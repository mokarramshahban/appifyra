import React, { useState, useEffect } from 'react';
import CaptchaCheckbox from '../common/CaptchaCheckbox';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';
import { saveContactInquiry } from '../../services/dbService';
import { sendContactReceivedEmail } from '../../services/emailService';

export default function ContactSection() {
  const { currentUser, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');

  // Auto-fill Google verified info
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
      setErrorAlert('Please sign in with Google first to verify your identity.');
      return;
    }

    if (!isCaptchaVerified) {
      setErrorAlert('Please check "I\'m not a robot" to verify you are a human.');
      return;
    }

    setErrorAlert('');
    setIsSubmitting(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      userUid: currentUser.uid || 'google_user'
    };

    // Save to MongoDB
    await saveContactInquiry(payload);

    try {
      // Send confirmation email to the user via custom backend
      sendContactReceivedEmail({
        email: formData.email,
        fullName: formData.fullName,
        subject: formData.subject || 'General Inquiry'
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Contact Form Error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section 
      id="contact" 
      className="contact pt-140 pb-100 pos-rel bg-slate-50 dark:bg-[#060813]" 
    >
      <div className="container">
        <div 
          className="pos-rel p-4 p-md-5 bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ ,
            borderRadius: '24px',
             }}
        >
          <div className="row align-items-stretch g-4">
            {/* Contact Details & Info */}
            <div className="col-lg-5">
              <div 
                className="p-4 p-md-5 text-main h-100 d-flex flex-column justify-content-between"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '20px'
                }}
              >
                <div>
                  <span className="badge bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200 text-slate-700 dark:text-white mb-2" style={{ borderRadius: '20px', padding: '6px 14px' }}>
                    <i className="fas fa-paper-plane me-1"></i> Get In Touch
                  </span>
                  <h2 className="text-main mb-3" style={{ fontWeight: '800', fontSize: '36px' }}>Let's Connect</h2>
                  <p className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Have a project in mind or questions about our internship programs & digital services? Reach out to us directly or send an inquiry.
                  </p>
                  
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="d-flex align-items-center gap-3 p-3" style={{ backgroundColor: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
                      <div className="d-flex align-items-center justify-content-center bg-cyan-100 text-cyan-900 dark:bg-cyan-900/50 dark:text-cyan-200 text-dark rounded-circle" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: '12px' }}>Email Address</span>
                        <strong className="text-main" style={{ fontSize: '15px' }}>appifyra@gmail.com</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Message Form */}
            <div className="col-lg-7">
              <div 
                className="p-4 p-md-5 h-100"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '20px'
                }}
              >
                <h3 className="text-main mb-1" style={{ fontWeight: '700' }}>Send Us a Message</h3>
                <p className="text-muted mb-4" style={{ fontSize: '14px' }}>Verified identity required via Google Sign-In.</p>

                {/* Login Banner when Logged Out */}
                {!currentUser && (
                  <div 
                    className="p-3 mb-4 text-center"
                    style={{
                      backgroundColor: 'rgba(67, 29, 171, 0.25)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '12px'
                    }}
                  >
                    <p className="text-main mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Sign in with Google to enable message sending
                    </p>
                    <button 
                      type="button"
                      onClick={loginWithGoogle}
                      className="btn btn-sm text-main px-4 py-2"
                      style={{ borderRadius: '8px', fontWeight: '600'  }}
                    >
                      <i className="fab fa-google me-2"></i> Sign In with Google
                    </button>
                  </div>
                )}

                {/* Verified User Badge when Logged In */}
                {currentUser && (
                  <div className="d-flex align-items-center justify-content-between p-3 mb-4 bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ ,  borderRadius: '12px' }}>
                    <div className="d-flex align-items-center gap-2">
                      <UserAvatar name={currentUser.displayName || currentUser.email} size={32} borderColor="#4ade80" />
                      <span className="text-main" style={{ fontSize: '14px', fontWeight: '600' }}>{currentUser.displayName} ({currentUser.email})</span>
                    </div>
                    <span className="badge bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-200 text-slate-700 dark:text-white" style={{ fontSize: '11px' }}>Verified</span>
                  </div>
                )}

                {submitted ? (
                  <div 
                    className="p-4 text-center bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ ,
                      
                      borderRadius: '16px' }}
                  >
                    <i className="fas fa-paper-plane mb-3" style={{ fontSize: '42px', color: 'var(--color-success)' }}></i>
                    <h4 className="text-main">Message Sent Successfully!</h4>
                    <p className="text-muted mt-2">
                      Thank you, <strong>{formData.fullName}</strong>. Your message has been saved to database and sent to <strong>appifyra@gmail.com</strong>.
                    </p>
                    <button 
                      onClick={() => {
                        setSubmitted(false);
                        setIsCaptchaVerified(false);
                      }}
                      className="btn btn-outline-light mt-3"
                      style={{ borderRadius: '8px' }}
                    >
                      Send Another Message
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
                        <label className="form-label text-muted">Full Name *</label>
                        <input 
                          type="text" 
                          name="fullName"
                          className="form-control text-main"
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '10px' }}
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          disabled={!currentUser}
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted">Email Address *</label>
                        <input 
                          type="email" 
                          name="email"
                          className="form-control text-main"
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '10px' }}
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={!currentUser}
                          placeholder="yourname@gmail.com"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted">Subject / Topic *</label>
                        <input 
                          type="text" 
                          name="subject"
                          className="form-control text-main"
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '10px' }}
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={!currentUser}
                          placeholder="Web Development / App Inquiry / General Question"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted">Message *</label>
                        <textarea 
                          name="message"
                          rows="4"
                          className="form-control text-main"
                          style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '10px' }}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={!currentUser}
                          placeholder="Write your project details or message here..."
                        ></textarea>
                      </div>

                      {/* Bot Prevention Captcha Checkbox */}
                      <div className="col-12 mt-3">
                        <CaptchaCheckbox 
                          isVerified={isCaptchaVerified} 
                          setIsVerified={setIsCaptchaVerified} 
                        />
                      </div>

                      <div className="col-12 mt-2">
                        {currentUser ? (
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-lg w-100"
                            style={{ color: 'var(--color-text-main)',
                              fontWeight: '700',
                              padding: '14px',
                              borderRadius: '12px'
                             }}
                          >
                            {isSubmitting ? (
                              <span><i className="fas fa-spinner fa-spin me-2"></i> Sending Message...</span>
                            ) : (
                              <span>Send Message</span>
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
    </section>
  );
}
