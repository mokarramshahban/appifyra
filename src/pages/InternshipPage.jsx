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

  // Auto-fill Google verified credentials when logged in
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
      // 1. Save to MongoDB Database
      await saveInternshipApplication(payload);

      // 2. Send confirmation email to candidate via custom backend
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
    { title: 'Web Development', icon: '/assets/img/icon/airdrop-white.svg', desc: 'React, Node.js, HTML/CSS, REST APIs & Full Stack Project Work' },
    { title: 'App Development', icon: '/assets/img/icon/finger-scan.svg', desc: 'Flutter, Dart, Mobile UI/UX & Native App Architecture' },
    { title: 'Cloud & DevOps', icon: '/assets/img/icon/cloud-add.svg', desc: 'AWS Infrastructure, Docker, CI/CD Pipelines & Cloud Security' },
    { title: 'Data Analytics', icon: '/assets/img/icon/ranking.svg', desc: 'Python Data Science, Visualization, BI Dashboards & ML Basics' },
    { title: 'Graphic Design', icon: '/assets/img/icon/check02.svg', desc: 'Figma UI/UX, Brand Identity, Visual Illustrations & Motion' },
    { title: 'Video Editing', icon: '/assets/img/icon/magic02.svg', desc: 'Premiere Pro, After Effects, Social Media Cuts & Post-Production' }
  ];

  return (
    <div className="pt-140 pb-100 pos-rel">
      <div className="container">
        {/* Section Title */}
        <div className="sec-title--two sec-title--three text-center mb-60">
          <span className="sub-title wow fadeInDown" data-wow-duration="600ms">
            <img src="/assets/img/icon/cap.svg" alt="Graduation Cap" style={{ width: '18px', height: '18px', marginRight: '6px' }} />
            <span>University Degree Aligned</span>
          </span>
          <h2 className="title wow fadeInDown" data-wow-duration="600ms">
            Industry Internship & Training Programs
          </h2>
          <p className="content mt-15" style={{ maxWidth: '720px', margin: '0 auto', color: '#9da1b4' }}>
            Gain real-world corporate experience, work on production code bases, and fulfill your university degree curriculum requirements with Appifyra's verified internship tracks.
          </p>
        </div>

        {/* Duration Track Cards */}
        <div className="row mb-60 g-4">
          <div className="col-lg-6">
            <div 
              className="p-4 p-md-5 pos-rel text-white h-100"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(103, 128, 210, 0.4)',
                background: 'linear-gradient(135deg, rgba(67, 29, 171, 0.25) 0%, rgba(1, 3, 21, 0.95) 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge px-3 py-2" style={{ backgroundColor: '#431DAB', color: '#fff', fontSize: '13px' }}>
                  SHORT-TERM / SUMMER
                </span>
                <span style={{ color: '#ae6dfe', fontWeight: '700', fontSize: '20px' }}>45 Days</span>
              </div>
              <h3 className="text-white mb-3" style={{ fontWeight: '700' }}>45-Day Summer Internship</h3>
              <p className="text-muted mb-4">
                Tailored for college students during summer breaks or short academic project mandates. Build core practical skills and receive an official Appifyra Certificate.
              </p>
              <ul className="list-unstyled text-white-50 mb-0">
                <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Intensive hands-on module guidance</li>
                <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Live mini-project development</li>
                <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Official Verified Completion Certificate</li>
                <li><i className="fas fa-check-circle text-primary me-2"></i> Letter of Recommendation (LOR) for top performers</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div 
              className="p-4 p-md-5 pos-rel text-white h-100"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(174, 109, 254, 0.4)',
                background: 'linear-gradient(135deg, rgba(174, 109, 254, 0.15) 0%, rgba(1, 3, 21, 0.95) 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge px-3 py-2" style={{ backgroundColor: '#AE6DFE', color: '#000', fontSize: '13px', fontWeight: '700' }}>
                  SEMESTER INDUSTRIAL
                </span>
                <span style={{ color: '#4ade80', fontWeight: '700', fontSize: '20px' }}>6 Months</span>
              </div>
              <h3 className="text-white mb-3" style={{ fontWeight: '700' }}>6-Month Industrial Training</h3>
              <p className="text-muted mb-4">
                Designed for final-year engineering & degree students needing a full-semester industrial training. Work alongside senior engineers on live client production systems.
              </p>
              <ul className="list-unstyled text-white-50 mb-0">
                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Full software development lifecycle exposure</li>
                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Dedicated 1-on-1 mentorship by industry leads</li>
                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Complete Industrial Training Certificate & NOC signoff</li>
                <li><i className="fas fa-check-circle text-success me-2"></i> Placement Assistance & Pre-Placement Interview (PPI) opportunity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Domain Specialization Grid */}
        <div className="sec-title--two sec-title--three text-center mb-40 mt-80">
          <h3 className="title text-white" style={{ fontSize: '28px' }}>Available Internship Domains</h3>
        </div>
        <div className="row g-4 mb-80">
          {domains.map((d, idx) => (
            <div className="col-lg-4 col-md-6" key={idx}>
              <div 
                className="p-4 h-100" 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px'
                }}
              >
                <img src={d.icon} alt={d.title} style={{ height: '36px', marginBottom: '16px' }} />
                <h4 className="text-white mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>{d.title}</h4>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form Box */}
        <div className="row justify-content-center" id="apply-form">
          <div className="col-lg-9">
            <div 
              className="p-4 p-md-5 text-white"
              style={{
                borderRadius: '24px',
                border: '1px solid rgba(103, 128, 210, 0.3)',
                background: 'linear-gradient(180deg, rgba(9, 5, 54, 0.95) 0%, rgba(1, 3, 21, 0.98) 100%)'
              }}
            >
              <div className="text-center mb-4">
                <span className="badge bg-primary mb-2">VERIFIED APPLICATION FORM</span>
                <h3 className="text-white" style={{ fontWeight: '700' }}>Apply for Internship</h3>
                <p className="text-muted">Authentic identity verification required via Google Sign-In to prevent spam.</p>
              </div>

              {/* Login Banner when Logged Out */}
              {!currentUser && (
                <div 
                  className="p-4 mb-4 text-center"
                  style={{
                    backgroundColor: 'rgba(67, 29, 171, 0.2)',
                    border: '1px solid rgba(174, 109, 254, 0.4)',
                    borderRadius: '16px'
                  }}
                >
                  <i className="fab fa-google mb-2" style={{ fontSize: '32px', color: '#ae6dfe' }}></i>
                  <h5 className="text-white">Google Sign-In Required</h5>
                  <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                    Sign in with your Google account to verify your identity and unlock the application form.
                  </p>
                  <button 
                    onClick={loginWithGoogle}
                    className="btn btn-primary px-4 py-2"
                    style={{ background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)', border: 'none', borderRadius: '10px', fontWeight: '600' }}
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
                      <label className="form-label text-muted">Full Name (Google Verified) *</label>
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
                      <label className="form-label text-muted">Email Address (Google Verified) *</label>
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
                      <label className="form-label text-muted">Phone / WhatsApp Number *</label>
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
                      <label className="form-label text-muted">University / College Name *</label>
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
                      <label className="form-label text-muted">Degree / Branch *</label>
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
                      <label className="form-label text-muted">Internship Duration *</label>
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
                      <label className="form-label text-muted">Target Domain *</label>
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
                      <label className="form-label text-muted">Resume Link / Portfolio (Optional)</label>
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
                      <label className="form-label text-muted">Additional Message / Academic Notes</label>
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
                          className="btn btn-lg w-100"
                          style={{
                            background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
                            color: '#fff',
                            fontWeight: '700',
                            padding: '14px',
                            borderRadius: '12px'
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
