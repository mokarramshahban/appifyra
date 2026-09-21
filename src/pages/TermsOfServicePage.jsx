import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <main className="main-area fix pt-120 pb-120" style={{ marginTop: '100px', marginBottom: '100px', background}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="title mb-40 text-main" style={{ color: '#0f172a', fontWeight: '800' }}>Terms of Service</h2>
            <div className="content" style={{ color: '#0f172a' }}>
              <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>1. Acceptance of Terms</h4>
              <p style={{ color: '#475569' }}>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>2. Use of Service</h4>
              <p style={{ color: '#475569' }}>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>3. Intellectual Property</h4>
              <p style={{ color: '#475569' }}>The Service and its original content, features, and functionality are and will remain the exclusive property of the company and its licensors.</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>4. Limitation of Liability</h4>
              <p style={{ color: '#475569' }}>In no event shall the company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfServicePage;
