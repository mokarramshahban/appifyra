import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickVerifySection() {
  const [certId, setCertId] = useState('');
  const navigate = useNavigate();

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate('/verify');
    }
  };

  return (
    <section className="pt-80 pb-80 pos-rel bg-slate-50 dark:bg-[#060813]" style={{ borderTop: '1px solid var(--card-bg)', borderBottom: '1px solid var(--card-bg)' }}>
      <div className="container">
        <div 
          className="p-4 p-md-5 text-main pos-rel"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--card-bg) 100%)',
            border: '1px solid var(--card-border)'
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="badge bg-green-100 text-green-900 dark:bg-green-600 dark:text-white" style={{ fontSize: '12px' }}>VERIFIED REGISTRY</span>
                <span className="text-muted" style={{ fontSize: '13px' }}>100% Credibility Guarantee</span>
              </div>
              <h3 className="text-main mb-2" style={{ fontWeight: '700' }}>Verify Student Certificate</h3>
              <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
                Employers and universities can instantly verify official Appifyra Certificate Serial IDs in real-time.
              </p>
            </div>

            <div className="col-lg-6">
              <form onSubmit={handleVerifySubmit}>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control text-main" 
                    placeholder="Enter Certificate ID (e.g. APP-2025-WD01)" 
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--color-border-light)',
                      borderRadius: '12px 0 0 12px',
                      padding: '14px 20px'
                    }}
                  />
                  <button 
                    type="submit" 
                    className="btn px-4"
                    style={{ color: 'var(--color-text-main)',
                      fontWeight: '700',
                      borderRadius: '0 12px 12px 0'
                     }}
                  >
                    <i className="far fa-search me-1"></i> Verify Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
