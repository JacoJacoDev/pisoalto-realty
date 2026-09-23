import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from app.config import settings

router = APIRouter(prefix="/properties", tags=["properties"])

@router.get("", response_model=List[schemas.PropertyResponse])
def get_properties(
    location: Optional[str] = None,
    property_type: Optional[str] = None,
    operation_type: Optional[str] = None,
    bedrooms: Optional[int] = None,
    is_published: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Property)

    # Public queries default to published only unless explicitly requested
    if is_published is not None:
        query = query.filter(models.Property.is_published == is_published)
    else:
        query = query.filter(models.Property.is_published == True)

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
    prop = db.query(models.Property).filter(models.Property.id == property_id).first()
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

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    existing_images_count = len(db_prop.images)
    uploaded_records = []

    for idx, file in enumerate(files):
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            ext = ".jpg"
        
        filename = f"prop_{property_id}_{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)

        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)

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
