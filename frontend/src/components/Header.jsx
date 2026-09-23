import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    fontWeight: isActive(path) ? '700' : '500',
    color: isActive(path) ? '#0c1836' : '#475569',
    fontSize: '0.85rem',
    transition: 'color 0.2s',
    letterSpacing: '-0.01em'
  });

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/logo-pisoalto.png"
            alt="Piso Alto Realty"
            style={{
              height: '50px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </Link>

        {/* Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '2rem'
        }} className="desktop-nav">
          <Link to="/" style={linkStyle('/')}>Inicio</Link>
          <Link to="/propiedades" style={linkStyle('/propiedades')}>Propiedades</Link>
          <a href="/#destacadas" style={linkStyle(null)}>Destacadas</a>
          <a href="/#nosotros" style={linkStyle(null)}>Nosotros</a>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link to="/admin" className="btn-pill-navy" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                <Shield size={14} /> Admin
              </Link>
              <button onClick={logout} style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600, padding: '0.4rem 0.5rem' }}>
                Salir
              </button>
            </div>
          ) : (
            <>
              <a href="/#contacto" className="btn-pill-navy" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem' }}>
                Contáctanos
              </a>
              <Link to="/admin" style={{
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.35rem',
                borderRadius: '50%',
                transition: 'color 0.2s'
              }} title="Acceso Administrador">
                <Shield size={16} />
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', padding: '0.3rem', color: '#0c1836' }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836', fontSize: '0.9rem' }}>
            Inicio
          </Link>
          <Link to="/propiedades" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836', fontSize: '0.9rem' }}>
            Propiedades
          </Link>
          <a href="/#destacadas" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836', fontSize: '0.9rem' }}>
            Propiedades Destacadas
          </a>
          <a href="/#nosotros" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836', fontSize: '0.9rem' }}>
            Nosotros
          </a>
          <a href="/#contacto" onClick={() => setMobileMenuOpen(false)} className="btn-pill-navy" style={{ width: '100%', marginTop: '0.25rem', textAlign: 'center' }}>
            Contáctanos
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
