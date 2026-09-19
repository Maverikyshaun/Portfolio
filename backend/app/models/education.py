from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.enums import EducationLevel
from app.models.types import enum_column


class Education(Base):
    __tablename__ = "educations"

    id: Mapped[int] = mapped_column(primary_key=True)
    institution: Mapped[str] = mapped_column(String(200), nullable=False)
    credential: Mapped[str] = mapped_column(String(200), nullable=False)
    field_of_study: Mapped[str] = mapped_column(String(200), nullable=False)
    location: Mapped[str] = mapped_column(String(160), nullable=False)
    level: Mapped[EducationLevel] = enum_column(EducationLevel)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    classification: Mapped[str | None] = mapped_column(String(80), nullable=True)
    score_label: Mapped[str | None] = mapped_column(String(40), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    highlights: Mapped[list["EducationHighlight"]] = relationship(
        back_populates="education",
        cascade="all, delete-orphan",
        order_by="EducationHighlight.sort_order",
    )


class EducationHighlight(Base):
    __tablename__ = "education_highlights"

    id: Mapped[int] = mapped_column(primary_key=True)
    education_id: Mapped[int] = mapped_column(ForeignKey("educations.id"), nullable=False, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    education: Mapped[Education] = relationship(back_populates="highlights")
