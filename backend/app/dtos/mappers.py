from calendar import month_abbr

from app.dtos import (
    EducationDTO,
    ExperienceDTO,
    InquiryDTO,
    MediaAssetDTO,
    ProfileDTO,
    ProjectDTO,
    SkillDTO,
    SkillGroupDTO,
)
from app.enums import SkillCategory
from app.models import (
    Education,
    Experience,
    Inquiry,
    MediaAsset,
    Profile,
    Project,
    Skill,
)


def _month_year(value) -> str:
    return f"{month_abbr[value.month]} {value.year}"


def tenure_label(experience: Experience) -> str:
    start = _month_year(experience.start_date)
    if experience.is_current or experience.end_date is None:
        return f"{start} — Present"
    return f"{start} — {_month_year(experience.end_date)}"


def profile_to_dto(row: Profile) -> ProfileDTO:
    return ProfileDTO.model_validate(row, from_attributes=True)


def experience_to_dto(row: Experience) -> ExperienceDTO:
    return ExperienceDTO(
        id=row.id,
        company=row.company,
        title=row.title,
        location=row.location,
        sector=row.sector,
        employment_type=row.employment_type,
        start_date=row.start_date,
        end_date=row.end_date,
        is_current=row.is_current,
        tenure_label=tenure_label(row),
        highlights=tuple(item.body for item in row.highlights),
    )


def education_to_dto(row: Education) -> EducationDTO:
    return EducationDTO(
        id=row.id,
        institution=row.institution,
        credential=row.credential,
        field_of_study=row.field_of_study,
        location=row.location,
        level=row.level,
        end_date=row.end_date,
        year=row.end_date.year,
        classification=row.classification,
        score_label=row.score_label,
        highlights=tuple(item.body for item in row.highlights),
    )


def skill_to_dto(row: Skill) -> SkillDTO:
    return SkillDTO.model_validate(row, from_attributes=True)


def group_skills(rows: list[Skill]) -> tuple[SkillGroupDTO, ...]:
    buckets: dict[SkillCategory, list[SkillDTO]] = {}
    for row in rows:
        buckets.setdefault(row.category, []).append(skill_to_dto(row))
    return tuple(SkillGroupDTO(category=category, items=tuple(items)) for category, items in buckets.items())


def project_to_dto(row: Project) -> ProjectDTO:
    return ProjectDTO(
        id=row.id,
        slug=row.slug,
        title=row.title,
        summary=row.summary,
        kind=row.kind,
        sector=row.sector,
        year=row.year,
        stack_label=row.stack_label,
        is_featured=row.is_featured,
        highlights=tuple(item.body for item in row.highlights),
    )


def media_to_dto(row: MediaAsset) -> MediaAssetDTO:
    return MediaAssetDTO.model_validate(row, from_attributes=True)


def inquiry_to_dto(row: Inquiry) -> InquiryDTO:
    return InquiryDTO.model_validate(row, from_attributes=True)
