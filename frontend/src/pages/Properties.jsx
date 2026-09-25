import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, X } from 'lucide-react';
import client from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter options
  const locations = ['All', 'Córdoba Capital', 'Las Varillas', 'Río Ceballos'];
  const propertyTypes = ['All', 'Casa', 'Cochera', 'Departamento', 'Oficina'];
  const operationTypes = ['All', 'Alquiler', 'Venta'];
  const bedroomOptions = [
    { label: 'All', value: 'All' },
    { label: '0 Dor.', value: 0 },
    { label: '1 Dor.', value: 1 },
    { label: '2 Dor.', value: 2 },
    { label: '4 Dor.', value: 4 }
  ];

  const [filters, setFilters] = useState(() => ({
    location: searchParams.get('location') || 'All',
    property_type: searchParams.get('property_type') || 'All',
    operation_type: searchParams.get('operation_type') || 'All',
    bedrooms: 'All',
    search: searchParams.get('search') || ''
  }));

  // Keep state synced if URL params change externally
  useEffect(() => {
    const loc = searchParams.get('location') || 'All';
    const pt = searchParams.get('property_type') || 'All';
    const op = searchParams.get('operation_type') || 'All';
    const srch = searchParams.get('search') || '';
    setFilters(f => ({
      ...f,
      location: loc,
      property_type: pt,
      operation_type: op,
      search: srch
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('is_published', 'true');

      if (filters.location !== 'All') params.append('location', filters.location);
      if (filters.property_type !== 'All') params.append('property_type', filters.property_type);
      if (filters.operation_type !== 'All') params.append('operation_type', filters.operation_type);
      if (filters.bedrooms !== 'All') params.append('bedrooms', filters.bedrooms);
      if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());

      const res = await client.get(`/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching properties list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFilter = (patch) => {
    setFilters(prev => ({ ...prev, ...patch }));
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '85vh', paddingBottom: '2.5rem' }}>

      {/* ── 1. Page Header with Slow Entrance Animation ── */}
      <div style={{
        padding: '1.75rem 0 1.25rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.06) 0%, rgba(255, 255, 255, 1) 75%)',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '1.5rem'
      }}>
        <div className="section-header animate-fade-in-up" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '0.65rem' }}>
            <span className="section-pill-badge section-pill-badge-light" style={{ margin: 0 }}>
              <Sparkles size={13} color="#2563eb" />
              <span>Catálogo Inmobiliario · Córdoba &amp; Interior</span>
            </span>
          </div>
          <h1 className="section-title">
            Listado de Propiedades
          </h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Explorá nuestra oferta de casas, departamentos, oficinas y terrenos con información detallada y actualizada.
          </p>
        </div>
      </div>

      {/* ── 2. Main Page Container ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1.25rem' }}>

        {/* Search bar & Quick Tags Strip */}
        <div className="animate-fade-in-up delay-100" style={{
          backgroundColor: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}>
            {/* Search Input Box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '0.45rem 0.9rem',
              flex: '1 1 300px',
              maxWidth: '440px',
              gap: '0.5rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
            }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Buscar por barrio, ciudad o dirección..."
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  width: '100%',
                  background: 'transparent'
                }}
              />
              {filters.search && (
                <button
                  onClick={() => setFilters(f => ({ ...f, search: '' }))}
                  style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Counter badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#1d4ed8'
            }}>
              <Sparkles size={13} color="#2563eb" />
              <span>{properties.length} propiedades disponibles</span>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap',
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: '0.25rem' }}>
              Filtro rápido:
            </span>
            {[
              { label: 'Todas', patch: { location: 'All', property_type: 'All', operation_type: 'All', bedrooms: 'All', search: '' } },
              { label: 'Casas en Venta', patch: { operation_type: 'Venta', property_type: 'Casa' } },
              { label: 'Departamentos', patch: { property_type: 'Departamento' } },
              { label: 'Alquileres', patch: { operation_type: 'Alquiler' } },
              { label: 'Córdoba Capital', patch: { location: 'Córdoba Capital' } },
              { label: 'Las Varillas', patch: { location: 'Las Varillas' } },
            ].map((tag, i) => (
              <button
                key={i}
                onClick={() => handleQuickFilter(tag.patch)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.7rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Two-Column Layout (Sidebar + 3-Column Grid) ── */}
        <div className="properties-page-layout">
          {/* Left Sidebar Filter */}
          <aside className="animate-fade-in-up delay-150" style={{ width: '100%' }}>
            <PropertyFilter
              filters={filters}
              onFilterChange={setFilters}
              locations={locations}
              propertyTypes={propertyTypes}
              operationTypes={operationTypes}
              bedroomOptions={bedroomOptions}
            />
          </aside>

          {/* Right Property Cards Grid (3 per row) */}
          <main style={{ minWidth: 0 }}>
            {loading ? (
              <div className="animate-fade-in" style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                fontSize: '0.95rem'
              }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                  <img src="/pisoalto-symbol.png" alt="Cargando" style={{ height: '32px', opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
                </div>
                Cargando propiedades disponibles...
              </div>
            ) : properties.length === 0 ? (
              <div className="animate-fade-in" style={{
                backgroundColor: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '0.875rem',
                padding: '3.5rem 1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <img src="/pisoalto-symbol.png" alt="Piso Alto" style={{ height: '36px', opacity: 0.6 }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#0c1836', fontWeight: 800, marginBottom: '0.4rem' }}>
                  No se encontraron propiedades
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
                  No hay propiedades que coincidan con los filtros aplicados. Probá modificando los criterios de búsqueda.
                </p>
                <button
                  onClick={() => setFilters({ location: 'All', property_type: 'All', operation_type: 'All', bedrooms: 'All', search: '' })}
                  className="btn-pill-navy"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.825rem' }}
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="properties-cards-grid animate-fade-in-up delay-200">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .properties-page-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 960px) {
          .properties-page-layout {
            grid-template-columns: 1fr;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.98); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default Properties;
