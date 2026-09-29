import os
from pathlib import Path
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Piso Alto Realty API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & DB
    DATABASE_URL: str
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Initial Admin Seed
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "jacobopuntonet@outlook.com")
    ADMIN_PASSWORD: str = Field(min_length=10)
    
    # Image Upload Storage
    UPLOAD_DIR: str

    @model_validator(mode="after")
    def validate_runtime_storage(self):
        if self.ENVIRONMENT.lower() == "production":
            if self.DATABASE_URL.startswith("sqlite"):
                raise ValueError("Production requires a persistent database; SQLite is not supported.")
            if not Path(self.UPLOAD_DIR).is_absolute():
                raise ValueError("Production UPLOAD_DIR must be an absolute path on a persistent volume.")
        return self

    class Config:
        env_file = ".env.local"
        extra = "ignore"

settings = Settings()
