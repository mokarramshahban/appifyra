import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <main className="main-area fix pt-120 pb-120" style={{ marginTop: '100px', marginBottom: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="title mb-40">Terms of Service</h2>
            <div className="content">
              <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
              <h4 className="mt-4">1. Acceptance of Terms</h4>
              <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
              <h4 className="mt-4">2. Use of Service</h4>
              <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
              <h4 className="mt-4">3. Intellectual Property</h4>
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of the company and its licensors.</p>
              <h4 className="mt-4">4. Limitation of Liability</h4>
              <p>In no event shall the company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfServicePage;
