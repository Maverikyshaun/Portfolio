from sqlalchemy.orm import Session, selectinload

from app.models import Experience


class ExperienceRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Experience]:
        return (
            self.db.query(Experience)
            .options(selectinload(Experience.highlights))
            .order_by(Experience.sort_order.asc(), Experience.start_date.desc())
            .all()
        )
