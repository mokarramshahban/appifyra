import React, { useState } from 'react';
import staticCertificates from '../data/certificates.json';
import { lookupCertificate } from '../services/dbService';

export default function CertificateVerificationPage() {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (idToVerify) => {
    const term = (idToVerify || searchId).trim().toUpperCase();
    if (!term) return;

    setLoading(true);
    setSearched(true);

    const found = await lookupCertificate(term);
    setResult(found);
    setLoading(false);
  };

  const handleQuickSample = (id) => {
    setSearchId(id);
    handleVerify(id);
  };

  const handleClear = () => {
    setSearchId('');
    setResult(null);
    setSearched(false);
  };

  return (
    <div className="pt-140 pb-100 pos-rel">
      <div className="container">
        {/* Section Header */}
        <div className="sec-title--two sec-title--three text-center mb-50">
          <span className="sub-title wow fadeInDown" data-wow-duration="600ms">
            <img src="/assets/img/icon/check-mark.png" alt="Verification Shield" style={{ width: '18px', height: '18px', marginRight: '6px' }} />
            <span>Official Credential Registry</span>
          </span>
          <h2 className="title wow fadeInDown" data-wow-duration="600ms">
            Verify Certificate Credibility
          </h2>
          <p className="content mt-15" style={{ maxWidth: '680px', margin: '0 auto', color: '#9da1b4' }}>
            Enter your unique Appifyra Certificate ID below to verify authenticity, candidate details, student email identity, internship domain, and skill competencies.
          </p>
        </div>

        {/* Verification Form Box */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-two pos-rel p-4 p-md-5 mb-5" style={{ borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'linear-gradient(135deg, rgba(9, 5, 54, 0.9) 0%, rgba(1, 3, 21, 0.95) 100%)' }}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify();
                }}
              >
                <label className="text-white mb-2" style={{ fontWeight: '500' }}>
                  Certificate ID / Serial Number:
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control text-white"
                    placeholder="e.g. APP-2025-WD01"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(103, 128, 210, 0.4)',
                      borderRadius: '10px 0 0 10px',
                      padding: '14px 20px',
                      fontSize: '16px',
                      color: '#ffffff'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn"
                    style={{
                      background: 'linear-gradient(90deg, #431DAB 0%, #AE6DFE 100%)',
                      color: '#fff',
                      padding: '0 30px',
                      fontWeight: '600',
                      borderRadius: '0 10px 10px 0'
                    }}
                  >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <span><i className="far fa-search me-2"></i> Verify</span>}
                  </button>
                </div>
              </form>

              {/* Sample Shortcuts */}
              <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                <span className="text-muted" style={{ fontSize: '13px' }}>Try sample certificate IDs:</span>
                {Object.keys(staticCertificates).map((id) => (
                  <button
                    key={id}
                    onClick={() => handleQuickSample(id)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: 'rgba(103, 128, 210, 0.15)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(165, 180, 252, 0.25)',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  >
                    {id}
                  </button>
                ))}
                {searched && (
                  <button
                    onClick={handleClear}
                    className="btn btn-sm btn-outline-secondary ms-auto"
                    style={{ fontSize: '12px', color: '#9da1b4' }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Verification Result Section */}
            {searched && !loading && (
              <div>
                {result ? (
                  <div 
                    className="verified-card pos-rel p-4 p-md-5 text-white" 
                    style={{
                      borderRadius: '24px',
                      border: '2px solid rgba(74, 222, 128, 0.4)',
                      background: 'linear-gradient(135deg, rgba(6, 40, 26, 0.95) 0%, rgba(1, 3, 21, 0.98) 100%)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(74, 222, 128, 0.15)'
                    }}
                  >
                    {/* Header Badge */}
                    <div className="d-flex justify-content-between align-items-center pb-4 mb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <div className="d-flex align-items-center gap-2">
                        <span 
                          style={{
                            backgroundColor: 'rgba(74, 222, 128, 0.2)',
                            color: '#4ade80',
                            padding: '8px 16px',
                            borderRadius: '30px',
                            fontSize: '13px',
                            fontWeight: '700',
                            letterSpacing: '1px'
                          }}
                        >
                          <i className="fas fa-check-circle me-1"></i> OFFICIAL VERIFIED CREDENTIAL
                        </span>
                      </div>
                      <img src="/assets/img/logo/appifyra logo white.svg" alt="Appifyra" style={{ height: '32px' }} />
                    </div>

                    {/* Main Details Grid */}
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <span className="text-muted text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Candidate Name & Identity</span>
                        <h3 className="text-white mt-1 mb-0" style={{ fontWeight: '700' }}>{result.studentName}</h3>
                        {result.studentEmail && (
                          <div style={{ color: '#38bdf8', fontSize: '13px', marginTop: '2px' }}>
                            <i className="fas fa-envelope me-1"></i> {result.studentEmail}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <span className="text-muted text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Domain / Program</span>
                        <h4 className="mt-1" style={{ color: '#c084fc', fontWeight: '600' }}>{result.domain}</h4>
                      </div>
                      <div className="col-md-4">
                        <span className="text-muted text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Certificate ID</span>
                        <p className="font-monospace text-white mt-1 mb-0" style={{ fontWeight: '600' }}>{result.certificateId}</p>
                      </div>
                      <div className="col-md-4">
                        <span className="text-muted text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Issue Date</span>
                        <p className="text-white mt-1 mb-0">{result.issueDate}</p>
                      </div>
                      <div className="col-md-4">
                        <span className="text-muted text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Performance Grade</span>
                        <p className="mt-1 mb-0" style={{ color: '#38bdf8', fontWeight: '600' }}>{result.grade || 'Verified'}</p>
                      </div>
                    </div>

                    {/* Verified Skills */}
                    {result.skills && result.skills.length > 0 && (
                      <div className="pt-3 pb-3 mb-4" style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                        <span className="text-muted text-uppercase d-block mb-2" style={{ fontSize: '12px', letterSpacing: '1px' }}>Verified Competencies</span>
                        <div className="d-flex flex-wrap gap-2">
                          {(Array.isArray(result.skills) ? result.skills : result.skills.split(',')).map((skill, idx) => (
                            <span 
                              key={idx}
                              style={{
                                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                                color: '#e9d5ff',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '13px'
                              }}
                            >
                              {typeof skill === 'string' ? skill.trim() : skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer / Actions */}
                    <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <span className="text-muted" style={{ fontSize: '13px' }}>
                        Issued by <strong className="text-white">{result.issuer || 'Team Appifyra'}</strong> • Status: <strong style={{ color: '#4ade80' }}>Active</strong>
                      </span>
                      <button 
                        onClick={() => window.print()} 
                        className="btn btn-outline-light btn-sm"
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="far fa-print me-1"></i> Print Certificate Record
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="unverified-card p-4 p-md-5 text-center text-white"
                    style={{
                      borderRadius: '24px',
                      border: '2px solid rgba(248, 113, 113, 0.4)',
                      background: 'linear-gradient(135deg, rgba(40, 10, 10, 0.95) 0%, rgba(1, 3, 21, 0.98) 100%)'
                    }}
                  >
                    <div className="mb-3">
                      <span 
                        style={{
                          backgroundColor: 'rgba(248, 113, 113, 0.2)',
                          color: '#f87171',
                          padding: '12px 20px',
                          borderRadius: '50px',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}
                      >
                        <i className="fas fa-exclamation-triangle me-2"></i> INVALID OR UNVERIFIED CERTIFICATE ID
                      </span>
                    </div>
                    <h4 className="mt-4 text-white">No Matching Credential Found</h4>
                    <p className="text-muted" style={{ maxWidth: '500px', margin: '10px auto 0' }}>
                      The Certificate ID "<strong>{searchId}</strong>" was not found in Appifyra's database. Please check for spelling mistakes or contact support.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
