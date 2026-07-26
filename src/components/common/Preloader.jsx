import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div 
      id="preloader" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#010315',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 1 : 0, 
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none'
      }}
    >
      <div id="loader" className="loader">
        <div className="loader-container">
          <div className="loader-icon">
            <img src="/assets/img/logo/preloader-logo.png" alt="Preloader Logo" style={{ height: '40px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
