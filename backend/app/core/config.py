from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Shantanu Soni — Portfolio"
    environment: str = "development"
    database_url: str = f"sqlite:///{(BACKEND_DIR / 'portfolio.db').as_posix()}"
    frontend_dir: Path = PROJECT_DIR / "frontend"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
