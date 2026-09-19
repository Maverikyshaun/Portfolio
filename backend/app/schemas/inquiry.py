from datetime import datetime

from pydantic import EmailStr, Field, field_validator

from app.enums import InquiryStatus, InquiryType
from app.schemas.common import ApiModel


class InquiryCreate(ApiModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: str | None = Field(default=None, max_length=160)
    inquiry_type: InquiryType
    message: str = Field(min_length=20, max_length=3000)

    @field_validator("name", "company", "message", mode="before")
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        if value is None:
            return value
        cleaned = " ".join(str(value).split())
        return cleaned or None


class InquiryOut(ApiModel):
    id: int
    name: str
    email: EmailStr
    company: str | None = None
    inquiry_type: InquiryType
    status: InquiryStatus
    message: str
    created_at: datetime
