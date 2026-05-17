# Rencana Implementasi: Aplikasi Analisis Teks Pendidikan Bahasa Indonesia

Aplikasi web ini dirancang untuk menganalisis teks pendidikan berbahasa Indonesia, mendeteksi tingkat keterbacaan, menemukan kata kompleks, menyederhanakan kalimat, serta mendukung input teks langsung, gambar (OCR), dan dokumen. Mengingat Anda sedang belajar Python untuk Machine Learning, bagian *backend* akan dibangun menggunakan Python agar Anda dapat dengan mudah mempelajari dan memodifikasi logika pemrosesan bahasanya di kemudian hari.

## User Review Required

> [!IMPORTANT]
> **Arsitektur Sistem**
> Saya mengusulkan pemisahan antara *Frontend* (Antarmuka Pengguna) dan *Backend* (Pemrosesan Data & Machine Learning).
> - **Frontend**: Vite + React (dengan Vanilla CSS untuk desain modern dan interaktif).
> - **Backend**: FastAPI (Python). Sangat cocok untuk pemrosesan teks, OCR, dan integrasi model Machine Learning di masa depan.
> 
> **Metode Penyederhanaan Teks & Deteksi**
> Untuk versi awal (v1), apakah Anda setuju menggunakan pendekatan berbasis aturan (*rule-based*), seperti kamus kata kompleks dan perhitungan heuristik untuk skor keterbacaan (seperti rumus Flesch yang disesuaikan)? Untuk penyederhanaan kalimat yang kompleks, kita bisa mensimulasikannya atau menggunakan API LLM, tetapi kamus/algoritma sederhana akan lebih mudah dipelajari pada tahap awal.

## Open Questions

> [!WARNING]
> 1. **Kamus Kata Kompleks:** Apakah Anda sudah memiliki dataset/kamus kata-kata kompleks bahasa Indonesia beserta padanan sederhananya, atau haruskah saya membuatkan contoh kamus dasar?
> 2. **Instalasi Tesseract:** Fitur pembacaan gambar (OCR) membutuhkan *engine* Tesseract yang harus diinstal di sistem operasi Windows Anda. Apakah Anda bersedia melakukan instalasi Tesseract nantinya? (Saya akan memberikan panduannya).
> 3. **Visual Desain:** Apakah ada referensi warna spesifik yang Anda inginkan untuk UI/UX? Saya berencana menggunakan palet warna modern yang bersih (seperti paduan putih, abu-abu muda, dan aksen biru/hijau edukatif) dengan animasi transisi yang mulus.

## Proposed Changes

Kita akan membuat dua direktori utama di dalam proyek ini: `frontend/` dan `backend/`.

---

### Backend (Python / FastAPI)

Backend akan menangani *routing*, penerimaan file, ekstraksi teks, dan analisis menggunakan pustaka NLP Python.

#### [NEW] backend/main.py
File utama server FastAPI. Mengatur *endpoint* untuk menerima teks, gambar, dan dokumen, serta mengembalikan hasil analisis dalam format JSON.

#### [NEW] backend/analyzer.py
Berisi logika utama NLP:
- Menghitung jumlah kata, kalimat, dan panjang paragraf.
- Mengidentifikasi kata kompleks dari teks.
- Menentukan skor keterbacaan dan level pembaca.

#### [NEW] backend/document_processor.py
Menangani ekstraksi teks dari file `PDF`, `DOCX`, dan `TXT`.
- Menggunakan `PyPDF2` / `pdfplumber` untuk PDF.
- Menggunakan `python-docx` untuk DOCX.

#### [NEW] backend/ocr_processor.py
Menangani ekstraksi teks dari gambar (JPG, PNG).
- Menggunakan `pytesseract` dan `Pillow`.

#### [NEW] backend/requirements.txt
Daftar *library* Python yang dibutuhkan (fastapi, uvicorn, spacy, pytesseract, python-multipart, dll).

---

### Frontend (Vite / React)

Antarmuka modern tempat pengguna berinteraksi, melakukan unggah file, dan melihat visualisasi hasil analisis.

#### [NEW] frontend/index.html & frontend/src/main.jsx
Titik masuk utama aplikasi React.

#### [NEW] frontend/src/App.jsx
Komponen utama yang mengatur *layout*: *Header*, *Input Area* (Paste, Upload), dan *Results Area*.

#### [NEW] frontend/src/components/InputSection.jsx
Komponen untuk menangani form teks, *drag-and-drop* gambar, dan unggah dokumen.

#### [NEW] frontend/src/components/AnalysisResults.jsx
Komponen visual untuk menampilkan Skor Keterbacaan, Daftar Kata Kompleks, Rekomendasi Level Pembaca (📗 Pemula, 📘 Menengah, 📕 Lanjutan), dan saran penyederhanaan.

#### [NEW] frontend/src/index.css
File Vanilla CSS untuk styling. Kita akan menggunakan variabel CSS untuk warna, *glassmorphism* untuk kartu hasil, dan transisi halus (*micro-animations*) agar desain terlihat *premium* dan responsif.

## Verification Plan

### Automated Tests
- Menjalankan server backend secara lokal (`uvicorn main:app --reload`) dan menguji *endpoint* menggunakan cURL/Postman dengan berbagai input (teks, gambar dummy, dokumen dummy).
- Menjalankan *frontend dev server* (`npm run dev`) untuk memastikan komponen me-render dengan baik.

### Manual Verification
- Anda akan mencoba aplikasi secara langsung di browser.
- Memasukkan teks akademik nyata berbahasa Indonesia dan memverifikasi apakah sistem berhasil mendeteksi kata kompleks dengan tepat.
- Mengunggah file gambar (tangkapan layar buku) dan PDF, lalu melihat apakah ekstraksi teks berjalan dan hasil analisisnya masuk akal.
