import io
import os
import platform
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes


# -----------------------------
# TESSERACT CONFIGURATION
# -----------------------------
# Windows needs explicit path
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = os.getenv(
        "TESSERACT_CMD",
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )


# -----------------------------
# POPPLER CONFIGURATION
# -----------------------------
# Windows requires poppler path
POPPLER_PATH = None

if platform.system() == "Windows":
    POPPLER_PATH = os.getenv(
        "POPPLER_PATH",
        r"C:\Program Files\poppler-25.12.0\Library\bin"
    )


# -----------------------------
# OCR EXTRACTION FUNCTION
# -----------------------------
def extract_text_from_file(file_bytes: bytes, content_type: str) -> str:

    text_result = []

    # ---------- IMAGE FILE ----------
    if content_type.startswith("image/"):

        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")

        text = pytesseract.image_to_string(image)

        return text.strip()

    # ---------- PDF FILE ----------
    if content_type == "application/pdf":

        images = convert_from_bytes(
            file_bytes,
            poppler_path=POPPLER_PATH
        )

        for page in images:
            page_text = pytesseract.image_to_string(page)
            text_result.append(page_text)

        return "\n".join(text_result).strip()

    # ---------- UNSUPPORTED ----------
    raise Exception("Unsupported file type")