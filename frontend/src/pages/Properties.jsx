import React, { useState, useEffect } from 'react';
import client from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter options setup matching reference image 2
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

  const [filters, setFilters] = useState({
    location: 'All',
    property_type: 'All',
    operation_type: 'All',
    bedrooms: 'All'
  });

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

      const res = await client.get(`/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching properties list:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0', backgroundColor: '#ffffff', minHeight: '80vh' }}>
      <div className="container">
        {/* Main Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
            Listado de Propiedades
          </h1>
        </div>

        {/* 2-Column Layout (Left Filters, Right Grid) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem'
        }} className="properties-page-grid">
          {/* Left Sidebar Filter */}
          <div style={{ maxWidth: '320px', width: '100%' }}>
            <PropertyFilter
              filters={filters}
              onFilterChange={setFilters}
              locations={locations}
              propertyTypes={propertyTypes}
              operationTypes={operationTypes}
              bedroomOptions={bedroomOptions}
            />
          </div>

          {/* Right Property Cards Grid */}
          <div style={{ flexGrow: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', fontSize: '1.1rem' }}>
                Cargando propiedades...
              </div>
            ) : properties.length === 0 ? (
              <div className="card-rounded" style={{ padding: '4rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', color: '#0c1836', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No se encontraron propiedades
                </p>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Prueba cambiando los filtros de búsqueda para ver más resultados.
                </p>
                <button
                  onClick={() => setFilters({ location: 'All', property_type: 'All', operation_type: 'All', bedrooms: 'All' })}
                  className="btn-pill-navy"
                  style={{ marginTop: '1.5rem' }}
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem'
              }}>
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .properties-page-grid {
            grid-template-columns: 300px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Properties;
