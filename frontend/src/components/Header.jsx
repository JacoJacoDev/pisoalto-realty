import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '75px'
      }}>
        {/* Logo matching reference */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            backgroundColor: '#0c1836',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(12, 24, 54, 0.2)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L2 21H7.5L12 12L16.5 21H22L12 3Z" fill="#ffffff"/>
              <path d="M12 15L9.5 20H14.5L12 15Z" fill="#2563eb"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0c1836',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              PISO ALTO
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.2em'
            }}>
              REALTY
            </span>
          </div>
        </Link>

        {/* Navigation Links Desktop */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '2.5rem'
        }} className="desktop-nav">
          <Link to="/" style={{
            fontWeight: isActive('/') ? '700' : '500',
            color: isActive('/') ? '#0c1836' : '#475569',
            fontSize: '0.95rem',
            transition: 'color 0.2s'
          }}>
            Inicio
          </Link>
          <Link to="/propiedades" style={{
            fontWeight: isActive('/propiedades') ? '700' : '500',
            color: isActive('/propiedades') ? '#0c1836' : '#475569',
            fontSize: '0.95rem',
            transition: 'color 0.2s'
          }}>
            Propiedades
          </Link>
          <a href="/#destacadas" style={{
            fontWeight: '500',
            color: '#475569',
            fontSize: '0.95rem'
          }}>
            Propiedades Destacadas
          </a>
          <a href="/#nosotros" style={{
            fontWeight: '500',
            color: '#475569',
            fontSize: '0.95rem'
          }}>
            Nosotros
          </a>
        </nav>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/admin" className="btn-pill-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                <Shield size={16} /> Panel Admin
              </Link>
              <button onClick={logout} style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600, padding: '0.5rem' }}>
                Salir
              </button>
            </div>
          ) : (
            <>
              <a href="/#contacto" className="btn-pill-navy" style={{ display: 'inline-flex', padding: '0.6rem 1.6rem', fontSize: '0.9rem' }}>
                Contáctanos
              </a>
              <Link to="/admin" style={{
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }} title="Acceso Administrador">
                <Shield size={18} />
              </Link>
            </>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', padding: '0.4rem', color: '#0c1836' }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836' }}>
            Inicio
          </Link>
          <Link to="/propiedades" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836' }}>
            Propiedades
          </Link>
          <a href="/#destacadas" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836' }}>
            Propiedades Destacadas
          </a>
          <a href="/#nosotros" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#0c1836' }}>
            Nosotros
          </a>
          <a href="/#contacto" onClick={() => setMobileMenuOpen(false)} className="btn-pill-navy" style={{ width: '100%', marginTop: '0.5rem' }}>
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
