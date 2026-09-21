import React from 'react';

export default function IndustriesSection() {
  const industries = [
    { 
      title: 'Fintech & Banking', 
      icon: 'fas fa-university', 
      glowColor: 'var(--color-success)',
      desc: 'Secure payment processing, digital banking apps, and financial compliance platforms.' 
    },
    { 
      title: 'Healthcare & Biotech', 
      icon: 'fas fa-heartbeat', 
      glowColor: '#ec4899',
      desc: 'HIPAA-compliant telehealth, patient portals, and medical telemetry data systems.' 
    },
    { 
      title: 'E-Commerce & Retail', 
      icon: 'fas fa-shopping-bag', 
      glowColor: '#a855f7',
      desc: 'High-conversion digital storefronts, inventory automation, and checkout pipelines.' 
    },
    { 
      title: 'Education & EdTech', 
      icon: 'fas fa-graduation-cap', 
      glowColor: 'var(--color-success)',
      desc: 'Interactive LMS platforms, AI learning assistants, and real-time student tracking.' 
    },
    { 
      title: 'Real Estate & PropTech', 
      icon: 'fas fa-building', 
      glowColor: '#f59e0b',
      desc: 'Property engines, virtual tour integrations, and automated tenant management portals.' 
    },
    { 
      title: 'Logistics & Supply Chain', 
      icon: 'fas fa-truck-fast', 
      glowColor: '#6366f1',
      desc: 'Real-time fleet tracking, automated dispatching, and warehouse management systems.' 
    }
  ];

  return (
    <section 
      className="industries-section pt-100 pb-100 pos-rel bg-slate-50 dark:bg-[#060813]" style={{ overflow: 'hidden' }}
    >
      {/* Background Ambient Glow Effects */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, var(--input-border) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container pos-rel" style={{ zIndex: 2 }}>
        <div className="sec-title--two text-center mb-60">
          <span 
            className="sub-title d-inline-flex align-items-center gap-2 px-3 py-2 mb-3"
            style={{
              backgroundColor: 'var(--input-border)',
              border: '1px solid var(--input-border)',
              borderRadius: '30px',
              color: 'var(--badge-text)',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <i className="fas fa-layer-group text-primary"></i>
            <span>Industries We Serve</span>
          </span>
          <h2 
            className="title text-main" 
            style={{ 
              fontWeight: '800', 
              fontSize: '36px', 
              letterSpacing: '-0.5px' 
            }}
          >
            Tailored Solutions For Diverse Sectors
          </h2>
          <p className="text-muted mx-auto mt-2" style={{ maxWidth: '640px', fontSize: '15px', color: 'var(--color-text-muted)' }}>
            We architect scalable, high-performance software tailored to the specialized compliance and operational demands of modern global industries.
          </p>
        </div>

        <div className="row g-4">
          {industries.map((ind, idx) => (
            <div className="col-lg-4 col-md-6" key={idx}>
              <div 
                className="industry-card p-4 h-100 d-flex flex-column bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ 
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  
                  borderRadius: '20px',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 30px var(--card-bg)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = ind.glowColor;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${ind.glowColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--input-border)';
                  e.currentTarget.style.boxShadow = '0 10px 30px var(--card-bg)';
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      background: `radial-gradient(circle, ${ind.glowColor}25 0%, var(--section-bg) 100%)`,
                      border: `1px solid ${ind.glowColor}50`,
                      color: ind.glowColor,
                      fontSize: '22px'
                    }}
                  >
                    <i className={ind.icon}></i>
                  </div>
                  <div>
                    <h4 className="text-main mb-0" style={{ fontWeight: '700', fontSize: '18px' }}>
                      {ind.title}
                    </h4>
                  </div>
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }} className="mb-0">
                  {ind.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
