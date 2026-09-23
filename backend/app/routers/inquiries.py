from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/inquiries", tags=["inquiries"])

@router.post("/valuation", response_model=schemas.ValuationResponse, status_code=status.HTTP_201_CREATED)
def create_valuation_request(request: schemas.ValuationCreate, db: Session = Depends(get_db)):
    db_req = models.ValuationRequest(**request.model_dump())
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

@router.post("/contact", response_model=schemas.ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact_inquiry(inquiry: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_inq = models.ContactInquiry(**inquiry.model_dump())
    db.add(db_inq)
    db.commit()
    db.refresh(db_inq)
    return db_inq

@router.get("/valuation", response_model=List[schemas.ValuationResponse])
def get_valuations(current_admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    return db.query(models.ValuationRequest).order_by(models.ValuationRequest.created_at.desc()).all()

@router.get("/contact", response_model=List[schemas.ContactResponse])
def get_contacts(current_admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    return db.query(models.ContactInquiry).order_by(models.ContactInquiry.created_at.desc()).all()
