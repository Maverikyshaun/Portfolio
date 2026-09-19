from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import api_router
from app.core.config import settings
from app.core.seed import seed_database

seed_database()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

frontend_dir = Path(settings.frontend_dir)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def serve_home():
    return FileResponse(frontend_dir / "index.html")


@app.get("/experience")
def serve_experience():
    return FileResponse(frontend_dir / "experience.html")


@app.get("/projects")
def serve_projects():
    return FileResponse(frontend_dir / "projects.html")


@app.get("/skills")
def serve_skills():
    return FileResponse(frontend_dir / "skills.html")


@app.get("/education")
def serve_education():
    return FileResponse(frontend_dir / "education.html")


@app.get("/contact")
def serve_contact():
    return FileResponse(frontend_dir / "contact.html")


app.mount("/static", StaticFiles(directory=str(frontend_dir)), name="static")
