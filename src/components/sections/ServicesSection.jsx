import React from 'react';
import { Link } from 'react-router-dom';

export default function ServicesSection() {
  const services = [
    {
      id: '01',
      title: 'Full-Stack Web Engineering',
      content: 'High-performance React, Next.js, and Node.js web applications engineered for speed, enterprise scalability, and flawless user experiences.',
      tags: ['React.js', 'Next.js', 'Node.js', 'REST APIs'],
      icon: '/assets/img/icon/airdrop-white.svg',
      glow: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: '02',
      title: 'Cross-Platform Mobile Apps',
      content: 'Native-feel Flutter and React Native mobile applications crafted for iOS & Android with buttery-smooth 60fps animations.',
      tags: ['Flutter', 'iOS & Android', 'Dart', 'UI/UX'],
      icon: '/assets/img/icon/finger-scan.svg',
      glow: 'rgba(236, 72, 153, 0.15)'
    },
    {
      id: '03',
      title: 'Cloud Architecture & DevOps',
      content: 'AWS cloud infrastructure, Docker container orchestration, automated CI/CD deployment pipelines, and zero-downtime monitoring.',
      tags: ['AWS Cloud', 'Docker', 'CI/CD Pipelines', 'Security'],
      icon: '/assets/img/icon/cloud-add.svg',
      glow: 'rgba(168, 85, 247, 0.15)'
    },
    {
      id: '04',
      title: 'Data Intelligence & AI Solutions',
      content: 'Python data science pipelines, real-time BI dashboards, predictive machine learning models, and automated business analytics.',
      tags: ['Python AI', 'BI Dashboards', 'Data Science', 'ML'],
      icon: '/assets/img/icon/ranking.svg',
      glow: 'rgba(249, 115, 22, 0.15)'
    },
    {
      id: '05',
      title: 'UI/UX & Product Design Systems',
      content: 'Figma design systems, high-fidelity interactive prototypes, user journey mapping, and conversion-focused visual branding.',
      tags: ['Figma', 'UI/UX Design', 'Design Systems', 'Branding'],
      icon: '/assets/img/icon/magic02.svg',
      glow: 'rgba(74, 222, 128, 0.15)'
    },
    {
      id: '06',
      title: 'Digital Marketing & Growth',
      content: 'Data-driven SEO strategies, performance marketing, content funnel optimization, and automated conversion analytics.',
      tags: ['SEO', 'Growth Hacking', 'Performance Ads', 'Analytics'],
      icon: '/assets/img/icon/edit.svg',
      glow: 'rgba(250, 204, 21, 0.15)'
    }
  ];

  return (
    <section id="services" className="service service-style-two service-style-three pt-120 pb-100 pos-rel">
      <div className="container">
        <div className="sec-title--two sec-title--three text-center mb-60">
          <span className="sub-title">
            <img src="/assets/img/icon/edit.svg" alt="Edit Icon" style={{ width: '16px', marginRight: '6px' }} />
            <span>ENTERPRISE DIGITAL SOLUTIONS</span>
          </span>
          <h2 className="title text-white mb-2" style={{ fontWeight: '800' }}>Our Engineering & Creative Capabilities</h2>
          <p className="content mt-15" style={{ maxWidth: '680px', margin: '0 auto', color: '#9da1b4', fontSize: '15px' }}>
            We design, engineer, and scale modern web applications, mobile products, and cloud infrastructure tailored to elevate your business.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {services.map((s) => (
            <div className="col-lg-4 col-md-6" key={s.id}>
              <div 
                className="service-hover-card p-4 p-md-5 h-100 pos-rel d-flex flex-column justify-content-between text-white"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  boxShadow: `0 10px 30px ${s.glow}`
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
                        width: '54px',
                        height: '54px'
                      }}
                    >
                      <img src={s.icon} alt={s.title} style={{ height: '28px' }} />
                    </div>
                    <span className="font-monospace text-muted" style={{ fontSize: '20px', fontWeight: '700' }}>{s.id}</span>
                  </div>

                  <h3 className="text-white mb-3" style={{ fontSize: '20px', fontWeight: '700' }}>{s.title}</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>{s.content}</p>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {s.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        style={{
                          backgroundColor: 'rgba(103, 128, 210, 0.15)',
                          color: '#a5b4fc',
                          padding: '4px 12px',
                          borderRadius: '14px',
                          fontSize: '12px',
                          border: '1px solid rgba(165, 180, 252, 0.2)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to="/services" className="service-arrow-icon text-white d-flex align-items-center gap-2" style={{ fontWeight: '600', fontSize: '14px', color: '#ae6dfe' }}>
                  <span>Explore Service</span>
                  <i className="far fa-arrow-right" style={{ fontSize: '12px' }}></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
