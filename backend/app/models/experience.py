from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.enums import EmploymentType, Sector
from app.models.types import enum_column


class Experience(Base):
    __tablename__ = "experiences"

    id: Mapped[int] = mapped_column(primary_key=True)
    company: Mapped[str] = mapped_column(String(160), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    location: Mapped[str] = mapped_column(String(160), nullable=False)
    sector: Mapped[Sector] = enum_column(Sector)
    employment_type: Mapped[EmploymentType] = enum_column(EmploymentType)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    highlights: Mapped[list["ExperienceHighlight"]] = relationship(
        back_populates="experience",
        cascade="all, delete-orphan",
        order_by="ExperienceHighlight.sort_order",
    )


class ExperienceHighlight(Base):
    __tablename__ = "experience_highlights"

    id: Mapped[int] = mapped_column(primary_key=True)
    experience_id: Mapped[int] = mapped_column(ForeignKey("experiences.id"), nullable=False, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    experience: Mapped[Experience] = relationship(back_populates="highlights")
