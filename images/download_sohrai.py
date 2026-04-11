"""
SOHRAI Google Drive Image Downloader & Deduplicator
====================================================
This script:
  1. Authenticates with Google Drive via OAuth2 (opens browser once)
  2. Recursively lists all image files in the SOHRAI folder and its sub-folders
  3. Detects duplicate images using perceptual hashing (phash)
  4. Downloads only the unique images to the output directory

SETUP (run once in Command Prompt / PowerShell):
    pip install google-auth google-auth-oauthlib google-api-python-client pillow imagehash requests

USAGE:
    python download_sohrai.py

The script will open a browser window for Google sign-in on the first run.
A token file (token.json) will be saved next to the script so you won't need
to log in again.
"""

import os
import io
import json
import hashlib
import shutil
import sys
from pathlib import Path

# ── Configuration ────────────────────────────────────────────────────────────

# Google Drive folder ID for SOHRAI
SOHRAI_FOLDER_ID = "1vT1IqVHK05Bjhj4uT4xz9vMgekiVul2O"

# Where unique images will be saved
OUTPUT_DIR = r"C:\Users\adipu\OneDrive\Desktop\IIT_proj\images\sohrai"

# Image MIME types to look for
IMAGE_MIME_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "image/bmp", "image/tiff", "image/svg+xml",
}

# OAuth2 scopes
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

# Path for OAuth token (saved after first login)
TOKEN_FILE = Path(__file__).parent / "token.json"

# ── Dependencies check ────────────────────────────────────────────────────────

def check_dependencies():
    missing = []
    for pkg, import_name in [
        ("google-auth", "google.auth"),
        ("google-auth-oauthlib", "google_auth_oauthlib"),
        ("google-api-python-client", "googleapiclient"),
        ("Pillow", "PIL"),
        ("imagehash", "imagehash"),
        ("requests", "requests"),
    ]:
        try:
            __import__(import_name)
        except ImportError:
            missing.append(pkg)
    if missing:
        print("Missing packages. Please run:")
        print(f"  pip install {' '.join(missing)}")
        sys.exit(1)

check_dependencies()

# ── Imports (after dependency check) ─────────────────────────────────────────

import requests
from PIL import Image
import imagehash
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# ── OAuth2 Authentication ─────────────────────────────────────────────────────

# Inline OAuth2 client config (uses Google's public test client — for personal use only).
# For production, replace with your own client_id/secret from Google Cloud Console.
CLIENT_CONFIG = {
    "installed": {
        "client_id": "YOUR_CLIENT_ID",          # <-- replace if needed
        "client_secret": "YOUR_CLIENT_SECRET",  # <-- replace if needed
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
    }
}

def get_credentials():
    """Load or refresh OAuth2 credentials, prompting for login if needed."""
    creds = None

    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Use installed app flow — opens browser
            flow = InstalledAppFlow.from_client_config(CLIENT_CONFIG, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save token for next run
        TOKEN_FILE.write_text(creds.to_json())

    return creds

# ── Google Drive helpers ───────────────────────────────────────────────────────

def list_all_images(service, folder_id, folder_path=""):
    """Recursively list all image files under folder_id."""
    images = []
    page_token = None

    while True:
        resp = service.files().list(
            q=f"'{folder_id}' in parents and trashed = false",
            fields="nextPageToken, files(id, name, mimeType, size, md5Checksum)",
            pageToken=page_token,
            pageSize=1000,
        ).execute()

        for f in resp.get("files", []):
            if f["mimeType"] == "application/vnd.google-apps.folder":
                # Recurse into subfolder
                sub_path = os.path.join(folder_path, f["name"])
                print(f"  📂 Entering subfolder: {sub_path}")
                images.extend(list_all_images(service, f["id"], sub_path))
            elif f["mimeType"] in IMAGE_MIME_TYPES:
                images.append({
                    "id": f["id"],
                    "name": f["name"],
                    "mimeType": f["mimeType"],
                    "size": f.get("size", "?"),
                    "md5": f.get("md5Checksum", ""),
                    "folder": folder_path,
                })

        page_token = resp.get("nextPageToken")
        if not page_token:
            break

    return images


def download_file(service, file_id, dest_path):
    """Download a Drive file to dest_path."""
    request = service.files().get_media(fileId=file_id)
    buf = io.BytesIO()
    downloader = MediaIoBaseDownload(buf, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    buf.seek(0)
    with open(dest_path, "wb") as fh:
        fh.write(buf.read())


# ── Duplicate detection ────────────────────────────────────────────────────────

def compute_phash(image_bytes):
    """Compute perceptual hash of image bytes. Returns None on error."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        return str(imagehash.phash(img))
    except Exception:
        return None


def compute_md5(image_bytes):
    return hashlib.md5(image_bytes).hexdigest()


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("SOHRAI Google Drive Image Downloader & Deduplicator")
    print("=" * 60)

    # Prepare output directory
    out_dir = Path(OUTPUT_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 Output directory: {out_dir}\n")

    # Authenticate
    print("🔐 Authenticating with Google Drive…")
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)
    print("   ✅ Authenticated.\n")

    # List all images recursively
    print("🔍 Scanning SOHRAI folder for images (this may take a moment)…")
    all_images = list_all_images(service, SOHRAI_FOLDER_ID)
    print(f"\n   Found {len(all_images)} image file(s) total.\n")

    if not all_images:
        print("No images found. Exiting.")
        return

    # Deduplicate and download
    print("⬇️  Downloading & deduplicating…\n")
    seen_md5   = set()   # fast exact-duplicate check via Drive md5
    seen_phash = set()   # perceptual duplicate check

    unique_count   = 0
    skipped_count  = 0
    error_count    = 0

    for idx, img in enumerate(all_images, 1):
        progress = f"[{idx}/{len(all_images)}]"
        display_name = os.path.join(img["folder"], img["name"]) if img["folder"] else img["name"]

        # Fast path: exact duplicate via Drive's own md5 checksum
        if img["md5"] and img["md5"] in seen_md5:
            print(f"  {progress} ⏭  EXACT DUPLICATE (md5): {display_name}")
            skipped_count += 1
            continue

        # Download the file for perceptual hashing
        try:
            request = service.files().get_media(fileId=img["id"])
            buf = io.BytesIO()
            downloader = MediaIoBaseDownload(buf, request)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            image_bytes = buf.getvalue()
        except Exception as e:
            print(f"  {progress} ❌ DOWNLOAD ERROR: {display_name} — {e}")
            error_count += 1
            continue

        # Compute md5 from bytes (in case Drive didn't return one)
        file_md5 = img["md5"] or compute_md5(image_bytes)
        if file_md5 in seen_md5:
            print(f"  {progress} ⏭  EXACT DUPLICATE (md5): {display_name}")
            skipped_count += 1
            continue

        # Perceptual hash — catches visually identical images with different bytes
        phash = compute_phash(image_bytes)
        if phash and phash in seen_phash:
            print(f"  {progress} ⏭  VISUAL DUPLICATE (phash): {display_name}")
            skipped_count += 1
            continue

        # Mark as seen
        seen_md5.add(file_md5)
        if phash:
            seen_phash.add(phash)

        # Save to output directory
        # Flatten filename; make unique if collision
        safe_name = img["name"]
        dest = out_dir / safe_name
        counter = 1
        while dest.exists():
            stem = Path(img["name"]).stem
            suffix = Path(img["name"]).suffix
            dest = out_dir / f"{stem}_{counter}{suffix}"
            counter += 1

        with open(dest, "wb") as fh:
            fh.write(image_bytes)

        unique_count += 1
        print(f"  {progress} ✅ SAVED: {dest.name}  ({int(len(image_bytes)/1024)} KB)")

    # Summary
    print("\n" + "=" * 60)
    print("✅ Done!")
    print(f"   Total images found   : {len(all_images)}")
    print(f"   Unique images saved  : {unique_count}")
    print(f"   Duplicates skipped   : {skipped_count}")
    print(f"   Errors               : {error_count}")
    print(f"   Output folder        : {out_dir}")
    print("=" * 60)


if __name__ == "__main__":
    main()
