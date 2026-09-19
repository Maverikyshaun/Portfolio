from pydantic import BaseModel, ConfigDict, Field


class ApiModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")


class EnumOptionOut(ApiModel):
    value: str = Field(min_length=1, max_length=40)
    label: str = Field(min_length=1, max_length=80)


class EnumCatalogOut(ApiModel):
    availability: list[EnumOptionOut]
    employment_type: list[EnumOptionOut]
    sector: list[EnumOptionOut]
    education_level: list[EnumOptionOut]
    skill_category: list[EnumOptionOut]
    proficiency: list[EnumOptionOut]
    project_kind: list[EnumOptionOut]
    inquiry_type: list[EnumOptionOut]
    inquiry_status: list[EnumOptionOut]
    media_kind: list[EnumOptionOut]
