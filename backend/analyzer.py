import re
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Kamus kata kompleks (sebagai fallback dan pendeteksi awal)
COMPLEX_WORDS_DICT = {
    "implementasi": {
        "formal": "Pelaksanaan atau penerapan suatu rencana.",
        "simple": "Proses menerapkan atau melakukan sesuatu."
    },
    "algoritma": {
        "formal": "Prosedur sistematis untuk memecahkan masalah matematis dalam langkah-langkah terbatas.",
        "simple": "Urutan langkah untuk menyelesaikan suatu masalah."
    },
    "optimalisasi": {
        "formal": "Proses, cara, perbuatan mengoptimalkan (menjadikan paling baik).",
        "simple": "Upaya membuat sesuatu menjadi lebih baik atau maksimal."
    },
    "komprehensif": {
        "formal": "Bersifat mampu menangkap atau menerima dengan baik; luas dan lengkap.",
        "simple": "Menyeluruh dan lengkap."
    },
    "fenomena": {
        "formal": "Hal-hal yang dapat disaksikan dengan pancaindra dan dapat diterangkan serta dinilai secara ilmiah.",
        "simple": "Kejadian atau peristiwa yang bisa diamati."
    },
    "signifikan": {
        "formal": "Penting atau berarti.",
        "simple": "Sangat penting atau memiliki pengaruh besar."
    },
    "esensial": {
        "formal": "Perlu sekali atau mendasar.",
        "simple": "Sangat penting atau menjadi dasar dari sesuatu."
    },
    "efisiensi": {
        "formal": "Ketepatan cara untuk menjalankan sesuatu tanpa membuang waktu dan tenaga.",
        "simple": "Melakukan sesuatu dengan cepat, tepat, dan hemat."
    },
    "efektivitas": {
        "formal": "Keadaan berpengaruh; hal berkesan.",
        "simple": "Seberapa baik sesuatu mencapai tujuan atau hasil yang diinginkan."
    },
    "akumulasi": {
        "formal": "Pengumpulan, penimbunan, atau penghimpunan.",
        "simple": "Kumpulan atau tumpukan dari sesuatu yang bertambah seiring waktu."
    },
    "analisis": {
        "formal": "Penyelidikan terhadap suatu peristiwa untuk mengetahui keadaan yang sebenarnya.",
        "simple": "Pemeriksaan atau pengkajian secara mendalam terhadap sesuatu."
    },
    "metodologi": {
        "formal": "Ilmu tentang metode atau uraian tentang metode.",
        "simple": "Cara atau langkah-langkah yang digunakan untuk melakukan penelitian atau pekerjaan."
    },
    "perspektif": {
        "formal": "Sudut pandang atau pandangan.",
        "simple": "Cara pandang seseorang terhadap suatu masalah atau kejadian."
    },
    "karakteristik": {
        "formal": "Tanda, ciri, atau fitur yang dapat digunakan sebagai identifikasi.",
        "simple": "Ciri khas yang membedakan sesuatu dari yang lain."
    },
    "fundamental": {
        "formal": "Bersifat dasar (pokok, prinsip).",
        "simple": "Mendasar atau menjadi hal yang paling penting."
    }
}

def analyze_text(text: str):
    if not text.strip():
        return {
            "readability_score": 0,
            "complex_words": [],
            "difficulty_level": "Mudah",
            "reader_recommendation": "Pemula",
            "simplified_sentences": [],
            "stats": {
                "num_words": 0,
                "num_sentences": 0
            }
        }
        
    words = [w for w in re.findall(r'\b\w+\b', text.lower())]
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    
    num_words = len(words)
    num_sentences = max(1, len(sentences))
    
    # Deteksi kata kompleks menggunakan kamus lokal
    words_to_query = []
    for word in words:
        if word in COMPLEX_WORDS_DICT and word not in words_to_query:
            words_to_query.append(word)
            
    found_complex_words = []
    
    if words_to_query:
        api_success = False
        
        # Coba panggil Gemini API jika ada API KEY
        if GEMINI_API_KEY:
            try:
                prompt = f"""Analisis kata kompleks pada teks pendidikan berbahasa Indonesia.

Tujuan:
Membantu pengguna memahami kata kompleks menggunakan bahasa Indonesia baku dan sederhana.

ATURAN PENTING:
1. Makna formal HARUS selaras dengan definisi Bahasa Indonesia baku dan mengacu pada standar KBBI.
2. Penjelasan sederhana HARUS mudah dipahami pembaca umum.
3. Jangan mengarang definisi.
4. Jangan menggunakan istilah terlalu teknis.
5. Jangan mengosongkan field.
6. Gunakan bahasa Indonesia formal dan jelas.
7. Hasil harus ringkas tetapi informatif.

Berikan output HANYA dalam format JSON berikut:
[
  {{
    "kata": "algoritma",
    "makna_formal": "Langkah sistematis untuk menyelesaikan masalah.",
    "penjelasan_sederhana": "Urutan langkah untuk menyelesaikan suatu masalah."
  }}
]

Kata kompleks: {', '.join(words_to_query)}"""

                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                
                response_text = response.text
                
                # Parsing JSON (mengatasi kemungkinan blok kode ```json)
                json_str = response_text
                if "```json" in response_text:
                    json_str = response_text.split("```json")[1].split("```")[0].strip()
                elif "```" in response_text:
                    json_str = response_text.split("```")[1].split("```")[0].strip()
                
                json_data = json.loads(json_str)
                
                for item in json_data:
                    found_complex_words.append({
                        "word": item["kata"].lower(),
                        "formal_explanation": item["makna_formal"],
                        "simple_explanation": item["penjelasan_sederhana"]
                    })
                    
                api_success = True
            except Exception as e:
                print(f"Error Gemini API: {e}")
                api_success = False
                
        # Fallback jika API gagal atau API key tidak ada
        if not api_success:
            for word in words_to_query:
                found_complex_words.append({
                    "word": word,
                    "formal_explanation": COMPLEX_WORDS_DICT[word]["formal"],
                    "simple_explanation": COMPLEX_WORDS_DICT[word]["simple"]
                })
            
    # Penyederhanaan Kalimat (heuristik sederhana menggunakan data dari AI/Kamus)
    simplified_sentences = []
    
    # Buat dictionary instan untuk lookup O(1)
    current_complex_dict = {cw["word"]: cw["simple_explanation"] for cw in found_complex_words}
    
    for sentence in sentences:
        words_in_sentence = re.findall(r'\b\w+\b', sentence.lower())
        complex_count = sum(1 for w in words_in_sentence if w in current_complex_dict)
        if complex_count >= 1:
            simple_sentence = sentence
            for cw_word, cw_simple in current_complex_dict.items():
                simple_sentence = re.sub(rf'\b{cw_word}\b', cw_simple, simple_sentence, flags=re.IGNORECASE)
            
            if simple_sentence != sentence:
                simplified_sentences.append({
                    "original": sentence + ".",
                    "simplified": simple_sentence + "."
                })

    # Readability Score (Heuristik)
    avg_words_per_sentence = num_words / num_sentences
    complex_word_ratio = len(found_complex_words) / max(1, num_words)
    
    score = (avg_words_per_sentence * 2) + (complex_word_ratio * 200)
    score = min(100, max(0, score))
    
    difficulty_level = "Mudah"
    reader_recommendation = "📗 Pemula"
    
    if score > 60:
        difficulty_level = "Sulit"
        reader_recommendation = "📕 Lanjutan"
    elif score > 30:
        difficulty_level = "Sedang"
        reader_recommendation = "📘 Menengah"
        
    return {
        "readability_score": round(score, 1),
        "complex_words": found_complex_words,
        "difficulty_level": difficulty_level,
        "reader_recommendation": reader_recommendation,
        "simplified_sentences": simplified_sentences,
        "stats": {
            "num_words": num_words,
            "num_sentences": num_sentences
        }
    }
