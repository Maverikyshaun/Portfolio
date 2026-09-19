from sqlalchemy.orm import Session

from app.models import MediaAsset


class MediaRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[MediaAsset]:
        return self.db.query(MediaAsset).order_by(MediaAsset.sort_order.asc(), MediaAsset.id.asc()).all()
