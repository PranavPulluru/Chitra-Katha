"""
model/model.py — DTSiameseNet
==============================
Distance-Transform Siamese Network for structural drawing comparison.

Architecture
------------
  • ContourCNN  — ResNet18, single-channel DT input, dilated layer3, no MaxPool
  • FPN         — 3-scale top-down pyramid (p2: H/2, p3: H/4, p4: H/4)
  • STNModule   — learns affine warp of student features into reference space
  • ScoreHead   — fused multi-scale diff → GAP → MLP → sigmoid × 100
  • HeatmapHead — fused diff → bilinear upsample → conv → [0, 1] error map
  • encode()    — L2-normalised per-image embedding for ranking/triplet loss

Input contract
--------------
Both tensors must be distance-transform images in [0, 1], shape (B, 1, H, W).
Inputs are resized internally to INPUT_SIZE × INPUT_SIZE before encoding.
Use data.preprocessing.to_distance_transform() to produce these from raw
binary contours before calling forward().
"""

from __future__ import annotations

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as tvm

# ── constants ──────────────────────────────────────────────────────────────────
INPUT_SIZE   = 128   # internal spatial resolution
FPN_CHANNELS = 128   # unified channel count across all FPN levels
EMB_DIM      = 256   # embedding dimension for ranking/triplet loss


# ── backbone ───────────────────────────────────────────────────────────────────

class ContourCNN(nn.Module):
    """
    ResNet18 adapted for single-channel distance-transform input.

    Modifications vs. standard ResNet18:
      conv1   : 3-ch → 1-ch (ImageNet weights averaged to 1-ch if pretrained=True)
      maxpool : replaced by Identity (preserves H/2 spatial resolution)
      layer3  : stride=2 → stride=1, dilation=2 (stays at H/4 resolution)

    Output feature map sizes for INPUT_SIZE=128:
      c2 : (B,  64, 64, 64)   H/2
      c3 : (B, 128, 32, 32)   H/4
      c4 : (B, 256, 32, 32)   H/4  (dilated → same resolution as c3)
    """

    def __init__(self, pretrained: bool = False) -> None:
        super().__init__()
        weights = tvm.ResNet18_Weights.DEFAULT if pretrained else None
        r = tvm.resnet18(weights=weights)

        # Adapt conv1 to 1-channel input
        orig_w = r.conv1.weight.data.clone()   # (64, 3, 7, 7)
        r.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
        if pretrained:
            r.conv1.weight.data = orig_w.mean(dim=1, keepdim=True)
        else:
            nn.init.kaiming_normal_(r.conv1.weight, mode="fan_out", nonlinearity="relu")

        # Remove MaxPool so H/2 resolution is preserved through layer1
        r.maxpool = nn.Identity()

        # Dilate layer3: stride 2 → 1 to keep H/4 resolution
        # Both the main 3×3 convs and the 1×1 shortcut need stride changed.
        for m in r.layer3.modules():
            if isinstance(m, nn.Conv2d) and m.stride == (2, 2):
                m.stride = (1, 1)
                if m.kernel_size == (3, 3):          # main conv: add dilation
                    m.dilation = (2, 2)
                    m.padding  = (2, 2)
                # 1×1 shortcut: stride change only, no dilation needed

        self.stem   = nn.Sequential(r.conv1, r.bn1, r.relu)
        self.layer1 = r.layer1
        self.layer2 = r.layer2
        self.layer3 = r.layer3

    def forward(
        self, x: torch.Tensor
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        x  = self.stem(x)
        c2 = self.layer1(x)
        c3 = self.layer2(c2)
        c4 = self.layer3(c3)
        return c2, c3, c4


# ── feature pyramid ────────────────────────────────────────────────────────────

class FPN(nn.Module):
    """
    Lightweight top-down FPN over the three ContourCNN scales.

    All outputs share FPN_CHANNELS channels. Since c3 and c4 have the same
    spatial size (both H/4), the p4 → p3 merge is an elementwise add with
    no spatial upsampling required.
    """

    def __init__(
        self,
        ch2: int = 64,
        ch3: int = 128,
        ch4: int = 256,
        out: int = FPN_CHANNELS,
    ) -> None:
        super().__init__()
        self.lat4 = nn.Conv2d(ch4, out, 1)
        self.lat3 = nn.Conv2d(ch3, out, 1)
        self.lat2 = nn.Conv2d(ch2, out, 1)
        self.out4 = nn.Conv2d(out, out, 3, padding=1)
        self.out3 = nn.Conv2d(out, out, 3, padding=1)
        self.out2 = nn.Conv2d(out, out, 3, padding=1)

    def forward(
        self,
        c2: torch.Tensor,
        c3: torch.Tensor,
        c4: torch.Tensor,
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        p4 = self.out4(self.lat4(c4))
        p3 = self.out3(
            self.lat3(c3) + F.interpolate(p4, size=c3.shape[-2:], mode="nearest")
        )
        p2 = self.out2(
            self.lat2(c2) + F.interpolate(p3, size=c2.shape[-2:], mode="nearest")
        )
        return p2, p3, p4


# ── spatial transformer ────────────────────────────────────────────────────────

class STNModule(nn.Module):
    """
    Predicts a global affine warp (theta, shape (B, 2, 3)) that aligns the
    student's drawing into the reference's coordinate space.

    The localization network operates on the concatenated p2 feature pair
    (finest FPN scale) and is initialised to the identity transform so
    training starts from a no-op warp.

    Theta is in normalised image coordinates [-1, 1], so the same theta
    can be applied across all FPN scales via F.affine_grid without rescaling.
    """

    def __init__(self, in_channels: int = FPN_CHANNELS * 2) -> None:
        super().__init__()
        # Pool to 8×8 before the linear layers to keep param count manageable
        self.locnet = nn.Sequential(
            nn.AdaptiveAvgPool2d(8),
            nn.Flatten(),
            nn.Linear(in_channels * 64, 256),   # 8×8 = 64 spatial locations
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(256, 6),
        )
        # Identity initialisation: [1,0,0, 0,1,0] → no warp at the start
        self.locnet[-1].weight.data.zero_()
        self.locnet[-1].bias.data = torch.tensor(
            [1.0, 0.0, 0.0, 0.0, 1.0, 0.0]
        )

    def forward(
        self,
        ref_feat: torch.Tensor,   # (B, C, H, W)
        stu_feat: torch.Tensor,   # (B, C, H, W)
    ) -> torch.Tensor:
        """Return theta (B, 2, 3) that maps student → reference."""
        combined = torch.cat([ref_feat, stu_feat], dim=1)
        return self.locnet(combined).view(-1, 2, 3)


# ── output heads ──────────────────────────────────────────────────────────────

class ScoreHead(nn.Module):
    """GAP + MLP → sigmoid × 100 → scalar score in [0, 100]."""

    def __init__(self, in_ch: int = FPN_CHANNELS * 3) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(in_ch, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(128, 1),
            nn.Sigmoid(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x).squeeze(-1) * 100.0   # (B,) in [0, 100]


class HeatmapHead(nn.Module):
    """
    Upsamples the fused difference map to out_size × out_size, then refines
    with two convolutions to produce a spatial error map in [0, 1].
    """

    def __init__(
        self,
        in_ch:    int = FPN_CHANNELS * 3,
        out_size: int = INPUT_SIZE,
    ) -> None:
        super().__init__()
        self.out_size = out_size
        self.refine = nn.Sequential(
            nn.Conv2d(in_ch, 64, 3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 1, 1),
            nn.Sigmoid(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = F.interpolate(
            x, size=(self.out_size, self.out_size),
            mode="bilinear", align_corners=False,
        )
        return self.refine(x).squeeze(1)   # (B, H, W)


# ── main model ─────────────────────────────────────────────────────────────────

class DTSiameseNet(nn.Module):
    """
    Distance-Transform Siamese Network for structural drawing evaluation.

    Training forward pass produces:
      • score     — quality score in [0, 100] (higher = closer to reference)
      • heatmap   — per-pixel structural deviation map in [0, 1]
      • theta     — STN affine parameters for alignment regularisation
      • ref_emb   — L2-normalised reference embedding (for triplet/ranking loss)
      • stu_emb   — L2-normalised student embedding (for triplet/ranking loss)

    The encode() method returns a standalone embedding for a single image
    without running the full comparison pipeline.

    Parameters
    ----------
    pretrained : bool
        Initialise ContourCNN from ImageNet-pretrained ResNet18 (conv1 weights
        averaged to 1-channel). Recommended when training on limited data.
    input_size : int
        Internal spatial resolution; inputs are resized to this before encoding.
    """

    def __init__(
        self,
        pretrained: bool = False,
        input_size: int  = INPUT_SIZE,
    ) -> None:
        super().__init__()
        self.input_size = input_size

        self.backbone   = ContourCNN(pretrained=pretrained)
        self.fpn        = FPN()
        self.stn        = STNModule(in_channels=FPN_CHANNELS * 2)

        # Per-image embedding branch (shared encoder output from p2 features)
        self.embed_proj = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(FPN_CHANNELS, EMB_DIM),
        )

        self.score_head   = ScoreHead(in_ch=FPN_CHANNELS * 3)
        self.heatmap_head = HeatmapHead(in_ch=FPN_CHANNELS * 3, out_size=input_size)

    # ── private helpers ───────────────────────────────────────────────────────

    def _prepare(self, x: torch.Tensor) -> torch.Tensor:
        """Ensure (B, 1, input_size, input_size) float32 in [0, 1]."""
        if x.dim() == 3:
            x = x.unsqueeze(0)
        if x.shape[1] != 1:
            x = x.mean(dim=1, keepdim=True)
        if x.shape[-2:] != (self.input_size, self.input_size):
            x = F.interpolate(
                x, size=(self.input_size, self.input_size),
                mode="bilinear", align_corners=False,
            )
        return x.clamp(0.0, 1.0)

    def _encode(
        self, x: torch.Tensor
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """Run backbone + FPN, return (p2, p3, p4)."""
        c2, c3, c4 = self.backbone(x)
        return self.fpn(c2, c3, c4)

    def _apply_warp(
        self,
        feats: tuple[torch.Tensor, ...],
        theta: torch.Tensor,
    ) -> tuple[torch.Tensor, ...]:
        """
        Apply the affine warp theta to every feature map in feats.
        Because theta is in normalised [-1, 1] coordinates it applies
        correctly across feature maps of different spatial sizes.
        """
        warped = []
        for f in feats:
            grid = F.affine_grid(theta, f.size(), align_corners=False)
            warped.append(
                F.grid_sample(
                    f, grid,
                    mode="bilinear",
                    padding_mode="border",
                    align_corners=False,
                )
            )
        return tuple(warped)

    def _fuse_differences(
        self,
        ref_feats:         tuple[torch.Tensor, ...],
        aligned_stu_feats: tuple[torch.Tensor, ...],
    ) -> torch.Tensor:
        """
        |ref - student| at each FPN scale, upsampled to p2 resolution,
        concatenated along the channel axis → (B, FPN_CHANNELS*3, H/2, W/2).
        """
        target = ref_feats[0].shape[-2:]
        diffs = [
            F.interpolate(
                torch.abs(r - s), size=target,
                mode="bilinear", align_corners=False,
            )
            for r, s in zip(ref_feats, aligned_stu_feats)
        ]
        return torch.cat(diffs, dim=1)

    # ── public API ────────────────────────────────────────────────────────────

    def encode(self, x: torch.Tensor) -> torch.Tensor:
        """
        Encode a single image to an L2-normalised embedding.
        Used to build anchor/positive/negative vectors for triplet training.

        Parameters
        ----------
        x : (B, 1, H, W) DT image

        Returns
        -------
        (B, EMB_DIM) float32, L2-normalised
        """
        p2, _, _ = self._encode(self._prepare(x))
        return F.normalize(self.embed_proj(p2), dim=-1)

    def forward(
        self,
        ref:     torch.Tensor,
        student: torch.Tensor,
    ) -> dict[str, torch.Tensor]:
        """
        Compare a reference drawing against a student drawing.

        Parameters
        ----------
        ref, student : (B, 1, H, W) float32 DT tensors in [0, 1]

        Returns
        -------
        score   : (B,)         quality score in [0, 100]
        heatmap : (B, H, W)    spatial error map in [0, 1]; H=W=input_size
        theta   : (B, 2, 3)    STN affine matrix (for alignment regulariser)
        ref_emb : (B, EMB_DIM) L2-normalised reference embedding
        stu_emb : (B, EMB_DIM) L2-normalised student embedding
        """
        ref_prep = self._prepare(ref)
        stu_prep = self._prepare(student)

        ref_feats = self._encode(ref_prep)   # (p2, p3, p4)
        stu_feats = self._encode(stu_prep)

        # Learn alignment from the finest-scale feature pair
        theta = self.stn(ref_feats[0], stu_feats[0])

        # Warp all student scales into reference space
        aligned_stu = self._apply_warp(stu_feats, theta)

        # Multi-scale absolute difference → fused map
        fused = self._fuse_differences(ref_feats, aligned_stu)

        score   = self.score_head(fused)
        heatmap = self.heatmap_head(fused)

        ref_emb = F.normalize(self.embed_proj(ref_feats[0]), dim=-1)
        stu_emb = F.normalize(self.embed_proj(stu_feats[0]), dim=-1)

        return {
            "score":   score,
            "heatmap": heatmap,
            "theta":   theta,
            "ref_emb": ref_emb,
            "stu_emb": stu_emb,
        }
