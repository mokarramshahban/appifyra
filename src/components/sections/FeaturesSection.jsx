import React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      id: '01',
      icon: '/assets/img/icon/frature-icon01.png',
      title: 'Custom Web Development',
      content: 'We engineer dynamic, user-centric web applications built with React, Next.js, and Node.js for maximum performance.',
      tags: ['React.js', 'Next.js', 'REST APIs'],
      glow: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: '02',
      icon: '/assets/img/icon/frature-icon02.png',
      title: 'Mobile App Solutions',
      content: 'From ideation to App Store deployment, we deliver cross-platform Flutter and iOS/Android mobile applications.',
      tags: ['Flutter', 'iOS & Android', 'Dart'],
      glow: 'rgba(236, 72, 153, 0.15)'
    },
    {
      id: '03',
      icon: '/assets/img/icon/frature-icon03.png',
      title: 'Cloud Integration & DevOps',
      content: 'Leverage secure AWS cloud infrastructure, containerized Docker deployments, and automated CI/CD pipelines.',
      tags: ['AWS Cloud', 'Docker', 'CI/CD'],
      glow: 'rgba(168, 85, 247, 0.15)'
    },
    {
      id: '04',
      icon: '/assets/img/icon/frature-icon04.png',
      title: 'Data Intelligence & Analytics',
      content: 'Transform your raw business data into real-time BI dashboards and actionable machine learning insights.',
      tags: ['Python AI', 'BI Analytics', 'ML'],
      glow: 'rgba(74, 222, 128, 0.15)'
    }
  ];

  return (
    <section className="cs-feature pos-rel pt-100 pb-80 z-1" style={{ backgroundColor: '#010315' }}>
      <div className="container">
        {/* Section Header */}
        <div className="sec-title--two sec-title--three text-center mb-50">
          <span className="sub-title">
            <img src="/assets/img/icon/magic02.svg" alt="Magic Icon" style={{ width: '16px', marginRight: '6px' }} />
            <span>ENGINEERING EXCELLENCE</span>
          </span>
          <h2 className="title text-white mb-2" style={{ fontWeight: '800' }}>Engineered for Performance & Scalability</h2>
          <p className="content mt-15" style={{ maxWidth: '680px', margin: '0 auto', color: '#9da1b4', fontSize: '15px' }}>
            Our core technology Pillars drive digital transformation for startups, enterprises, and university students worldwide.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {features.map((feature, idx) => (
            <div className="col-lg-3 col-md-6" key={idx}>
              <div 
                className="service-hover-card p-4 h-100 pos-rel d-flex flex-column justify-content-between text-white"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  boxShadow: `0 10px 30px ${feature.glow}`
                }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div 
                      className="service-icon-box p-3 d-flex align-items-center justify-content-center"
                      style={{
                        borderRadius: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        width: '56px',
                        height: '56px'
                      }}
                    >
                      <img src={feature.icon} alt={feature.title} style={{ height: '32px' }} />
                    </div>
                    <span className="font-monospace text-muted" style={{ fontSize: '18px', fontWeight: '700' }}>{feature.id}</span>
                  </div>

                  <h3 className="text-white mb-3" style={{ fontSize: '19px', fontWeight: '700', lineHeight: '1.3' }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted mb-4" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    {feature.content}
                  </p>
                </div>

                <div className="d-flex flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {feature.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      style={{
                        backgroundColor: 'rgba(103, 128, 210, 0.12)',
                        color: '#a5b4fc',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        border: '1px solid rgba(165, 180, 252, 0.2)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
