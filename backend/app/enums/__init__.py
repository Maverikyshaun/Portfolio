from enum import StrEnum


class AvailabilityStatus(StrEnum):
    OPEN_TO_WORK = "open_to_work"
    OPEN_TO_CONVERSATION = "open_to_conversation"
    NOT_LOOKING = "not_looking"


class EmploymentType(StrEnum):
    FULL_TIME = "full_time"
    CONTRACT = "contract"
    APPRENTICESHIP = "apprenticeship"
    INTERNSHIP = "internship"


class Sector(StrEnum):
    AVIATION = "aviation"
    ENERGY = "energy"
    ACADEMIC = "academic"
    PERSONAL = "personal"


class EducationLevel(StrEnum):
    MASTERS = "masters"
    BACHELORS = "bachelors"
    A_LEVEL = "a_level"
    GCSE = "gcse"


class SkillCategory(StrEnum):
    PROGRAMMING = "programming"
    DATABASE = "database"
    MACHINE_LEARNING = "machine_learning"
    CLOUD = "cloud"
    AI_ENGINEERING = "ai_engineering"
    VISUALIZATION = "visualization"
    WEB = "web"
    VERSION_CONTROL = "version_control"
    TOOLING = "tooling"
    OFFICE = "office"


class ProficiencyLevel(StrEnum):
    FOUNDATIONAL = "foundational"
    PROFICIENT = "proficient"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ProjectKind(StrEnum):
    AI = "ai"
    MACHINE_LEARNING = "machine_learning"
    DATA_ENGINEERING = "data_engineering"
    DASHBOARD = "dashboard"
    RESEARCH = "research"
    FULL_STACK = "full_stack"


class InquiryType(StrEnum):
    RECRUITER = "recruiter"
    HIRING_MANAGER = "hiring_manager"
    COLLABORATION = "collaboration"
    OTHER = "other"


class InquiryStatus(StrEnum):
    NEW = "new"
    READ = "read"
    REPLIED = "replied"


class MediaKind(StrEnum):
    HEADSHOT = "headshot"
    CV = "cv"
    GALLERY = "gallery"


class HighlightKind(StrEnum):
    EXPERIENCE = "experience"
    EDUCATION = "education"
    PROJECT = "project"


__all__ = [
    "AvailabilityStatus",
    "EducationLevel",
    "EmploymentType",
    "HighlightKind",
    "InquiryStatus",
    "InquiryType",
    "MediaKind",
    "ProficiencyLevel",
    "ProjectKind",
    "Sector",
    "SkillCategory",
]
