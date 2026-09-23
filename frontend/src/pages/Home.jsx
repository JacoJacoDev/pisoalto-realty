import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Building,
  Users,
  MapPin,
  Calculator,
  Wrench,
  Plus,
  Minus,
  CheckCircle,
  Home as HomeIcon
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
      icon: <Building size={32} color="#2563eb" />,
      title: 'Administración de Propiedades',
      desc: 'Gestionamos tu propiedad de forma integral y cuidando tu inversión y tranquilidad.'
    },
    {
      icon: <Users size={32} color="#2563eb" />,
      title: 'Asesoramiento General Personalizado',
      desc: 'Te acompañamos con asesoramiento claro y a medida en cada decisión inmobiliaria.'
    },
    {
      icon: <MapPin size={32} color="#2563eb" />,
      title: 'Administración de Consorcios, PH y Conjuntos Inmobiliarios',
      desc: 'Administramos consorcios y conjuntos inmobiliarios con orden, transparencia y gestión eficiente.'
    },
    {
      icon: <Calculator size={32} color="#2563eb" />,
      title: 'Valuación de Propiedades',
      desc: 'Determinamos el valor real de tu propiedad con análisis preciso del mercado.'
    },
    {
      icon: <Wrench size={32} color="#2563eb" />,
      title: 'Mantenimiento de Propiedades',
      desc: 'Conservamos y supervisamos el mantenimiento para conservar y valorizar tu propiedad.'
    }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <section style={{ padding: '3.5rem 0 4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              <h1 style={{
                fontSize: '2.75rem',
                fontWeight: 800,
                color: '#0c1836',
                lineHeight: 1.15,
                marginBottom: '1.25rem'
              }}>
                Encontrá tu <span style={{ color: '#2563eb' }}>oportunidad</span> ideal
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}>
                En Piso Alto Realty conectamos personas con oportunidades inmobiliarias. Te acompañamos en cada paso para comprar, vender o alquilar con confianza, transparencia y un servicio personalizado.
              </p>

              {/* Dark Pill Stats Bar */}
              <div style={{
                backgroundColor: '#0e1b38',
                borderRadius: '9999px',
                padding: '0.85rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff',
                marginBottom: '2.5rem',
                boxShadow: '0 10px 25px rgba(14, 27, 56, 0.15)',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>+180</span>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.2 }}>Propiedades<br/>disponibles</span>
                </div>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#334155' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>+300</span>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.2 }}>Clientes<br/>satisfechos</span>
                </div>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#334155' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>+12</span>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.2 }}>Años de experiencia<br/>en el mercado</span>
                </div>
              </div>

              {/* Two Hero Cards Side by Side */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem'
              }}>
                {/* Hero Card 1 */}
                <div style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '150px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"
                    alt="Casa en Venta"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 14, 32, 0.85), transparent)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    color: '#ffffff'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#93c5fd', fontWeight: 600 }}>
                      Pasaje Esperanza 79 - Río Ceballos
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      Casa en Venta
                    </span>
                  </div>
                </div>

                {/* Hero Card 2 */}
                <div style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '150px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600"
                    alt="Cochera en Venta"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 14, 32, 0.85), transparent)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    color: '#ffffff'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#93c5fd', fontWeight: 600 }}>
                      Humberto 1º 28 - Córdoba Capital
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      Cochera en Venta
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arch Image */}
            <div style={{ height: '480px', display: 'flex', justifyContent: 'center' }}>
              <div className="arch-container" style={{ maxWidth: '420px' }}>
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
                  alt="Piso Alto Realty Architecture"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROPIEDADES DESTACADAS */}
      <section id="destacadas" style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-subtitle">Selección curada de oportunidades únicas</p>
            <h2 className="section-title">Propiedades Destacadas</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Cargando propiedades destacadas...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {featuredProperties.slice(0, 3).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/propiedades" className="btn-pill-navy" style={{ padding: '0.75rem 2.25rem' }}>
              Ver todas las propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* 3. QUERES VENDER TU PROPIEDAD? */}
      <section style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Architectural Building Image */}
            <div style={{ height: '440px' }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000"
                  alt="Edificio Piso Alto Realty"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right Form */}
            <div>
              <p className="section-subtitle" style={{ textAlign: 'left' }}>
                Solicitá una tasación profesional y sin compromiso
              </p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0c1836', marginBottom: '1rem' }}>
                Queres vender tu propiedad?
              </h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                En Piso Alto Realty realizamos tasaciones profesionales basadas en análisis de mercado real, ubicación, estado de conservación y demanda actual. Nuestro equipo evalúa cada propiedad con criterios objetivos para determinar un valor competitivo que maximice tus oportunidades de venta.
              </p>

              {valuationSuccess && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={20} /> ¡Solicitud enviada con éxito! Nos comunicaremos en breve.
                </div>
              )}

              <form onSubmit={handleValuationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={valuationForm.full_name}
                      onChange={(e) => setValuationForm({ ...valuationForm, full_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Teléfono o WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={valuationForm.phone}
                      onChange={(e) => setValuationForm({ ...valuationForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Tipo de Propiedad
                    </label>
                    <select
                      value={valuationForm.property_type}
                      onChange={(e) => setValuationForm({ ...valuationForm, property_type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="Casa">Casa</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Cochera">Cochera</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Local">Local</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Ciudad
                    </label>
                    <input
                      type="text"
                      required
                      value={valuationForm.city}
                      onChange={(e) => setValuationForm({ ...valuationForm, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className="btn-pill-navy" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}>
                    <HomeIcon size={18} /> Quiero mi tasación
                  </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
                  Un asesor de Piso Alto Realty se comunicará contigo en menos de 24 horas.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NUESTROS SERVICIOS */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-subtitle">Soluciones inmobiliarias a tu medida</p>
            <h2 className="section-title">Nuestros Servicios</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.5rem'
          }}>
            {servicesList.map((service, idx) => (
              <div key={idx} className="card-rounded" style={{
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '1rem',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EXPERIENCIA PISOALTO */}
      <section id="nosotros" style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Image */}
            <div style={{ height: '420px' }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000"
                  alt="Experiencia Piso Alto"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right Accordion */}
            <div>
              <p className="section-subtitle" style={{ textAlign: 'left' }}>
                Acompañamiento claro, profesional y cercano
              </p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0c1836', marginBottom: '1.5rem' }}>
                Experiencia Pisoalto
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {accordionItems.map((item, idx) => (
                  <div key={idx} style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff'
                  }}>
                    <button
                      onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#0c1836',
                        textAlign: 'left'
                      }}
                    >
                      <span>{item.title}</span>
                      {openAccordion === idx ? <Minus size={20} color="#2563eb" /> : <Plus size={20} color="#64748b" />}
                    </button>
                    {openAccordion === idx && (
                      <div style={{
                        padding: '0 1.25rem 1.25rem 1.25rem',
                        fontSize: '0.9rem',
                        color: '#475569',
                        lineHeight: '1.6',
                        borderTop: '1px solid #f1f5f9'
                      }}>
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. UBICACION Y CONTACTO */}
      <section id="contacto" style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-subtitle">Cerca de vos, cuando lo necesites</p>
            <h2 className="section-title">Ubicacion y Contacto</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem'
          }}>
            {/* Left Contact Form */}
            <div className="card-rounded" style={{ padding: '2rem' }}>
              {contactSuccess && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={20} /> Mensaje enviado con éxito. Te responderemos a la brevedad.
                </div>
              )}

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.first_name}
                      onChange={(e) => setContactForm({ ...contactForm, first_name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Apellido (opcional)
                    </label>
                    <input
                      type="text"
                      value={contactForm.last_name}
                      onChange={(e) => setContactForm({ ...contactForm, last_name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Email (opcional)
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Teléfono o WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Servicio de interés
                  </label>
                  <select
                    value={contactForm.service_interest}
                    onChange={(e) => setContactForm({ ...contactForm, service_interest: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="Compra">Compra de propiedad</option>
                    <option value="Venta">Venta de propiedad</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Tasacion">Tasación profesional</option>
                    <option value="Administracion">Administración de propiedades</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Contanos en qué podemos ayudarte...
                  </label>
                  <textarea
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn-pill-navy" style={{ width: '100%', padding: '0.75rem' }}>
                  <Send size={18} /> Enviar mensaje
                </button>
              </form>
            </div>

            {/* Right Office Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card-rounded" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.5rem' }}>
                  Oficina de Córdoba Capital
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>
                  Juan A. Sarachaga 953, Alta Córdoba, Córdoba
                </p>
                <div style={{ height: '140px', borderRadius: '0.75rem', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600"
                    alt="Mapa Córdoba"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              <div className="card-rounded" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.5rem' }}>
                  Oficina de Las Varillas
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>
                  Av. Centenario 250, Las Varillas, Córdoba
                </p>
                <div style={{ height: '140px', borderRadius: '0.75rem', overflow: 'hidden' }}>
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
