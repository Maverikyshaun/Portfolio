from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.enums import (
    AvailabilityStatus,
    EducationLevel,
    EmploymentType,
    InquiryStatus,
    InquiryType,
    MediaKind,
    ProficiencyLevel,
    ProjectKind,
    Sector,
    SkillCategory,
)


class FrozenDTO(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class ProfileDTO(FrozenDTO):
    id: int
    full_name: str
    first_name: str
    headline: str
    location: str
    email: EmailStr
    phone: str
    summary: str
    years_experience: int = Field(ge=0, le=50)
    availability: AvailabilityStatus
    photo_url: str
    cv_url: str
    linkedin_url: str | None = None
    github_url: str | None = None
    website_url: str | None = None


class ExperienceDTO(FrozenDTO):
    id: int
    company: str
    title: str
    location: str
    sector: Sector
    employment_type: EmploymentType
    start_date: date
    end_date: date | None
    is_current: bool
    tenure_label: str
    highlights: tuple[str, ...]


class EducationDTO(FrozenDTO):
    id: int
    institution: str
    credential: str
    field_of_study: str
    location: str
    level: EducationLevel
    end_date: date
    year: int
    classification: str | None
    score_label: str | None
    highlights: tuple[str, ...]


class SkillDTO(FrozenDTO):
    id: int
    name: str
    category: SkillCategory
    proficiency: ProficiencyLevel
    is_featured: bool


class SkillGroupDTO(FrozenDTO):
    category: SkillCategory
    items: tuple[SkillDTO, ...]


class ProjectDTO(FrozenDTO):
    id: int
    slug: str
    title: str
    summary: str
    kind: ProjectKind
    sector: Sector
    year: int
    stack_label: str
    is_featured: bool
    highlights: tuple[str, ...]


class MediaAssetDTO(FrozenDTO):
    id: int
    kind: MediaKind
    title: str
    url: str
    alt_text: str


class InquiryDTO(FrozenDTO):
    id: int
    name: str
    email: EmailStr
    company: str | None
    inquiry_type: InquiryType
    status: InquiryStatus
    message: str
    created_at: datetime


class CreateInquiryDTO(FrozenDTO):
    name: str
    email: EmailStr
    company: str | None
    inquiry_type: InquiryType
    message: str


class PortfolioSnapshotDTO(FrozenDTO):
    profile: ProfileDTO
    featured_skills: tuple[SkillDTO, ...]
    latest_experiences: tuple[ExperienceDTO, ...]
    featured_projects: tuple[ProjectDTO, ...]
    education: tuple[EducationDTO, ...]
    media: tuple[MediaAssetDTO, ...]
