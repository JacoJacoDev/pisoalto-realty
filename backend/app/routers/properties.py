import io
import os
import uuid
import warnings
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from PIL import Image, ImageOps, UnidentifiedImageError
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from app.config import settings

router = APIRouter(prefix="/properties", tags=["properties"])

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
MAX_IMAGES_PER_REQUEST = 10
MAX_IMAGES_PER_PROPERTY = 50
MAX_IMAGE_PIXELS = 20_000_000
MAX_TOTAL_UPLOAD_PIXELS = 40_000_000
MAX_TOTAL_UPLOAD_SIZE_BYTES = 30 * 1024 * 1024
IMAGE_FORMATS = {
    "JPEG": (".jpg", "JPEG"),
    "PNG": (".png", "PNG"),
    "WEBP": (".webp", "WEBP"),
}

@router.get("", response_model=List[schemas.PropertyResponse])
def get_properties(
    location: Optional[str] = None,
    property_type: Optional[str] = None,
    operation_type: Optional[str] = None,
    bedrooms: Optional[int] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Property)

    # Public queries must never expose draft properties.
    query = query.filter(models.Property.is_published.is_(True))

    if location and location.lower() != "all" and location.strip():
        query = query.filter(models.Property.location.ilike(f"%{location.strip()}%"))

    if property_type and property_type.lower() != "all" and property_type.strip():
        query = query.filter(models.Property.property_type.ilike(f"%{property_type.strip()}%"))

    if operation_type and operation_type.lower() != "all" and operation_type.strip():
        query = query.filter(models.Property.operation_type.ilike(f"%{operation_type.strip()}%"))

    if bedrooms is not None:
        if bedrooms >= 4:
            query = query.filter(models.Property.bedrooms >= 4)
        else:
            query = query.filter(models.Property.bedrooms == bedrooms)

    if is_featured is not None:
        query = query.filter(models.Property.is_featured == is_featured)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (models.Property.title.ilike(search_pattern)) |
            (models.Property.address.ilike(search_pattern)) |
            (models.Property.location.ilike(search_pattern)) |
            (models.Property.description.ilike(search_pattern))
        )

    properties = query.order_by(models.Property.created_at.desc()).all()
    return properties


# Admin specific list endpoint to see all properties including drafts
@router.get("/admin/all", response_model=List[schemas.PropertyResponse])
def get_admin_properties(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(models.Property).order_by(models.Property.created_at.desc()).all()


@router.get("/{property_id}", response_model=schemas.PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(models.Property).filter(
        models.Property.id == property_id,
        models.Property.is_published.is_(True),
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return prop


@router.post("", response_model=schemas.PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    prop_in: schemas.PropertyCreate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_prop = models.Property(**prop_in.model_dump())
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    return db_prop


@router.put("/{property_id}", response_model=schemas.PropertyResponse)
def update_property(
    property_id: int,
    prop_in: schemas.PropertyUpdate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not db_prop:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")

    update_data = prop_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_prop, field, value)

    db.commit()
    db.refresh(db_prop)
    return db_prop


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not db_prop:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")

    db.delete(db_prop)
    db.commit()
    return None


@router.post("/{property_id}/images", response_model=List[schemas.PropertyImageResponse])
async def upload_property_images(
    property_id: int,
    files: List[UploadFile] = File(...),
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not db_prop:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")

    if not files or len(files) > MAX_IMAGES_PER_REQUEST:
        raise HTTPException(status_code=413, detail=f"Suba entre 1 y {MAX_IMAGES_PER_REQUEST} imágenes por solicitud.")

    existing_images_count = len(db_prop.images)
    if existing_images_count + len(files) > MAX_IMAGES_PER_PROPERTY:
        raise HTTPException(status_code=413, detail=f"Cada propiedad admite hasta {MAX_IMAGES_PER_PROPERTY} imágenes.")

    validated_images = []
    total_upload_pixels = 0
    total_input_size = 0
    total_upload_size = 0
    for file in files:
        content = await file.read(MAX_IMAGE_SIZE_BYTES + 1)
        if len(content) > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(status_code=413, detail="Cada imagen debe pesar 10 MB o menos.")
        total_input_size += len(content)
        if total_input_size > MAX_TOTAL_UPLOAD_SIZE_BYTES:
            raise HTTPException(status_code=413, detail="El tamaño total de las imágenes excede 30 MB.")

        try:
            with warnings.catch_warnings():
                warnings.simplefilter("error", Image.DecompressionBombWarning)
                with Image.open(io.BytesIO(content)) as image:
                    image_format = image.format
                    if image_format not in IMAGE_FORMATS:
                        raise HTTPException(status_code=415, detail="Formato inválido. Use JPG, PNG o WEBP.")
                    if image.width * image.height > MAX_IMAGE_PIXELS:
                        raise HTTPException(status_code=413, detail="La imagen excede el límite de resolución permitido.")
                    total_upload_pixels += image.width * image.height
                    if total_upload_pixels > MAX_TOTAL_UPLOAD_PIXELS:
                        raise HTTPException(status_code=413, detail="La resolución total de las imágenes excede el límite permitido.")
                    image.load()
                    normalized = ImageOps.exif_transpose(image)
                    extension, output_format = IMAGE_FORMATS[image_format]
                    if output_format == "JPEG":
                        normalized = normalized.convert("RGB")
                    output = io.BytesIO()
                    if output_format == "JPEG":
                        normalized.save(output, format=output_format, quality=90, optimize=True)
                    elif output_format == "PNG":
                        normalized.save(output, format=output_format, optimize=True)
                    else:
                        normalized.save(output, format=output_format, quality=90, method=6)
                    normalized_content = output.getvalue()
                    total_upload_size += len(normalized_content)
                    if total_upload_size > MAX_TOTAL_UPLOAD_SIZE_BYTES:
                        raise HTTPException(status_code=413, detail="El tamaño total de las imágenes excede 30 MB.")
                    validated_images.append((normalized_content, extension))
        except HTTPException:
            raise
        except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning) as exc:
            raise HTTPException(status_code=415, detail="El archivo no es una imagen válida o excede la resolución permitida.") from exc

    if settings.ENVIRONMENT.lower() == "production":
        if not os.path.isdir(settings.UPLOAD_DIR) or not os.access(settings.UPLOAD_DIR, os.W_OK):
            raise HTTPException(status_code=503, detail="El almacenamiento persistente de imágenes no está disponible.")
    else:
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    uploaded_records = []
    created_paths = []

    try:
        for idx, (content, ext) in enumerate(validated_images):
            filename = f"prop_{property_id}_{uuid.uuid4().hex}{ext}"
            filepath = os.path.join(settings.UPLOAD_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(content)
            created_paths.append(filepath)

            relative_url = f"/uploads/{filename}"
            is_cover = (existing_images_count == 0 and idx == 0)
            img_record = models.PropertyImage(
                property_id=property_id,
                image_url=relative_url,
                is_cover=is_cover,
                display_order=existing_images_count + idx
            )
            db.add(img_record)
            uploaded_records.append(img_record)

        db.commit()
    except Exception:
        db.rollback()
        for filepath in created_paths:
            try:
                os.remove(filepath)
            except OSError:
                pass
        raise
    for record in uploaded_records:
        db.refresh(record)

    return uploaded_records


@router.delete("/{property_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property_image(
    property_id: int,
    image_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    img = db.query(models.PropertyImage).filter(
        models.PropertyImage.id == image_id,
        models.PropertyImage.property_id == property_id
    ).first()

    if not img:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    # Remove file from disk if local
    if img.image_url.startswith("/uploads/"):
        filename = img.image_url.replace("/uploads/", "")
        filepath = os.path.join(settings.UPLOAD_DIR, filename)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception:
                pass

    was_cover = img.is_cover
    db.delete(img)
    db.commit()

    # If deleted image was cover, set next image as cover
    if was_cover:
        next_img = db.query(models.PropertyImage).filter(models.PropertyImage.property_id == property_id).first()
        if next_img:
            next_img.is_cover = True
            db.commit()

    return None


@router.put("/{property_id}/images/{image_id}/cover", response_model=schemas.PropertyImageResponse)
def set_cover_image(
    property_id: int,
    image_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    images = db.query(models.PropertyImage).filter(models.PropertyImage.property_id == property_id).all()
    target_img = None
    for img in images:
        if img.id == image_id:
            img.is_cover = True
            target_img = img
        else:
            img.is_cover = False

    if not target_img:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    db.commit()
    db.refresh(target_img)
    return target_img
