import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, text
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_db
from app.routers import auth, properties, inquiries

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production setup can restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local development may create its upload directory. Production must mount it first.
if settings.ENVIRONMENT.lower() != "production":
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR, check_dir=False), name="uploads")

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(properties.router, prefix=settings.API_V1_STR)
app.include_router(inquiries.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    if settings.ENVIRONMENT.lower() == "production":
        upload_path = Path(settings.UPLOAD_DIR)
        if not upload_path.is_dir() or not os.access(upload_path, os.W_OK):
            raise RuntimeError("Production UPLOAD_DIR must be an existing writable persistent volume.")
    # Ensure database schema is created and seeded on startup
    Base.metadata.create_all(bind=engine)
    # create_all does not add columns to existing tables, so keep deployments
    # with an existing properties table compatible with the optional map URL.
    property_columns = {column["name"] for column in inspect(engine).get_columns("properties")}
    if "google_maps_url" not in property_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE properties ADD COLUMN google_maps_url VARCHAR(1000)"))
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    return {"status": "healthy"}
