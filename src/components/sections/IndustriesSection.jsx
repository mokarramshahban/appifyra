import React from 'react';

export default function IndustriesSection() {
  const industries = [
    { title: 'Fintech & Banking', icon: '/assets/img/icon/da-ser-icon01.png', desc: 'Secure payment processing, banking apps, and compliance solutions.' },
    { title: 'Healthcare & Biotech', icon: '/assets/img/icon/da-ser-icon02.png', desc: 'HIPAA-compliant platforms, patient portals, and telemetry data.' },
    { title: 'E-Commerce & Retail', icon: '/assets/img/icon/da-ser-icon03.png', desc: 'High-conversion storefronts, inventory syncing, and checkout.' },
    { title: 'Education & EdTech', icon: '/assets/img/icon/da-ser-icon04.png', desc: 'LMS platforms, student tracking, and interactive virtual learning.' }
  ];

  return (
    <section className="industries pt-100 pb-100 pos-rel bg_img" style={{ backgroundImage: 'url(/assets/img/bg/service_bg.png)' }}>
      <div className="container">
        <div className="sec-title--two sec-title--three text-center mb-60">
          <span className="sub-title">
            <img src="/assets/img/icon/airdrop01.svg" alt="Airdrop Icon" />
            <span>Industries We Serve</span>
          </span>
          <h2 className="title text-white">Tailored Solutions for Diverse Sectors</h2>
        </div>

        <div className="row g-4">
          {industries.map((ind, idx) => (
            <div className="col-lg-3 col-md-6" key={idx}>
              <div 
                className="p-4 text-white h-100"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px'
                }}
              >
                <div className="mb-3">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id={`grad-${idx}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#431DAB" />
                        <stop offset="100%" stopColor="#AE6DFE" />
                      </radialGradient>
                    </defs>
                    <circle cx="24" cy="24" r="22" fill={`url(#grad-${idx})`} opacity="0.3" />
                  </svg>
                </div>
                <h4 className="text-white mb-2" style={{ fontWeight: '600', fontSize: '18px' }}>{ind.title}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{ind.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
