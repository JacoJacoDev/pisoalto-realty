import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bed, Bath, Maximize2, MapPin, ArrowLeft, Send, Check, Phone,
  ChevronLeft, ChevronRight, Share2, Heart, ShieldCheck, Clock,
  Star, Eye, Sparkles, ZoomIn
} from 'lucide-react';
import client, { getImageUrl } from '../api/client';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    first_name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
        console.error('Error fetching property detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      await client.post('/inquiries/contact', {
        ...inquiryForm,
        service_interest: `Consulta Propiedad #${id}`
      });
      setInquirySubmitted(true);
      setTimeout(() => setInquirySubmitted(false), 6000);
    } catch (err) {
      alert('Error al enviar la consulta.');
    } finally {
      setInquiryLoading(false);
    }
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        background: '#f8fafc', color: '#64748b'
      }}>
        <div style={{
          width: 44, height: 44,
          border: '3px solid #e2e8f0', borderTopColor: '#2563eb',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cargando propiedad…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ─── Not found ─── */
  if (!property) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <MapPin size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '2rem', color: '#0c1836', marginBottom: '1rem' }}>Propiedad no encontrada</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>La propiedad que buscás no existe o ya no está disponible.</p>
        <Link to="/propiedades" className="btn-pill-navy">Explorar propiedades</Link>
      </div>
    );
  }

  /* ─── Data helpers ─── */
  const formattedPrice = property.currency === 'USD'
    ? `U$S ${Number(property.price).toLocaleString('es-AR')}`
    : `$ ${Number(property.price).toLocaleString('es-AR')}`;

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200' }];

  const featuresList = property.features
    ? property.features.split(',').map(f => f.trim()).filter(Boolean)
    : ['Excelente iluminación', 'Excelente ubicación', 'Servicios al día', 'Escritura inmediata'];

  const isVenta = property.operation_type === 'Venta';

  const prevImg = () => setSelectedImage(prev => Math.max(prev - 1, 0));
  const nextImg = () => setSelectedImage(prev => Math.min(prev + 1, images.length - 1));

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', minHeight: '90vh' }}>

      {/* Decorative background blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-120px', left: '5%', width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.07)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.06)', filter: 'blur(90px)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '1.75rem', paddingBottom: '4rem' }}>

        {/* ─── Back Link ─── */}
        <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
          <Link to="/propiedades" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            color: '#2563eb', fontWeight: 700, fontSize: '0.85rem',
            padding: '0.45rem 1rem', borderRadius: '9999px',
            border: '1.5px solid rgba(37,99,235,0.2)',
            background: 'rgba(37,99,235,0.04)',
            transition: 'all 0.2s ease'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.04)'; }}
          >
            <ArrowLeft size={15} /> Volver al listado
          </Link>
        </div>

        {/* ─── Hero Header Card ─── */}
        <div className="animate-fade-in-up delay-100" style={{
          background: '#ffffff', border: '1.5px solid #e2e8f0',
          borderRadius: '1.25rem', padding: '1.75rem 2rem',
          marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(12,24,54,0.05)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.25rem' }}>
            {/* Left — title + address */}
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              {/* Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: isVenta ? 'rgba(29,78,216,0.1)' : 'rgba(5,150,105,0.1)',
                  color: isVenta ? '#1d4ed8' : '#059669',
                  fontSize: '0.7rem', fontWeight: 800,
                  padding: '4px 12px', borderRadius: '9999px',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  border: `1px solid ${isVenta ? 'rgba(29,78,216,0.2)' : 'rgba(5,150,105,0.2)'}`
                }}>
                  {property.operation_type}
                </span>
                <span style={{
                  background: 'rgba(12,24,54,0.07)', color: '#334155',
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '4px 12px', borderRadius: '9999px',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>
                  {property.property_type}
                </span>
                {property.is_featured && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#ffffff', fontSize: '0.68rem', fontWeight: 800,
                    padding: '4px 10px', borderRadius: '9999px', letterSpacing: '0.04em'
                  }}>
                    <Star size={11} fill="white" /> Destacado
                  </span>
                )}
              </div>

              <h1 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                fontWeight: 800, color: '#0c1836',
                letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '0.6rem'
              }}>
                {property.title}
              </h1>

              <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>
                <MapPin size={16} color="#2563eb" /> {property.address}
              </p>
            </div>

            {/* Right — price + actions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
              <div>
                <span style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0c1836', letterSpacing: '-0.04em', display: 'block', lineHeight: 1 }}>
                  {formattedPrice}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textAlign: 'right', display: 'block', marginTop: '0.2rem' }}>
                  Precio de {property.operation_type?.toLowerCase()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setLiked(l => !l)} title="Guardar" style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1.5px solid #e2e8f0', background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  color: liked ? '#ef4444' : '#64748b'
                }}>
                  <Heart size={16} fill={liked ? '#ef4444' : 'none'} />
                </button>
                <button onClick={() => navigator.share && navigator.share({ title: property.title, url: window.location.href })} title="Compartir" style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1.5px solid #e2e8f0', background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s ease', color: '#64748b'
                }}>
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Two-column layout ─── */}
        <div className="pd-layout-grid" style={{
          display: 'grid', gap: '1.5rem', alignItems: 'start'
        }}>

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

            {/* ─── Gallery ─── */}
            <div className="animate-fade-in-up delay-150" style={{
              background: '#ffffff', border: '1.5px solid #e2e8f0',
              borderRadius: '1.25rem', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(12,24,54,0.05)'
            }}>
              {/* Main image */}
              <div style={{ position: 'relative', width: '100%', height: '420px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                <img
                  src={getImageUrl(images[selectedImage]?.image_url)}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />

                {/* Gallery button */}
                <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setLightboxOpen(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    background: 'rgba(12,24,54,0.75)', backdropFilter: 'blur(8px)',
                    color: '#fff', border: 'none', borderRadius: '9999px',
                    padding: '6px 14px', fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}>
                    <ZoomIn size={13} /> Ver galería
                  </button>
                </div>

                {/* Counter */}
                <div style={{
                  position: 'absolute', bottom: 14, left: 14,
                  background: 'rgba(12,24,54,0.75)', backdropFilter: 'blur(8px)',
                  color: '#fff', borderRadius: '9999px',
                  padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '0.35rem'
                }}>
                  <Eye size={12} /> {selectedImage + 1} / {images.length}
                </div>

                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImg} disabled={selectedImage === 0} style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: selectedImage === 0 ? 0.4 : 1, transition: 'all 0.2s ease',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                    }}>
                      <ChevronLeft size={18} color="#0c1836" />
                    </button>
                    <button onClick={nextImg} disabled={selectedImage === images.length - 1} style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: selectedImage === images.length - 1 ? 0.4 : 1, transition: 'all 0.2s ease',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                    }}>
                      <ChevronRight size={18} color="#0c1836" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.6rem', padding: '0.85rem 1rem', overflowX: 'auto', background: '#fafbfc' }}>
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImage(idx)} style={{
                      width: 72, height: 54, borderRadius: '0.5rem',
                      overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
                      border: selectedImage === idx ? '2.5px solid #2563eb' : '2px solid transparent',
                      outline: 'none', padding: 0, background: 'none',
                      opacity: selectedImage === idx ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                      transform: selectedImage === idx ? 'scale(1.04)' : 'scale(1)'
                    }}>
                      <img src={getImageUrl(img.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Specs ─── */}
            <div className="animate-fade-in-up delay-200" style={{
              background: '#ffffff', border: '1.5px solid #e2e8f0',
              borderRadius: '1.25rem', padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(12,24,54,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 4, height: 20, borderRadius: 4, background: 'linear-gradient(180deg, #2563eb, #38bdf8)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0c1836' }}>Características Principales</h3>
              </div>
              <div className="pd-specs-grid" style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { icon: <Bed size={22} color="#2563eb" />, value: property.bedrooms, label: 'Dormitorios' },
                  { icon: <Bath size={22} color="#2563eb" />, value: property.bathrooms, label: 'Baños' },
                  { icon: <Maximize2 size={22} color="#2563eb" />, value: `${property.surface_area} m²`, label: 'Superficie' },
                ].map((spec, i) => (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '1.1rem 0.75rem', borderRadius: '0.9rem',
                    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>{spec.icon}</div>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0c1836', display: 'block', lineHeight: 1 }}>{spec.value}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>{spec.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Description ─── */}
            <div className="animate-fade-in-up delay-250" style={{
              background: '#ffffff', border: '1.5px solid #e2e8f0',
              borderRadius: '1.25rem', padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(12,24,54,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
                <div style={{ width: 4, height: 20, borderRadius: 4, background: 'linear-gradient(180deg, #2563eb, #38bdf8)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0c1836' }}>Descripción</h3>
              </div>
              <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '0.94rem', whiteSpace: 'pre-line' }}>
                {property.description || 'Sin descripción disponible para esta propiedad.'}
              </p>
            </div>

            {/* ─── Features ─── */}
            {featuresList.length > 0 && (
              <div className="animate-fade-in-up delay-300" style={{
                background: '#ffffff', border: '1.5px solid #e2e8f0',
                borderRadius: '1.25rem', padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(12,24,54,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 4, height: 20, borderRadius: 4, background: 'linear-gradient(180deg, #2563eb, #38bdf8)' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0c1836' }}>Comodidades y Detalles</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
                  {featuresList.map((feat, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.6rem 0.85rem', borderRadius: '0.6rem',
                      background: 'rgba(37,99,235,0.04)',
                      border: '1px solid rgba(37,99,235,0.1)',
                      fontSize: '0.85rem', color: '#334155', fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.09)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.04)'; }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(37,99,235,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Check size={12} color="#2563eb" strokeWidth={3} />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Trust bar ─── */}
            <div className="animate-fade-in-up delay-400" style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem'
            }}>
              {[
                { icon: <ShieldCheck size={18} color="#2563eb" />, title: 'Matriculados CPI', desc: 'Operación respaldada' },
                { icon: <Clock size={18} color="#2563eb" />, title: 'Respuesta en 24 hs', desc: 'Contacto ágil garantizado' },
                { icon: <Star size={18} color="#f59e0b" fill="#f59e0b" />, title: '5 estrellas', desc: 'Valorado por clientes' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.9rem 1.1rem',
                  background: '#ffffff', borderRadius: '0.9rem',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(12,24,54,0.04)'
                }}>
                  <div style={{ flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0c1836' }}>{item.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="animate-fade-in-up delay-200">
            <div className="pd-sidebar-sticky">
              {/* Contact card */}
              <div style={{
                background: '#ffffff', border: '1.5px solid #e2e8f0',
                borderRadius: '1.25rem', overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(12,24,54,0.08)'
              }}>
                {/* Card header */}
                <div style={{
                  background: 'linear-gradient(135deg, #0c1836 0%, #1d4ed8 100%)',
                  padding: '1.25rem 1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Sparkles size={16} color="#60a5fa" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Consultar Propiedad
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    ¿Te interesa esta propiedad?
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '0.3rem', lineHeight: 1.5 }}>
                    Completá el formulario y un asesor te contactará en menos de 24 hs.
                  </p>
                </div>

                {/* Form body */}
                <div style={{ padding: '1.5rem' }}>
                  {inquirySubmitted && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      background: '#dcfce7', color: '#15803d',
                      padding: '0.85rem 1rem', borderRadius: '0.75rem',
                      fontSize: '0.85rem', fontWeight: 700,
                      marginBottom: '1rem', border: '1px solid #86efac'
                    }}>
                      <Check size={16} /> Consulta enviada. Te responderemos pronto.
                    </div>
                  )}

                  <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { label: 'Tu Nombre', key: 'first_name', type: 'text', req: true, ph: 'Ej: Juan Pérez' },
                      { label: 'Teléfono / WhatsApp', key: 'phone', type: 'text', req: true, ph: '+54 351 000 0000' },
                      { label: 'Email (opcional)', key: 'email', type: 'email', req: false, ph: 'tu@correo.com' },
                    ].map(({ label, key, type, req, ph }) => (
                      <div key={key}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                          {label}
                        </label>
                        <input
                          type={type} required={req} placeholder={ph}
                          value={inquiryForm[key]}
                          onChange={e => setInquiryForm({ ...inquiryForm, [key]: e.target.value })}
                          style={{
                            width: '100%', padding: '0.6rem 0.9rem',
                            borderRadius: '0.6rem', border: '1.5px solid #e2e8f0',
                            fontSize: '0.85rem', background: '#f8fafc',
                            fontFamily: 'inherit', outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                          }}
                        />
                      </div>
                    ))}

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                        Mensaje
                      </label>
                      <textarea
                        rows="3"
                        value={inquiryForm.message}
                        onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        style={{
                          width: '100%', padding: '0.6rem 0.9rem',
                          borderRadius: '0.6rem', border: '1.5px solid #e2e8f0',
                          fontSize: '0.82rem', resize: 'vertical',
                          background: '#f8fafc', fontFamily: 'inherit', outline: 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s', lineHeight: 1.5
                        }}
                      />
                    </div>

                    <button type="submit" disabled={inquiryLoading} style={{
                      width: '100%', padding: '0.75rem',
                      background: inquiryLoading ? '#94a3b8' : 'linear-gradient(135deg, #0c1836 0%, #1d4ed8 100%)',
                      color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                      border: 'none', borderRadius: '9999px',
                      cursor: inquiryLoading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                      transition: 'all 0.25s ease',
                      boxShadow: inquiryLoading ? 'none' : '0 6px 20px rgba(29,78,216,0.3)',
                      fontFamily: 'inherit'
                    }}>
                      <Send size={15} />
                      {inquiryLoading ? 'Enviando…' : 'Enviar Consulta'}
                    </button>
                  </form>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>o contactanos directo</span>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  </div>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/5493518555588?text=Hola,%20quisiera%20consultar%20por%20la%20propiedad%20"${encodeURIComponent(property.title)}"%20(ID:%20${property.id})`}
                    target="_blank" rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                      padding: '0.75rem', borderRadius: '9999px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <Phone size={17} /> Consultar por WhatsApp
                  </a>
                </div>
              </div>

              {/* Piso Alto trust */}
              <div style={{
                marginTop: '1rem',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(12,24,54,0.04))',
                border: '1.5px solid rgba(37,99,235,0.15)',
                borderRadius: '1rem', padding: '1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: '0.85rem'
              }}>
                <img src="/pisoalto-symbol.png" alt="Piso Alto" style={{ height: 36, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0c1836' }}>Piso Alto Inmobiliaria</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>Matriculados CPI · Córdoba, Argentina</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Lightbox ─── */}
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(4,8,19,0.96)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeInSlow 0.25s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={getImageUrl(images[selectedImage]?.image_url)}
              alt="" style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '0.75rem' }}
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImg} disabled={selectedImage === 0} style={{
                  position: 'absolute', left: -52, top: '50%', transform: 'translateY(-50%)',
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ChevronLeft size={22} />
                </button>
                <button onClick={nextImg} disabled={selectedImage === images.length - 1} style={{
                  position: 'absolute', right: -52, top: '50%', transform: 'translateY(-50%)',
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
          <button onClick={() => setLightboxOpen(false)} style={{
            position: 'fixed', top: 20, right: 20,
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>
      )}

      {/* ─── Internal styles for layout ─── */}
      <style>{`
        .pd-layout-grid {
          grid-template-columns: minmax(0, 1fr) 360px;
        }
        .pd-specs-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .pd-sidebar-sticky {
          position: sticky;
          top: 90px;
        }
        @media (max-width: 960px) {
          .pd-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .pd-sidebar-sticky {
            position: relative !important;
            top: auto !important;
          }
        }
        @media (max-width: 480px) {
          .pd-specs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetail;
