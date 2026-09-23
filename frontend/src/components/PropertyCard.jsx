import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin } from 'lucide-react';
import { getImageUrl } from '../api/client';

const PropertyCard = ({ property }) => {
  const coverImage = property.images && property.images.length > 0
    ? (property.images.find(img => img.is_cover) || property.images[0]).image_url
    : null;

  const formattedPrice = property.currency === 'USD'
    ? `U$S ${Number(property.price).toLocaleString('es-AR')}`
    : `$ ${Number(property.price).toLocaleString('es-AR')}`;

  const isVenta = property.operation_type === 'Venta';

  return (
    <div className="property-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#ffffff'
    }}>
      {/* Property Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '160px',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden'
      }}>
        <img
          src={getImageUrl(coverImage)}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Type Badge top-left */}
        <span style={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'rgba(12, 24, 54, 0.82)',
          backdropFilter: 'blur(6px)',
          color: '#ffffff',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {property.property_type}
        </span>

        {/* Operation Badge top-right */}
        <span style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: isVenta ? '#1d4ed8' : '#059669',
          color: '#ffffff',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {property.operation_type}
        </span>
      </div>

      {/* Property Info Content */}
      <div style={{
        padding: '0.85rem 0.95rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        {/* Price */}
        <div style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#0c1836',
          lineHeight: 1.2,
          marginBottom: '0.25rem',
          letterSpacing: '-0.02em'
        }}>
          {formattedPrice}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#1e293b',
          lineHeight: 1.3,
          marginBottom: '0.2rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }} title={property.title}>
          {property.title}
        </h3>

        {/* Location / Address */}
        <p style={{
          fontSize: '0.72rem',
          color: '#64748b',
          fontWeight: 500,
          marginBottom: '0.65rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <MapPin size={12} color="#94a3b8" />
          <span>{property.address || property.location}</span>
        </p>

        {/* Specs Icons Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.45rem 0',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '0.75rem',
          fontSize: '0.72rem',
          color: '#475569',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Dormitorios">
            <Bed size={13} color="#64748b" />
            <span>{property.bedrooms} dor.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Baños">
            <Bath size={13} color="#64748b" />
            <span>{property.bathrooms} bñ.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Superficie">
            <Maximize2 size={13} color="#64748b" />
            <span>{property.surface_area} m²</span>
          </div>
        </div>

        {/* Action Button & Attached Piso Alto Icon */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <Link
            to={`/propiedades/${property.id}`}
            className="btn-pill-navy"
            style={{
              width: '100%',
              padding: '0.42rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textAlign: 'center'
            }}
          >
            Ver detalles
          </Link>

          {/* Piso Alto Attached Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '0.2rem'
          }}>
            <img
              src="/pisoalto-symbol.png"
              alt="Piso Alto"
              style={{
                height: '18px',
                width: 'auto',
                opacity: 1,
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
