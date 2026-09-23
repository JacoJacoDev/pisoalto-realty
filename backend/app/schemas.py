from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_admin: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Property Image Schemas ---
class PropertyImageBase(BaseModel):
    image_url: str
    is_cover: bool = False
    display_order: int = 0

class PropertyImageCreate(PropertyImageBase):
    pass

class PropertyImageResponse(PropertyImageBase):
    id: int
    property_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Property Schemas ---
class PropertyBase(BaseModel):
    title: str
    operation_type: str  # Venta, Alquiler
    property_type: str   # Casa, Departamento, Cochera, Oficina, Terreno, Local
    price: float
    currency: str = "USD" # USD, ARS
    location: str
    address: str
    description: Optional[str] = None
    bedrooms: int = 0
    bathrooms: int = 0
    surface_area: float = 0.0
    features: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    operation_type: Optional[str] = None
    property_type: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    surface_area: Optional[float] = None
    features: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None

class PropertyResponse(PropertyBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: List[PropertyImageResponse] = []

    model_config = ConfigDict(from_attributes=True)

# --- Forms Schemas ---
class ValuationCreate(BaseModel):
    full_name: str
    phone: str
    property_type: str
    city: str

class ValuationResponse(ValuationCreate):
    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ContactCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: str
    service_interest: str
    message: Optional[str] = None

class ContactResponse(ContactCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
