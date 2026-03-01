# 🧠 Offline IntelliExtract

**Offline IntelliExtract** is a local-first web application that allows users to  
extract text from images / PDF / documents using OCR and translate text between languages — fully running on your local machine.

It provides:
- Secure login & activity history
- Offline OCR processing
- Offline / local text translation
- Downloadable outputs

---

## 📌 Features

- 🔐 User authentication (Login / Register)
- 📷 OCR for images, PDF and documents
- 🌍 Text translation (source → target language)
- 🕘 Activity history for:
  - OCR
  - Translation
- 📥 Download output files
- ❌ Delete individual history records
- 🪟 Popup view for full extracted / translated text
- 🎨 Glass-panel UI theme

---

## 🏗️ Project Structure

### Backend (FastAPI)
backend/
├─ core/
│ ├─ config.py
│ └─ security.py
├─ db/
│ └─ database.py
├─ models/
│ └─ models.py
├─ schemas/
│ └─ schemas.py
├─ routers/
│ ├─ auth.py
│ ├─ ocr.py
│ └─ translation.py
├─ services/
│ ├─ file_text_extractor.py
│ ├─ ocr_service.py
│ ├─ text_chunker.py
│ ├─ text_cleaner.py
│ ├─ translation_service.py
│ └─ translation_service.py
└─ main.py


---

### Frontend (React + Vite)
frontend/
├─ src/
│ ├─ components/
│ │ ├─ ActivityHistory.jsx
│ │ ├─ ActivityHistory.css
│ │ ├─ Navbar.jsx
│ │ ├─ OCRTool.jsx
│ │ └─ TranslationTool.jsx
│ ├─ context/
│ │ └─ AuthContext.jsx
│ ├─ pages/
│ │ ├─ Dashboard.jsx
│ │ ├─ Login.jsx
│ │ └─ Register.jsx
│ ├─ utils/
│ ├─ api.js
│ ├─ App.jsx
│ ├─ main.jsx
│ └─ index.css
├─ index.html
└─ vite.config.js



---

## ⚙️ Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- OCR & translation services (local)

### Frontend
- React
- Vite
- Axios
- Lucide Icons
- Glass-morphism UI

---

## 🚀 How to Run

---

### ✅ Backend setup


cd backend
Create virtual environment:
python -m venv venv


Activate:
Windows
venv\Scripts\activate

Linux / Mac
source venv/bin/activate


Install dependencies:
pip install -r requirements.txt


Run server:
uvicorn main:app --reload
Backend will run at:
http://127.0.0.1:8000


---

### ✅ Frontend setup


cd frontend
npm install
npm run dev
Frontend will run at:
http://localhost:5173


---

## 🔐 Authentication Flow

- Register → `/register`
- Login → `/login`
- JWT token is stored in localStorage
- All history and actions are user-specific

---

## 📄 API Endpoints (Main)

### Auth

POST /auth/register
POST /auth/login


### OCR

POST /ocr/file
GET /ocr/history
DELETE /ocr/history/{id}


### Translation

POST /translate/text
POST /translate/file
GET /translate/history
DELETE /translate/history/{id}


---

## 🕘 Activity History

- OCR and Translation are merged into one timeline
- Scrollable column
- Fixed card height
- Popup to view full content
- Download output file
- Delete history with confirmation popup

---

## 📥 Download Format

### OCR

extracted text → .txt


### Translation

source language
target language
original text
translated text


Saved as:
translation_output.txt


---

## 🛡️ Offline-first Design

- OCR and translation services are implemented locally
- No cloud APIs are required
- All data is stored in your own database

---

## 🧩 Environment Variables

Create a `.env` file in backend (if required):


SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60


---

## 📝 Notes

- This project is designed for local/offline usage.
- Suitable for document processing, internal tools, and privacy-focused environments.

---

## 👩‍💻 Author

Developed as an offline OCR & translation system with full activity tracking and user authentication.