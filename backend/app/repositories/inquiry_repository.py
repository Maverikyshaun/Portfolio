from sqlalchemy.orm import Session

from app.models import Inquiry


class InquiryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, row: Inquiry) -> Inquiry:
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row
