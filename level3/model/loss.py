"""
model/loss.py — ChitraKathaLoss
=================================
Two complementary loss terms:

  1. PatchContrastiveLoss
     Operates on the (B, 256, D) projected patch embeddings.
     For each position k, the pair distance should be low when similarity is
     high and above a margin when similarity is low (weighted Siamese loss).

  2. CLSRegressionLoss
     Regresses the cosine similarity of CLS tokens to the ground-truth
     similarity label using MSE.  Trains the global score head direction.

Combined:
    total = patch_loss + lambda_cls * cls_loss
"""

from __future__ import annotations

import torch
import torch.nn as nn
import torch.nn.functional as F


class PatchContrastiveLoss(nn.Module):
    """
    Weighted Siamese contrastive loss over patch embeddings.

    For a pair with similarity label s ∈ [0, 1]:

        L_pull = s       * mean_k( ||f_r_k - f_c_k||² )
        L_push = (1 - s) * mean_k( relu(margin - ||f_r_k - f_c_k||)² )
        L      = L_pull + L_push

    Parameters
    ----------
    margin : minimum distance enforced for dissimilar patch pairs.
             Good default ≈ 1.0 when embeddings are L2-normalised; use ~2–4
             if embeddings are not normalised.
    normalise : if True, L2-normalise patch embeddings before computing
                distances (recommended for stable training).
    """

    def __init__(self, margin: float = 1.5, normalise: bool = True) -> None:
        super().__init__()
        self.margin    = margin
        self.normalise = normalise

    def forward(
        self,
        patch_ref:   torch.Tensor,   # (B, N, D)
        patch_child: torch.Tensor,   # (B, N, D)
        similarity:  torch.Tensor,   # (B,)  in [0, 1]
    ) -> torch.Tensor:
        if self.normalise:
            patch_ref   = F.normalize(patch_ref,   dim=-1)
            patch_child = F.normalize(patch_child, dim=-1)

        # Per-patch Euclidean distance: (B, N)
        dist = torch.norm(patch_ref - patch_child, dim=-1)

        s = similarity.unsqueeze(1)  # (B, 1)

        pull = s       * dist.pow(2)
        push = (1 - s) * F.relu(self.margin - dist).pow(2)

        return (pull + push).mean()


class CLSRegressionLoss(nn.Module):
    """
    MSE loss between the CLS-token cosine similarity and the ground-truth
    similarity label.

    This explicitly trains the backbone (frozen) → CLS projection such that
    the cosine similarity of the two CLS tokens tracks human-interpretable
    similarity.  Because the backbone is frozen, only the projection head
    receives gradients through this term.
    """

    def forward(
        self,
        cls_ref:    torch.Tensor,  # (B, D)
        cls_child:  torch.Tensor,  # (B, D)
        similarity: torch.Tensor,  # (B,)
    ) -> torch.Tensor:
        cos_sim = F.cosine_similarity(cls_ref, cls_child, dim=-1)   # (B,)
        # Map similarity label [0,1] → [-1, 1] to match cosine range
        target = 2.0 * similarity - 1.0
        return F.mse_loss(cos_sim, target)


class ChitraKathaLoss(nn.Module):
    """
    Combined training loss.

    Parameters
    ----------
    lambda_cls : weight of the CLS regression term relative to patch loss.
    margin     : passed through to PatchContrastiveLoss.
    normalise  : passed through to PatchContrastiveLoss.
    """

    def __init__(
        self,
        lambda_cls: float = 0.5,
        margin:     float = 1.5,
        normalise:  bool  = True,
    ) -> None:
        super().__init__()
        self.patch_loss = PatchContrastiveLoss(margin=margin, normalise=normalise)
        self.cls_loss   = CLSRegressionLoss()
        self.lambda_cls = lambda_cls

    def forward(
        self,
        patch_ref:   torch.Tensor,   # (B, N, D)
        patch_child: torch.Tensor,   # (B, N, D)
        cls_ref:     torch.Tensor,   # (B, hidden)
        cls_child:   torch.Tensor,   # (B, hidden)
        similarity:  torch.Tensor,   # (B,)
    ) -> tuple[torch.Tensor, dict[str, float]]:
        """
        Returns
        -------
        total_loss : scalar tensor (differentiable)
        breakdown  : dict with 'patch', 'cls', 'total' as plain Python floats
                     (for logging, detached from graph)
        """
        p_loss = self.patch_loss(patch_ref, patch_child, similarity)
        c_loss = self.cls_loss(cls_ref, cls_child, similarity)
        total  = p_loss + self.lambda_cls * c_loss

        breakdown = {
            "patch": p_loss.item(),
            "cls":   c_loss.item(),
            "total": total.item(),
        }
        return total, breakdown
