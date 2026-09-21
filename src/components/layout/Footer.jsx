import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CaptchaCheckbox from '../common/CaptchaCheckbox';
import { saveSubscriber } from '../../services/dbService';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      setErrorMsg('Please verify "I\'m not a robot" first.');
      return;
    }

    if (email) {
      setErrorMsg('');
      await saveSubscriber(email);
      setSubmitted(true);
      setEmail('');
      setTimeout(() => {
        setSubmitted(false);
        setIsCaptchaVerified(false);
      }, 4000);
    }
  };

  return (
    <footer 
      className="footer footer-style-two footer-style-three pt-120 pos-rel bg-slate-50 dark:bg-[#060813] dark:bg-[url('/assets/img/bg/footer_overly.png')] dark:bg-cover dark:bg-center"
    >
      <div className="container">
        <div className="xb-footer">
          <div className="sec-title--two sec-title--three text-center mb-40">
            <span className="sub-title !bg-purple-100 !text-purple-900 border border-purple-200 dark:!bg-purple-900/30 dark:!text-purple-300 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4">
              <img src="/assets/img/icon/airdrop01.svg" alt="Airdrop Icon" />
              <span>Join the Appifyra community</span>
            </span>
          </div>

          <div className="footer-inner mt-60 mb-70 ul_li_between align-items-start">
            {/* Column 1: Company Navigation */}
            <div className="footer-widget">
              <span className="xb-item--sub-title">Quick Navigation</span>
              <ul className="xb-item--holder list-unstyled">
                <li className="xb-item--list"><Link to="/">Home</Link></li>
                <li className="xb-item--list"><Link to="/about">About Us</Link></li>
                <li className="xb-item--list"><Link to="/services">Services</Link></li>
                <li className="xb-item--list"><Link to="/internship">Internships</Link></li>
                <li className="xb-item--list"><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 2: Our Programs & Services */}
            <div className="footer-widget">
              <span className="xb-item--sub-title">Programs & Services</span>
              <ul className="xb-item--holder list-unstyled">
                <li className="xb-item--list"><Link to="/internship">45-Day Internship</Link></li>
                <li className="xb-item--list"><Link to="/internship">6-Month Training</Link></li>
                <li className="xb-item--list"><Link to="/services">Web Engineering</Link></li>
                <li className="xb-item--list"><Link to="/services">Mobile App Development</Link></li>
                <li className="xb-item--list"><Link to="/services">Cloud & DevOps</Link></li>
              </ul>
            </div>

            {/* Column 3: Portals & Verification */}
            <div className="footer-widget">
              <span className="xb-item--sub-title">Student & Portal</span>
              <ul className="xb-item--holder list-unstyled">
                <li className="xb-item--list"><Link to="/verify">Verify Certificate</Link></li>
                <li className="xb-item--list"><Link to="/dashboard">Student Dashboard</Link></li>
                <li className="xb-item--list"><Link to="/contact">Support & Help</Link></li>
              </ul>
            </div>

            {/* Column 4: Stay Updated Newsletter Form */}
            <div className="sa-newslatter footer-widget">
              <span className="xb-item--sub-title">Stay Updated</span>
              <div className="static-message">
                <p className="static-info">Subscribe to receive tech updates & internship notifications</p>
              </div>
              <form onSubmit={handleSubmit} className="xb-item--input-box">
                <label htmlFor="text6">Enter your Email</label>
                <div className="xb-item--input_field pos-rel mb-2">
                  <input 
                    type="email" 
                    name="gmail" 
                    id="text6" 
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="xb-item--btn"><i className="fas fa-paper-plane"></i></button>
                </div>

                <CaptchaCheckbox 
                  isVerified={isCaptchaVerified} 
                  setIsVerified={setIsCaptchaVerified} 
                />

                {errorMsg && (
                  <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>
                    {errorMsg}
                  </p>
                )}

                {submitted && (
                  <p style={{ color: 'var(--color-success)', fontSize: '13px', marginTop: '8px' }}>
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="footer-copyright mt-50 ul_li_between border-top border-secondary pt-4 pb-4">
            <p className="copyright mb-0">Copyright © 2025 <Link to="/">Appifyra</Link>. All rights reserved.</p>
            <div className="legal-links d-flex align-items-center gap-3">
              <Link to="/privacy-policy" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Privacy Policy</Link>
              <Link to="/terms-of-service" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Terms of Service</Link>
              <Link to="/cookie-policy" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
