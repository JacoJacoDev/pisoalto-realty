import React from 'react';
import { MapPin, Home, Key, BedDouble, RotateCcw, SlidersHorizontal } from 'lucide-react';

const PropertyFilter = ({ filters, onFilterChange, locations, propertyTypes, operationTypes, bedroomOptions }) => {

  const handlePillClick = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = filters.location !== 'All' ||
    filters.property_type !== 'All' ||
    filters.operation_type !== 'All' ||
    filters.bedrooms !== 'All';

  const resetFilters = () => {
    onFilterChange({
      ...filters,
      location: 'All',
      property_type: 'All',
      operation_type: 'All',
      bedrooms: 'All'
    });
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1.5px solid #e2e8f0',
      borderRadius: '0.875rem',
      padding: '1.25rem 1rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      height: 'fit-content'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <SlidersHorizontal size={17} color="#0c1836" />
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: '#0c1836',
            margin: 0
          }}>
            Filtros
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              fontSize: '0.72rem',
              color: '#ef4444',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer'
            }}
            title="Restablecer todos los filtros"
          >
            <RotateCcw size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* 1. Ubicación */}
      <div style={{ marginBottom: '1.15rem' }}>
        <h4 style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <MapPin size={14} color="#2563eb" /> Ubicación
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {locations.map(loc => {
            const isSelected = filters.location === loc;
            return (
              <button
                key={loc}
                onClick={() => handlePillClick('location', loc)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #0c1836' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0c1836' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {loc === 'All' ? 'Todas' : loc}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.85rem 0' }}></div>

      {/* 2. Tipo de Propiedad */}
      <div style={{ marginBottom: '1.15rem' }}>
        <h4 style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <Home size={14} color="#2563eb" /> Tipo de Propiedad
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {propertyTypes.map(type => {
            const isSelected = filters.property_type === type;
            return (
              <button
                key={type}
                onClick={() => handlePillClick('property_type', type)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #0c1836' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0c1836' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {type === 'All' ? 'Todos' : type}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.85rem 0' }}></div>

      {/* 3. Tipo de Operacion */}
      <div style={{ marginBottom: '1.15rem' }}>
        <h4 style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <Key size={14} color="#2563eb" /> Operación
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {operationTypes.map(op => {
            const isSelected = filters.operation_type === op;
            return (
              <button
                key={op}
                onClick={() => handlePillClick('operation_type', op)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #0c1836' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0c1836' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {op === 'All' ? 'Todas' : op}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.85rem 0' }}></div>

      {/* 4. Cantidad de Dormitorios */}
      <div>
        <h4 style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#0c1836',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <BedDouble size={14} color="#2563eb" /> Dormitorios
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {bedroomOptions.map(opt => {
            const isSelected = filters.bedrooms === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handlePillClick('bedrooms', opt.value)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #0c1836' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0c1836' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt.label === 'All' ? 'Todos' : opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
