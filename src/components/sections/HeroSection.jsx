import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { saveInternshipApplication, saveContactInquiry } from '../../services/dbService';

export default function HeroSection() {
  const { currentUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Tab state: 'internship' or 'service'
  const [formTab, setFormTab] = useState('internship');

  // Internship Form State
  const [internshipForm, setInternshipForm] = useState({
    duration: '45-Days',
    domain: 'Web Development'
  });
  const [customDomain, setCustomDomain] = useState('');

  // Service Request Form State (No Pricing / No Budget)
  const [serviceForm, setServiceForm] = useState({
    serviceType: 'Web Application Development',
    timeline: '1 - 2 Weeks (Rapid Prototype)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      let activeUser = currentUser;
      if (!activeUser) {
        activeUser = await loginWithGoogle();
      }

      if (!activeUser) {
        setErrorMsg('Please sign in with Google to complete submission.');
        setIsSubmitting(false);
        return;
      }

      if (formTab === 'internship') {
        const finalDomain = internshipForm.domain === 'Other' ? (customDomain.trim() || 'Custom Domain') : internshipForm.domain;
        const payload = {
          fullName: activeUser.displayName || 'Applicant',
          email: activeUser.email || 'applicant@gmail.com',
          phone: 'Quick Applied via Homepage',
          college: 'Quick Applied via Homepage',
          degree: 'Undergraduate',
          duration: internshipForm.duration,
          domain: finalDomain,
          resumeUrl: '',
          message: 'Applied from Hero Quick Form',
          userUid: activeUser.uid || 'quick_user'
        };
        await saveInternshipApplication(payload);
      } else {
        const payload = {
          fullName: activeUser.displayName || 'Client',
          email: activeUser.email || 'client@gmail.com',
          phone: 'Quick Submitted via Homepage',
          subject: serviceForm.serviceType,
          serviceType: serviceForm.serviceType,
          message: serviceForm.message ? `${serviceForm.message} (Timeline: ${serviceForm.timeline})` : `Service inquiry for ${serviceForm.serviceType} (Timeline: ${serviceForm.timeline})`,
          userUid: activeUser.uid || 'client_user'
        };
        await saveContactInquiry(payload);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Quick Submit Error:', err);
      setErrorMsg('Could not submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="hero hero-style-two hero-style-three bg_img pos-rel overflow-hidden"
      style={{ 
        backgroundImage: 'url(/assets/img/bg/hero-bg03.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: '130px',
        paddingBottom: '50px'
      }}
    >
      {/* Dynamic Background Video Overlay */}
      <video
        src="/appifyra-hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.28,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      ></video>

      {/* Dark Gradient Mask Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(1, 3, 21, 0.4) 0%, rgba(1, 3, 21, 0.85) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      ></div>

      <div className="container pos-rel" style={{ zIndex: 2 }}>
        <div className="hero-inner">
          <div className="row justify-content-between g-4" style={{ alignItems: 'stretch' }}>
            {/* Left Column: Title & Messaging */}
            <div className="col-lg-6 d-flex flex-column">
              <div 
                className="hero-content d-flex flex-column justify-content-between h-100 py-2" 
                style={{ marginBottom: 0 }}
              >
                <div>
                  <div 
                    className="d-inline-flex align-items-center gap-2 px-3 py-2"
                    style={{
                      backgroundColor: 'rgba(174, 109, 254, 0.18)',
                      border: '1px solid rgba(174, 109, 254, 0.4)',
                      borderRadius: '30px',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <span className="badge bg-primary" style={{ fontSize: '11px', borderRadius: '15px' }}>NEW</span>
                    <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
                      🚀 Next-Gen IT Services & Verified University Training
                    </span>
                  </div>
                </div>

                <h1 className="title text-white my-3" style={{ fontWeight: '800', lineHeight: '1.2' }}>
                  Empowering Tech Innovation & Industry Training
                </h1>
                
                <p className="content text-white-50 my-2" style={{ fontSize: '17px', maxWidth: '580px', lineHeight: '1.6' }}>
                  Appifyra delivers enterprise-grade software development, cloud architecture, and degree-aligned industrial internship programs to shape the future of IT.
                </p>

                {/* Dual Action Buttons */}
                <div className="d-flex flex-wrap align-items-center gap-3 my-3">
                  <Link 
                    to="/services" 
                    className="btn btn-lg"
                    style={{
                      background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
                      color: '#fff',
                      fontWeight: '700',
                      padding: '14px 32px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(67, 29, 171, 0.4)'
                    }}
                  >
                    <span>Explore Our Services <i className="far fa-arrow-right ms-2"></i></span>
                  </Link>

                  <Link 
                    to="/internship" 
                    className="btn btn-lg btn-outline-light"
                    style={{
                      fontWeight: '600',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      borderColor: 'rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    <span><i className="far fa-user-graduate me-2" style={{ color: '#ae6dfe' }}></i> View All Programs</span>
                  </Link>
                </div>

                {/* Live Stats Strip */}
                <div 
                  className="row g-3 p-3 text-white mt-3 mb-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    maxWidth: '560px'
                  }}
                >
                  <div className="col-4 border-end border-secondary">
                    <div className="h3 text-white mb-0" style={{ fontWeight: '700', color: '#4ade80' }}>500+</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>Students Trained</div>
                  </div>
                  <div className="col-4 border-end border-secondary">
                    <div className="h3 text-white mb-0" style={{ fontWeight: '700', color: '#ae6dfe' }}>100+</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>Projects Shipped</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 text-white mb-0" style={{ fontWeight: '700', color: '#38bdf8' }}>100%</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>Verifiable Certs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Application / Inquiry Form Box with Dual Tabs */}
            <div className="col-lg-6 d-flex flex-column">
              <div 
                className="p-4 p-md-5 text-white pos-rel h-100 d-flex flex-column justify-content-between mb-0"
                style={{
                  borderRadius: '24px',
                  border: '1px solid rgba(174, 109, 254, 0.4)',
                  backgroundColor: 'rgba(9, 5, 54, 0.88)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
                }}
              >
                <div>
                  {/* Form Mode Selector Tabs */}
                  <div className="d-flex gap-2 p-1 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <button
                      type="button"
                      className={`btn flex-fill py-2 btn-sm ${formTab === 'internship' ? 'btn-primary' : 'btn-link text-white-50 text-decoration-none'}`}
                      style={{ borderRadius: '10px', fontWeight: '600', fontSize: '13px' }}
                      onClick={() => { setFormTab('internship'); setSubmitted(false); }}
                    >
                      <i className="fas fa-graduation-cap me-1"></i> Student Internship
                    </button>
                    <button
                      type="button"
                      className={`btn flex-fill py-2 btn-sm ${formTab === 'service' ? 'btn-primary' : 'btn-link text-white-50 text-decoration-none'}`}
                      style={{ borderRadius: '10px', fontWeight: '600', fontSize: '13px', backgroundColor: formTab === 'service' ? '#7541c8' : 'transparent', borderColor: 'transparent' }}
                      onClick={() => { setFormTab('service'); setSubmitted(false); }}
                    >
                      <i className="fas fa-briefcase me-1"></i> Client Service Request
                    </button>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-primary px-3 py-1" style={{ borderRadius: '8px', fontSize: '11px' }}>
                      {formTab === 'internship' ? 'QUICK APPLY' : 'SERVICE INQUIRY'}
                    </span>
                    <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>
                      <i className="fas fa-check-circle me-1"></i> {formTab === 'internship' ? 'Open Enrollments' : 'Fast Response (24h)'}
                    </span>
                  </div>

                  <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>
                    {formTab === 'internship' ? 'Apply for Internship' : 'Hire Us for Your Project'}
                  </h3>
                  <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                    {formTab === 'internship' 
                      ? 'Select your track and domain to get instant confirmation and dashboard access.'
                      : 'Tell us about your project or development needs for a custom quote.'}
                  </p>
                </div>

                {submitted ? (
                  <div className="p-4 text-center my-auto" style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', borderRadius: '16px', border: '1px solid rgba(74, 222, 128, 0.4)' }}>
                    <i className="fas fa-check-circle mb-3" style={{ fontSize: '42px', color: '#4ade80' }}></i>
                    <h4 className="text-white">
                      {formTab === 'internship' ? 'Application Received!' : 'Service Request Received!'}
                    </h4>
                    <p className="text-muted mt-2" style={{ fontSize: '14px' }}>
                      {formTab === 'internship'
                        ? 'Your application has been saved. A confirmation email was sent to your inbox!'
                        : 'We have received your service request. Our engineering lead will contact you within 24h!'}
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)} 
                      className="btn btn-outline-light mt-2"
                      style={{ borderRadius: '8px', fontSize: '13px' }}
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-between flex-grow-1">
                    {errorMsg && (
                      <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '13px', borderRadius: '8px' }}>
                        {errorMsg}
                      </div>
                    )}

                    {formTab === 'internship' ? (
                      /* Student Internship Form Fields */
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label text-muted mb-1" style={{ fontSize: '13px' }}>Program Track *</label>
                          <select 
                            className="form-select text-white"
                            style={{ backgroundColor: '#090536', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}
                            value={internshipForm.duration}
                            onChange={(e) => setInternshipForm({ ...internshipForm, duration: e.target.value })}
                          >
                            <option value="45-Days">45-Day Summer Internship</option>
                            <option value="6-Months">6-Month Semester Industrial Training</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label text-muted mb-1" style={{ fontSize: '13px' }}>Target Domain *</label>
                          <select 
                            className="form-select text-white"
                            style={{ backgroundColor: '#090536', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}
                            value={internshipForm.domain}
                            onChange={(e) => setInternshipForm({ ...internshipForm, domain: e.target.value })}
                          >
                            <option value="Web Development">Web Development (React & Node.js)</option>
                            <option value="App Development">App Development (Flutter & Dart)</option>
                            <option value="Cloud & DevOps">Cloud & DevOps (AWS & Docker)</option>
                            <option value="Data Analytics">Data Analytics (Python & BI)</option>
                            <option value="Graphic Design">Graphic Design & UI/UX</option>
                            <option value="Other">Other (Specify Manually)</option>
                          </select>
                        </div>

                        {internshipForm.domain === 'Other' && (
                          <div className="col-12">
                            <label className="form-label text-warning mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>
                              <i className="fas fa-edit me-1"></i> Specify Custom Target Domain *
                            </label>
                            <input 
                              type="text" 
                              className="form-control text-white"
                              style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(174, 109, 254, 0.5)', borderRadius: '10px' }}
                              placeholder="e.g. Cyber Security, AI/ML..."
                              value={customDomain}
                              onChange={(e) => setCustomDomain(e.target.value)}
                              required
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Client Service Request Form Fields */
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label text-muted mb-1" style={{ fontSize: '13px' }}>Service Needed *</label>
                          <select 
                            className="form-select text-white"
                            style={{ backgroundColor: '#090536', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}
                            value={serviceForm.serviceType}
                            onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                          >
                            <option value="Web Application Development">Custom Web Application Development</option>
                            <option value="Mobile App Development">Mobile App Development (iOS & Android)</option>
                            <option value="UI/UX Product Design">UI/UX Product Redesign</option>
                            <option value="Cloud Architecture & DevOps">Cloud Architecture & AWS/Docker DevOps</option>
                            <option value="AI & Automation Integration">AI Models & Workflow Automation</option>
                            <option value="Custom Enterprise Software">Custom Enterprise Software Solution</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label text-muted mb-1" style={{ fontSize: '13px' }}>Target Timeline / Launch Goal *</label>
                          <select 
                            className="form-select text-white"
                            style={{ backgroundColor: '#090536', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}
                            value={serviceForm.timeline}
                            onChange={(e) => setServiceForm({ ...serviceForm, timeline: e.target.value })}
                          >
                            <option value="1 - 2 Weeks (Rapid Prototype)">1 - 2 Weeks (Rapid Prototype)</option>
                            <option value="1 Month (Standard Launch)">1 Month (Standard Launch)</option>
                            <option value="2 - 3 Months (Full Enterprise Scope)">2 - 3 Months (Full Enterprise Scope)</option>
                            <option value="Flexible / Exploring Requirements">Flexible / Exploring Requirements</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label text-muted mb-1" style={{ fontSize: '13px' }}>Project Summary / Requirements *</label>
                          <textarea 
                            className="form-control text-white"
                            rows={2}
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px', fontSize: '13px' }}
                            placeholder="Briefly describe what features or application you need built..."
                            value={serviceForm.message}
                            onChange={(e) => setServiceForm({ ...serviceForm, message: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      {!currentUser && (
                        <p className="text-muted mb-2 text-center" style={{ fontSize: '12px' }}>
                          <i className="fab fa-google text-danger me-1"></i> Google Verification required on submit to prevent spam
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-lg w-100 text-white font-weight-bold"
                        style={{
                          background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
                          borderRadius: '12px',
                          padding: '14px',
                          boxShadow: '0 10px 25px rgba(67, 29, 171, 0.5)',
                          fontSize: '15px'
                        }}
                      >
                        {isSubmitting ? (
                          <span><i className="fas fa-spinner fa-spin me-2"></i> Submitting & Verifying...</span>
                        ) : currentUser ? (
                          <span>
                            <i className="fas fa-paper-plane me-2"></i> 
                            {formTab === 'internship' ? 'Submit Internship Application' : 'Send Service Request'}
                          </span>
                        ) : (
                          <span>
                            <i className="fab fa-google me-2"></i> 
                            Sign In with Google & Submit {formTab === 'internship' ? 'Application' : 'Request'}
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
