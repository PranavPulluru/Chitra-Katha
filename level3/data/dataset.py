"""
data/dataset.py — StrokeDataset
================================
PyTorch Dataset over the processed/ folder produced by prepare_dataset.py.
Used by both train.py and test.py.
"""

import json
from pathlib import Path

import cv2
import torch
from torch.utils.data import Dataset
from torchvision import transforms


class StrokeDataset(Dataset):
    """
    Loads contour PNGs and labels from the processed/ directory.

    Parameters
    ----------
    root     : path to processed/ (must contain images/ and labels.json)
    augment  : geometry-only augmentation for training
               (no colour/lighting jitter — OpenCV already removed those)

    Item returned
    -------------
    (image_tensor, shape_score, stage, errors)
        image_tensor : (1, H, W) float32 in [0, 1]
        shape_score  : scalar float32
        stage        : scalar int64
        errors       : (4,) float32 binary vector
    """

    def __init__(self, root: str | Path, augment: bool = False):
        self.root = Path(root)
        with open(self.root / "labels.json") as f:
            self.labels = json.load(f)

        aug = []
        if augment:
            aug += [
                transforms.RandomHorizontalFlip(),
                transforms.RandomRotation(15),
                transforms.RandomAffine(degrees=0, translate=(0.05, 0.05)),
            ]
        aug.append(transforms.ToTensor())
        self.transform = transforms.Compose(aug)

    def __len__(self) -> int:
        return len(self.labels)

    def __getitem__(self, idx: int):
        entry    = self.labels[idx]
        img_path = self.root / "images" / entry["file"]

        img = cv2.imread(str(img_path), cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise FileNotFoundError(img_path)

        from PIL import Image
        tensor = self.transform(Image.fromarray(img))   # (1, H, W) float32

        return (
            tensor,
            torch.tensor(entry["shape_score"], dtype=torch.float32),
            torch.tensor(entry["stage"],        dtype=torch.long),
            torch.tensor(entry["errors"],       dtype=torch.float32),
        )
