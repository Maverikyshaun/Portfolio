from sqlalchemy.orm import Session, selectinload

from app.enums import ProjectKind
from app.models import Project


class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def _base(self):
        return self.db.query(Project).options(selectinload(Project.highlights))

    def list_all(self, kind: ProjectKind | None = None) -> list[Project]:
        query = self._base()
        if kind is not None:
            query = query.filter(Project.kind == kind)
        return query.order_by(Project.sort_order.asc(), Project.year.desc()).all()

    def list_featured(self) -> list[Project]:
        return (
            self._base()
            .filter(Project.is_featured.is_(True))
            .order_by(Project.sort_order.asc(), Project.year.desc())
            .all()
        )

    def get_by_slug(self, slug: str) -> Project | None:
        return self._base().filter(Project.slug == slug).first()
