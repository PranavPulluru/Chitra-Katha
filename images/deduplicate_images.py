"""
SOHRAI Image Deduplicator
=========================
After you download + extract the SOHRAI folder from Google Drive, run this
script to find and remove duplicate images, keeping only unique ones.

SETUP (run once in Command Prompt / PowerShell):
    pip install pillow imagehash

USAGE:
    python deduplicate_images.py <path_to_extracted_sohrai_folder>

Example:
    python deduplicate_images.py "C:\\Users\\adipu\\Downloads\\SOHRAI"

Unique images will be saved to:
    C:\\Users\\adipu\\OneDrive\\Desktop\\IIT_proj\\images\\sohrai\\unique\\
"""

import os
import io
import sys
import hashlib
import shutil
from pathlib import Path

# ── Configuration ────────────────────────────────────────────────────────────

OUTPUT_DIR = Path(r"C:\Users\adipu\OneDrive\Desktop\IIT_proj\images\sohrai\unique")

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".bmp",
    ".webp", ".tiff", ".tif", ".svg",
}

# ── Dependencies check ────────────────────────────────────────────────────────

def check_dependencies():
    missing = []
    for pkg, import_name in [("Pillow", "PIL"), ("imagehash", "imagehash")]:
        try:
            __import__(import_name)
        except ImportError:
            missing.append(pkg)
    if missing:
        print("Missing packages. Please run:")
        print(f"  pip install {' '.join(missing)}")
        sys.exit(1)

check_dependencies()

import imagehash
from PIL import Image

# ── Helpers ───────────────────────────────────────────────────────────────────

def iter_images(root: Path):
    """Yield all image file paths under root (recursive)."""
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
            yield path


def md5_of_file(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def phash_of_file(path: Path):
    """Compute perceptual hash. Returns None on failure (e.g. SVGs)."""
    try:
        img = Image.open(path).convert("RGB")
        return imagehash.phash(img)
    except Exception:
        return None

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("ERROR: Please pass the path to the extracted SOHRAI folder.\n")
        print("Usage:  python deduplicate_images.py <sohrai_folder>")
        sys.exit(1)

    input_dir = Path(sys.argv[1])
    if not input_dir.exists():
        print(f"ERROR: Path not found: {input_dir}")
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("SOHRAI Image Deduplicator")
    print("=" * 60)
    print(f"\n📂 Input  : {input_dir}")
    print(f"📁 Output : {OUTPUT_DIR}\n")

    all_images = list(iter_images(input_dir))
    print(f"🔍 Found {len(all_images)} image file(s). Processing…\n")

    seen_md5   = {}   # md5 → path (exact duplicates)
    seen_phash = {}   # phash str → path (visual duplicates)
    unique_count  = 0
    skipped_count = 0
    error_count   = 0

    for idx, path in enumerate(all_images, 1):
        progress = f"[{idx}/{len(all_images)}]"
        rel = path.relative_to(input_dir)

        # ── Exact duplicate check (fast) ──────────────────────────────────
        try:
            m = md5_of_file(path)
        except Exception as e:
            print(f"  {progress} ❌ READ ERROR: {rel} — {e}")
            error_count += 1
            continue

        if m in seen_md5:
            orig = seen_md5[m].relative_to(input_dir)
            print(f"  {progress} ⏭  EXACT DUPLICATE of [{orig}]: {rel}")
            skipped_count += 1
            continue

        # ── Perceptual duplicate check ────────────────────────────────────
        ph = phash_of_file(path)
        if ph is not None:
            ph_str = str(ph)
            if ph_str in seen_phash:
                orig = seen_phash[ph_str].relative_to(input_dir)
                print(f"  {progress} ⏭  VISUAL DUPLICATE of [{orig}]: {rel}")
                skipped_count += 1
                continue
            seen_phash[ph_str] = path

        seen_md5[m] = path

        # ── Save unique image (renamed sequentially) ──────────────────────
        unique_count += 1
        dest = OUTPUT_DIR / f"{unique_count}{path.suffix.lower()}"
        shutil.copy2(path, dest)
        size_kb = path.stat().st_size // 1024
        print(f"  {progress} ✅ UNIQUE: {path.name} → {dest.name}  ({size_kb} KB)")

    # ── Summary ───────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("✅ Done!")
    print(f"   Total images found   : {len(all_images)}")
    print(f"   Unique images saved  : {unique_count}")
    print(f"   Duplicates skipped   : {skipped_count}")
    print(f"   Errors               : {error_count}")
    print(f"   Output folder        : {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
