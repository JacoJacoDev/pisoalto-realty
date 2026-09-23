import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2 } from 'lucide-react';
import { getImageUrl } from '../api/client';

const PropertyCard = ({ property }) => {
  const coverImage = property.images && property.images.length > 0
    ? (property.images.find(img => img.is_cover) || property.images[0]).image_url
    : null;

  const formattedPrice = property.currency === 'USD'
    ? `U$S ${Number(property.price).toLocaleString('es-AR')}`
    : `$ ${Number(property.price).toLocaleString('es-AR')}`;

  return (
    <div className="card-rounded property-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1.5px solid #0c1836' }}>
      {/* Property Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '210px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
        <img
          src={getImageUrl(coverImage)}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Type Badge top-left */}
        <span className="badge-type">
          {property.property_type}
        </span>
      </div>

      {/* Property Info Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Price + Operation Type row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0c1836' }}>
            {formattedPrice}
          </span>
          <span className="badge-operation">
            {property.operation_type}
          </span>
        </div>

        {/* Address */}
        <p style={{
          fontSize: '0.85rem',
          color: '#475569',
          fontWeight: 600,
          marginBottom: '1rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {property.address}
        </p>

        {/* Specs Icons Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
          color: '#334155',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Bed size={16} color="#475569" />
            <span>{property.bedrooms}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Bath size={16} color="#475569" />
            <span>{property.bathrooms}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Maximize2 size={16} color="#475569" />
            <span>{property.surface_area} m²</span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <Link
            to={`/propiedades/${property.id}`}
            className="btn-pill-navy"
            style={{ width: '100%', padding: '0.55rem', fontSize: '0.875rem' }}
          >
            Ver detalles
          </Link>
        </div>

        {/* Bottom Piso Alto Logo matching screenshot */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H7.5L12 12L16.5 22H22L12 2Z" fill="#0c1836" />
            <path d="M12 15L9.5 20H14.5L12 15Z" fill="#2563eb" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
