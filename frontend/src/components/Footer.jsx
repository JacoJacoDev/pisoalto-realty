import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#000000ff',
      color: '#ffffff',
      paddingTop: '2.25rem',
      paddingBottom: '1.5rem',
      marginTop: 0,
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Col 1: Stylized Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.85rem' }}>
          <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <img
              src="/logo-pisoalto-white.png"
              alt="Piso Alto Realty"
              style={{
                height: '100px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </Link>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '280px', lineHeight: '1.6' }}>
            Conectamos personas con oportunidades inmobiliarias con transparencia y servicio personalizado.
          </p>
        </div>

        {/* Col 2: Ubicaciones */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Ubicaciones
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                Juan A. Sarachaga 953, Córdoba
              </p>
              <a
                href="https://maps.google.com/?q=Juan+A.+Sarachaga+953,+Cordoba"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  color: '#60a5fa',
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(37, 99, 235, 0.3)'
                }}
              >
                <MapPin size={12} /> Ver en Maps ↗
              </a>
            </div>

            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                Av. Centenario 250, Las Varillas, Córdoba
              </p>
              <a
                href="https://maps.google.com/?q=Av.+Centenario+250,+Las+Varillas"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  color: '#60a5fa',
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(37, 99, 235, 0.3)'
                }}
              >
                <MapPin size={12} /> Ver en Maps ↗
              </a>
            </div>
          </div>
        </div>

        {/* Col 3: Contactos */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Contactos
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="#60a5fa" />
              <span>Córdoba: <strong>351-8-5555-88</strong></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="#60a5fa" />
              <span>Las Varillas: <strong>3533-68-1005</strong></span>
            </li>
          </ul>
        </div>

        {/* Col 4: Redes Sociales (Matching Screenshot Buttons) */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Redes Sociales
          </h4>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Facebook */}
            <a href="#" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#3b5998', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.65 13.73 5.65c1.07 0 2.19.19 2.19.19v2.41h-1.24c-1.23 0-1.62.76-1.62 1.54V12h2.71l-.43 3h-2.28v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a href="#" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#000000', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5493518555588"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.89c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.875 11.875 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.89a11.815 11.815 0 00-3.479-8.416" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E1306C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #1e293b',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.8rem'
      }}>
        © {new Date().getFullYear()} Piso Alto Realty. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
