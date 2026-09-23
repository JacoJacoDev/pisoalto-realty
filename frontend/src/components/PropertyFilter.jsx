import React from 'react';
import { MapPin, Home, Key, BedDouble } from 'lucide-react';

const PropertyFilter = ({ filters, onFilterChange, locations, propertyTypes, operationTypes, bedroomOptions }) => {

  const handlePillClick = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="card-rounded" style={{ padding: '1.5rem', height: 'fit-content' }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 800,
        color: '#0c1836',
        marginBottom: '1rem',
        textAlign: 'center',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.75rem'
      }}>
        Filtros
      </h3>

      {/* 1. Ubicación */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <MapPin size={16} color="#2563eb" /> Ubicación
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {locations.map(loc => (
            <button
              key={loc}
              onClick={() => handlePillClick('location', loc)}
              className={`btn-pill-outline ${filters.location === loc ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '1rem 0' }}></div>

      {/* 2. Tipo de Propiedad */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Home size={16} color="#2563eb" /> Tipo de Propiedad
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {propertyTypes.map(type => (
            <button
              key={type}
              onClick={() => handlePillClick('property_type', type)}
              className={`btn-pill-outline ${filters.property_type === type ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '1rem 0' }}></div>

      {/* 3. Tipo de Operacion */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Key size={16} color="#2563eb" /> Tipo de Operacion
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {operationTypes.map(op => (
            <button
              key={op}
              onClick={() => handlePillClick('operation_type', op)}
              className={`btn-pill-outline ${filters.operation_type === op ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '1rem 0' }}></div>

      {/* 4. Cantidad de Dormitorios */}
      <div>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <BedDouble size={16} color="#2563eb" /> Cantidad de Dormitorios
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {bedroomOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handlePillClick('bedrooms', opt.value)}
              className={`btn-pill-outline ${filters.bedrooms === opt.value ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
