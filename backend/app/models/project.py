from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.enums import ProjectKind, Sector
from app.models.types import enum_column


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(String(400), nullable=False)
    kind: Mapped[ProjectKind] = enum_column(ProjectKind)
    sector: Mapped[Sector] = enum_column(Sector)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    stack_label: Mapped[str] = mapped_column(String(240), nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    highlights: Mapped[list["ProjectHighlight"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="ProjectHighlight.sort_order",
    )


class ProjectHighlight(Base):
    __tablename__ = "project_highlights"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable=False, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    project: Mapped[Project] = relationship(back_populates="highlights")
