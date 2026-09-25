import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Building,
  Users,
  MapPin,
  Calculator,
  Wrench,
  CheckCircle,
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Search,
  Star,
  Phone,
  Clock,
  ExternalLink,
  TrendingUp,
  Award,
  Key,
  Houses
} from 'lucide-react';
import client, { getImageUrl } from '../api/client';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredFilter, setFeaturedFilter] = useState('All'); // 'All', 'Venta', 'Alquiler'

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [touchStart, setTouchStart] = useState(null);

  // Responsive items per page for carousel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hero search bar state
  const [heroSearch, setHeroSearch] = useState({
    query: '',
    operation_type: 'All', // 'All', 'Venta', 'Alquiler'
    property_type: 'All'
  });

  // Active tab in Hero search
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Venta', 'Alquiler'

  // Valuation Form State
  const [valuationForm, setValuationForm] = useState({
    full_name: '',
    phone: '',
    property_type: 'Casa',
    city: ''
  });
  const [valuationLoading, setValuationLoading] = useState(false);
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
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Fetch featured properties
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
    setValuationLoading(true);
    try {
      await client.post('/inquiries/valuation', valuationForm);
      setValuationSuccess(true);
      setValuationForm({ full_name: '', phone: '', property_type: 'Casa', city: '' });
      setTimeout(() => setValuationSuccess(false), 6000);
    } catch {
      alert('Error enviando la solicitud. Intente nuevamente.');
    } finally {
      setValuationLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
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
      setTimeout(() => setContactSuccess(false), 6000);
    } catch {
      alert('Error enviando el mensaje. Intente nuevamente.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeTab !== 'All') {
      params.set('operation_type', activeTab);
    } else if (heroSearch.operation_type !== 'All') {
      params.set('operation_type', heroSearch.operation_type);
    }

    if (heroSearch.property_type !== 'All') {
      params.set('property_type', heroSearch.property_type);
    }
    if (heroSearch.query.trim()) {
      params.set('search', heroSearch.query.trim());
    }
    navigate(`/propiedades?${params.toString()}`);
  };

  // Filtered featured properties
  const displayedProperties = featuredProperties.filter(p => {
    if (featuredFilter === 'All') return true;
    return p.operation_type === featuredFilter;
  });

  // Carousel navigation handlers
  const maxCarouselIndex = Math.max(0, displayedProperties.length - itemsPerPage);
  const nextSlide = () => setCarouselIndex(prev => Math.min(prev + 1, maxCarouselIndex));
  const prevSlide = () => setCarouselIndex(prev => Math.max(prev - 1, 0));

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) nextSlide();
    if (touchStart - touchEnd < -50) prevSlide();
  };

  const servicesList = [
    {
      icon: <Building size={24} color="#60a5fa" />,
      title: 'Compra y Venta de Propiedades',
      desc: 'Tasación técnica, comercialización de alto impacto y acompañamiento legal riguroso hasta la firma final.',
      badge: 'Respaldo CPI'
    },
    {
      icon: <Key size={24} color="#60a5fa" />,
      title: 'Gestión Integral de Alquileres',
      desc: 'Selección calificada de inquilinos, garantías verificadas, cobro puntual y liquidación mensual clara.',
      badge: 'Tranquilidad Total'
    },
    {
      icon: <Calculator size={24} color="#60a5fa" />,
      title: 'Tasaciones Profesionales',
      desc: 'Informes objetivos basados en valores reales de cierre en el mercado inmobiliario cordobés.',
      badge: 'En 24-48 hs'
    },
    {
      icon: <Users size={24} color="#60a5fa" />,
      title: 'Consorcios y Propiedad Horizontal',
      desc: 'Administración transparente, liquidación clara de expensas y supervisión proactiva de mantenimiento.',
      badge: 'Gestión Transparente'
    },
    {
      icon: <TrendingUp size={24} color="#60a5fa" />,
      title: 'Asesoramiento para Inversores',
      desc: 'Identificación de oportunidades en pozo, rentabilidad por alquiler temporario y plusvalía garantizada.',
      badge: 'Alta Rentabilidad'
    },
    {
      icon: <Wrench size={24} color="#60a5fa" />,
      title: 'Mantenimiento Patrimonial',
      desc: 'Red de profesionales confiables para conservación preventiva y revalorización continua de inmuebles.',
      badge: 'Cuidado Activo'
    }
  ];

  const experiencePillars = [
    {
      title: 'Relaciones Humanas para Siempre',
      subtitle: 'Nuestro compromiso no termina al firmar',
      desc: 'Creemos que las operaciones inmobiliarias deben ser principalmente humanas. Te acompañamos antes, durante y después de concretar cada negocio.',
      icon: <Users size={22} color="#2563eb" />
    },
    {
      title: 'Transparencia y Claridad Total',
      subtitle: 'Cero sorpresas ni letra chica',
      desc: 'Explicamos cada término legal, tributario y financiero con absoluta honestidad para que tomes decisiones con plena seguridad y confianza.',
      icon: <ShieldCheck size={22} color="#2563eb" />
    },
    {
      title: 'Profesionales Matriculados CPI',
      subtitle: 'Rigurosidad jurídica y notarial',
      desc: 'Cada operación cuenta con supervisión técnica y legal conforme a las normativas del Colegio Profesional de Inmobiliarios de Córdoba.',
      icon: <Award size={22} color="#2563eb" />
    },
    {
      title: 'Difusión de Alto Alcance',
      subtitle: 'Comercialización ágil y efectiva',
      desc: 'Posicionamos tu inmueble en los principales portales del país, redes sociales segmentadas y nuestra base de inversores calificados.',
      icon: <TrendingUp size={22} color="#2563eb" />
    }
  ];

  const testimonials = [
    {
      name: 'Mariana Silveyra',
      role: 'Propietaria en Nueva Córdoba',
      text: 'Excelente atención del equipo de Piso Alto. Vendieron mi departamento en tiempo récord y se ocuparon de toda la documentación notarial. 100% recomendados.',
      rating: 5,
      date: 'Hace 1 mes'
    },
    {
      name: 'Ing. Carlos Benítez',
      role: 'Inversor en pozo y departamentos',
      text: 'La seriedad y el análisis de rentabilidad que me brindaron fue determinante. Es difícil encontrar inmobiliarias que hablen con números claros y honestos.',
      rating: 5,
      date: 'Hace 2 meses'
    },
    {
      name: 'Lucas & Sofía',
      role: 'Compradores de su primera casa',
      text: 'Buscamos durante meses hasta que dimos con ellos. La paciencia, el acompañamiento en cada visita y la claridad en los contratos nos dieron total tranquilidad.',
      rating: 5,
      date: 'Hace 3 semanas'
    }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden', backgroundColor: '#fcfdfd' }}>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — COMPACT, IMMERSIVE, SLOW ENTRANCE ANIMATION             */}
      {/* ========================================================================= */}
      <section style={{
        position: 'relative',
        paddingTop: '2rem',
        paddingBottom: '2.5rem',
        background: 'radial-gradient(ellipse 90% 70% at 50% -15%, rgba(37, 99, 235, 0.08) 0%, rgba(248, 250, 252, 0.4) 60%, #ffffff 100%)',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow accents */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'rgba(56, 189, 248, 0.12)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '8%',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.09)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-split-grid">

            {/* ── LEFT COLUMN: Left-Justified Components, Compact Search & Continuous Carousel ── */}
            <div className="hero-left-column">
              {/* Eyebrow & Brand Badge */}
              <div className="animate-fade-in-up" style={{ textAlign: 'left', marginBottom: '0.85rem' }}>
                <div className="section-pill-badge section-pill-badge-light" style={{ boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)' }}>
                  <Houses size={14} color="#2563eb" />
                  <span>Pisoalto Realty · Córdoba Capital &amp; Interior</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="animate-fade-in-up delay-100" style={{ textAlign: 'left', marginBottom: '0.85rem' }}>
                <h1 style={{
                  fontSize: 'clamp(1.85rem, 2.9vw, 2.65rem)',
                  fontWeight: 800,
                  color: '#0c1836',
                  lineHeight: 1.15,
                  letterSpacing: '-0.035em',
                  marginBottom: '0.65rem'
                }}>
                  Tu próximo hogar o inversión,{' '}
                  <span className="text-gradient-blue">con el respaldo que merecés.</span>
                </h1>
                <p style={{
                  fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                  color: '#475569',
                  lineHeight: 1.5,
                  maxWidth: '520px'
                }}>
                  Más de 12 años brindando asesoramiento inmobiliario transparente, ágil y humano en Córdoba y la región.
                </p>
              </div>

              {/* Reduced-Size Search Console */}
              <div className="hero-search-shell animate-fade-in-up delay-150" style={{
                maxWidth: '530px',
                width: '100%',
                margin: '0 0 0.85rem 0',
                padding: '0.35rem 0.45rem'
              }}>
                {/* Operation Selector Tabs */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.35rem 0.45rem 0.35rem',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  {[
                    { id: 'All', label: 'Todas' },
                    { id: 'Venta', label: 'Comprar' },
                    { id: 'Alquiler', label: 'Alquilar' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`search-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setHeroSearch(s => ({ ...s, operation_type: tab.id }));
                      }}
                    >
                      {tab.id === 'Venta' && <HomeIcon size={12} />}
                      {tab.id === 'Alquiler' && <Key size={12} />}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Compact Form Inputs */}
                <form
                  onSubmit={handleHeroSearch}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) auto',
                    gap: '0.4rem',
                    alignItems: 'center',
                    padding: '0.45rem 0.2rem 0.15rem'
                  }}
                >
                  {/* Location Input */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.65rem',
                    padding: '0.45rem 0.65rem'
                  }}>
                    <MapPin size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Barrio o ciudad..."
                      value={heroSearch.query}
                      onChange={e => setHeroSearch(s => ({ ...s, query: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        outline: 'none',
                        padding: 0
                      }}
                    />
                  </div>

                  {/* Property Type Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.65rem',
                    padding: '0.45rem 0.65rem'
                  }}>
                    <Building size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                    <select
                      value={heroSearch.property_type}
                      onChange={e => setHeroSearch(s => ({ ...s, property_type: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <option value="All">Tipo inmueble</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Casa">Casa</option>
                      <option value="Cochera">Cochera</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Local">Local</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="btn-pill-blue"
                    style={{
                      height: '100%',
                      minHeight: '38px',
                      padding: '0.45rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      borderRadius: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Search size={15} />
                    <span>Buscar</span>
                  </button>
                </form>
              </div>

              {/* Quick Filter Tag Chips (Left-aligned) */}
              <div className="animate-fade-in delay-200" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.35rem',
                alignItems: 'center',
                marginBottom: '1.15rem'
              }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Sugerencias:</span>
                {[
                  { label: 'Nueva Córdoba', pt: 'Departamento', loc: 'Nueva Córdoba' },
                  { label: 'Casas en Venta', op: 'Venta', pt: 'Casa' },
                  { label: 'Alquileres', op: 'Alquiler' },
                  { label: 'Las Varillas', loc: 'Las Varillas' }
                ].map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const p = new URLSearchParams();
                      if (tag.op) p.set('operation_type', tag.op);
                      if (tag.pt) p.set('property_type', tag.pt);
                      if (tag.loc) p.set('search', tag.loc);
                      navigate(`/propiedades?${p.toString()}`);
                    }}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      color: '#334155',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.18s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.color = '#1d4ed8';
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#334155';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {/* Continuous Moving Carousel of Featured Properties */}
              <div className="animate-fade-in-up delay-250" style={{ maxWidth: '530px', width: '100%' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.45rem',
                  padding: '0 0.15rem'
                }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0c1836',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Sparkles size={13} color="#2563eb" />
                    Propiedades Destacadas
                  </span>
                  <Link
                    to="/propiedades"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    Ver todas <ChevronRight size={13} />
                  </Link>
                </div>

                {/* Continuous Marquee Ticker Track */}
                <div className="marquee-container">
                  <div className="marquee-track">
                    {(featuredProperties.length > 0 ? [...featuredProperties, ...featuredProperties] : []).map((property, idx) => {
                      const cover = property.images && property.images.length > 0
                        ? (property.images.find(img => img.is_cover) || property.images[0]).image_url
                        : null;
                      const formattedPrice = property.currency === 'USD'
                        ? `U$S ${Number(property.price).toLocaleString('es-AR')}`
                        : `$ ${Number(property.price).toLocaleString('es-AR')}`;
                      return (
                        <Link
                          key={`${property.id}-${idx}`}
                          to={`/propiedades/${property.id}`}
                          className="marquee-card"
                          title={property.title}
                        >
                          <div style={{
                            width: '68px',
                            height: '56px',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            flexShrink: 0,
                            position: 'relative'
                          }}>
                            <img
                              src={getImageUrl(cover)}
                              alt={property.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span style={{
                              position: 'absolute',
                              top: 2,
                              left: 2,
                              backgroundColor: property.operation_type === 'Venta' ? '#1d4ed8' : '#059669',
                              color: '#ffffff',
                              fontSize: '0.55rem',
                              fontWeight: 700,
                              padding: '1px 4px',
                              borderRadius: '4px',
                              textTransform: 'uppercase'
                            }}>
                              {property.operation_type}
                            </span>
                          </div>

                          <div style={{ minWidth: 0, flexGrow: 1 }}>
                            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#1d4ed8', lineHeight: 1.1 }}>
                              {formattedPrice}
                            </div>
                            <div style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: '0.15rem'
                            }}>
                              {property.title}
                            </div>
                            <div style={{
                              fontSize: '0.65rem',
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: '0.1rem'
                            }}>
                              <MapPin size={10} color="#94a3b8" />
                              <span>{property.location || property.address}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Contenedor con Estructuras Monolíticas ── */}
            <div className="hero-right-column animate-fade-in-up delay-150">
              <div className="monolithic-container">
                <img
                  src="/monolithic-structures.jpg"
                  alt="Estructuras Monolíticas Pisoalto Realty"
                  className="monolithic-image"
                />

                {/* Elegant overlay gradient */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(12,24,54,0.18) 0%, rgba(12,24,54,0) 35%, rgba(12,24,54,0.7) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Top-Left Floating Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backdropFilter: 'blur(12px)',
                  backgroundColor: 'rgba(12, 24, 54, 0.85)',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                  <Building size={14} color="#60a5fa" />
                  <span>Torres &amp; Desarrollos Monolíticos</span>
                </div>

                {/* Top-Right Floating Metric Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backdropFilter: 'blur(12px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#0c1836',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                }}>
                  <Award size={13} color="#2563eb" />
                  <span>Calidad Constructiva</span>
                </div>

                {/* Bottom-Right Monolithic Info Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  left: '16px',
                  backdropFilter: 'blur(16px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Piso Alto Realty · Desarrollos Urbanos
                    </div>
                    <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0c1836', lineHeight: 1.2, marginTop: '0.15rem' }}>
                      Estructuras Monolíticas &amp; Pisos Altos
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Emprendimientos en altura de máxima categoría en Córdoba.
                    </div>
                  </div>

                  <Link
                    to="/propiedades"
                    className="btn-pill-navy"
                    style={{
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    <span>Explorar</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

              </div>
            </div>

          </div>

          {/* Social Proof & Metrics Strip below the 2 columns */}
          <div className="animate-fade-in-up delay-300" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            {[
              {
                icon: <Building size={20} color="#2563eb" />,
                title: '+180 Inmuebles',
                desc: 'Disponibles para visitar'
              },
              {
                icon: <ShieldCheck size={20} color="#2563eb" />,
                title: 'Matrícula CPI',
                desc: 'Profesionales matriculados'
              },
              {
                icon: <Users size={20} color="#2563eb" />,
                title: '+350 Operaciones',
                desc: 'Concretadas con éxito'
              },
              {
                icon: <Award size={20} color="#2563eb" />,
                title: '12+ Años',
                desc: 'De trayectoria en Córdoba'
              }
            ].map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '0.85rem',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '0.65rem',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {m.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0c1836', lineHeight: 1.1 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROPIEDADES DESTACADAS — INTERACTIVE CAROUSEL SLIDER                    */}
      {/* ========================================================================= */}
      <section id="destacadas" className="section-light" style={{ padding: '2.5rem 0' }}>
        <div className="container">

          {/* Section Header */}
          <div className="section-header animate-fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '0.65rem' }}>
              <span className="section-pill-badge section-pill-badge-light" style={{ margin: 0 }}>
                <Star size={13} color="#2563eb" />
                <span>Oportunidades Seleccionadas</span>
              </span>
            </div>
            <h2 className="section-title">
              Propiedades Destacadas
            </h2>
            <p className="section-subtitle">
              Inmuebles seleccionados por su ubicación privilegiada, rentabilidad y excelente relación de precio y calidad.
            </p>

            {/* In-page Operation Filter Tabs & Carousel Nav Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '1200px',
              marginTop: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Filter Tabs */}
              <div style={{
                display: 'inline-flex',
                backgroundColor: '#f1f5f9',
                padding: '0.25rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0'
              }}>
                {[
                  { id: 'All', label: 'Todas' },
                  { id: 'Venta', label: 'En Venta' },
                  { id: 'Alquiler', label: 'En Alquiler' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFeaturedFilter(f.id);
                      setCarouselIndex(0);
                    }}
                    style={{
                      padding: '0.4rem 1.2rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      transition: 'all 0.2s ease',
                      backgroundColor: featuredFilter === f.id ? '#ffffff' : 'transparent',
                      color: featuredFilter === f.id ? '#1d4ed8' : '#64748b',
                      boxShadow: featuredFilter === f.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Carousel Arrows */}
              {displayedProperties.length > itemsPerPage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="carousel-nav-btn"
                    onClick={prevSlide}
                    disabled={carouselIndex === 0}
                    title="Anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="carousel-nav-btn"
                    onClick={nextSlide}
                    disabled={carouselIndex >= maxCarouselIndex}
                    title="Siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Properties Carousel Viewport */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
              <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Cargando propiedades destacadas...</p>
            </div>
          ) : displayedProperties.length > 0 ? (
            <div
              className="carousel-viewport animate-fade-in delay-150"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ padding: '0.5rem 0 1rem 0' }}
            >
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${carouselIndex * (100 / itemsPerPage)}%)`
                }}
              >
                {displayedProperties.map(property => (
                  <div
                    key={property.id}
                    style={{
                      flex: `0 0 ${100 / itemsPerPage}%`,
                      padding: '0 0.65rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              border: '1px dashed #cbd5e1'
            }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                No se encontraron propiedades en esta categoría por el momento.
              </p>
              <Link to="/propiedades" className="btn-pill-outline" style={{ marginTop: '1rem' }}>
                Explorar todo el catálogo
              </Link>
            </div>
          )}

          {/* Carousel Dots Indicator */}
          {displayedProperties.length > itemsPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.45rem', marginTop: '1.25rem' }}>
              {Array.from({ length: maxCarouselIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  style={{
                    width: carouselIndex === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: carouselIndex === idx ? '#2563eb' : '#cbd5e1',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  title={`Ir a diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* View More Link */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              to="/propiedades"
              className="btn-pill-navy animate-fade-in delay-250"
              style={{
                padding: '0.75rem 2.2rem',
                fontSize: '0.925rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(12, 24, 54, 0.15)'
              }}
            >
              <span>Ver todas las propiedades</span>
              <ArrowRight size={17} />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TASACIÓN PROFESIONAL — HIGH CONVERTING, COMPACT PADDING                 */}
      {/* ========================================================================= */}
      <section id="tasacion" style={{
        padding: '2.75rem 0',
        backgroundColor: '#0c1836',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient radial glow */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(12, 24, 54, 0) 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-80px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(12, 24, 54, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>

            {/* Left Column: Value Proposition */}
            <div className="animate-fade-in-up delay-100">
              <div style={{ display: 'flex', width: '100%', marginBottom: '0.75rem' }}>
                <span className="section-pill-badge section-pill-badge-dark" style={{ margin: 0 }}>
                  <Calculator size={13} color="#38bdf8" />
                  <span>Tasación Oficial &amp; Comercialización</span>
                </span>
              </div>

              <h2 style={{
                display: 'block',
                clear: 'both',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                marginBottom: '0.85rem'
              }}>
                ¿Querés vender o tasar tu inmueble con éxito?
              </h2>

              <p style={{
                color: '#cbd5e1',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem'
              }}>
                Determinamos el valor real de mercado con informes comparativos rigurosos, evitando sobreprecios que congelan tu propiedad o subvaluaciones que perjudican tu patrimonio.
              </p>

              {/* Value checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                {[
                  {
                    title: 'Informe Técnico en 24 a 48 hs',
                    desc: 'Análisis detallado de valores reales de cierre en tu zona.'
                  },
                  {
                    title: 'Estrategia de Difusión 360°',
                    desc: 'Presencia destacada en los principales portales y redes segmentadas.'
                  },
                  {
                    title: 'Acompañamiento Notarial y Legal',
                    desc: 'Revisión exhaustiva de títulos, deudas e impuestos.'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.18)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.15rem'
                    }}>
                      <CheckCircle size={15} color="#38bdf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#ffffff' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct WhatsApp Callout */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                <Phone size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  ¿Preferís atención inmediata?{' '}
                  <a
                    href="https://wa.me/5493512345678?text=Hola,%20quisiera%20solicitar%20una%20tasaci%C3%B3n%20profesional"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Escribinos por WhatsApp
                  </a>
                </span>
              </div>
            </div>

            {/* Right Column: Valuation Form Card */}
            <div className="card-dark-glass animate-fade-in-up delay-200" style={{
              padding: '2rem',
              backgroundColor: 'rgba(14, 27, 56, 0.85)',
              border: '1px solid rgba(96, 165, 250, 0.25)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{ marginBottom: '1.15rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                  Solicitar Tasación Profesional
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                  Completá los datos y un asesor matriculado se contactará en menos de 24 horas.
                </p>
              </div>

              {valuationSuccess && (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#4ade80',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.65rem',
                  marginBottom: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={18} /> ¡Solicitud recibida! Te contactaremos a la brevedad.
                </div>
              )}

              <form onSubmit={handleValuationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={valuationForm.full_name}
                    onChange={(e) => setValuationForm({ ...valuationForm, full_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.95rem',
                      borderRadius: '0.65rem',
                      border: '1px solid #1e293b',
                      fontSize: '0.875rem',
                      backgroundColor: '#070e20',
                      color: '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Teléfono o WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +54 9 351 123 4567"
                    value={valuationForm.phone}
                    onChange={(e) => setValuationForm({ ...valuationForm, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.95rem',
                      borderRadius: '0.65rem',
                      border: '1px solid #1e293b',
                      fontSize: '0.875rem',
                      backgroundColor: '#070e20',
                      color: '#ffffff'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Tipo de Inmueble
                    </label>
                    <select
                      value={valuationForm.property_type}
                      onChange={(e) => setValuationForm({ ...valuationForm, property_type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.95rem',
                        borderRadius: '0.65rem',
                        border: '1px solid #1e293b',
                        fontSize: '0.875rem',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        cursor: 'pointer'
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
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Barrio / Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Nueva Córdoba"
                      value={valuationForm.city}
                      onChange={(e) => setValuationForm({ ...valuationForm, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.95rem',
                        borderRadius: '0.65rem',
                        border: '1px solid #1e293b',
                        fontSize: '0.875rem',
                        backgroundColor: '#070e20',
                        color: '#ffffff'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={valuationLoading}
                  className="btn-pill-blue"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    marginTop: '0.35rem',
                    borderRadius: '0.65rem'
                  }}
                >
                  {valuationLoading ? 'Enviando solicitud...' : 'Solicitar Tasación Sin Compromiso'}
                </button>

                <p style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', margin: 0 }}>
                  Respetamos tu privacidad. Tus datos no se comparten con terceros.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. NUESTROS SERVICIOS — STAGGERED ENTRANCE ANIMATIONS                     */}
      {/* ========================================================================= */}
      <section style={{ padding: '2.75rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">

          <div className="section-header animate-fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '0.65rem' }}>
              <span className="section-pill-badge section-pill-badge-light" style={{ margin: 0 }}>
                <Building size={13} color="#2563eb" />
                <span>Soluciones Inmobiliarias Integrales</span>
              </span>
            </div>
            <h2 className="section-title">
              Nuestros Servicios
            </h2>
            <p className="section-subtitle">
              Un abanico de servicios pensado para resolver cada necesidad de propietarios, inquilinos e inversores.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.5rem'
          }}>
            {servicesList.map((service, idx) => (
              <div
                key={idx}
                className={`animate-fade-in-up delay-${Math.min((idx + 1) * 100, 500)}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1.15rem',
                  padding: '1.6rem 1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 16px rgba(12, 24, 54, 0.03)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 16px 36px -10px rgba(37, 99, 235, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(12, 24, 54, 0.03)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.15rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '0.85rem',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(service.icon, { color: '#2563eb', size: 22 })}
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {service.badge}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#0c1836',
                  lineHeight: 1.3,
                  marginBottom: '0.55rem'
                }}>
                  {service.title}
                </h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  lineHeight: 1.55,
                  marginBottom: '1.25rem',
                  flexGrow: 1
                }}>
                  {service.desc}
                </p>

                <a
                  href="#contacto"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    transition: 'gap 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.gap = '0.6rem'}
                  onMouseLeave={e => e.currentTarget.style.gap = '0.4rem'}
                >
                  <span>Consultar por este servicio</span>
                  <ChevronRight size={15} />
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPERIENCIA PISO ALTO — BRAND PILLARS & TESTIMONIALS                   */}
      {/* ========================================================================= */}
      <section id="nosotros" style={{ padding: '2.75rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">

          <div className="section-header animate-fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '0.65rem' }}>
              <span className="section-pill-badge section-pill-badge-light" style={{ margin: 0 }}>
                <Users size={13} color="#2563eb" />
                <span>Nuestra Filosofía</span>
              </span>
            </div>
            <h2 className="section-title">
              La Experiencia Piso Alto
            </h2>
            <p className="section-subtitle">
              Entendemos que detrás de cada operación inmobiliaria hay un proyecto de vida, una familia o un sueño de superación.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.35rem'
          }}>
            {experiencePillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`animate-fade-in-up delay-${Math.min((idx + 1) * 100, 400)}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1.15rem',
                  padding: '1.6rem 1.4rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.22s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 99, 235, 0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.03)';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '0.75rem',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  {pillar.icon}
                </div>

                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                  {pillar.subtitle}
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.55rem', lineHeight: 1.3 }}>
                  {pillar.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.55 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Social Proof Testimonials */}
          <div style={{ marginTop: '3rem' }}>
            <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Lo que dicen nuestros clientes
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.35rem'
            }}>
              {testimonials.map((test, idx) => (
                <div
                  key={idx}
                  className={`animate-fade-in-up delay-${Math.min((idx + 2) * 100, 500)}`}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '1rem',
                    padding: '1.4rem',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.75rem' }}>
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.55, fontStyle: 'italic', marginBottom: '1.15rem' }}>
                      "{test.text}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0c1836' }}>
                        {test.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {test.role}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{test.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. UBICACIÓN Y CONTACTO — LUXURY DUAL OFFICE & DIRECT CONTACT SECTION      */}
      {/* ========================================================================= */}
      <section id="contacto" style={{
        padding: '2.75rem 0',
        backgroundColor: '#0c1836',
        color: '#ffffff',
        position: 'relative'
      }}>
        <div className="container">

          <div className="section-header animate-fade-in-up">
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '0.65rem' }}>
              <span className="section-pill-badge section-pill-badge-dark" style={{ margin: 0 }}>
                <MapPin size={13} color="#38bdf8" />
                <span>Nuestras Sedes &amp; Atención</span>
              </span>
            </div>
            <h2 className="section-title-light">
              Ubicación y Contacto
            </h2>
            <p className="section-subtitle-light">
              Estamos cerca de vos. Acercate a nuestras oficinas o envianos tu consulta para recibir atención personalizada.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}>

            {/* Left Contact Form Card */}
            <div className="card-dark-glass animate-fade-in-up delay-100" style={{
              padding: '2rem',
              backgroundColor: 'rgba(14, 27, 56, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                Dejanos tu Mensaje
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginBottom: '1.35rem' }}>
                Un asesor te responderá a la brevedad con la información que necesitas.
              </p>

              {contactSuccess && (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#4ade80',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.65rem',
                  marginBottom: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={18} /> ¡Mensaje enviado con éxito! Te responderemos muy pronto.
                </div>
              )}

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                      Nombre *
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
                        borderRadius: '0.6rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
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
                        borderRadius: '0.6rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.6rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                      Teléfono o WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 351 ..."
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '0.6rem',
                        border: '1px solid #1e293b',
                        backgroundColor: '#070e20',
                        color: '#ffffff',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                    Motivo de Consulta
                  </label>
                  <select
                    value={contactForm.service_interest}
                    onChange={(e) => setContactForm({ ...contactForm, service_interest: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #1e293b',
                      backgroundColor: '#070e20',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Compra">Comprar una propiedad</option>
                    <option value="Venta">Vender una propiedad</option>
                    <option value="Alquiler">Alquilar un inmueble</option>
                    <option value="Tasacion">Tasación oficial de mercado</option>
                    <option value="Administracion">Administración de consorcios o alquiler</option>
                    <option value="Inversiones">Asesoramiento de inversión en pozo</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                    Mensaje o Consulta
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Contanos qué tipo de propiedad o servicio estás buscando..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #1e293b',
                      backgroundColor: '#070e20',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="btn-pill-blue"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    borderRadius: '0.65rem'
                  }}
                >
                  <Send size={16} />
                  <span>{contactLoading ? 'Enviando...' : 'Enviar Consulta'}</span>
                </button>
              </form>
            </div>

            {/* Right Office Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Office 1: Cordoba Capital */}
              <div className="card-dark-glass animate-fade-in-up delay-150" style={{ padding: '1.6rem', backgroundColor: 'rgba(14, 27, 56, 0.85)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.5rem',
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MapPin size={18} color="#60a5fa" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                        Oficina Córdoba Capital
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 600 }}>Sede Central</span>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Juan+A.+Sarachaga+953,+Cordoba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-outline-light"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                  >
                    <span>Ver mapa</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                  Juan A. Sarachaga 953, Alta Córdoba, Ciudad de Córdoba
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} color="#60a5fa" />
                    <span>Lunes a Viernes de 9:00 a 18:00 hs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} color="#60a5fa" />
                    <span>+54 9 351 700 0000</span>
                  </div>
                </div>
              </div>

              {/* Office 2: Las Varillas */}
              <div className="card-dark-glass animate-fade-in-up delay-200" style={{ padding: '1.6rem', backgroundColor: 'rgba(14, 27, 56, 0.85)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.5rem',
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MapPin size={18} color="#60a5fa" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                        Oficina Las Varillas
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 600 }}>Sede Interior</span>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Av.+Centenario+250,+Las+Varillas,+Cordoba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-outline-light"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                  >
                    <span>Ver mapa</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                  Av. Centenario 250, Las Varillas, Córdoba
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} color="#60a5fa" />
                    <span>Lunes a Viernes de 8:30 a 12:30 y 16:30 a 20:00 hs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} color="#60a5fa" />
                    <span>+54 9 3533 40 0000</span>
                  </div>
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
