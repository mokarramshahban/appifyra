import React from 'react';
import ServicesSection from '../components/sections/ServicesSection';
import IndustriesSection from '../components/sections/IndustriesSection';
import ContactSection from '../components/sections/ContactSection';
import { Link } from 'react-router-dom';

export default function ServicesPage() {
  const serviceDetails = [
    {
      badge: 'WEB & MOBILE',
      title: 'Web & Mobile Development',
      desc: 'We build high-performance, scalable web apps and cross-platform mobile solutions using modern tech stacks like React, Next.js, Node.js, and Flutter.',
      highlights: [
        'Custom Single & Multi-Page Web Apps',
        'Cross-Platform iOS & Android Apps',
        'API Integration & Scalable Backend',
        'SEO & Performance Optimization'
      ]
    },
    {
      badge: 'INFRASTRUCTURE',
      title: 'Cloud & DevOps Solutions',
      desc: 'Architecting secure, cost-effective cloud solutions on AWS and modern hosting providers with automated CI/CD deployment pipelines.',
      highlights: [
        'Cloud Infrastructure & Migration',
        'Docker & Kubernetes Containerization',
        'Automated CI/CD Pipelines',
        '24/7 Monitoring & Backup Recovery'
      ]
    },
    {
      badge: 'CREATIVE & BRANDING',
      title: 'Graphic Design & Video Editing',
      desc: 'Transforming brand vision into compelling visual graphics, UI/UX designs, motion animations, and high-impact promo video edits.',
      highlights: [
        'Brand Identity & Logo Design',
        'Figma UI/UX Prototypes',
        'Infographics & Pitch Decks',
        'Commercial & Social Video Editing'
      ]
    },
    {
      badge: 'BUSINESS INTELLIGENCE',
      title: 'Data Analytics & AI',
      desc: 'Unlocking actionable business insights through predictive modeling, data cleaning, automated reporting, and custom dashboard visualizations.',
      highlights: [
        'Data Pipeline & Cleaning',
        'Interactive BI Dashboards',
        'Predictive Analytics & Forecasting',
        'AI/ML Workflows & Integrations'
      ]
    }
  ];

  return (
    <div className="pt-140 pb-60 pos-rel">
      {/* Services Header Banner */}
      <div className="container">
        <div className="sec-title--two sec-title--three text-center mb-60">
          <span className="sub-title wow fadeInDown" data-wow-duration="600ms">
            <img src="/assets/img/icon/ser_layer.svg" alt="Services Layer" />
            <span>End-to-End Digital Solutions</span>
          </span>
          <h2 className="title wow fadeInDown" data-wow-duration="600ms">
            Services Designed to Scale Your Business
          </h2>
          <p className="content mt-15" style={{ maxWidth: '720px', margin: '0 auto', color: '#9da1b4' }}>
            From custom web and mobile applications to cloud infrastructure and visual branding, Appifyra delivers tailored technology solutions engineered for growth.
          </p>
        </div>

        {/* Main Services Section */}
        <ServicesSection />

        {/* Detailed Solutions Grid */}
        <div className="pt-80 pb-60">
          <div className="sec-title--two sec-title--three text-center mb-50">
            <h3 className="title text-white" style={{ fontSize: '32px' }}>Why Choose Appifyra For Your Project</h3>
          </div>

          <div className="row g-4">
            {serviceDetails.map((detail, idx) => (
              <div className="col-lg-6" key={idx}>
                <div 
                  className="p-4 p-md-5 h-100 pos-rel text-white"
                  style={{
                    borderRadius: '24px',
                    border: '1px solid rgba(103, 128, 210, 0.25)',
                    background: 'linear-gradient(135deg, rgba(9, 5, 54, 0.8) 0%, rgba(1, 3, 21, 0.95) 100%)'
                  }}
                >
                  <span className="badge px-3 py-2 mb-3" style={{ backgroundColor: 'rgba(174, 109, 254, 0.15)', color: '#c084fc', border: '1px solid rgba(174, 109, 254, 0.3)', fontSize: '12px' }}>
                    {detail.badge}
                  </span>
                  <h4 className="text-white mb-3" style={{ fontWeight: '700', fontSize: '24px' }}>{detail.title}</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>{detail.desc}</p>
                  
                  <div className="pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <ul className="list-unstyled row g-2 mb-0">
                      {detail.highlights.map((h, i) => (
                        <li className="col-md-6 text-white-50" style={{ fontSize: '14px' }} key={i}>
                          <i className="fas fa-check-circle text-primary me-2"></i> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div 
            className="p-4 p-md-5 mt-60 text-center text-white pos-rel"
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
              boxShadow: '0 20px 40px rgba(67, 29, 171, 0.3)'
            }}
          >
            <h3 className="text-white mb-2" style={{ fontWeight: '700' }}>Have a custom project in mind?</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: '600px', margin: '0 auto 24px' }}>
              Our team of senior engineers and designers is ready to transform your ideas into scalable software products.
            </p>
            <Link to="/contact" className="btn btn-light px-4 py-3 font-weight-bold" style={{ borderRadius: '12px', color: '#431DAB', fontWeight: '700' }}>
              Request a Free Consultation <i className="far fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>

        {/* Industries Section */}
        <IndustriesSection />

        {/* Contact Section */}
        <ContactSection />
      </div>
    </div>
  );
}
