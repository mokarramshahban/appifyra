import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentApplications, getStudentCertificates } from '../services/dbService';
import { Link } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';
import { CardSkeletonGrid } from '../components/common/SkeletonLoader';

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Direct View & Download Modal State
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (currentUser?.email) {
        setLoading(true);
        const appList = await getStudentApplications(currentUser.email);
        const certList = await getStudentCertificates(currentUser.email);
        setApplications(appList);
        setCertificates(certList);
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge bg-success px-3 py-2" style={{ borderRadius: '20px', fontWeight: '600' }}><i className="fas fa-check-circle me-1"></i> Approved</span>;
      case 'Completed':
        return <span className="badge bg-info text-dark px-3 py-2" style={{ borderRadius: '20px', fontWeight: '700' }}><i className="fas fa-award me-1"></i> Completed</span>;
      case 'Rejected':
        return <span className="badge bg-danger px-3 py-2" style={{ borderRadius: '20px', fontWeight: '600' }}><i className="fas fa-times-circle me-1"></i> Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark px-3 py-2" style={{ borderRadius: '20px', fontWeight: '700' }}><i className="fas fa-clock me-1"></i> Under Review</span>;
    }
  };

  const handlePrintCert = () => {
    window.print();
  };

  return (
    <div className="pt-140 pb-100 pos-rel">
      <div className="container">
        {/* Welcome Header */}
        <div 
          className="p-4 p-md-5 mb-5 text-white pos-rel no-print"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(67, 29, 171, 0.4) 0%, rgba(1, 3, 21, 0.95) 100%)',
            border: '1px solid rgba(174, 109, 254, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <UserAvatar name={currentUser?.displayName || currentUser?.email} size={64} borderColor="#ae6dfe" />
              <div>
                <span className="badge bg-primary px-3 py-1 mb-2" style={{ borderRadius: '15px', fontWeight: '700', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <i className="fas fa-user-graduate me-1"></i> STUDENT PORTAL
                </span>
                <h2 className="text-white mb-0" style={{ fontWeight: '800' }}>Welcome back, {currentUser?.displayName || 'Student'}!</h2>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>{currentUser?.email}</p>
              </div>
            </div>
            <Link to="/internship" className="btn btn-primary btn-glow-hover px-4 py-3" style={{ borderRadius: '12px', fontWeight: '700', boxShadow: '0 10px 25px rgba(67, 29, 171, 0.4)' }}>
              <i className="fas fa-plus-circle me-2"></i> Apply for New Internship
            </Link>
          </div>

          {/* Student Dashboard Navigation Tabs */}
          <div className="d-flex flex-wrap gap-3 mt-4 pt-4 border-top border-secondary">
            <button 
              onClick={() => setActiveTab('applications')}
              className={`btn btn-glow-hover px-4 py-2 ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline-light'}`}
              style={{ borderRadius: '12px', fontSize: '14px', fontWeight: '700' }}
            >
              <i className="fas fa-list-check me-2"></i> My Applications ({applications.length})
            </button>

            <button 
              onClick={() => setActiveTab('certificates')}
              className={`btn btn-glow-hover px-4 py-2 ${activeTab === 'certificates' ? 'btn-success' : 'btn-outline-success'}`}
              style={{ borderRadius: '12px', fontSize: '14px', fontWeight: '700' }}
            >
              <i className="fas fa-award me-2"></i> My Issued Certificates ({certificates.length})
            </button>
          </div>
        </div>

        {/* Certificate View / Download Modal Overlay */}
        {previewCert && (
          <div 
            className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              zIndex: 9999,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div 
              className="printable-cert-card p-4 p-md-5 text-white pos-rel w-100"
              style={{
                maxWidth: '920px',
                maxHeight: '92vh',
                overflowY: 'auto',
                borderRadius: '24px',
                border: '3px double #4ade80',
                background: 'linear-gradient(135deg, #04121a 0%, #030818 100%)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(74, 222, 128, 0.25)'
              }}
            >
              {/* Modal Top Close Bar (UI Only, Hidden in PDF Print) */}
              <div className="d-flex justify-content-between align-items-center pb-3 mb-3 no-print" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span className="badge bg-success px-3 py-2" style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
                  <i className="fas fa-check-circle me-1"></i> VERIFIED CREDENTIAL PREVIEW
                </span>
                <button onClick={() => setPreviewCert(null)} className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '36px', height: '36px' }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Formal Clean Certificate Canvas Body */}
              <div className="text-center py-4">
                <img src="/assets/img/logo/appifyra logo white.svg" alt="Appifyra" style={{ height: '56px', marginBottom: '20px' }} />
                <h2 className="text-uppercase mb-1" style={{ letterSpacing: '6px', fontSize: '20px', color: '#a5b4fc', fontWeight: '700' }}>
                  Certificate of Completion
                </h2>
                <p className="text-muted mb-4" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>This Credential is Proudly Awarded To</p>
                
                <h1 className="text-white mb-3" style={{ fontWeight: '800', fontSize: '42px', color: '#4ade80', letterSpacing: '1px' }}>
                  {previewCert.studentName}
                </h1>

                <p className="text-muted mb-2" style={{ fontSize: '14px' }}>for successfully fulfilling all training requirements and completing the industrial internship in</p>
                
                {(() => {
                  const fullStr = String(previewCert.courseTitle || previewCert.domain || '').trim();
                  const match = fullStr.match(/^(.*?)\s*\((.*?)\)$/);
                  const title = match ? match[1].trim() : fullStr;
                  const rawDuration = match ? match[2].trim() : (previewCert.duration || null);
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
                      <strong className="text-warning font-monospace d-block mb-2" style={{ fontSize: '16px' }}>{previewCert.certificateId}</strong>
                      <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Issue Date</span>
                      <strong className="text-white" style={{ fontSize: '14px' }}>{previewCert.issueDate || 'July 26, 2026'}</strong>
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
                      <strong className="text-info d-block" style={{ fontSize: '16px' }}>{previewCert.performanceGrade || previewCert.grade || 'Excellence (A+)'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="d-flex flex-wrap align-items-center justify-content-between pt-4 mt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  Issued by <strong>Appifyra Certification Board</strong>
                </span>
                <div className="d-flex gap-2 no-print">
                  <button onClick={handlePrintCert} className="btn btn-success btn-glow-hover px-4" style={{ borderRadius: '10px', fontWeight: '700' }}>
                    <i className="fas fa-download me-2"></i> Download / Print PDF
                  </button>
                  <button onClick={() => setPreviewCert(null)} className="btn btn-outline-light px-3" style={{ borderRadius: '10px' }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: My Applications Section */}
        {activeTab === 'applications' && (
          <div className="mb-5 no-print">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="text-white mb-0" style={{ fontWeight: '700' }}>My Internship Applications</h3>
              <span className="badge bg-primary px-3 py-2" style={{ fontSize: '13px' }}>Total: {applications.length}</span>
            </div>

            {loading ? (
              <CardSkeletonGrid count={4} />
            ) : applications.length === 0 ? (
              <div 
                className="p-5 text-center text-white"
                style={{
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)'
                }}
              >
                <i className="fas fa-folder-open mb-3 text-muted" style={{ fontSize: '48px' }}></i>
                <h4 className="text-white fw-bold">No Submitted Applications Yet</h4>
                <p className="text-muted" style={{ maxWidth: '450px', margin: '0 auto 20px', fontSize: '14px' }}>
                  You haven't submitted any internship applications yet. Choose from our 45-Day or 6-Month programs to get started!
                </p>
                <Link to="/internship" className="btn btn-primary btn-glow-hover px-4 py-2" style={{ borderRadius: '10px', fontWeight: '600' }}>
                  <i className="fas fa-graduation-cap me-2"></i> Browse Internship Programs
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {applications.map((app) => (
                  <div className="col-lg-6" key={app.id}>
                    <div 
                      className="p-4 text-white h-100 pos-rel interactive-hover-card"
                      style={{
                        borderRadius: '20px',
                        backgroundColor: 'rgba(15, 18, 41, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge px-3 py-2" style={{ backgroundColor: 'rgba(103, 128, 210, 0.2)', color: '#a5b4fc', border: '1px solid rgba(103, 128, 210, 0.3)', fontWeight: '700' }}>
                          {app.duration}
                        </span>
                        {getStatusBadge(app.status)}
                      </div>

                      <h4 className="text-white mb-2" style={{ fontWeight: '700' }}>{app.domain}</h4>
                      <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                        <i className="fas fa-university me-1 text-primary"></i> {app.college} ({app.degree})
                      </p>

                      <div className="pt-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '13px' }}>
                        <span className="text-muted">
                          Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                        <span className="text-white-50 font-monospace">
                          ID: {app.id.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Issued Certificates Section */}
        {activeTab === 'certificates' && (
          <div className="mb-5 no-print">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>My Issued Certificates</h3>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Official credentials issued by Appifyra Certification Board.</p>
              </div>
              <span className="badge bg-success px-3 py-2" style={{ fontSize: '14px', fontWeight: '700' }}>Total: {certificates.length}</span>
            </div>

            {loading ? (
              <CardSkeletonGrid count={4} />
            ) : certificates.length === 0 ? (
              <div 
                className="p-5 text-center text-white"
                style={{
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)'
                }}
              >
                <i className="fas fa-award mb-3 text-muted" style={{ fontSize: '48px' }}></i>
                <h4 className="text-white fw-bold">No Issued Certificates Yet</h4>
                <p className="text-muted" style={{ maxWidth: '480px', margin: '0 auto 20px', fontSize: '14px' }}>
                  Once you complete your internship track, your verified completion certificate will be issued here by the administration.
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {certificates.map((cert) => (
                  <div className="col-lg-6" key={cert.id || cert.certificateId}>
                    <div 
                      className="p-4 text-white h-100 pos-rel d-flex flex-column justify-content-between interactive-hover-card"
                      style={{
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(67, 29, 171, 0.3) 0%, rgba(1, 3, 21, 0.95) 100%)',
                        border: '1px solid rgba(74, 222, 128, 0.45)'
                      }}
                    >
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-warning text-dark font-monospace px-3 py-2" style={{ fontSize: '13px', fontWeight: '800' }}>
                            <i className="fas fa-certificate me-1"></i> {cert.certificateId}
                          </span>
                          <span className="badge bg-success px-3 py-2" style={{ fontWeight: '700' }}>
                            <i className="fas fa-check-circle me-1"></i> Verified Credential
                          </span>
                        </div>

                        <h4 className="text-white mb-2" style={{ fontWeight: '800' }}>
                          {cert.courseTitle || cert.domain}
                        </h4>
                        <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                          Student: <strong className="text-white">{cert.studentName}</strong> ({cert.studentEmail})
                        </p>

                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="text-muted" style={{ fontSize: '13px' }}>Grade:</span>
                          <span className="badge bg-primary px-3 py-1" style={{ fontSize: '13px', fontWeight: '700' }}>
                            {cert.performanceGrade || cert.grade || 'Excellence (A+)'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <span className="text-muted" style={{ fontSize: '12px' }}>
                          Issued: {cert.issueDate || (cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'Recent')}
                        </span>
                        
                        <div className="d-flex gap-2">
                          <button 
                            onClick={() => setPreviewCert(cert)} 
                            className="btn btn-sm btn-info btn-glow-hover text-dark px-3"
                            style={{ borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}
                          >
                            <i className="fas fa-eye me-1"></i> View Certificate
                          </button>
                          
                          <button 
                            onClick={() => setPreviewCert(cert)} 
                            className="btn btn-sm btn-success btn-glow-hover px-3"
                            style={{ borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}
                          >
                            <i className="fas fa-download me-1"></i> Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
