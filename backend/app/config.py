import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Piso Alto Realty API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & DB
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/pisoalto_db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "piso_alto_realty_super_secret_jwt_key_2026_change_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Initial Admin Seed
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@pisoaltorealty.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminPassword123!")
    
    # Image Upload Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
