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
      className="footer bg_img footer-style-two footer-style-three pt-120 pos-rel" 
      style={{ backgroundColor: '#010315', backgroundImage: 'url(/assets/img/bg/footer_overly.png)' }}
    >
      <div className="container">
        <div className="xb-footer">
          <div className="sec-title--two sec-title--three text-center mb-40">
            <span className="sub-title">
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
                  <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                    {errorMsg}
                  </p>
                )}

                {submitted && (
                  <p style={{ color: '#4ade80', fontSize: '13px', marginTop: '8px' }}>
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="footer-copyright mt-50 ul_li_between border-top border-secondary pt-4">
            <p className="copyright mb-0">Copyright © 2025 <Link to="/">Appifyra</Link>. All rights reserved.</p>
            <p className="mb-0">Developed in-house by <Link to="/">Team Appifyra</Link></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
