from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    
class OCRHistoryBase(BaseModel):
    filename: str
    extracted_text: str

class OCRHistoryCreate(OCRHistoryBase):
    pass

class OCRHistoryResponse(OCRHistoryBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True

class TranslationHistoryBase(BaseModel):
    original_text: str
    source_language: str
    target_language: str


class TranslationHistoryCreate(TranslationHistoryBase):
    roman_language: Optional[str] = None

class TranslationHistoryResponse(TranslationHistoryBase):
    translated_text: str
    id: int
    created_at: datetime
    user_id: int


    class Config:
        from_attributes = True
