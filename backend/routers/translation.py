from fastapi import APIRouter, Body, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from models import models, schemas
from db.database import get_db
from routers.auth import get_current_user
from services import translation_service
from services.file_text_extractor import extract_text_from_file
from services.text_chunker import split_text
from services.text_cleaner import clean_text_for_translation
from services.transliteration_service import transliterate_roman_to_native

router = APIRouter(prefix="/translate", tags=["translate"])

@router.post("/execute", response_model=schemas.TranslationHistoryResponse)
def translate_text(
    data: schemas.TranslationHistoryCreate = Body(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    try:
        text = clean_text_for_translation(data.original_text)

        if data.source_language == "roman":

            if not data.roman_language:
                raise HTTPException(
                    status_code=400,
                    detail="roman_language is required when source is roman"
                )

            text = transliterate_roman_to_native(
                text=text,
                target_lang=data.roman_language
            )

            translated_result = translation_service.translate_text(
                text=text,
                source_lang=data.roman_language,
                target_lang=data.target_language
            )

            source_lang_to_store = "roman"

        else:

            translated_result = translation_service.translate_text(
                text=text,
                source_lang=data.source_language,
                target_lang=data.target_language
            )

            source_lang_to_store = data.source_language

        db_translation_record = models.TranslationHistory(
            original_text=data.original_text,
            translated_text=translated_result,
            source_language=source_lang_to_store,
            target_language=data.target_language,
            user_id=current_user.id
        )

        db.add(db_translation_record)
        db.commit()
        db.refresh(db_translation_record)

        return db_translation_record

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process Translation: {str(e)}")
    
@router.get("/history", response_model=list[schemas.TranslationHistoryResponse])
def get_translation_history(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.TranslationHistory)
        .filter(models.TranslationHistory.user_id == current_user.id)
        .order_by(models.TranslationHistory.created_at.desc())
        .all()
    )

@router.post("/translate/file")
async def translate_file(
    file: UploadFile = File(...),
    target_lang: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    try:
        data = await file.read()

        text = extract_text_from_file(data, file.filename)
        text = clean_text_for_translation(text)

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text found in file")

        chunks = split_text(text)

        translated_chunks = []

        for chunk in chunks:
            translated_chunks.append(
                translation_service.translate_text(
                    text=chunk,
                    source_lang="eng_Latn",
                    target_lang=target_lang
                )
            )

        final_text = "\n".join(translated_chunks)

        db_translation_record = models.TranslationHistory(
            original_text=text,
            translated_text=final_text,
            source_language="file",
            target_language=target_lang,
            user_id=current_user.id
        )

        db.add(db_translation_record)
        db.commit()
        db.refresh(db_translation_record)

        return {"translated_text": final_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))