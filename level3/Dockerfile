# Hugging Face Spaces — Docker runtime
FROM python:3.10-slim

# System deps for OpenCV (headless) + common wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libglib2.0-0 \
        libsm6 \
        libxext6 \
        libxrender1 \
        libgl1 \
    && rm -rf /var/lib/apt/lists/*

# HF Spaces convention: non-root user with UID 1000
RUN useradd -m -u 1000 user
WORKDIR /app

# Install Python deps first (cache-friendly)
COPY --chown=user:user requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the application
COPY --chown=user:user . /app

USER user

ENV PYTHONUNBUFFERED=1 \
    PORT=7860 \
    HF_HOME=/app/.cache/huggingface

EXPOSE 7860

CMD ["python", "server.py"]
