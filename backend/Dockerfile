FROM python:3.11-slim

WORKDIR /app

# 1. Install system dependencies (Keep this at the top)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --- CHANGE STARTS HERE ---

# 2. Copy ONLY requirements.txt first
# This allows Docker to cache the 'pip install' layer
COPY requirements.txt .

# 3. Install Python dependencies 
# Adding the CPU-only URL makes this layer much smaller/faster
RUN pip install --no-cache-dir -r requirements.txt \
    --extra-index-url https://download.pytorch.org/whl/cpu

# 4. Copy the rest of your source code LAST
# Now, if you change your Python code, Docker skips steps 1, 2, and 3!
COPY . .

# --- CHANGE ENDS HERE ---

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]