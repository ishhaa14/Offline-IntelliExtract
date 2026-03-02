from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine
from models import models
from routers import auth, ocr, translation

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Offline OCR & Translator API",
    description="Backend for offline text extraction and translation",
    version="1.0.0"
)

# CORS configuration for frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://intelliextract.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(ocr.router)
app.include_router(translation.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Offline OCR & Translator API"}

