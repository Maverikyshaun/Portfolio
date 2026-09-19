from datetime import date

from pydantic import Field

from app.enums import EmploymentType, Sector
from app.schemas.common import ApiModel


class ExperienceOut(ApiModel):
    id: int
    company: str = Field(min_length=2, max_length=160)
    title: str = Field(min_length=2, max_length=160)
    location: str = Field(min_length=2, max_length=160)
    sector: Sector
    employment_type: EmploymentType
    start_date: date
    end_date: date | None = None
    is_current: bool
    tenure_label: str = Field(min_length=8, max_length=40)
    highlights: list[str] = Field(min_length=1)
