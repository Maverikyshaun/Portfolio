from pydantic import Field

from app.enums import ProficiencyLevel, SkillCategory
from app.schemas.common import ApiModel


class SkillOut(ApiModel):
    id: int
    name: str = Field(min_length=1, max_length=80)
    category: SkillCategory
    proficiency: ProficiencyLevel
    is_featured: bool


class SkillGroupOut(ApiModel):
    category: SkillCategory
    items: list[SkillOut] = Field(min_length=1)
