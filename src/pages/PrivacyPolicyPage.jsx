import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <main className="main-area fix pt-120 pb-120" style={{ marginTop: '100px', marginBottom: '100px', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="title mb-40 text-main" style={{ color: '#0f172a', fontWeight: '800' }}>Privacy Policy</h2>
            <div className="content" style={{ color: '#0f172a' }}>
              <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>1. Information We Collect</h4>
              <p style={{ color: '#475569' }}>We collect information to provide better services to our users. This may include personal information such as your name, email address, and usage data.</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>2. How We Use Information</h4>
              <p style={{ color: '#475569' }}>We use the information we collect to operate, maintain, and improve our services, as well as to communicate with you.</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>3. Data Security</h4>
              <p style={{ color: '#475569' }}>We use commercially reasonable technical and administrative measures designed to secure your personal information from accidental loss and unauthorized access. While we strive to protect your data, no system is completely impenetrable, and we cannot guarantee the absolute security of your information.</p>
              <h4 className="mt-4 text-main" style={{ color: '#0f172a', fontWeight: '700' }}>4. Updates to this Policy</h4>
              <p style={{ color: '#475569' }}>We may update this Privacy Policy from time to time. We encourage users to frequently check this page for any changes.</p>
              <p className="mt-4" style={{ color: '#475569' }}>For any questions or concerns, please visit our <Link to="/contact" style={{ color: '#431DAB', textDecoration: 'none', fontWeight: '600' }}>Contact</Link> page.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
