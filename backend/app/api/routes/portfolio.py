from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enums import ProjectKind, SkillCategory
from app.repositories import (
    EducationRepository,
    ExperienceRepository,
    MediaRepository,
    ProfileRepository,
    ProjectRepository,
    SkillRepository,
)
from app.schemas.education import EducationOut
from app.schemas.experience import ExperienceOut
from app.schemas.profile import ProfileOut
from app.schemas.project import ProjectOut
from app.schemas.skill import SkillGroupOut, SkillOut
from app.schemas.snapshot import PortfolioSnapshotOut
from app.schemas.common import EnumCatalogOut
from app.services import PortfolioNotSeededError, PortfolioService, ProjectNotFoundError

router = APIRouter(tags=["portfolio"])


def get_portfolio_service(db: Session = Depends(get_db)) -> PortfolioService:
    return PortfolioService(
        ProfileRepository(db),
        ExperienceRepository(db),
        EducationRepository(db),
        SkillRepository(db),
        ProjectRepository(db),
        MediaRepository(db),
    )


@router.get("/portfolio", response_model=PortfolioSnapshotOut)
def get_portfolio(service: PortfolioService = Depends(get_portfolio_service)):
    try:
        snapshot = service.get_snapshot()
    except PortfolioNotSeededError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return PortfolioSnapshotOut.model_validate(snapshot)


@router.get("/profile", response_model=ProfileOut)
def get_profile(service: PortfolioService = Depends(get_portfolio_service)):
    try:
        profile = service.get_profile()
    except PortfolioNotSeededError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return ProfileOut.model_validate(profile)


@router.get("/experience", response_model=list[ExperienceOut])
def list_experience(service: PortfolioService = Depends(get_portfolio_service)):
    return [ExperienceOut.model_validate(item) for item in service.list_experience()]


@router.get("/education", response_model=list[EducationOut])
def list_education(service: PortfolioService = Depends(get_portfolio_service)):
    return [EducationOut.model_validate(item) for item in service.list_education()]


@router.get("/skills", response_model=list[SkillOut])
def list_skills(
    category: SkillCategory | None = Query(default=None),
    service: PortfolioService = Depends(get_portfolio_service),
):
    return [SkillOut.model_validate(item) for item in service.list_skills(category=category)]


@router.get("/skills/groups", response_model=list[SkillGroupOut])
def list_skill_groups(
    category: SkillCategory | None = Query(default=None),
    service: PortfolioService = Depends(get_portfolio_service),
):
    return [SkillGroupOut.model_validate(item) for item in service.list_skill_groups(category=category)]


@router.get("/projects", response_model=list[ProjectOut])
def list_projects(
    kind: ProjectKind | None = Query(default=None),
    service: PortfolioService = Depends(get_portfolio_service),
):
    return [ProjectOut.model_validate(item) for item in service.list_projects(kind=kind)]


@router.get("/projects/{slug}", response_model=ProjectOut)
def get_project(slug: str, service: PortfolioService = Depends(get_portfolio_service)):
    try:
        project = service.get_project(slug)
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return ProjectOut.model_validate(project)


@router.get("/meta/enums", response_model=EnumCatalogOut)
def list_enums(service: PortfolioService = Depends(get_portfolio_service)):
    return service.enum_catalog()
