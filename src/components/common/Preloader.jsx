import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // Smooth progress bar increment
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 80);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
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
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 1 : 0, 
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: loading ? 'all' : 'none'
      }}
    >
      {/* Background Radial Glow */}
      <div 
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(174, 109, 254, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}
      />

      <div className="text-center pos-rel" style={{ zIndex: 2 }}>
        {/* Animated Appifyra Logo */}
        <div className="mb-4">
          <img 
            src="/assets/img/logo/appifyra logo white.svg" 
            alt="Appifyra" 
            style={{ 
              height: '52px',
              filter: 'drop-shadow(0 0 15px rgba(174, 109, 254, 0.5))'
            }} 
          />
        </div>

        {/* Progress Bar Container */}
        <div 
          style={{
            width: '220px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            margin: '0 auto 16px'
          }}
        >
          <div 
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 50%, #4ade80 100%)',
              transition: 'width 0.15s ease-out',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(174, 109, 254, 0.8)'
            }}
          />
        </div>

        <span style={{ color: '#a5b4fc', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600' }}>
          Loading Appifyra...
        </span>
      </div>
    </div>
  );
}
