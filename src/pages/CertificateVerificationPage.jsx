import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import staticCertificates from '../data/certificates.json';
import { lookupCertificate } from '../services/dbService';

export default function CertificateVerificationPage() {
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId) {
      setSearchId(urlId);
      handleVerify(urlId);
    }
  }, [searchParams]);

  const handleQuickSample = (id) => {
    setSearchId(id);
    handleVerify(id);
  };

  const handleClear = () => {
    setSearchId('');
    setResult(null);
    setSearched(false);
  };

  const handlePrintCert = () => {
    window.print();
  };

  return (
    <div className="pt-140 pb-100 pos-rel">
      <div className="container">
        {/* Section Header */}
        <div className="sec-title--two sec-title--three text-center mb-50 no-print">
          <span className="sub-title">
            <img src="/assets/img/icon/check-mark.png" alt="Verification Shield" style={{ width: '18px', height: '18px', marginRight: '6px' }} />
            <span>Official Credential Registry</span>
          </span>
          <h2 className="title text-white">
            Verify Certificate Credibility
          </h2>
          <p className="content mt-15" style={{ maxWidth: '680px', margin: '0 auto', color: '#9da1b4' }}>
            Enter your unique Appifyra Certificate ID below to verify authenticity, candidate details, student email identity, internship domain, and completion grade.
          </p>
        </div>

        {/* Verification Form Box */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="contact-two pos-rel p-4 p-md-5 mb-5 no-print" style={{ borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'linear-gradient(135deg, rgba(9, 5, 54, 0.9) 0%, rgba(1, 3, 21, 0.95) 100%)' }}>
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
                    placeholder="e.g. APP-2026-001"
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
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <span><i className="far fa-search me-2"></i> Verify Credential</span>}
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

            {/* Verification Result Section: Formal Landscape Certificate Canvas */}
            {searched && !loading && (
              <div>
                {result ? (
                  <div>
                    {/* Top Action Control Bar */}
                    <div className="d-flex justify-content-between align-items-center mb-4 no-print">
                      <span className="badge bg-success px-3 py-2" style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>
                        <i className="fas fa-check-circle me-1"></i> VERIFIED OFFICIAL CREDENTIAL
                      </span>
                      <button onClick={handlePrintCert} className="btn btn-success px-4 py-2" style={{ borderRadius: '10px', fontWeight: '700', boxShadow: '0 4px 15px rgba(74, 222, 128, 0.4)' }}>
                        <i className="fas fa-download me-2"></i> Download / Print PDF Certificate
                      </button>
                    </div>

                    {/* Official Certificate Canvas Frame */}
                    <div 
                      className="printable-cert-card p-4 p-md-5 text-white pos-rel w-100"
                      style={{
                        borderRadius: '24px',
                        border: '3px double #4ade80',
                        background: 'linear-gradient(135deg, #04121a 0%, #030818 100%)',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(74, 222, 128, 0.25)'
                      }}
                    >
                      <div className="text-center py-4">
                        <img src="/assets/img/logo/appifyra logo white.svg" alt="Appifyra" style={{ height: '56px', marginBottom: '20px' }} />
                        <h2 className="text-uppercase mb-1" style={{ letterSpacing: '6px', fontSize: '20px', color: '#a5b4fc', fontWeight: '700' }}>
                          Certificate of Completion
                        </h2>
                        <p className="text-muted mb-4" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                          This Credential is Proudly Awarded To
                        </p>
                        
                        <h1 className="text-white mb-3" style={{ fontWeight: '800', fontSize: '42px', color: '#4ade80', letterSpacing: '1px' }}>
                          {result.studentName}
                        </h1>

                        <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                          for successfully fulfilling all training requirements and completing the industrial internship in
                        </p>
                        
                        {(() => {
                          const fullStr = String(result.courseTitle || result.domain || '').trim();
                          const match = fullStr.match(/^(.*?)\s*\((.*?)\)$/);
                          const title = match ? match[1].trim() : fullStr;
                          const rawDuration = match ? match[2].trim() : (result.duration || null);
                          const cleanDuration = rawDuration ? rawDuration.replace(/-/g, ' ') : null;
                          
                          return (
                            <div className="mb-4">
                              <h3 className="mb-2" style={{ color: '#c084fc', fontWeight: '700', fontSize: '30px' }}>
                                {title}
                              </h3>
                              {cleanDuration && (
                                <div style={{ color: '#a5b4fc', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                  (Completed over an intensive tenure of {cleanDuration})
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Certificate Badges & Signatory Footer Grid */}
                        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                          <div className="row align-items-center">
                            <div className="col-4 text-start">
                              <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Certificate ID</span>
                              <strong className="text-warning font-monospace d-block mb-2" style={{ fontSize: '16px' }}>{result.certificateId}</strong>
                              <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Issue Date</span>
                              <strong className="text-white" style={{ fontSize: '14px' }}>{result.issueDate || 'July 26, 2026'}</strong>
                            </div>

                            <div className="col-4 text-center">
                              <div 
                                className="d-inline-flex flex-column align-items-center justify-content-center"
                                style={{
                                  border: '2px dashed #4ade80',
                                  borderRadius: '50%',
                                  width: '84px',
                                  height: '84px',
                                  background: 'rgba(74, 222, 128, 0.08)'
                                }}
                              >
                                <i className="fas fa-award text-success mb-1" style={{ fontSize: '24px' }}></i>
                                <span style={{ fontSize: '9px', fontWeight: '800', color: '#4ade80', letterSpacing: '0.5px' }}>VERIFIED</span>
                              </div>
                            </div>

                            <div className="col-4 text-end">
                              <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Performance Grade</span>
                              <strong className="text-info d-block" style={{ fontSize: '16px' }}>{result.performanceGrade || result.grade || 'Excellence (A+)'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
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
