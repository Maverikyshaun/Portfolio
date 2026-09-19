from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dtos import CreateInquiryDTO
from app.repositories import InquiryRepository
from app.schemas.inquiry import InquiryCreate, InquiryOut
from app.services import InquiryService

router = APIRouter(tags=["inquiries"])


@router.post("/inquiries", response_model=InquiryOut, status_code=status.HTTP_201_CREATED)
def create_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)):
    dto = CreateInquiryDTO.model_validate(payload, from_attributes=True)
    created = InquiryService(InquiryRepository(db)).submit(dto)
    return InquiryOut.model_validate(created)
