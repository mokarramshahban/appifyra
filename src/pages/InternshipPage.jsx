import React, { useState, useEffect } from 'react';
import CaptchaCheckbox from '../components/common/CaptchaCheckbox';
import { useAuth } from '../context/AuthContext';
import { saveInternshipApplication } from '../services/dbService';
import { sendAppReceivedEmail } from '../services/emailService';
import UserAvatar from '../components/common/UserAvatar';

export default function InternshipPage() {
  const { currentUser, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    duration: '45-Days',
    domain: 'Web Development',
    resumeUrl: '',
    message: ''
  });

  const [customDomain, setCustomDomain] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.displayName || prev.fullName,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setErrorAlert('Please sign in with Google first to verify your identity and apply.');
      return;
    }

    if (!isCaptchaVerified) {
      setErrorAlert('Please check "I\'m not a robot" to verify you are a human.');
      return;
    }

    const finalDomain = formData.domain === 'Other' ? (customDomain.trim() || 'Custom Domain') : formData.domain;

    setErrorAlert('');
    setIsSubmitting(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      degree: formData.degree,
      duration: formData.duration,
      domain: finalDomain,
      resumeUrl: formData.resumeUrl || '',
      message: formData.message || '',
      userUid: currentUser.uid
    };

    try {
      await saveInternshipApplication(payload);
      sendAppReceivedEmail({
        studentEmail: payload.email,
        studentName: payload.fullName,
        domain: finalDomain,
        duration: formData.duration
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Submission Error:', error);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const domains = [
    { title: 'Web Application Engineering', icon: 'fas fa-laptop-code', glow: '#38bdf8', desc: 'React.js, Node.js, Express, MongoDB, REST APIs & Live Deployment Pipelines' },
    { title: 'Mobile App Engineering', icon: 'fas fa-mobile-alt', glow: '#4ade80', desc: 'Flutter, React Native, Mobile UI Architecture, State Management & App Store Logic' },
    { title: 'Cloud Architecture & DevOps', icon: 'fas fa-cloud', glow: '#a855f7', desc: 'AWS Infrastructure, Docker Containers, Kubernetes & Automated CI/CD Pipelines' },
    { title: 'Data Analytics & BI Engineering', icon: 'fas fa-chart-bar', glow: '#f59e0b', desc: 'Python Data Pipelines, SQL Analytics, Business Dashboards & Predictive Modeling' },
    { title: 'UI/UX & Product Design', icon: 'fas fa-paint-brush', glow: '#ec4899', desc: 'Figma Systems, User Research, Interactive Wireframes & Visual Brand Identity' },
    { title: 'AI & Python Automation', icon: 'fas fa-robot', glow: '#6366f1', desc: 'OpenAI API Integration, Python Automation Bots, Data Scraping & ML Workflow' }
  ];

  const benefits = [
    { title: 'Verified Digital Certificate', icon: 'fas fa-certificate', color: '#4ade80', desc: 'Verifiable 24/7 on our public /verify registry with high-res PDF download.' },
    { title: 'Official LOR & NOC Signoff', icon: 'fas fa-file-alt', color: '#38bdf8', desc: 'Formal university documentation and recommendation letter for top performers.' },
    { title: 'Live Codebase Mentorship', icon: 'fas fa-user-tie', color: '#c084fc', desc: 'Direct 1-on-1 guidance from senior software engineers on production systems.' },
    { title: 'Placement & PPI Opportunity', icon: 'fas fa-briefcase', color: '#f59e0b', desc: 'Pre-Placement Interview (PPI) referrals for outstanding internship candidates.' }
  ];

  return (
    <div className="pt-140 pb-100 pos-rel">
      <div className="container">
        {/* ─── 1. HERO BANNER ────────────────────────────────────────────── */}
        <div className="sec-title--two sec-title--three text-center mb-60">
          <span 
            className="sub-title d-inline-flex align-items-center gap-2 px-3 py-2 mb-3"
            style={{
              backgroundColor: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '30px',
              color: '#4ade80',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <i className="fas fa-graduation-cap text-success"></i>
            <span>UNIVERSITY DEGREE & ACADEMIC ALIGNED</span>
          </span>

          <h1 
            className="title text-white" 
            style={{ 
              fontWeight: '800', 
              fontSize: '44px', 
              letterSpacing: '-1px' 
            }}
          >
            Bridge Academic Theory With Live Industrial Software
          </h1>

          <p className="content mt-3 mx-auto" style={{ maxWidth: '740px', color: '#94a3b8', fontSize: '16px', lineHeight: '1.7' }}>
            Gain real-world corporate experience, build production codebases alongside senior tech leads, and fulfill your university degree curriculum requirements with Appifyra's accredited internship programs.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <a href="#apply-form" className="btn btn-primary btn-glow-hover px-4 py-3" style={{ borderRadius: '12px', fontWeight: '700', boxShadow: '0 10px 25px rgba(67, 29, 171, 0.4)' }}>
              <i className="fas fa-edit me-2"></i> Apply for Internship Now
            </a>
            <a href="/verify" className="btn btn-outline-light btn-glow-hover px-4 py-3" style={{ borderRadius: '12px', fontWeight: '600' }}>
              <i className="fas fa-certificate me-2"></i> Verify Credentials Portal
            </a>
          </div>
        </div>

        {/* ─── 2. DURATION TRACK CARDS ────────────────────────────────────── */}
        <div className="row mb-80 g-4">
          <div className="col-lg-6">
            <div 
              className="p-4 p-md-5 pos-rel text-white h-100 d-flex flex-column justify-content-between interactive-hover-card"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 40, 26, 0.95) 100%)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge px-3 py-2" style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontSize: '13px', fontWeight: '700' }}>
                    SHORT-TERM / SUMMER
                  </span>
                  <span style={{ color: '#38bdf8', fontWeight: '800', fontSize: '22px' }}>45 Days</span>
                </div>
                <h3 className="text-white mb-3" style={{ fontWeight: '700' }}>45-Day Summer Internship</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.6' }} className="mb-4">
                  Tailored for college students during summer breaks or short academic project mandates. Build practical skills and receive an official Appifyra Certificate.
                </p>
                <ul className="list-unstyled text-white-50 mb-0" style={{ fontSize: '14px' }}>
                  <li className="mb-2"><i className="fas fa-check-circle text-info me-2"></i> Intensive hands-on module guidance</li>
                  <li className="mb-2"><i className="fas fa-check-circle text-info me-2"></i> Live production mini-project development</li>
                  <li className="mb-2"><i className="fas fa-check-circle text-info me-2"></i> Official Verified Completion Certificate</li>
                  <li><i className="fas fa-check-circle text-info me-2"></i> Letter of Recommendation (LOR) for top performers</li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-top border-secondary">
                <a href="#apply-form" className="btn btn-outline-info btn-glow-hover w-100 py-2" style={{ borderRadius: '10px', fontWeight: '600' }}>
                  Apply for 45-Day Program
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div 
              className="p-4 p-md-5 pos-rel text-white h-100 d-flex flex-column justify-content-between interactive-hover-card"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(192, 132, 252, 0.35)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(67, 29, 171, 0.4) 100%)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge px-3 py-2" style={{ backgroundColor: 'rgba(192, 132, 252, 0.2)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.4)', fontSize: '13px', fontWeight: '700' }}>
                    SEMESTER INDUSTRIAL
                  </span>
                  <span style={{ color: '#4ade80', fontWeight: '800', fontSize: '22px' }}>6 Months</span>
                </div>
                <h3 className="text-white mb-3" style={{ fontWeight: '700' }}>6-Month Industrial Training</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.6' }} className="mb-4">
                  Designed for final-year engineering students requiring full-semester industrial training. Work alongside senior engineers on live client production systems.
                </p>
                <ul className="list-unstyled text-white-50 mb-0" style={{ fontSize: '14px' }}>
                  <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Full software development lifecycle (SDLC) exposure</li>
                  <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Dedicated 1-on-1 mentorship by senior engineers</li>
                  <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Complete Industrial Training Certificate & NOC signoff</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i> Placement Assistance & Pre-Placement Interview (PPI) track</li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-top border-secondary">
                <a href="#apply-form" className="btn btn-outline-success btn-glow-hover w-100 py-2" style={{ borderRadius: '10px', fontWeight: '600' }}>
                  Apply for 6-Month Program
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. DOMAIN SPECIALIZATION GRID ─────────────────────────────── */}
        <div className="text-center mb-50">
          <span 
            className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-3"
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '30px',
              color: '#38bdf8',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            <i className="fas fa-layer-group"></i>
            <span>TECHNICAL TRACKS</span>
          </span>
          <h2 className="title text-white" style={{ fontWeight: '800', fontSize: '32px' }}>Available Internship Domains</h2>
        </div>

        <div className="row g-4 mb-80">
          {domains.map((d, idx) => (
            <div className="col-lg-4 col-md-6" key={idx}>
              <div 
                className="p-4 h-100 d-flex flex-column justify-content-between interactive-hover-card" 
                style={{
                  backgroundColor: 'rgba(15, 18, 41, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '18px',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div>
                  <div 
                    className="d-flex align-items-center justify-content-center mb-3 hover-icon-scale"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: `${d.glow}20`,
                      border: `1px solid ${d.glow}60`,
                      color: d.glow,
                      fontSize: '24px'
                    }}
                  >
                    <i className={d.icon} style={{ color: d.glow }}></i>
                  </div>
                  <h4 className="text-white mb-2" style={{ fontSize: '18px', fontWeight: '700' }}>{d.title}</h4>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }} className="mb-0">{d.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── 4. PROGRAM DELIVERABLES & BENEFITS ────────────────────────── */}
        <section className="program-benefits mb-80">
          <div className="p-4 p-md-5" style={{ backgroundColor: 'rgba(15, 18, 41, 0.8)', border: '1px solid rgba(174, 109, 254, 0.3)', borderRadius: '24px' }}>
            <div className="sec-title--two text-center mb-50">
              <h2 className="title text-white" style={{ fontWeight: '800', fontSize: '32px' }}>
                Program Deliverables & Candidate Benefits
              </h2>
            </div>
            <div className="row g-4">
              {benefits.map((b, idx) => (
                <div className="col-lg-3 col-md-6" key={idx}>
                  <div className="p-3 text-center interactive-hover-card" style={{ borderRadius: '16px' }}>
                    <i className={`${b.icon} mb-3 hover-icon-scale d-inline-block`} style={{ fontSize: '34px', color: b.color }}></i>
                    <h5 className="text-white mb-2" style={{ fontWeight: '700' }}>{b.title}</h5>
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }} className="mb-0">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. APPLICATION FORM BOX ───────────────────────────────────── */}
        <div className="row justify-content-center" id="apply-form">
          <div className="col-lg-9">
            <div 
              className="p-4 p-md-5 text-white"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(103, 128, 210, 0.3)',
                background: 'linear-gradient(180deg, rgba(9, 5, 54, 0.95) 0%, rgba(1, 3, 21, 0.98) 100%)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
            >
              <div className="text-center mb-4">
                <span className="badge bg-primary px-3 py-2 mb-2" style={{ fontSize: '13px', fontWeight: '700' }}>
                  <i className="fas fa-check-circle me-1"></i> VERIFIED APPLICATION FORM
                </span>
                <h3 className="text-white" style={{ fontWeight: '800', fontSize: '28px' }}>Apply for Internship</h3>
                <p className="text-muted" style={{ fontSize: '14px' }}>Authentic identity verification required via Google Sign-In to prevent spam.</p>
              </div>

              {/* Login Banner when Logged Out */}
              {!currentUser && (
                <div 
                  className="p-4 mb-4 text-center"
                  style={{
                    backgroundColor: 'rgba(67, 29, 171, 0.25)',
                    border: '1px solid rgba(174, 109, 254, 0.4)',
                    borderRadius: '16px'
                  }}
                >
                  <i className="fab fa-google mb-2" style={{ fontSize: '36px', color: '#ae6dfe' }}></i>
                  <h5 className="text-white fw-bold">Google Sign-In Required</h5>
                  <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                    Sign in with your Google account to verify your identity and unlock the application form.
                  </p>
                  <button 
                    onClick={loginWithGoogle}
                    className="btn btn-primary btn-glow-hover px-4 py-2"
                    style={{ background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)', border: 'none', borderRadius: '10px', fontWeight: '700' }}
                  >
                    <i className="fab fa-google me-2"></i> Sign In with Google to Apply
                  </button>
                </div>
              )}

              {/* Verified User Badge when Logged In */}
              {currentUser && (
                <div className="d-flex align-items-center justify-content-between p-3 mb-4" style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '12px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <UserAvatar name={currentUser.displayName || currentUser.email} size={40} borderColor="#4ade80" />
                    <div>
                      <div className="text-white" style={{ fontWeight: '600', fontSize: '15px' }}>{currentUser.displayName}</div>
                      <div style={{ color: '#4ade80', fontSize: '13px' }}><i className="fas fa-check-circle me-1"></i> Google Verified Account ({currentUser.email})</div>
                    </div>
                  </div>
                  <span className="badge bg-success">Authenticated</span>
                </div>
              )}

              {submitted ? (
                <div 
                  className="p-4 text-center"
                  style={{
                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.4)',
                    borderRadius: '16px'
                  }}
                >
                  <i className="fas fa-check-circle mb-3" style={{ fontSize: '48px', color: '#4ade80' }}></i>
                  <h4 className="text-white">Application Submitted Successfully!</h4>
                  <p className="text-muted" style={{ maxWidth: '500px', margin: '10px auto 0' }}>
                    Thank you, <strong>{formData.fullName}</strong>. Your application has been saved to your dashboard and submitted to our team. Track your status on <a href="/dashboard" style={{ color: '#38bdf8' }}>My Dashboard</a>.
                  </p>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setIsCaptchaVerified(false);
                    }}
                    className="btn btn-outline-light mt-4"
                    style={{ borderRadius: '8px' }}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ opacity: currentUser ? 1 : 0.6 }}>
                  {errorAlert && (
                    <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '14px', borderRadius: '8px' }}>
                      <i className="fas fa-exclamation-circle me-2"></i>{errorAlert}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Full Name (Google Verified) *</label>
                      <input 
                        type="text" 
                        name="fullName"
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={!currentUser}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Email Address (Google Verified) *</label>
                      <input 
                        type="email" 
                        name="email"
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={!currentUser}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Phone / WhatsApp Number *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={!currentUser}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>University / College Name *</label>
                      <input 
                        type="text" 
                        name="college"
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.college}
                        onChange={handleChange}
                        required
                        disabled={!currentUser}
                        placeholder="XYZ Institute of Technology"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Degree / Branch *</label>
                      <input 
                        type="text" 
                        name="degree"
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        disabled={!currentUser}
                        placeholder="B.Tech Computer Science / BCA / MCA"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Internship Duration *</label>
                      <select 
                        name="duration"
                        className="form-select text-white"
                        style={{ backgroundColor: '#090536', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        disabled={!currentUser}
                      >
                        <option value="45-Days">45-Day Summer Internship</option>
                        <option value="6-Months">6-Month Semester Industrial Training</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Target Domain *</label>
                      <select 
                        name="domain"
                        className="form-select text-white"
                        style={{ backgroundColor: '#090536', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.domain}
                        onChange={handleChange}
                        required
                        disabled={!currentUser}
                      >
                        {domains.map((d, i) => (
                          <option value={d.title} key={i}>{d.title}</option>
                        ))}
                        <option value="Other">Other (Specify Manually)</option>
                      </select>
                    </div>

                    {/* Manual Custom Domain Specification Box */}
                    {formData.domain === 'Other' && (
                      <div className="col-md-6">
                        <label className="form-label text-warning" style={{ fontSize: '13px', fontWeight: '600' }}>
                          <i className="fas fa-edit me-1"></i> Specify Custom Target Domain *
                        </label>
                        <input 
                          type="text" 
                          className="form-control text-white"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(174, 109, 254, 0.5)', borderRadius: '10px' }}
                          placeholder="e.g. Cyber Security, AI/ML, Blockchain..."
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          required
                          disabled={!currentUser}
                        />
                      </div>
                    )}

                    <div className="col-md-6">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Resume Link / Portfolio (Optional)</label>
                      <input 
                        type="url" 
                        name="resumeUrl"
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.resumeUrl}
                        onChange={handleChange}
                        disabled={!currentUser}
                        placeholder="Google Drive link / LinkedIn URL"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted" style={{ fontSize: '13px' }}>Additional Message / Academic Notes</label>
                      <textarea 
                        name="message"
                        rows="3"
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={!currentUser}
                        placeholder="Mention any specific university training dates or requirements..."
                      ></textarea>
                    </div>

                    {/* Captcha Checkbox */}
                    <div className="col-12 mt-3">
                      <CaptchaCheckbox 
                        isVerified={isCaptchaVerified} 
                        setIsVerified={setIsCaptchaVerified} 
                      />
                    </div>

                    <div className="col-12 text-center mt-2">
                      {currentUser ? (
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="btn btn-lg w-100 btn-glow-hover"
                          style={{
                            background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
                            color: '#fff',
                            fontWeight: '700',
                            padding: '14px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(67, 29, 171, 0.4)'
                          }}
                        >
                          {isSubmitting ? (
                            <span><i className="fas fa-spinner fa-spin me-2"></i> Submitting Application...</span>
                          ) : (
                            <span>Submit Application</span>
                          )}
                        </button>
                      ) : (
                        <button 
                          type="button" 
                          onClick={loginWithGoogle}
                          className="btn btn-lg w-100 btn-secondary"
                          style={{ borderRadius: '12px', padding: '14px', fontWeight: '700' }}
                        >
                          <i className="fab fa-google me-2"></i> Please Sign In with Google First
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
