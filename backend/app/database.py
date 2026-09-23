import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

db_url = settings.DATABASE_URL

# Fallback mechanism if Postgres connection fails on initial connect or for dev without local Postgres running
def get_engine(url: str):
    try:
        if url.startswith("sqlite"):
            engine = create_engine(url, connect_args={"check_same_thread": False})
        else:
            engine = create_engine(url, pool_pre_ping=True)
        # Test connection
        with engine.connect() as conn:
            pass
        return engine
    except Exception as e:
        print(f"[DATABASE WARNING] Primary database connection failed ({e}). Falling back to local SQLite database.")
        sqlite_fallback = "sqlite:///./pisoalto.db"
        return create_engine(sqlite_fallback, connect_args={"check_same_thread": False})

engine = get_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
