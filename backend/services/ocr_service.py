import io
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes


# IMPORTANT (Windows – your case)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# If poppler is not in PATH, set this too:
POPPLER_PATH = r"C:\Program Files\poppler-25.12.0\Library\bin"


def extract_text_from_file(file_bytes: bytes, content_type: str) -> str:

    text_result = []

    # ---------- IMAGE ----------
    if content_type.startswith("image/"):
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()

    # ---------- PDF ----------
    if content_type == "application/pdf":

        images = convert_from_bytes(
            file_bytes,
            poppler_path=POPPLER_PATH
        )

        for page in images:
            page_text = pytesseract.image_to_string(page)
            text_result.append(page_text)

        return "\n".join(text_result).strip()

    raise Exception("Unsupported file type")