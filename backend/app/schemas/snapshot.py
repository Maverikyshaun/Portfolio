from app.enums import MediaKind
from app.schemas.common import ApiModel
from app.schemas.education import EducationOut
from app.schemas.experience import ExperienceOut
from app.schemas.profile import ProfileOut
from app.schemas.project import ProjectOut
from app.schemas.skill import SkillOut


class MediaAssetOut(ApiModel):
    id: int
    kind: MediaKind
    title: str
    url: str
    alt_text: str


class PortfolioSnapshotOut(ApiModel):
    profile: ProfileOut
    featured_skills: list[SkillOut]
    latest_experiences: list[ExperienceOut]
    featured_projects: list[ProjectOut]
    education: list[EducationOut]
    media: list[MediaAssetOut]
