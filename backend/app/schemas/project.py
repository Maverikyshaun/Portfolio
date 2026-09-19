from pydantic import Field, field_validator

from app.enums import ProjectKind, Sector
from app.schemas.common import ApiModel


class ProjectOut(ApiModel):
    id: int
    slug: str = Field(min_length=3, max_length=120, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str = Field(min_length=3, max_length=200)
    summary: str = Field(min_length=20, max_length=400)
    kind: ProjectKind
    sector: Sector
    year: int = Field(ge=2015, le=2100)
    stack_label: str = Field(min_length=3, max_length=240)
    is_featured: bool
    highlights: list[str] = Field(min_length=1)

    @field_validator("highlights")
    @classmethod
    def highlights_not_blank(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item.strip()]
        if not cleaned:
            raise ValueError("at least one highlight is required")
        return cleaned
