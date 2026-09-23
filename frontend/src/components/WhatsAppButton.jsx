import React from 'react';
import { Phone } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5493518555588?text=Hola,%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20sus%20propiedades"
      target="_blank"
      rel="noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: '#25D366',
        color: '#ffffff',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        zIndex: 99,
        transition: 'transform 0.25s ease, boxShadow 0.25s ease'
      }}
      title="Contactar por WhatsApp"
      className="whatsapp-float-btn"
    >
      <Phone size={28} />
      <style>{`
        .whatsapp-float-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
        }
      `}</style>
    </a>
  );
};

export default WhatsAppButton;
