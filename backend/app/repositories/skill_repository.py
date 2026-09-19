from sqlalchemy.orm import Session

from app.enums import SkillCategory
from app.models import Skill


class SkillRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self, category: SkillCategory | None = None) -> list[Skill]:
        query = self.db.query(Skill)
        if category is not None:
            query = query.filter(Skill.category == category)
        return query.order_by(Skill.sort_order.asc(), Skill.name.asc()).all()

    def list_featured(self) -> list[Skill]:
        return (
            self.db.query(Skill)
            .filter(Skill.is_featured.is_(True))
            .order_by(Skill.sort_order.asc(), Skill.name.asc())
            .all()
        )
