import pytesseract
from PIL import Image
import io

def extract_text_from_image(file_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(file_bytes))
        # Uncomment baris di bawah dan sesuaikan path jika Tesseract tidak terdeteksi otomatis di Windows
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        text = pytesseract.image_to_string(image, lang='ind')
        return text
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
