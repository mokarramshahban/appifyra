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
    <div className="pt-140 pb-100 pos-rel w-full min-h-screen bg-slate-50 dark:bg-[#060813]">
      <div className="container">
        {/* Section Header */}
        <div className="sec-title--two sec-title--three text-center mb-50 no-print">
          <span className="sub-title">
            <img src="/assets/img/icon/check-mark.png" alt="Verification Shield" style={{ width: '18px', height: '18px', marginRight: '6px' }} />
            <span>Official Credential Registry</span>
          </span>
          <h2 className="title text-main">
            Verify Certificate Credibility
          </h2>
          <p className="content mt-15" style={{ maxWidth: '680px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
            Enter your unique Appifyra Certificate ID below to verify authenticity, candidate details, student email identity, internship domain, and completion grade.
          </p>
        </div>

        {/* Verification Form Box */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="contact-two pos-rel p-4 p-md-5 mb-5 no-print" style={{ borderRadius: '20px',  }}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify();
                }}
              >
                <label className="text-main mb-2" style={{ fontWeight: '500' }}>
                  Certificate ID / Serial Number:
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control text-main"
                    placeholder="e.g. APP-2026-001"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      
                      borderRadius: '10px 0 0 10px',
                      padding: '14px 20px',
                      fontSize: '16px',
                      color: 'var(--color-text-main)'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn"
                    style={{ color: 'var(--color-text-main)',
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
                      backgroundColor: 'var(--input-border)',
                      color: 'var(--color-text-muted)',
                      
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
                    style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}
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
                      <span className="badge bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-200 px-3 py-2" style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>
                        <i className="fas fa-check-circle me-1"></i> VERIFIED OFFICIAL CREDENTIAL
                      </span>
                      <button onClick={handlePrintCert} className="btn bg-green-600 text-white hover:bg-green-700 shadow-md dark:bg-green-600/80 font-semibold px-4 py-2" style={{ borderRadius: '10px', fontWeight: '700',  }}>
                        <i className="fas fa-download me-2"></i> Download / Print PDF Certificate
                      </button>
                    </div>

                    {/* Official Certificate Canvas Frame */}
                    <div 
                      className="printable-cert-card p-4 p-md-5 text-main pos-rel w-100"
                      style={{
                        borderRadius: '24px',
                        
                        
                        
                      }}
                    >
                      <div className="text-center py-4">
                        <img src="/assets/img/logo/appifyra logo white.svg" alt="Appifyra" style={{ height: '56px', marginBottom: '20px' }} />
                        <h2 className="text-uppercase mb-1" style={{ letterSpacing: '6px', fontSize: '20px', color: 'var(--color-text-muted)', fontWeight: '700' }}>
                          Certificate of Completion
                        </h2>
                        <p className="text-muted mb-4" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                          This Credential is Proudly Awarded To
                        </p>
                        
                        <h1 className="text-main mb-3" style={{ fontWeight: '800', fontSize: '42px', color: 'var(--color-success)', letterSpacing: '1px' }}>
                          {result.studentName}
                        </h1>

                        <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                          for successfully fulfilling all training requirements and completing the
                        </p>
                        
                        <p className="text-muted mb-3" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-success)' }}>
                          <i className="fas fa-clock me-2"></i>
                          {result.duration || '45 Days'} Industrial Internship
                        </p>
                        
                        {(() => {
                          const fullStr = String(result.courseTitle || result.domain || '').trim();
                          const match = fullStr.match(/^(.*?)\s*\((.*?)\)$/);
                          const title = match ? match[1].trim() : fullStr;
                          const rawDuration = match ? match[2].trim() : (result.duration || null);
                          const cleanDuration = rawDuration ? rawDuration.replace(/-/g, ' ') : null;
                          
                          return (
                            <div className="mb-4">
                              <h3 className="mb-2" style={{ color: 'var(--color-primary-light)', fontWeight: '700', fontSize: '30px' }}>
                                {title}
                              </h3>
                              {cleanDuration && (
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                  (Completed over an intensive tenure of {cleanDuration})
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Certificate Badges & Signatory Footer Grid */}
                        <div className="mt-5 pt-4 w-full min-h-screen bg-slate-50 dark:bg-[#060813]" >
                          <div className="row align-items-center">
                            <div className="col-4 text-start">
                              <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Certificate ID</span>
                              <strong className="text-warning font-monospace d-block mb-2" style={{ fontSize: '16px' }}>{result.certificateId}</strong>
                              <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Issue Date</span>
                              <strong className="text-main" style={{ fontSize: '14px' }}>{result.issueDate || 'July 26, 2026'}</strong>
                            </div>

                            <div className="col-4 text-center">
                              <div 
                                className="d-inline-flex flex-column align-items-center justify-content-center"
                                style={{
                                  
                                  borderRadius: '50%',
                                  width: '84px',
                                  height: '84px',
                                  background: 'var(--card-bg)'
                                }}
                              >
                                <i className="fas fa-award text-success mb-1" style={{ fontSize: '24px' }}></i>
                                <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--color-success)', letterSpacing: '0.5px' }}>VERIFIED</span>
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
                    className="unverified-card p-4 p-md-5 text-center text-main"
                    style={{
                      borderRadius: '24px',
                      
                      background: 'linear-gradient(135deg, var(--section-bg) 0%, var(--section-bg) 100%)'
                    }}
                  >
                    <div className="mb-3">
                      <span 
                        className="bg-white dark:bg-[#0d1226] border border-indigo-200 border-b-4 border-b-blue-500 shadow-sm dark:border-none" style={{ 
                          color: 'var(--color-error)',
                          padding: '12px 20px',
                          borderRadius: '50px',
                          fontSize: '14px',
                          fontWeight: '700' }}
                      >
                        <i className="fas fa-exclamation-triangle me-2"></i> INVALID OR UNVERIFIED CERTIFICATE ID
                      </span>
                    </div>
                    <h4 className="mt-4 text-main">No Matching Credential Found</h4>
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
