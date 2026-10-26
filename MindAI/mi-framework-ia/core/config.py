# -*- coding: utf-8 -*-
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = BASE_DIR.parents[1]


class Settings(BaseSettings):
    app_env: str = "dev"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    secret_key: str = "change-me-in-production"
    jwt_secret_key: str = "change-me-jwt-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    database_url: str = "postgresql+asyncpg://mindia:mindia@localhost:5432/mindia"
    allow_sqlite_fallback: bool = True
    auto_create_tables: bool = True
    sqlite_fallback_url: str = "sqlite+aiosqlite:///./mindflow.db"

    llm_mode: str = "mock"
    llm_provider: str = "openai"
    default_model: str = "gpt-4o-mini"
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    llm_timeout_seconds: int = 30
    llm_max_retries: int = 2
    llm_rate_limit_per_minute: int = 30

    enable_pii_redaction: bool = True
    aes_key: str | None = None
    log_level: str = "INFO"
    enable_code_executor: bool = False
    reports_dir: str = "reports"
    spacy_model: str = "es_core_news_sm"

    model_config = SettingsConfigDict(
        env_file=(str(BASE_DIR / ".env"), str(REPO_ROOT / ".env")),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
