import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Building,
  Users,
  MapPin,
  Calculator,
  Wrench,
  Plus,
  Minus,
  CheckCircle,
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import client from '../api/client';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Valuation Form State
  const [valuationForm, setValuationForm] = useState({
    full_name: '',
    phone: '',
    property_type: 'Casa',
    city: ''
  });
  const [valuationSuccess, setValuationSuccess] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    service_interest: 'Compra',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Accordion State for "Experiencia Pisoalto"
  const [openAccordion, setOpenAccordion] = useState(0); // Index 0 open by default (Propósito)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await client.get('/properties?is_published=true');
        setFeaturedProperties(res.data);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleValuationSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/inquiries/valuation', valuationForm);
      setValuationSuccess(true);
      setValuationForm({ full_name: '', phone: '', property_type: 'Casa', city: '' });
      setTimeout(() => setValuationSuccess(false), 5000);
    } catch (err) {
      alert('Error enviando la solicitud. Intente nuevamente.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/inquiries/contact', contactForm);
      setContactSuccess(true);
      setContactForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        service_interest: 'Compra',
        message: ''
      });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      alert('Error enviando el mensaje. Intente nuevamente.');
    }
  };

  const accordionItems = [
    {
      title: 'Propósito',
      content: 'Existimos porque somos una Empresa que cree que nuestra relación con el cliente comienza cuando la operación se realiza y no termina jamás; no tiene fin, porque consideramos que las relaciones humanas deben ser principalmente HUMANAS y para siempre.'
    },
    {
      title: 'Misión',
      content: 'Brindar asesoramiento integral y personalizado en negocios inmobiliarios, garantizando seguridad, rapidez y máxima transparencia en cada operación.'
    },
    {
      title: 'Visión',
      content: 'Ser la empresa inmobiliaria referente de la región por la excelencia operacional, el profesionalismo y la constante innovación al servicio del cliente.'
    },
    {
      title: 'Valores',
      content: 'Honestidad, transparencia, compromiso humano, profesionalismo continuo y orientación total hacia las necesidades de nuestros clientes.'
    }
  ];

  const servicesList = [
    {
      icon: <Building size={26} color="#60a5fa" />,
      title: 'Administración de Propiedades',
      desc: 'Gestionamos tu propiedad de forma integral, maximizando tu renta y garantizando tu tranquilidad.'
    },
    {
      icon: <Users size={26} color="#60a5fa" />,
      title: 'Asesoramiento Personalizado',
      desc: 'Te acompañamos con orientación clara y estratégica en cada decisión de compra, venta o alquiler.'
    },
    {
      icon: <MapPin size={26} color="#60a5fa" />,
      title: 'Consorcios y PH',
      desc: 'Administración ordenada y transparente de consorcios y conjuntos inmobiliarios de cualquier escala.'
    },
    {
      icon: <Calculator size={26} color="#60a5fa" />,
      title: 'Valuación Profesional',
      desc: 'Determinamos el valor real de mercado con informes comparativos objetivos y precisos.'
    },
    {
      icon: <Wrench size={26} color="#60a5fa" />,
      title: 'Mantenimiento Integral',
      desc: 'Supervisión y conservación preventiva para preservar y valorizar tu patrimonio en el tiempo.'
    }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (WHITE BACKGROUND)                                        */}
      {/* ========================================================================= */}
      <section className="section-light" style={{ paddingTop: '1.25rem', paddingBottom: '2rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.75rem',
            alignItems: 'center'
          }}>
            {/* Left Content Column */}
            <div>
              {/* Eyebrow Pill Tag */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                marginBottom: '1rem'
              }}>
                <Sparkles size={14} color="#2563eb" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Piso Alto Realty · Córdoba & Interior
                </span>
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 3.1rem)',
                fontWeight: 800,
                color: '#0c1836',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: '1.1rem'
              }}>
                Encontrá tu oportunidad inmobiliaria con <span style={{ color: '#2563eb' }}>confianza</span> y respaldo
              </h1>

              {/* Subtitle / Paragraph */}
              <p style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: 1.65,
                marginBottom: '1.75rem',
                maxWidth: '540px'
              }}>
                Conectamos personas con propiedades excepcionales. Te acompañamos en cada etapa de compra, venta o alquiler con máxima transparencia, agilidad y un servicio genuinamente personalizado.
              </p>

              {/* CTA Group */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
                marginBottom: '2rem'
              }}>
                <Link to="/propiedades" className="btn-pill-blue">
                  Explorar Propiedades <ChevronRight size={17} />
                </Link>
                <a href="#tasacion" className="btn-pill-outline">
                  Tasá tu propiedad
                </a>
              </div>

              {/* Metrics / Key Stats Strip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #e2e8f0',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0c1836', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    +180
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>
                    Propiedades disponibles
                  </div>
                </div>

                <div style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0' }} />

                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0c1836', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    +300
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>
                    Operaciones concretadas
                  </div>
                </div>

                <div style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0' }} />

                <div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0c1836', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    +12
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>
                    Años de trayectoria
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div style={{ position: 'relative' }}>
              {/* Main Architectural Hero Card */}
              <div style={{
                position: 'relative',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 20px 45px -12px rgba(12, 24, 54, 0.22)',
                border: '1px solid rgba(0,0,0,0.06)',
                height: '430px'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
                  alt="Propiedad destacada Piso Alto"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Subtle gradient vignette */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(7, 14, 32, 0.15) 0%, rgba(7, 14, 32, 0.65) 100%)'
                }} />

                {/* Floating Top Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  backgroundColor: 'rgba(12, 24, 54, 0.82)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  <ShieldCheck size={14} color="#60a5fa" />
                  <span>Tasación oficial en 24h</span>
                </div>

                {/* Bottom Overlay Label */}
                <div style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.25rem',
                  right: '1.25rem',
                  color: '#ffffff'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Oportunidad de inversión
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.15rem' }}>
                    Propiedades de categoría en Córdoba
                  </div>
                </div>
              </div>

              {/* Floating Property Spotlight Card */}
              <div style={{
                position: 'absolute',
                bottom: '-1.25rem',
                right: '-0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                border: '1.5px solid #0c1836',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                maxWidth: '280px',
                zIndex: 2
              }}>
                <img
                  src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=200"
                  alt="Spotlight"
                  style={{ width: '48px', height: '48px', borderRadius: '0.6rem', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Río Ceballos
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0c1836', lineHeight: 1.2 }}>
                    Casa en Venta
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    U$S 135.000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROPIEDADES DESTACADAS (BLACK/DARK BACKGROUND)                          */}
      {/* ========================================================================= */}
      <section id="destacadas" className="section-dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="section-subtitle-light">Selección curada de oportunidades únicas</p>
            <h2 className="section-title-light">Propiedades Destacadas</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
              Cargando propiedades destacadas...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.75rem'
            }}>
              {featuredProperties.slice(0, 3).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.25rem' }}>
            <Link to="/propiedades" className="btn-pill-blue" style={{ padding: '0.7rem 2rem' }}>
              Ver todas las propiedades <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ¿QUERÉS VENDER TU PROPIEDAD? (WHITE BACKGROUND)                        */}
      {/* ========================================================================= */}
      <section id="tasacion" className="section-light">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.75rem',
            alignItems: 'center'
          }}>
            {/* Left Image Showcase */}
            <div style={{ height: '420px' }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000"
                  alt="Edificio Piso Alto Realty"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right Valuation Form */}
            <div>
              <p className="section-subtitle" style={{ textAlign: 'left' }}>
                Solicitá una tasación profesional y sin compromiso
              </p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>
                ¿Querés vender tu propiedad?
              </h2>
              <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1.35rem' }}>
                Realizamos tasaciones objetivas basadas en operaciones reales de mercado, estado de conservación y demanda actual. Maximizá el valor de tu inmueble con el asesoramiento de profesionales matriculados.
              </p>

              {valuationSuccess && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.6rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={18} /> ¡Solicitud enviada con éxito! Nos comunicaremos en breve.
                </div>
              )}

              <form onSubmit={handleValuationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={valuationForm.full_name}
                      onChange={(e) => setValuationForm({ ...valuationForm, full_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        backgroundColor: '#f8fafc'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                      Teléfono o WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. +54 9 351 123 4567"
                      value={valuationForm.phone}
                      onChange={(e) => setValuationForm({ ...valuationForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        backgroundColor: '#f8fafc'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                      Tipo de Propiedad
                    </label>
                    <select
                      value={valuationForm.property_type}
                      onChange={(e) => setValuationForm({ ...valuationForm, property_type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      <option value="Casa">Casa</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Cochera">Cochera</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Local">Local Comercial</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                      Ciudad / Barrio
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Córdoba / Nueva Córdoba"
                      value={valuationForm.city}
                      onChange={(e) => setValuationForm({ ...valuationForm, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        backgroundColor: '#f8fafc'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.35rem' }}>
                  <button type="submit" className="btn-pill-blue" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}>
                    <HomeIcon size={18} /> Quiero mi tasación profesional
                  </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '0.25rem' }}>
                  Un asesor matriculado se comunicará dentro de las próximas 24 horas.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. NUESTROS SERVICIOS (BLACK/DARK BACKGROUND)                              */}
      {/* ========================================================================= */}
      <section className="section-dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="section-subtitle-light">Soluciones inmobiliarias a tu medida</p>
            <h2 className="section-title-light">Nuestros Servicios</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem'
          }}>
            {servicesList.map((service, idx) => (
              <div key={idx} className="card-dark-glass" style={{
                padding: '1.5rem 1.25rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '0.85rem',
                  backgroundColor: 'rgba(37, 99, 235, 0.18)',
                  border: '1px solid rgba(37, 99, 235, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.1rem'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem', lineHeight: '1.3' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: '1.55' }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPERIENCIA PISOALTO (WHITE BACKGROUND)                                 */}
      {/* ========================================================================= */}
      <section id="nosotros" className="section-light">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.75rem',
            alignItems: 'center'
          }}>
            {/* Left Image */}
            <div style={{ height: '400px' }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000"
                  alt="Experiencia Piso Alto"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(12, 24, 54, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '0.85rem',
                  color: '#ffffff'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa' }}>
                    Compromiso Humano
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                    Relaciones para siempre, basadas en honestidad y cercanía.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Accordion */}
            <div>
              <p className="section-subtitle" style={{ textAlign: 'left' }}>
                Acompañamiento claro, profesional y cercano
              </p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0c1836', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                Experiencia Pisoalto
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {accordionItems.map((item, idx) => {
                  const isOpen = openAccordion === idx;
                  return (
                    <div key={idx} style={{
                      border: isOpen ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                      transition: 'all 0.2s ease'
                    }}>
                      <button
                        onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1.15rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: isOpen ? '#2563eb' : '#0c1836',
                          textAlign: 'left'
                        }}
                      >
                        <span>{item.title}</span>
                        {isOpen ? <Minus size={18} color="#2563eb" /> : <Plus size={18} color="#64748b" />}
                      </button>
                      {isOpen && (
                        <div style={{
                          padding: '0 1.15rem 1rem 1.15rem',
                          fontSize: '0.875rem',
                          color: '#475569',
                          lineHeight: '1.6',
                          borderTop: '1px solid #e2e8f0'
                        }}>
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. UBICACIÓN Y CONTACTO (BLACK/DARK BACKGROUND)                           */}
      {/* ========================================================================= */}
      <section id="contacto" className="section-dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="section-subtitle-light">Cerca de vos, cuando lo necesites</p>
            <h2 className="section-title-light">Ubicación y Contacto</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Left Contact Form Card (Dark Glass) */}
            <div className="card-dark-glass" style={{ padding: '1.75rem' }}>
              {contactSuccess && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.6rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={18} /> Mensaje enviado con éxito. Te responderemos a la brevedad.
                </div>
              )}

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={contactForm.first_name}
                      onChange={(e) => setContactForm({ ...contactForm, first_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                      Apellido
                    </label>
                    <input
                      type="text"
                      placeholder="Tu apellido"
                      value={contactForm.last_name}
                      onChange={(e) => setContactForm({ ...contactForm, last_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                      Teléfono o WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+54 9 351 ..."
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                    Servicio de interés
                  </label>
                  <select
                    value={contactForm.service_interest}
                    onChange={(e) => setContactForm({ ...contactForm, service_interest: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #1e293b',
                      backgroundColor: '#070e20',
                      color: '#ffffff',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="Compra">Compra de propiedad</option>
                    <option value="Venta">Venta de propiedad</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Tasacion">Tasación profesional</option>
                    <option value="Administracion">Administración de propiedades</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                    Mensaje o consulta
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Contanos en qué podemos ayudarte..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #1e293b',
                      backgroundColor: '#070e20',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>

                <button type="submit" className="btn-pill-blue" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}>
                  <Send size={16} /> Enviar mensaje
                </button>
              </form>
            </div>

            {/* Right Office Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card-dark-glass" style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <MapPin size={16} color="#60a5fa" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                    Oficina Córdoba Capital
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
                  Juan A. Sarachaga 953, Alta Córdoba, Córdoba
                </p>
                <div style={{ height: '130px', borderRadius: '0.65rem', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600"
                    alt="Mapa Córdoba"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              <div className="card-dark-glass" style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <MapPin size={16} color="#60a5fa" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                    Oficina Las Varillas
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
                  Av. Centenario 250, Las Varillas, Córdoba
                </p>
                <div style={{ height: '130px', borderRadius: '0.65rem', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600"
                    alt="Mapa Las Varillas"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
