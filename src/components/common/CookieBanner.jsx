import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#111',
      color: '#fff',
      padding: '15px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.5)',
      fontFamily: 'inherit'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        We use cookies to improve your experience. By continuing to use our site, you agree to our <Link to="/cookie-policy" style={{ color: 'var(--tg-theme-primary)', textDecoration: 'underline' }}>Cookie Policy</Link>.
      </div>
      <button 
        onClick={handleAccept} 
        style={{
          backgroundColor: 'var(--tg-theme-primary)',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Accept & Close
      </button>
    </div>
  );
};

export default CookieBanner;
