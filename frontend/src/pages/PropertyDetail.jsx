import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, ArrowLeft, Send, Check, Phone } from 'lucide-react';
import client, { getImageUrl } from '../api/client';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    first_name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await client.get(`/properties/${id}`);
        setProperty(res.data);
        if (res.data) {
          setInquiryForm(prev => ({
            ...prev,
            message: `Hola, me interesa la propiedad "${res.data.title}" (${res.data.address}). Deseo solicitar más información.`
          }));
        }
      } catch (err) {
        console.error("Error fetching property detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/inquiries/contact', {
        ...inquiryForm,
        service_interest: `Consulta Propiedad #${id}`
      });
      setInquirySubmitted(true);
      setTimeout(() => setInquirySubmitted(false), 5000);
    } catch (err) {
      alert("Error al enviar la consulta.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: '#64748b' }}>
        Cargando detalles de la propiedad...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#0c1836', marginBottom: '1rem' }}>Propiedad no encontrada</h2>
        <Link to="/propiedades" className="btn-pill-navy">
          Volver al listado
        </Link>
      </div>
    );
  }

  const formattedPrice = property.currency === 'USD'
    ? `U$S ${Number(property.price).toLocaleString('es-AR')}`
    : `$ ${Number(property.price).toLocaleString('es-AR')}`;

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200' }];

  const featuresList = property.features
    ? property.features.split(',').map(f => f.trim()).filter(Boolean)
    : ['Excelente iluminación', 'Excelente ubicación', 'Servicios al día', 'Escritura inmediata'];

  return (
    <div style={{ padding: '2.5rem 0 5rem 0', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/propiedades" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#2563eb',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            <ArrowLeft size={18} /> Volver al listado de propiedades
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="card-rounded" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="badge-operation" style={{ position: 'relative', top: 'auto', left: 'auto' }}>
                  {property.operation_type}
                </span>
                <span style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563eb',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase'
                }}>
                  {property.property_type}
                </span>
              </div>

              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.5rem' }}>
                {property.title}
              </h1>

              <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontWeight: 600 }}>
                <MapPin size={18} color="#2563eb" /> {property.address}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0c1836', display: 'block' }}>
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Section (Gallery Left, Contact Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }} className="detail-layout-grid">
          {/* Left Main Content */}
          <div style={{ flexGrow: 1 }}>
            {/* Gallery Image Display */}
            <div className="card-rounded" style={{ marginBottom: '2rem', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '420px', backgroundColor: '#e2e8f0' }}>
                <img
                  src={getImageUrl(images[selectedImage]?.image_url)}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', overflowX: 'auto', backgroundColor: '#ffffff' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        width: '80px',
                        height: '60px',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        border: selectedImage === idx ? '3px solid #2563eb' : '1px solid #cbd5e1',
                        opacity: selectedImage === idx ? 1 : 0.7,
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <img src={getImageUrl(img.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Bar */}
            <div className="card-rounded" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0c1836', marginBottom: '1rem' }}>
                Características Principales
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <Bed size={24} color="#2563eb" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0c1836', display: 'block' }}>
                    {property.bedrooms}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Dormitorios</span>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <Bath size={24} color="#2563eb" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0c1836', display: 'block' }}>
                    {property.bathrooms}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Baños</span>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <Maximize2 size={24} color="#2563eb" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0c1836', display: 'block' }}>
                    {property.surface_area} m²
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Superficie</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="card-rounded" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0c1836', marginBottom: '1rem' }}>
                Descripción
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem', whitespace: 'pre-line' }}>
                {property.description || 'Sin descripción disponible.'}
              </p>
            </div>

            {/* Features List */}
            <div className="card-rounded" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0c1836', marginBottom: '1.25rem' }}>
                Comodidades y Detalles
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {featuresList.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 600, fontSize: '0.9rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={14} color="#2563eb" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Contact Box */}
          <div style={{ maxWidth: '380px', width: '100%' }}>
            <div className="card-rounded" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.5rem' }}>
                ¿Te interesa esta propiedad?
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Comunicate con nuestro equipo de asesores para coordinar una visita o recibir más detalles.
              </p>

              {inquirySubmitted && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                  ✓ Consulta enviada. Te responderemos pronto.
                </div>
              )}

              <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.first_name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, first_name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    Teléfono o WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    Mensaje
                  </label>
                  <textarea
                    rows="3"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn-pill-navy" style={{ width: '100%', padding: '0.7rem' }}>
                  <Send size={16} /> Enviar Consulta
                </button>
              </form>

              <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '1.5rem 0' }}></div>

              {/* Direct WhatsApp Action */}
              <a
                href={`https://wa.me/5493518555588?text=Hola,%20quisiera%20consultar%20por%20la%20propiedad%20"${encodeURIComponent(property.title)}"%20(ID:%20${property.id})`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  padding: '0.7rem',
                  borderRadius: '9999px',
                  textDecoration: 'none'
                }}
              >
                <Phone size={18} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .detail-layout-grid {
            grid-template-columns: 1fr 360px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetail;
