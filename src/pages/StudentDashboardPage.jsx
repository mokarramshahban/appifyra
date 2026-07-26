import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentApplications, getStudentCertificates } from '../services/dbService';
import { Link } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';

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
        return <span className="badge bg-success"><i className="fas fa-check-circle me-1"></i> Approved</span>;
      case 'Completed':
        return <span className="badge bg-info text-dark"><i className="fas fa-award me-1"></i> Completed</span>;
      case 'Rejected':
        return <span className="badge bg-danger"><i className="fas fa-times-circle me-1"></i> Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark"><i className="fas fa-clock me-1"></i> Under Review</span>;
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
            border: '1px solid rgba(174, 109, 254, 0.3)'
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <UserAvatar name={currentUser?.displayName || currentUser?.email} size={64} borderColor="#ae6dfe" />
              <div>
                <span className="badge bg-primary mb-1">STUDENT PORTAL</span>
                <h2 className="text-white mb-0" style={{ fontWeight: '700' }}>Welcome, {currentUser?.displayName || 'Student'}</h2>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>{currentUser?.email}</p>
              </div>
            </div>
            <Link to="/internship" className="btn btn-primary px-4 py-2" style={{ borderRadius: '10px', fontWeight: '600' }}>
              <i className="fas fa-plus-circle me-1"></i> Apply for New Internship
            </Link>
          </div>

          {/* Student Dashboard Navigation Tabs */}
          <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top border-secondary">
            <button 
              onClick={() => setActiveTab('applications')}
              className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline-light'}`}
              style={{ borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}
            >
              📋 My Applications ({applications.length})
            </button>

            <button 
              onClick={() => setActiveTab('certificates')}
              className={`btn ${activeTab === 'certificates' ? 'btn-success' : 'btn-outline-success'}`}
              style={{ borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}
            >
              🏅 My Issued Certificates ({certificates.length})
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
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 9999,
              backdropFilter: 'blur(8px)'
            }}
          >
            <div 
              className="printable-cert-card p-4 p-md-5 text-white pos-rel w-100"
              style={{
                maxWidth: '850px',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '24px',
                border: '2px solid rgba(74, 222, 128, 0.5)',
                background: 'linear-gradient(135deg, rgba(6, 40, 26, 0.98) 0%, rgba(1, 3, 21, 0.98) 100%)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(74, 222, 128, 0.2)'
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
                <img src="/assets/img/logo/appifyra logo white.svg" alt="Appifyra" style={{ height: '54px', marginBottom: '24px' }} />
                <h4 className="text-uppercase mb-2" style={{ letterSpacing: '5px', fontSize: '15px', color: '#a5b4fc', fontWeight: '700' }}>
                  Certificate of Completion
                </h4>
                <p className="text-muted mb-4" style={{ fontSize: '14px' }}>This is to certify that</p>
                
                <h1 className="text-white mb-2" style={{ fontWeight: '800', fontSize: '40px', color: '#4ade80', letterSpacing: '1px' }}>
                  {previewCert.studentName}
                </h1>
                <p className="text-info mb-4" style={{ fontSize: '14px' }}>({previewCert.studentEmail})</p>

                <p className="text-muted mb-2" style={{ fontSize: '14px' }}>has successfully completed the industrial internship program in</p>
                <h3 className="mb-4" style={{ color: '#c084fc', fontWeight: '700', fontSize: '26px' }}>
                  {previewCert.courseTitle || previewCert.domain}
                </h3>

                <div className="d-flex flex-wrap justify-content-center gap-5 py-4 my-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div>
                    <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Certificate ID</span>
                    <strong className="text-warning font-monospace" style={{ fontSize: '17px' }}>{previewCert.certificateId}</strong>
                  </div>
                  <div>
                    <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Performance Grade</span>
                    <strong className="text-info" style={{ fontSize: '17px' }}>{previewCert.performanceGrade || previewCert.grade || 'Excellence (A+)'}</strong>
                  </div>
                  <div>
                    <span className="text-muted text-uppercase d-block" style={{ fontSize: '11px', letterSpacing: '1px' }}>Issue Date</span>
                    <strong className="text-white" style={{ fontSize: '17px' }}>{previewCert.issueDate || 'July 26, 2026'}</strong>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="d-flex flex-wrap align-items-center justify-content-between pt-4 mt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  Issued by <strong>Appifyra Certification Board</strong>
                </span>
                <div className="d-flex gap-2 no-print">
                  <button onClick={handlePrintCert} className="btn btn-success px-4" style={{ borderRadius: '10px', fontWeight: '700' }}>
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
              <span className="text-muted" style={{ fontSize: '14px' }}>Total Applications: {applications.length}</span>
            </div>

            {loading ? (
              <div className="text-center py-5 text-white">
                <i className="fas fa-spinner fa-spin me-2"></i> Loading application status...
              </div>
            ) : applications.length === 0 ? (
              <div 
                className="p-5 text-center text-white"
                style={{
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)'
                }}
              >
                <i className="fas fa-folder-open mb-3 text-muted" style={{ fontSize: '42px' }}></i>
                <h4 className="text-white">No Submitted Applications Yet</h4>
                <p className="text-muted" style={{ maxWidth: '450px', margin: '0 auto 20px' }}>
                  You haven't submitted any internship applications yet. Choose from our 45-Day or 6-Month programs to get started!
                </p>
                <Link to="/internship" className="btn btn-outline-light" style={{ borderRadius: '8px' }}>
                  Browse Internship Programs
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {applications.map((app) => (
                  <div className="col-lg-6" key={app.id}>
                    <div 
                      className="p-4 text-white h-100 pos-rel"
                      style={{
                        borderRadius: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge px-3 py-2" style={{ backgroundColor: 'rgba(103, 128, 210, 0.2)', color: '#a5b4fc', border: '1px solid rgba(103, 128, 210, 0.3)' }}>
                          {app.duration}
                        </span>
                        {getStatusBadge(app.status)}
                      </div>

                      <h4 className="text-white mb-2" style={{ fontWeight: '600' }}>{app.domain}</h4>
                      <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                        <i className="fas fa-university me-1"></i> {app.college} ({app.degree})
                      </p>

                      <div className="pt-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '13px' }}>
                        <span className="text-muted">
                          Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                        <span className="text-white font-monospace">
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
              <span className="badge bg-success px-3 py-2" style={{ fontSize: '14px' }}>Total Certificates: {certificates.length}</span>
            </div>

            {loading ? (
              <div className="text-center py-5 text-white">
                <i className="fas fa-spinner fa-spin me-2"></i> Loading certificates...
              </div>
            ) : certificates.length === 0 ? (
              <div 
                className="p-5 text-center text-white"
                style={{
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)'
                }}
              >
                <i className="fas fa-award mb-3 text-muted" style={{ fontSize: '42px' }}></i>
                <h4 className="text-white">No Issued Certificates Yet</h4>
                <p className="text-muted" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
                  Once you complete your internship track, your verified completion certificate will be issued here by the administration.
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {certificates.map((cert) => (
                  <div className="col-lg-6" key={cert.id || cert.certificateId}>
                    <div 
                      className="p-4 text-white h-100 pos-rel d-flex flex-column justify-content-between"
                      style={{
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(67, 29, 171, 0.25) 0%, rgba(1, 3, 21, 0.95) 100%)',
                        border: '1px solid rgba(74, 222, 128, 0.4)'
                      }}
                    >
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-warning text-dark font-monospace" style={{ fontSize: '13px', fontWeight: '700' }}>
                            <i className="fas fa-certificate me-1"></i> {cert.certificateId}
                          </span>
                          <span className="badge bg-success">
                            <i className="fas fa-check-circle me-1"></i> Verified Credential
                          </span>
                        </div>

                        <h4 className="text-white mb-2" style={{ fontWeight: '700' }}>
                          {cert.courseTitle || cert.domain}
                        </h4>
                        <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                          Student: <strong className="text-white">{cert.studentName}</strong> ({cert.studentEmail})
                        </p>

                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="text-muted" style={{ fontSize: '13px' }}>Grade:</span>
                          <span className="badge bg-primary px-3 py-1" style={{ fontSize: '13px' }}>
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
                            className="btn btn-sm btn-info text-dark px-3"
                            style={{ borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}
                          >
                            <i className="fas fa-eye me-1"></i> View Certificate
                          </button>
                          
                          <button 
                            onClick={() => setPreviewCert(cert)} 
                            className="btn btn-sm btn-success px-3"
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
