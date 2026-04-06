from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "HabitatX Backend"
    app_env: str = "development"
    database_url: str = "sqlite:///./habitatx.db"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="HABITATX_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

