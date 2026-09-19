from sqlalchemy.orm import Session

from app.models import Profile


class ProfileRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_primary(self) -> Profile | None:
        return self.db.query(Profile).order_by(Profile.id.asc()).first()
