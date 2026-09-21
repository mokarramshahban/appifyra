import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AboutSection from '../components/sections/AboutSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowWeWorkSection from '../components/sections/HowWeWorkSection';
import ContactSection from '../components/sections/ContactSection';
import BrandMarquee from '../components/sections/BrandMarquee';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const stats = [
    { number: '50+', label: 'Enterprise & Client Projects', icon: 'fas fa-laptop-code', color: 'var(--color-success)' },
    { number: '1,200+', label: 'Certified Internship Graduates', icon: 'fas fa-graduation-cap', color: 'var(--color-success)' },
    { number: '99.8%', label: 'On-Time Production Deployment', icon: 'fas fa-shield-check', color: 'var(--color-primary-light)' },
    { number: '24/7', label: 'Dedicated Support & Maintenance', icon: 'fas fa-headset', color: '#f59e0b' }
  ];

  const techStack = [
    { name: 'React.js & Next.js', category: 'Frontend Mastery', icon: 'fab fa-react', color: '#61dafb' },
    { name: 'Flutter & React Native', category: 'Mobile Applications', icon: 'fas fa-mobile-screen-button', color: 'var(--color-success)' },
    { name: 'Node.js & Express', category: 'Backend Systems', icon: 'fab fa-node-js', color: 'var(--color-success)' },
    { name: 'MongoDB & PostgreSQL', category: 'Database Systems', icon: 'fas fa-database', color: '#a855f7' },
    { name: 'AWS & Docker DevOps', category: 'Cloud Infrastructure', icon: 'fab fa-aws', color: '#f59e0b' },
    { name: 'AI & Python Automation', category: 'Machine Learning', icon: 'fab fa-python', color: '#ec4899' }
  ];

  const pillars = [
    {
      title: 'Enterprise Software & IT Services',
      icon: 'fas fa-laptop-code',
      glow: 'var(--color-success)',
      desc: 'We engineer custom web applications, native mobile apps, cloud architecture, and AI integrations designed for high-scale enterprise performance.'
    },
    {
      title: 'Industrial Internship & Skill Academy',
      icon: 'fas fa-graduation-cap',
      glow: 'var(--color-success)',
      desc: 'We bridge the academia-industry gap by equipping candidates with hands-on production codebase experience, mentorship, and verified credentials.'
    },
    {
      title: 'UI/UX & Product Experience Design',
      icon: 'fas fa-palette',
      glow: 'var(--color-primary-light)',
      desc: 'We craft human-centric interfaces, interactive prototypes, and modern design systems that captivate users and elevate brand equity.'
    }
  ];

  const timeline = [
    { year: '2023', title: 'Enterprise IT Agency Founded', desc: 'Appifyra launched as a specialized IT consulting firm building high-performance web applications.' },
    { year: '2024', title: 'Industrial Internship Program Launched', desc: 'Introduced 45-Day and 6-Month hands-on internship programs to empower ambitious engineering students.' },
    { year: '2025', title: '1,000+ Verified Graduates', desc: 'Expanded training domain verticals into Cloud DevOps, Full-Stack Node.js, and Mobile Engineering.' },
    { year: '2026', title: 'AI Integration & Next-Gen Cloud Scaling', desc: 'Pioneered custom AI model integrations and automated cloud infrastructure for global clients.' }
  ];

  const faqs = [
    {
      q: 'What makes Appifyra different from traditional software agencies?',
      a: 'We operate a dual-powerhouse model: engineering production-grade software for global corporate clients while simultaneously training elite talent on real live codebases.'
    },
    {
      q: 'How does Appifyra verify internship certificates?',
      a: 'Every issued certificate carries a unique serial ID registered in our live MongoDB database, verifiable 24/7 on our public /verify portal with downloadable PDF credentials.'
    },
    {
      q: 'Can corporate clients request custom software development & NDA terms?',
      a: 'Yes, we execute formal Non-Disclosure Agreements (NDAs), provide dedicated project managers, and deliver fully IP-transferred, production-deployed codebases.'
    },
    {
      q: 'What technologies do candidates work on during the internship?',
      a: 'Candidates build production projects in React, Node.js, Express, MongoDB, Flutter, Python AI integrations, Docker, and AWS Cloud deployments.'
    }
  ];

  return (
    <div className="pt-140 pb-100 pos-rel w-full min-h-screen bg-slate-50 dark:bg-[#060813]">
      {/* ─── 1. ABOUT HERO BANNER ────────────────────────────────────────── */}
      <section className="about-hero mb-80">
        <div className="container">
          <div className="text-center mx-auto" style={{ maxWidth: '840px' }}>
            <span 
              className="sub-title d-inline-flex align-items-center gap-2 px-3 py-2 mb-3 !bg-purple-100 !text-purple-900 border border-purple-200 dark:!bg-purple-900/30 dark:!text-purple-300 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4"
              style={{
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-sparkles text-primary"></i>
              <span>ABOUT APPIFYRA IT SERVICES & TRAINING</span>
            </span>

            <h1 
              className="text-main mb-4" 
              style={{ 
                fontWeight: '800', 
                fontSize: '48px', 
                letterSpacing: '-1px',
                lineHeight: '1.2'
              }}
            >
              Architecting Digital Futures & Empowering Tech Pioneers
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', lineHeight: '1.7' }} className="mb-4">
              Appifyra is a modern IT consultancy and industrial skill academy. We deliver high-scale enterprise web applications, mobile platforms, and cloud DevOps while training the next generation of engineers on live production software.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/contact" className="btn bg-blue-600 text-white hover:bg-blue-700 shadow-md dark:bg-blue-600/80 font-semibold px-4 py-3" style={{ borderRadius: '12px', fontWeight: '700',  }}>
                <i className="fas fa-paper-plane me-2"></i> Partner With Us
              </Link>
              <Link to="/internship" className="btn btn-outline-light px-4 py-3" style={{ borderRadius: '12px', fontWeight: '600' }}>
                <i className="fas fa-graduation-cap me-2"></i> Explore Internships
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. BRAND MARQUEE ───────────────────────────────────────────── */}
      <div className="mb-80">
        <BrandMarquee />
      </div>

      {/* ─── 3. MISSION & VISION DUAL GLASS CARDS ───────────────────────── */}
      <section className="mission-vision mb-100">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div 
                className="p-4 p-md-5 h-100 text-main pos-rel bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ borderRadius: '24px',
                  
                  backdropFilter: 'blur(16px)',
                   }}
              >
                <div 
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'var(--card-bg)',
                    
                    color: 'var(--color-success)',
                    fontSize: '26px'
                  }}
                >
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3 className="text-main mb-3" style={{ fontWeight: '700' }}>Our Core Mission</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.7' }} className="mb-0">
                  To accelerate business success by crafting secure, scalable software solutions while bridging the academic-industry gap by equipping engineering candidates with authentic production experience.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div 
                className="p-4 p-md-5 h-100 text-main pos-rel bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ borderRadius: '24px',
                  
                  backdropFilter: 'blur(16px)',
                   }}
              >
                <div 
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'var(--card-bg)',
                    
                    color: 'var(--color-primary-light)',
                    fontSize: '26px'
                  }}
                >
                  <i className="fas fa-eye"></i>
                </div>
                <h3 className="text-main mb-3" style={{ fontWeight: '700' }}>Our Global Vision</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.7' }} className="mb-0">
                  To stand as a global benchmark for software engineering craftsmanship and talent transformation—empowering enterprises to innovate faster and developers to build thriving tech careers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. THREE CORPORATE PILLARS ─────────────────────────────────── */}
      <section className="corporate-pillars mb-100">
        <div className="container">
          <div className="sec-title--two text-center mb-60">
            <span 
              className="sub-title d-inline-flex align-items-center gap-2 px-3 py-2 mb-3 !bg-purple-100 !text-purple-900 border border-purple-200 dark:!bg-purple-900/30 dark:!text-purple-300 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4"
              style={{
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-layer-group"></i>
              <span>OUR CORE CAPABILITIES</span>
            </span>
            <h2 className="title text-main" style={{ fontWeight: '800', fontSize: '36px' }}>
              What Drives Appifyra Forward
            </h2>
          </div>

          <div className="row g-4">
            {pillars.map((pil, idx) => (
              <div className="col-lg-4 col-md-6" key={idx}>
                <div 
                  className="p-4 p-md-5 h-100 text-main d-flex flex-column justify-content-between bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ borderRadius: '20px',
                    
                    backdropFilter: 'blur(16px)',
                     }}
                >
                  <div>
                    <div 
                      className="d-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: `radial-gradient(circle, ${pil.glow}30 0%, var(--section-bg) 100%)`,
                        
                        color: pil.glow,
                        fontSize: '24px'
                      }}
                    >
                      <i className={pil.icon}></i>
                    </div>
                    <h4 className="text-main mb-3" style={{ fontWeight: '700', fontSize: '20px' }}>{pil.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6' }} className="mb-0">
                      {pil.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. IMPACT & ACHIEVEMENT METRICS ────────────────────────────── */}
      <section className="impact-metrics mb-100">
        <div className="container">
          <div className="row g-4">
            {stats.map((st, idx) => (
              <div className="col-lg-3 col-md-6" key={idx}>
                <div 
                  className="p-4 text-center text-main h-100"
                  style={{
                    borderRadius: '20px',
                    backgroundColor: 'var(--input-bg)',
                    
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className={`${st.icon} mb-3`} style={{ fontSize: '32px', color: st.color }}></i>
                  <h2 className="text-main mb-1" style={{ fontWeight: '800', fontSize: '38px', color: st.color }}>
                    {st.number}
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                    {st.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. MASTER TECHNOLOGY STACK ──────────────────────────────────── */}
      <section className="tech-stack mb-100">
        <div className="container">
          <div className="sec-title--two text-center mb-50">
            <span 
              className="sub-title d-inline-flex align-items-center gap-2 px-3 py-2 mb-3 !bg-purple-100 !text-purple-900 border border-purple-200 dark:!bg-purple-900/30 dark:!text-purple-300 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4"
              style={{
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-code"></i>
              <span>TECHNOLOGY ECOSYSTEM</span>
            </span>
            <h2 className="title text-main" style={{ fontWeight: '800', fontSize: '36px' }}>
              Built with Modern Cutting-Edge Stacks
            </h2>
          </div>

          <div className="row g-4">
            {techStack.map((tech, idx) => (
              <div className="col-lg-4 col-md-6" key={idx}>
                <div 
                  className="p-4 text-main d-flex align-items-center gap-3 h-100 bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ 
                    
                    borderRadius: '16px',
                    transition: 'all 0.3s ease' }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: `${tech.color}15`,
                      
                      color: tech.color,
                      fontSize: '22px'
                    }}
                  >
                    <i className={tech.icon}></i>
                  </div>
                  <div>
                    <h5 className="text-main mb-0" style={{ fontWeight: '700', fontSize: '16px' }}>{tech.name}</h5>
                    <span className="text-muted" style={{ fontSize: '12px' }}>{tech.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. MILESTONE TIMELINE ("OUR JOURNEY") ───────────────────────── */}
      <section className="timeline-section mb-100">
        <div className="container">
          <div className="sec-title--two text-center mb-60">
            <h2 className="title text-main" style={{ fontWeight: '800', fontSize: '36px' }}>
              Our Milestone Journey of Growth
            </h2>
          </div>

          <div className="row g-4">
            {timeline.map((item, idx) => (
              <div className="col-lg-3 col-md-6" key={idx}>
                <div 
                  className="p-4 text-main h-100 pos-rel"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    
                    borderRadius: '20px'
                  }}
                >
                  <span 
                    className="badge mb-3 px-3 py-2"
                    style={{
                      backgroundColor: 'var(--input-border)',
                      color: 'var(--color-primary-light)',
                      fontWeight: '800',
                      fontSize: '14px'
                    }}
                  >
                    {item.year}
                  </span>
                  <h4 className="text-main mb-2" style={{ fontWeight: '700', fontSize: '17px' }}>{item.title}</h4>
                  <p className="text-muted mb-0" style={{ fontSize: '13px', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. ABOUT DETAILED SECTION ───────────────────────────────────── */}
      <AboutSection />

      {/* ─── 9. INTERACTIVE FAQ ACCORDION ────────────────────────────────── */}
      <section className="faq-section mb-100">
        <div className="container">
          <div className="sec-title--two text-center mb-60">
            <h2 className="title text-main" style={{ fontWeight: '800', fontSize: '36px' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-muted mx-auto mt-2" style={{ maxWidth: '600px', fontSize: '14px' }}>
              Everything you need to know about our IT consultancy services and industrial internship program.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="d-flex flex-column gap-3">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="p-4 text-main bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ 
                      
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease' }}
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 className="text-main mb-0" style={{ fontWeight: '600', fontSize: '17px' }}>
                        {faq.q}
                      </h4>
                      <i className={`fas ${openFaq === idx ? 'fa-chevron-up text-primary' : 'fa-chevron-down text-muted'}`}></i>
                    </div>
                    {openFaq === idx && (
                      <p className="text-muted mt-3 mb-0" style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. FEATURES & HOW WE WORK ─────────────────────────────────── */}
      <FeaturesSection />
      <HowWeWorkSection />

      {/* ─── 11. CONTACT CALL TO ACTION ─────────────────────────────────── */}
      <ContactSection />
    </div>
  );
}
