from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from analyzer import analyze_text
from document_processor import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt
from ocr_processor import extract_text_from_image

app = FastAPI(title="API Analisis Teks Pendidikan")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Untuk development. Pada production ganti dengan domain frontend.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

@app.post("/api/analyze/text")
async def analyze_text_endpoint(input_data: TextInput):
    if not input_data.text.strip():
        raise HTTPException(status_code=400, detail="Teks tidak boleh kosong")
    
    result = analyze_text(input_data.text)
    result["original_text"] = input_data.text
    return {"status": "success", "data": result}

@app.post("/api/analyze/file")
async def analyze_file_endpoint(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename.lower()
    
    extracted_text = ""
    
    try:
        if filename.endswith(".pdf"):
            extracted_text = extract_text_from_pdf(content)
        elif filename.endswith(".docx"):
            extracted_text = extract_text_from_docx(content)
        elif filename.endswith(".txt"):
            extracted_text = extract_text_from_txt(content)
        elif filename.endswith(".png") or filename.endswith(".jpg") or filename.endswith(".jpeg"):
            extracted_text = extract_text_from_image(content)
        else:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Gunakan PDF, DOCX, TXT, JPG, atau PNG.")
            
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Gagal mengekstrak teks dari file atau file kosong.")
            
        result = analyze_text(extracted_text)
        result["original_text"] = extracted_text
        result["filename"] = file.filename
        return {"status": "success", "data": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
