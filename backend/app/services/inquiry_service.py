from app.dtos import CreateInquiryDTO, InquiryDTO
from app.dtos.mappers import inquiry_to_dto
from app.enums import InquiryStatus
from app.models import Inquiry
from app.repositories import InquiryRepository


class InquiryService:
    def __init__(self, repository: InquiryRepository):
        self.repository = repository

    def submit(self, payload: CreateInquiryDTO) -> InquiryDTO:
        row = Inquiry(
            name=payload.name,
            email=str(payload.email),
            company=payload.company,
            inquiry_type=payload.inquiry_type,
            status=InquiryStatus.NEW,
            message=payload.message,
        )
        return inquiry_to_dto(self.repository.create(row))
