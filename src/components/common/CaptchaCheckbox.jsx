import React, { useState } from 'react';

export default function CaptchaCheckbox({ isVerified, setIsVerified }) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleClick = () => {
    if (isVerified) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 800);
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-between p-3 mb-3"
      onClick={handleClick}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${isVerified ? 'rgba(74, 222, 128, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
        borderRadius: '12px',
        cursor: isVerified ? 'default' : 'pointer',
        maxWidth: '320px',
        userSelect: 'none'
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <div 
          className="d-flex align-items-center justify-content-center"
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: `2px solid ${isVerified ? '#4ade80' : '#a5b4fc'}`,
            backgroundColor: isVerified ? '#4ade80' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          {isVerifying ? (
            <i className="fas fa-spinner fa-spin text-white" style={{ fontSize: '12px' }}></i>
          ) : isVerified ? (
            <i className="fas fa-check text-dark" style={{ fontSize: '14px', fontWeight: 'bold' }}></i>
          ) : null}
        </div>
        <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
          I'm not a robot
        </span>
      </div>

      <div className="text-end" style={{ lineHeight: '1' }}>
        <i className="fas fa-shield-alt" style={{ color: isVerified ? '#4ade80' : '#818cf8', fontSize: '18px' }}></i>
        <div className="text-muted" style={{ fontSize: '9px', marginTop: '2px', letterSpacing: '0.5px' }}>
          Protected by Anti-Bot
        </div>
      </div>
    </div>
  );
}
