@echo off
echo ===================================================
echo     Offline OCR ^& Translator - Startup Script    
echo ===================================================

echo [1/2] Starting Python FastAPI Backend...
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload"

echo [2/2] Starting React Vite Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo - Backend will be available at: http://localhost:8000
echo - Frontend will be available at: http://localhost:5173
echo.
echo Make sure you have PostgreSQL running and Tesseract OCR installed!
pause
