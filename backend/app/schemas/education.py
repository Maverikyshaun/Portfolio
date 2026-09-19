from datetime import date

from pydantic import Field

from app.enums import EducationLevel
from app.schemas.common import ApiModel


class EducationOut(ApiModel):
    id: int
    institution: str = Field(min_length=2, max_length=200)
    credential: str = Field(min_length=2, max_length=200)
    field_of_study: str = Field(min_length=2, max_length=200)
    location: str = Field(min_length=2, max_length=160)
    level: EducationLevel
    end_date: date
    year: int = Field(ge=1990, le=2100)
    classification: str | None = Field(default=None, max_length=80)
    score_label: str | None = Field(default=None, max_length=40)
    highlights: list[str] = Field(default_factory=list)
