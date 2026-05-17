# Gunakan image Python resmi yang ringan
FROM python:3.10-slim

# Set direktori kerja di dalam container
WORKDIR /app

# Hindari pembuatan file .pyc dan pastikan output log langsung muncul (unbuffered)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instal dependensi sistem yang dibutuhkan (terutama Tesseract OCR)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-ind \
    libgl1-mesa-glx \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Salin file requirements.txt
COPY requirements.txt .

# Instal dependensi Python
RUN pip install --no-cache-dir -r requirements.txt

# Download model spacy (jika digunakan di analyzer, pastikan untuk mendownloadnya, atau ini bisa diabaikan jika tidak memakai spacy model yang besar. Spacy base diinstal oleh requirements.txt, tapi jika perlu model 'id' pastikan di sini)
# RUN python -m spacy download en_core_web_sm  <-- uncomment jika butuh spacy model spesifik

# Salin seluruh kode backend
COPY . .

# Ekspos port (Render biasanya menggunakan variabel PORT atau port 10000 secara default)
EXPOSE 8000

# Perintah untuk menjalankan aplikasi menggunakan Gunicorn dengan worker Uvicorn
CMD gunicorn main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}
