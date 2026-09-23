from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    operation_type = Column(String(50), nullable=False)  # Venta, Alquiler
    property_type = Column(String(50), nullable=False)   # Casa, Departamento, Cochera, Oficina, Terreno, Local
    price = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), nullable=False, default="USD") # USD, ARS
    location = Column(String(100), nullable=False, index=True) # Córdoba Capital, Las Varillas, Río Ceballos
    address = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    bedrooms = Column(Integer, default=0)
    bathrooms = Column(Integer, default=0)
    surface_area = Column(Float, default=0.0)  # m²
    features = Column(Text, nullable=True)     # JSON string or comma-separated tags
    contact_phone = Column(String(50), nullable=True)
    contact_email = Column(String(100), nullable=True)
    is_published = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")

class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    is_cover = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    property = relationship("Property", back_populates="images")

class ValuationRequest(Base):
    __tablename__ = "valuation_requests"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(100), nullable=False)
    property_type = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    status = Column(String(50), default="Pendiente")
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True)
    email = Column(String(150), nullable=True)
    phone = Column(String(100), nullable=False)
    service_interest = Column(String(100), nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
