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
    <section className="pt-80 pb-80 pos-rel" style={{ backgroundColor: '#010315', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        <div 
          className="p-4 p-md-5 text-white pos-rel"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(67, 29, 171, 0.3) 0%, rgba(9, 5, 54, 0.95) 100%)',
            border: '1px solid rgba(103, 128, 210, 0.3)'
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="badge bg-success" style={{ fontSize: '12px' }}>VERIFIED REGISTRY</span>
                <span className="text-muted" style={{ fontSize: '13px' }}>100% Credibility Guarantee</span>
              </div>
              <h3 className="text-white mb-2" style={{ fontWeight: '700' }}>Verify Student Certificate</h3>
              <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
                Employers and universities can instantly verify official Appifyra Certificate Serial IDs in real-time.
              </p>
            </div>

            <div className="col-lg-6">
              <form onSubmit={handleVerifySubmit}>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control text-white" 
                    placeholder="Enter Certificate ID (e.g. APP-2025-WD01)" 
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px 0 0 12px',
                      padding: '14px 20px'
                    }}
                  />
                  <button 
                    type="submit" 
                    className="btn px-4"
                    style={{
                      background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
                      color: '#fff',
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
