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

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false');
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
      color: 'var(--color-text-main)',
      padding: '15px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.5)',
      fontFamily: 'inherit'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '14px' }}>
        We use cookies to enhance your browsing experience and analyze our traffic. Please choose whether to accept our cookies.
        Read more in our <Link to="/cookie-policy" style={{ color: 'var(--tg-theme-primary)', textDecoration: 'underline' }}>Cookie Policy</Link>.
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleReject} 
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-text-main)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            padding: '8px 20px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '13px'
          }}
        >
          Decline
        </button>
        <button 
          onClick={handleAccept} 
          style={{
            backgroundColor: 'var(--tg-theme-primary)',
            color: 'var(--color-text-main)',
            border: 'none',
            padding: '8px 20px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '13px'
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
