import React from 'react';

export default function BrandMarquee() {
  const leftBrands = [
    'cs-brd01.png', 'cs-brd02.png', 'cs-brd03.png', 'cs-brd04.png', 
    'cs-brd05.png', 'cs-brd06.png', 'cs-brd07.png', 'cs-brd08.png', 'cs-brd09.png'
  ];

  const rightBrands = [
    'cs-brd10.png', 'cs-brd11.png', 'cs-brd12.png', 'cs-brd13.png', 
    'cs-brd14.png', 'cs-brd15.png', 'cs-brd16.png', 'cs-brd17.png', 'cs-brd18.png'
  ];

  // Duplicate for seamless infinite loop
  const leftLoop = [...leftBrands, ...leftBrands];
  const rightLoop = [...rightBrands, ...rightBrands];

  return (
    <section className="brand py-5 overflow-hidden pos-rel" style={{ backgroundColor: '#010315', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-4">
          <span 
            className="badge px-3 py-2 mb-2"
            style={{
              backgroundColor: 'rgba(174, 109, 254, 0.12)',
              color: '#ae6dfe',
              border: '1px solid rgba(174, 109, 254, 0.25)',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            GLOBAL TRUSTED PARTNERS
          </span>
          <h3 className="text-white mb-1" style={{ fontWeight: '700', fontSize: '26px' }}>
            50+ Clients & Tech Partners Worldwide
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
            Delivering Excellence Globally • Unmatched Speed & Security
          </p>
        </div>
      </div>

      {/* Smooth Marquee Container with Fade Edge Mask */}
      <div 
        className="pos-rel py-3"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
        }}
      >
        {/* Top Marquee Row (Scrolls Left) */}
        <div className="cs-brand-inner marquee-left mb-3">
          {leftLoop.map((img, idx) => (
            <div 
              className="cs-brand-item px-3" 
              key={`left-${idx}`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={`/assets/img/brand/${img}`} 
                alt={`Brand ${idx + 1}`} 
                style={{ height: '26px', opacity: 0.85, filter: 'brightness(1.2)' }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Marquee Row (Scrolls Right) */}
        <div className="cs-brand-inner marquee-right">
          {rightLoop.map((img, idx) => (
            <div 
              className="cs-brand-item px-3" 
              key={`right-${idx}`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={`/assets/img/brand/${img}`} 
                alt={`Brand ${idx + 10}`} 
                style={{ height: '26px', opacity: 0.85, filter: 'brightness(1.2)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
