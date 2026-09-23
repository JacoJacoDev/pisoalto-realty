import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Search
} from 'lucide-react';
import client from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { getImageUrl } from '../api/client';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero search bar state
  const [heroSearch, setHeroSearch] = useState({ query: '', operation_type: 'All', property_type: 'All' });

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

  // Hero search handler
  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroSearch.operation_type !== 'All') params.set('operation_type', heroSearch.operation_type);
    if (heroSearch.property_type !== 'All') params.set('property_type', heroSearch.property_type);
    if (heroSearch.query.trim()) params.set('search', heroSearch.query.trim());
    navigate(`/propiedades?${params.toString()}`);
  };

  // Static property card data for hero background decoration
  const heroBgCards = [
    {
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop',
      title: 'Casa Quinta · Las Varillas',
      price: 'U$S 59.000',
      type: 'Venta'
    },
    {
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop',
      title: 'Departamento · Nueva Córdoba',
      price: '$ 50.000 / mes',
      type: 'Alquiler'
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
      title: 'Casa Serrana · Río Ceballos',
      price: 'U$S 84.500',
      type: 'Venta'
    },
    {
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      title: 'Oficina Comercial · Las Varillas',
      price: '$ 730.000 / mes',
      type: 'Alquiler'
    }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — WHITE, NO GRADIENTS, TIGHT SPACING, FLOATING BG CARDS   */}
      {/* ========================================================================= */}
      <section style={{
        position: 'relative',
        minHeight: 'auto',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '1.75rem 1.5rem 2.5rem'
      }}>

        {/* ── Blurred floating property cards (background decoration) ── */}
        {heroBgCards.map((card, i) => {
          const positions = [
            { top: '6%',  left: '2%',   rotate: '-8deg',  scale: 0.82 },
            { top: '54%', left: '1%',   rotate: '6deg',   scale: 0.78 },
            { top: '5%',  right: '2%',  rotate: '9deg',   scale: 0.80 },
            { top: '52%', right: '1%',  rotate: '-6deg',  scale: 0.76 },
          ];
          const pos = positions[i];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                right: pos.right,
                width: '210px',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                transform: `rotate(${pos.rotate}) scale(${pos.scale})`,
                filter: 'blur(2.2px)',
                opacity: 0.65,
                zIndex: 1,
                pointerEvents: 'none',
                transition: 'filter 0.3s ease'
              }}
            >
              <div style={{ position: 'relative', height: '125px', overflow: 'hidden' }}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  fontSize: '0.6rem', fontWeight: 700,
                  padding: '2px 8px', borderRadius: '9999px',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>{card.type}</span>
              </div>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '0.6rem 0.75rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1d4ed8' }}>
                  {card.price}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Main centered content ── */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '760px', width: '100%' }}>

          {/* Eyebrow pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '0.35rem 1rem', borderRadius: '9999px',
            marginBottom: '1rem'
          }}>
            <Sparkles size={13} color="#2563eb" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Piso Alto Realty · Córdoba &amp; Interior
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.8vw, 3.4rem)',
            fontWeight: 800,
            color: '#0c1836',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '0.85rem'
          }}>
            Encontrá tu propiedad ideal{' '}
            <span style={{ color: '#1d4ed8' }}>en Córdoba</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
            maxWidth: '580px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Compra, venta y alquiler con máxima transparencia, agilidad y asesoramiento profesional.
            Más de 12 años conectando personas con su próximo hogar.
          </p>

          {/* ── Search bar ── */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.07)',
              flexWrap: 'wrap',
              gap: '1px',
              marginBottom: '1.5rem'
            }}
          >
            {/* Text search */}
            <div style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', padding: '0.85rem 1.1rem', gap: '0.6rem', borderRight: '1px solid #e2e8f0' }}>
              <Search size={17} color="#64748b" />
              <input
                type="text"
                placeholder="Barrio, ciudad o dirección..."
                value={heroSearch.query}
                onChange={e => setHeroSearch(s => ({ ...s, query: e.target.value }))}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  color: '#0f172a', fontSize: '0.9rem', outline: 'none'
                }}
              />
            </div>

            {/* Operation type */}
            <select
              value={heroSearch.operation_type}
              onChange={e => setHeroSearch(s => ({ ...s, operation_type: e.target.value }))}
              style={{
                flex: '0 1 140px',
                background: '#ffffff',
                border: 'none',
                borderRight: '1px solid #e2e8f0',
                color: heroSearch.operation_type === 'All' ? '#64748b' : '#0f172a',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '0 1rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="All">Operación</option>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
            </select>

            {/* Property type */}
            <select
              value={heroSearch.property_type}
              onChange={e => setHeroSearch(s => ({ ...s, property_type: e.target.value }))}
              style={{
                flex: '0 1 150px',
                background: '#ffffff',
                border: 'none',
                borderRight: '1px solid #e2e8f0',
                color: heroSearch.property_type === 'All' ? '#64748b' : '#0f172a',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '0 1rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="All">Tipo de propiedad</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Cochera">Cochera</option>
              <option value="Oficina">Oficina</option>
            </select>

            {/* Search button */}
            <button
              type="submit"
              style={{
                flex: '0 0 auto',
                backgroundColor: '#1d4ed8',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '0 1.75rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s ease',
                whiteSpace: 'nowrap',
                minHeight: '52px'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            >
              <Search size={16} /> Buscar
            </button>
          </form>

          {/* Quick-filter tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', justifyContent: 'center', marginBottom: '1.75rem' }}>
            {[
              { label: 'Casas en Venta', op: 'Venta', pt: 'Casa' },
              { label: 'Departamentos', op: 'All', pt: 'Departamento' },
              { label: 'Alquileres', op: 'Alquiler', pt: 'All' },
              { label: 'Córdoba Capital', op: 'All', pt: 'All', loc: 'Córdoba Capital' },
              { label: 'Las Varillas', op: 'All', pt: 'All', loc: 'Las Varillas' },
            ].map((tag, i) => (
              <button
                key={i}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (tag.op !== 'All') params.set('operation_type', tag.op);
                  if (tag.pt !== 'All') params.set('property_type', tag.pt);
                  if (tag.loc) params.set('location', tag.loc);
                  navigate(`/propiedades?${params.toString()}`);
                }}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.9rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Stats strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            {[
              { val: '+180', label: 'Propiedades disponibles' },
              { val: '+300', label: 'Operaciones concretadas' },
              { val: '+12', label: 'Años de trayectoria' },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0' }} />}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0c1836', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {stat.val}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. PROPIEDADES DESTACADAS (BLACK/DARK BACKGROUND)                          */}
      {/* ========================================================================= */}
      <section id="destacadas" className="section-dark" style={{ paddingTop: 0 }}>
        {/* Full-width black bar for title/subtitle */}
        <div style={{
          width: '100%',
          backgroundColor: '#000000',
          padding: '0.45rem 1rem',
          textAlign: 'center',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <p style={{
            fontSize: '0.72rem',
            color: '#60a5fa',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: 0,
            lineHeight: 1.2
          }}>
            Selección curada de oportunidades únicas
          </p>
          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0.15rem 0 0 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Propiedades Destacadas
          </h2>
        </div>

        <div className="container">

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
              Cargando propiedades destacadas...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem'
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
      <section className="section-dark" style={{ paddingTop: 0 }}>
        {/* Full-width black bar for title/subtitle */}
        <div style={{
          width: '100%',
          backgroundColor: '#000000',
          padding: '0.45rem 1rem',
          textAlign: 'center',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <p style={{
            fontSize: '0.72rem',
            color: '#60a5fa',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: 0,
            lineHeight: 1.2
          }}>
            Soluciones inmobiliarias a tu medida
          </p>
          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0.15rem 0 0 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Nuestros Servicios
          </h2>
        </div>

        <div className="container">

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
      <section id="contacto" className="section-dark" style={{ paddingTop: 0 }}>
        {/* Full-width black bar for title/subtitle */}
        <div style={{
          width: '100%',
          backgroundColor: '#000000',
          padding: '0.45rem 1rem',
          textAlign: 'center',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <p style={{
            fontSize: '0.72rem',
            color: '#60a5fa',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: 0,
            lineHeight: 1.2
          }}>
            Cerca de vos, cuando lo necesites
          </p>
          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0.15rem 0 0 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Ubicación y Contacto
          </h2>
        </div>

        <div className="container">

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
