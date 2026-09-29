# Backend deployment storage

Set `ENVIRONMENT=production`, provide `DATABASE_URL` for the persistent PostgreSQL service, and set `UPLOAD_DIR` to an absolute path on a persistent writable volume mounted into the API container. The API intentionally refuses to start if the database is unavailable or the upload volume is missing or read-only. SQLite is supported only when explicitly configured for development.

Copy `.env.example` to a private environment file, generate a unique `SECRET_KEY` of at least 32 characters and `ADMIN_PASSWORD` of at least 16 characters, and replace the database placeholder. Do not commit that private file.
