import io
import os
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes


# In Docker (Linux): tesseract is installed via apt, so no path needed (None).
# On Windows locally: set TESSERACT_CMD env var, or it falls back to the default Windows path.
TESSERACT_CMD = os.getenv("TESSERACT_CMD", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

# In Docker (Linux): poppler is installed via apt and in PATH, so None is fine.
# On Windows locally: set POPPLER_PATH env var, or it falls back to the default.
POPPLER_PATH = os.getenv("POPPLER_PATH", r"C:\Program Files\poppler-25.12.0\Library\bin") or None


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