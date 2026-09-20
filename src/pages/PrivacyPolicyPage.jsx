import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <main className="main-area fix pt-120 pb-120" style={{ marginTop: '100px', marginBottom: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="title mb-40">Privacy Policy</h2>
            <div className="content">
              <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
              <h4 className="mt-4">1. Information We Collect</h4>
              <p>We collect information to provide better services to our users. This may include personal information such as your name, email address, and usage data.</p>
              <h4 className="mt-4">2. How We Use Information</h4>
              <p>We use the information we collect to operate, maintain, and improve our services, as well as to communicate with you.</p>
              <h4 className="mt-4">3. Data Security</h4>
              <p>We implement a variety of security measures to maintain the safety of your personal information. However, no data transmission over the Internet can be guaranteed to be 100% secure.</p>
              <h4 className="mt-4">4. Updates to this Policy</h4>
              <p>We may update this Privacy Policy from time to time. We encourage users to frequently check this page for any changes.</p>
              <p className="mt-4">For any questions or concerns, please visit our <Link to="/contact">Contact</Link> page.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
