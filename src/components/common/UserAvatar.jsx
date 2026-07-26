import React from 'react';

export default function UserAvatar({ name, size = 40, bgColor = 'linear-gradient(135deg, #431DAB 0%, #AE6DFE 100%)', borderColor = 'rgba(255, 255, 255, 0.2)' }) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div 
      className="d-flex align-items-center justify-content-center text-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: bgColor,
        border: `2px solid ${borderColor}`,
        fontSize: `${Math.round(size * 0.45)}px`,
        fontWeight: '700',
        lineHeight: '1',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {initial}
    </div>
  );
}
