from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from models import models, schemas
from db.database import get_db
from routers.auth import get_current_user
from services import ocr_service

router = APIRouter(prefix="/ocr", tags=["ocr"])


@router.post("/extract", response_model=schemas.OCRHistoryResponse)
async def extract_text(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and PDF are supported"
        )

    try:
        contents = await file.read()

        extracted_text = ocr_service.extract_text_from_file(
            contents,
            file.content_type
        )

        db_ocr_record = models.OCRHistory(
            filename=file.filename,
            extracted_text=extracted_text,
            user_id=current_user.id
        )

        db.add(db_ocr_record)
        db.commit()
        db.refresh(db_ocr_record)

        return db_ocr_record

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))