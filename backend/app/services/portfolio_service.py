from enum import StrEnum

from app.dtos import (
    EducationDTO,
    ExperienceDTO,
    PortfolioSnapshotDTO,
    ProfileDTO,
    ProjectDTO,
    SkillDTO,
    SkillGroupDTO,
)
from app.dtos.mappers import (
    education_to_dto,
    experience_to_dto,
    group_skills,
    media_to_dto,
    profile_to_dto,
    project_to_dto,
    skill_to_dto,
)
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
from app.repositories import (
    EducationRepository,
    ExperienceRepository,
    MediaRepository,
    ProfileRepository,
    ProjectRepository,
    SkillRepository,
)
from app.schemas.common import EnumCatalogOut, EnumOptionOut
from app.services.exceptions import PortfolioNotSeededError, ProjectNotFoundError


def _label(item: StrEnum) -> str:
    specials = {
        "ai": "AI",
        "a_level": "A Level",
        "gcse": "GCSE",
        "open_to_work": "Open to work",
        "open_to_conversation": "Open to conversation",
        "not_looking": "Not looking",
        "full_time": "Full time",
        "machine_learning": "Machine learning",
        "data_engineering": "Data engineering",
        "full_stack": "Full stack",
        "ai_engineering": "AI engineering",
        "version_control": "Version control",
        "hiring_manager": "Hiring manager",
    }
    return specials.get(item.value, item.name.replace("_", " ").title())


def _options(enum_cls: type[StrEnum]) -> list[EnumOptionOut]:
    return [EnumOptionOut(value=item.value, label=_label(item)) for item in enum_cls]


class PortfolioService:
    def __init__(
        self,
        profile_repository: ProfileRepository,
        experience_repository: ExperienceRepository,
        education_repository: EducationRepository,
        skill_repository: SkillRepository,
        project_repository: ProjectRepository,
        media_repository: MediaRepository,
    ):
        self.profile_repository = profile_repository
        self.experience_repository = experience_repository
        self.education_repository = education_repository
        self.skill_repository = skill_repository
        self.project_repository = project_repository
        self.media_repository = media_repository

    def get_profile(self) -> ProfileDTO:
        profile = self.profile_repository.get_primary()
        if profile is None:
            raise PortfolioNotSeededError("Profile has not been seeded")
        return profile_to_dto(profile)

    def list_experience(self) -> list[ExperienceDTO]:
        return [experience_to_dto(row) for row in self.experience_repository.list_all()]

    def list_education(self) -> list[EducationDTO]:
        return [education_to_dto(row) for row in self.education_repository.list_all()]

    def list_skills(self, category: SkillCategory | None = None) -> list[SkillDTO]:
        return [skill_to_dto(row) for row in self.skill_repository.list_all(category=category)]

    def list_skill_groups(self, category: SkillCategory | None = None) -> tuple[SkillGroupDTO, ...]:
        return group_skills(self.skill_repository.list_all(category=category))

    def list_projects(self, kind: ProjectKind | None = None) -> list[ProjectDTO]:
        return [project_to_dto(row) for row in self.project_repository.list_all(kind=kind)]

    def get_project(self, slug: str) -> ProjectDTO:
        row = self.project_repository.get_by_slug(slug)
        if row is None:
            raise ProjectNotFoundError(f"Project '{slug}' was not found")
        return project_to_dto(row)

    def get_snapshot(self) -> PortfolioSnapshotDTO:
        profile = self.get_profile()
        return PortfolioSnapshotDTO(
            profile=profile,
            featured_skills=tuple(skill_to_dto(row) for row in self.skill_repository.list_featured()),
            latest_experiences=tuple(self.list_experience()[:3]),
            featured_projects=tuple(
                project_to_dto(row) for row in self.project_repository.list_featured()
            ),
            education=tuple(self.list_education()),
            media=tuple(media_to_dto(row) for row in self.media_repository.list_all()),
        )

    @staticmethod
    def enum_catalog() -> EnumCatalogOut:
        return EnumCatalogOut(
            availability=_options(AvailabilityStatus),
            employment_type=_options(EmploymentType),
            sector=_options(Sector),
            education_level=_options(EducationLevel),
            skill_category=_options(SkillCategory),
            proficiency=_options(ProficiencyLevel),
            project_kind=_options(ProjectKind),
            inquiry_type=_options(InquiryType),
            inquiry_status=_options(InquiryStatus),
            media_kind=_options(MediaKind),
        )
