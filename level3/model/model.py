"""
model/model.py — ChitraKathaModel
==================================
Dual-stream DINOv2 ViT-B/14 encoder for contour similarity evaluation.

Architecture
------------
  • Shared frozen DINOv2 backbone (facebook/dinov2-base)
  • Lightweight trainable projection head on top of patch embeddings
  • Similarity score  : cosine distance between CLS tokens → 0–100
  • Spatial heatmap   : per-patch L2 distance → 16×16 grid
  • Region feedback   : 3×3 named zone labels derived from the heatmap

Input contract
--------------
Both images must be binary contour images (float32 tensors, values in [0, 1]).
Acceptable channel layouts: (B, 1, H, W)  or  (B, 3, H, W).
The model internally resizes to 224×224 and applies ImageNet normalisation.
"""

from __future__ import annotations

import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel

# ── constants ──────────────────────────────────────────────────────────────────
DINO_MODEL_ID  = "facebook/dinov2-base"
DINO_HIDDEN    = 768     # hidden dimension of ViT-B
PATCH_GRID     = 16      # 224 / patch_size(14) = 16  →  16×16 = 256 patches
N_PATCHES      = PATCH_GRID * PATCH_GRID  # 256
PROJ_HIDDEN    = 256
PROJ_OUT       = 128

# ImageNet statistics used during DINOv2 pre-training
_IMAGENET_MEAN = torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1)
_IMAGENET_STD  = torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1)

# ── projection head ────────────────────────────────────────────────────────────

class ProjectionHead(nn.Module):
    """Two-layer MLP that projects patch embeddings into a comparison space."""

    def __init__(
        self,
        in_dim:  int = DINO_HIDDEN,
        hid_dim: int = PROJ_HIDDEN,
        out_dim: int = PROJ_OUT,
    ) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hid_dim),
            nn.GELU(),
            nn.LayerNorm(hid_dim),
            nn.Linear(hid_dim, out_dim),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


# ── main model ─────────────────────────────────────────────────────────────────

class ChitraKathaModel(nn.Module):
    """
    Dual-stream contour comparator.

    Parameters
    ----------
    pretrained : bool
        If True, loads DINOv2 weights from HuggingFace.
        Set False for unit-tests without network access.
    """

    def __init__(self, pretrained: bool = True) -> None:
        super().__init__()

        # ── Frozen backbone ──────────────────────────────────────────────────
        if pretrained:
            self.backbone = AutoModel.from_pretrained(
                DINO_MODEL_ID,
                low_cpu_mem_usage=True,
            )
        else:
            from transformers import AutoConfig
            cfg = AutoConfig.from_pretrained(DINO_MODEL_ID)
            self.backbone = AutoModel.from_config(cfg)

        for param in self.backbone.parameters():
            param.requires_grad_(False)
        self.backbone.eval()

        # ── Trainable projection head (shared weights for both streams) ──────
        self.proj_head = ProjectionHead()

        # Buffers for ImageNet normalisation (move with .to(device))
        self.register_buffer("_mean", _IMAGENET_MEAN)
        self.register_buffer("_std",  _IMAGENET_STD)

    # ── private helpers ───────────────────────────────────────────────────────

    def _prepare(self, x: torch.Tensor) -> torch.Tensor:
        """
        Normalise a binary contour tensor for DINOv2.

        Accepts (B, 1, H, W) or (B, 3, H, W) float32 in [0, 1].
        Returns (B, 3, 224, 224) float32, ImageNet-normalised.
        """
        if x.dim() == 3:
            x = x.unsqueeze(0)                          # add batch dim if missing

        if x.shape[1] == 1:
            x = x.expand(-1, 3, -1, -1)                # grayscale → 3-channel

        if x.shape[-2:] != (224, 224):
            x = F.interpolate(
                x, size=(224, 224), mode="bilinear", align_corners=False
            )

        return (x - self._mean) / self._std

    def _encode(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Run backbone + projection head on one image batch.

        Returns
        -------
        cls_token  : (B, 768)  — global representation
        patch_proj : (B, 256, PROJ_OUT)  — projected patch embeddings
        """
        with torch.no_grad():
            out = self.backbone(pixel_values=x)

        # last_hidden_state: (B, 257, DINO_HIDDEN)  →  [CLS] + 256 patch tokens
        cls_token     = out.last_hidden_state[:, 0, :]       # (B, DINO_HIDDEN)
        patch_tokens  = out.last_hidden_state[:, 1:, :]      # (B, 256, DINO_HIDDEN)

        patch_proj = self.proj_head(patch_tokens)            # (B, 256, PROJ_OUT)
        return cls_token, patch_proj

    # ── public API ────────────────────────────────────────────────────────────

    def forward(
        self,
        ref:   torch.Tensor,
        child: torch.Tensor,
    ) -> dict[str, torch.Tensor]:
        """
        Compare reference and child contours.

        Parameters
        ----------
        ref, child : (B, C, H, W) float32 tensors in [0, 1].

        Returns
        -------
        dict with keys:
            score       : (B,)      similarity score in [0, 100]
            patch_ref   : (B, 256, PROJ_OUT)  projected ref patches
            patch_child : (B, 256, PROJ_OUT)  projected child patches
            patch_dist  : (B, 256)  per-patch L2 distance
            heatmap     : (B, 16, 16)  distance grid (higher = more deviation)
        """
        ref_prep   = self._prepare(ref)
        child_prep = self._prepare(child)

        cls_r, patch_r = self._encode(ref_prep)
        cls_c, patch_c = self._encode(child_prep)

        # ── global similarity score ──────────────────────────────────────────
        cos_sim = F.cosine_similarity(cls_r, cls_c, dim=-1)  # (B,) in [-1, 1]
        score   = (cos_sim + 1.0) / 2.0 * 100.0             # → [0, 100]

        # ── per-patch L2 distance ────────────────────────────────────────────
        patch_dist = torch.norm(patch_r - patch_c, dim=-1)   # (B, 256)

        # ── 2-D heatmap ──────────────────────────────────────────────────────
        heatmap = patch_dist.view(-1, PATCH_GRID, PATCH_GRID)  # (B, 16, 16)

        return {
            "score":       score,
            "patch_ref":   patch_r,
            "patch_child": patch_c,
            "patch_dist":  patch_dist,
            "heatmap":     heatmap,
        }

    # ── convenience: encode a single image ────────────────────────────────────

    def encode_single(self, x: torch.Tensor):
        """Return (cls_token, patch_proj) for one image batch."""
        return self._encode(self._prepare(x))
