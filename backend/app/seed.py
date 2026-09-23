from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import User, Property, PropertyImage
from app.auth import get_password_hash
from app.config import settings

def seed_db(db: Session):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # 1. Seed Admin User
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print(f"[SEED] Created initial admin: {settings.ADMIN_EMAIL}")

    # 2. Seed Initial Properties matching reference screenshots
    if db.query(Property).count() == 0:
        sample_properties = [
            {
                "title": "Casa Quinta con Amplio Terreno",
                "operation_type": "Venta",
                "property_type": "Casa",
                "price": 59000,
                "currency": "USD",
                "location": "Las Varillas",
                "address": "Pasaje R. Salamanca 351 - Las Varillas",
                "bedrooms": 2,
                "bathrooms": 1,
                "surface_area": 275,
                "is_published": True,
                "is_featured": True,
                "description": "Excelente oportunidad en Las Varillas. Casa con 2 dormitorios, patio espacioso, excelente iluminación natural y todos los servicios al día.",
                "image_url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"
            },
            {
                "title": "Oficina Comercial Céntrica",
                "operation_type": "Alquiler",
                "property_type": "Oficina",
                "price": 730000,
                "currency": "ARS",
                "location": "Las Varillas",
                "address": "Tucumán 205 - Las Varillas",
                "bedrooms": 4,
                "bathrooms": 1,
                "surface_area": 120,
                "is_published": True,
                "is_featured": True,
                "description": "Oficina comercial ideal para profesionales o empresa. Excelente ubicación en sector céntrico con alta visibilidad y tránsito.",
                "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
            },
            {
                "title": "Casa Familiar Luminosa",
                "operation_type": "Venta",
                "property_type": "Casa",
                "price": 55000,
                "currency": "USD",
                "location": "Las Varillas",
                "address": "Hernán Durando 52 - Las Varillas",
                "bedrooms": 2,
                "bathrooms": 1,
                "surface_area": 272,
                "is_published": True,
                "is_featured": True,
                "description": "Propiedad cómoda y funcional con amplio jardín, cochera cubierta y buena distribución en zona residencial tranquila.",
                "image_url": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop"
            },
            {
                "title": "Casa Serrano en Río Ceballos",
                "operation_type": "Venta",
                "property_type": "Casa",
                "price": 84500,
                "currency": "USD",
                "location": "Río Ceballos",
                "address": "Pasaje Esperanza 79 - Río Ceballos",
                "bedrooms": 1,
                "bathrooms": 1,
                "surface_area": 400,
                "is_published": True,
                "is_featured": True,
                "description": "Hermosa vista a las sierras, entorno natural privilegiado en Río Ceballos. Terreno de 400 m² con gran potencial de expansión.",
                "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
            },
            {
                "title": "Cochera Cubierta Privada",
                "operation_type": "Venta",
                "property_type": "Cochera",
                "price": 7000,
                "currency": "USD",
                "location": "Córdoba Capital",
                "address": "Humberto 1º 28 - Córdoba Capital",
                "bedrooms": 0,
                "bathrooms": 0,
                "surface_area": 15,
                "is_published": True,
                "is_featured": False,
                "description": "Cochera fija y techada en edificio con seguridad 24 horas y portón automático. Excelente ubicación céntrica.",
                "image_url": "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1200&auto=format&fit=crop"
            },
            {
                "title": "Departamento Amueblado en Nueva Córdoba",
                "operation_type": "Alquiler",
                "property_type": "Departamento",
                "price": 50000,
                "currency": "ARS",
                "location": "Córdoba Capital",
                "address": "Paraná 390 - Córdoba Capital",
                "bedrooms": 2,
                "bathrooms": 1,
                "surface_area": 70,
                "is_published": True,
                "is_featured": False,
                "description": "Departamento luminoso con cocina integrada, balcones y vista a la ciudad. Cerca de universidades y centros comerciales.",
                "image_url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
            },
            {
                "title": "Departamento Moderno Av. Vélez Sársfield",
                "operation_type": "Alquiler",
                "property_type": "Departamento",
                "price": 50000,
                "currency": "ARS",
                "location": "Córdoba Capital",
                "address": "Av. Vélez Sársfield 511 - Córdoba Capital",
                "bedrooms": 2,
                "bathrooms": 1,
                "surface_area": 70,
                "is_published": True,
                "is_featured": False,
                "description": "Excelente departamento en ubicación estratégica. Living comedor amplio, 2 dormitorios con placards e interiores.",
                "image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop"
            },
            {
                "title": "Departamento 1 Dormitorio Céntrico",
                "operation_type": "Alquiler",
                "property_type": "Departamento",
                "price": 45000,
                "currency": "ARS",
                "location": "Córdoba Capital",
                "address": "Paraná 390 - Córdoba Capital",
                "bedrooms": 1,
                "bathrooms": 1,
                "surface_area": 40,
                "is_published": True,
                "is_featured": False,
                "description": "Ideal estudiantes o profesionales. 1 dormitorio con gran placard, cocina amueblada y bajas expensas.",
                "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
            }
        ]

        for p_data in sample_properties:
            img_url = p_data.pop("image_url")
            prop = Property(**p_data)
            db.add(prop)
            db.commit()
            db.refresh(prop)

            img = PropertyImage(
                property_id=prop.id,
                image_url=img_url,
                is_cover=True,
                display_order=0
            )
            db.add(img)

            # Add secondary sample image for detail view
            img2 = PropertyImage(
                property_id=prop.id,
                image_url="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop",
                is_cover=False,
                display_order=1
            )
            db.add(img2)
            db.commit()

        print("[SEED] Successfully seeded initial properties and images matching reference designs.")

if __name__ == "__main__":
    db = SessionLocal()
    seed_db(db)
    db.close()
