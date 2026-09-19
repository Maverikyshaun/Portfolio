from sqlalchemy.orm import Session, selectinload

from app.models import Education


class EducationRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Education]:
        return (
            self.db.query(Education)
            .options(selectinload(Education.highlights))
            .order_by(Education.sort_order.asc(), Education.end_date.desc())
            .all()
        )
