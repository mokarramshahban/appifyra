import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAllApplications, 
  getContactInquiries,
  getAllCertificates,
  getAllSubscribers,
  updateSubscriber,
  deleteSubscriber,
  updateApplication,
  deleteApplication,
  updateInquiry,
  deleteInquiry,
  updateApplicationStatus, 
  issueCertificate, 
  updateIssuedCertificate,
  deleteIssuedCertificate,
  getNextCertificateId 
} from '../services/dbService';
import { sendCertificateEmail, sendStatusUpdateEmail, sendNewsletterBroadcast } from '../services/emailService';
import UserAvatar from '../components/common/UserAvatar';

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('hero-quick');
  const [applications, setApplications] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [issuedCerts, setIssuedCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Edit Modals / Form Overlay State
  const [editingApp, setEditingApp] = useState(null);
  const [appEditForm, setAppEditForm] = useState({ fullName: '', email: '', duration: '45-Days', domain: 'Web Development', status: 'Under Review' });

  const [editingInq, setEditingInq] = useState(null);
  const [inqEditForm, setInqEditForm] = useState({ fullName: '', email: '', subject: '', message: '' });

  const [editingSub, setEditingSub] = useState(null);
  const [subEditEmail, setSubEditEmail] = useState('');

  const [editingCert, setEditingCert] = useState(null);
  const [certEditForm, setCertEditForm] = useState({ studentName: '', studentEmail: '', domain: '', performanceGrade: '' });

  // Form Saving State
  const [isSavingAppEdit, setIsSavingAppEdit] = useState(false);
  const [isSavingInqEdit, setIsSavingInqEdit] = useState(false);
  const [isSavingSubEdit, setIsSavingSubEdit] = useState(false);
  const [isSavingCertEdit, setIsSavingCertEdit] = useState(false);

  // Broadcast Newsletter Form State
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState('');

  // Handle Broadcast Newsletter Send
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!newsletterSubject.trim() || !newsletterMessage.trim()) {
      setBroadcastStatus('❌ Please enter both subject and message content.');
      return;
    }

    if (!subscribers || subscribers.length === 0) {
      setBroadcastStatus('❌ No subscribers found in database.');
      return;
    }

    if (!window.confirm(`Are you sure you want to send this broadcast email to all ${subscribers.length} subscribers?`)) {
      return;
    }

    setIsSendingBroadcast(true);
    setBroadcastStatus('⌛ Broadcasting email to all subscribers...');

    try {
      const result = await sendNewsletterBroadcast({
        subject: newsletterSubject.trim(),
        message: newsletterMessage.trim()
      });

      if (result && result.success) {
        setBroadcastStatus(`✅ ${result.message || 'Broadcast newsletter sent successfully!'}`);
        setNewsletterSubject('');
        setNewsletterMessage('');
      } else {
        setBroadcastStatus(`❌ Broadcast error: ${result ? (result.error || result.message) : 'Server failed to respond'}`);
      }
    } catch (err) {
      setBroadcastStatus(`❌ Broadcast failed: ${err.message}`);
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  // Issue Certificate Form State
  const gradeOptions = ['Excellence (A+)', 'Very Good (A)', 'Good (B+)', 'Satisfactory (B)', 'Pass (C)'];
  const [certForm, setCertForm] = useState({
    certificateId: '',
    studentName: '',
    studentEmail: '',
    domain: 'Web Development Internship',
    issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    grade: 'Excellence (A+)',
    skills: 'React.js, JavaScript, HTML/CSS, REST APIs'
  });
  const [isIssuing, setIsIssuing] = useState(false);
  const [certSubmitted, setCertSubmitted] = useState(false);
  const [certError, setCertError] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    const appData = await getAllApplications();
    const inqData = await getContactInquiries();
    const subData = await getAllSubscribers();
    const certData = await getAllCertificates();
    setApplications(appData);
    setInquiries(inqData);
    setSubscribers(subData);
    setIssuedCerts(certData);
    setLoading(false);
  };

  const loadNextCertId = async () => {
    const nextId = await getNextCertificateId();
    setCertForm(prev => ({ ...prev, certificateId: nextId }));
  };

  useEffect(() => {
    loadAllData();
    loadNextCertId();
  }, []);

  // Handle Application Status Change & Automated Email Dispatch
  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    const targetApp = applications.find(a => a.id === appId || a._id === appId);
    const updatedObj = { ...(targetApp || {}), status: newStatus };
    
    await updateApplication(appId, updatedObj);
    setApplications(prev => prev.map(a => (a.id === appId || a._id === appId) ? { ...a, status: newStatus } : a));

    const emailToUse = targetApp?.email || targetApp?.studentEmail;
    const nameToUse = targetApp?.fullName || targetApp?.studentName || targetApp?.name || 'Candidate';
    const domainToUse = targetApp?.domain || targetApp?.target_domain || targetApp?.courseTitle || 'Software Program';
    const durationToUse = targetApp?.duration || targetApp?.internship_duration || '45-Days';

    if (emailToUse) {
      const emailRes = await sendStatusUpdateEmail({
        studentEmail: emailToUse,
        studentName: nameToUse,
        status: newStatus,
        domain: domainToUse,
        duration: durationToUse
      });
      console.log(`✅ Status email dispatch result for ${emailToUse}:`, emailRes);
    }

    setTimeout(() => {
      setUpdatingId(null);
    }, 900);
  };

  // Subscriber Actions
  const handleDeleteSub = async (sub) => {
    if (window.confirm(`Delete subscriber email ${sub.email}?`)) {
      await deleteSubscriber(sub.id);
      setSubscribers(prev => prev.filter(s => s.id !== sub.id));
    }
  };

  const handleOpenEditSub = (sub) => {
    setEditingSub(sub);
    setSubEditEmail(sub.email || '');
  };

  const handleSaveEditSub = async (e) => {
    e.preventDefault();
    if (!editingSub) return;
    setIsSavingSubEdit(true);
    try {
      await updateSubscriber(editingSub.id, subEditEmail);
      setSubscribers(prev => prev.map(s => s.id === editingSub.id ? { ...s, email: subEditEmail } : s));
      setEditingSub(null);
    } catch (err) {
      console.error('Error saving subscriber edit:', err);
    } finally {
      setIsSavingSubEdit(false);
    }
  };

  // Application Delete & Edit
  const handleDeleteApp = async (app) => {
    if (window.confirm(`Delete application for ${app.fullName}?`)) {
      await deleteApplication(app.id);
      setApplications(prev => prev.filter(a => a.id !== app.id));
    }
  };

  const handleOpenEditApp = (app) => {
    setEditingApp(app);
    setAppEditForm({
      fullName: app.fullName || '',
      email: app.email || '',
      duration: app.duration || '45-Days',
      domain: app.domain || 'Web Development',
      status: app.status || 'Under Review'
    });
  };

  const handleSaveEditApp = async (e) => {
    e.preventDefault();
    if (!editingApp) return;
    setIsSavingAppEdit(true);

    try {
      await updateApplication(editingApp.id, appEditForm);
      setApplications(prev => prev.map(a => a.id === editingApp.id ? { ...a, ...appEditForm } : a));
      
      // Fire-and-forget background email notification
      if (appEditForm.email) {
        sendStatusUpdateEmail({
          studentEmail: appEditForm.email,
          studentName: appEditForm.fullName || 'Candidate',
          status: appEditForm.status || 'Under Review',
          domain: appEditForm.domain || 'Software Program',
          duration: appEditForm.duration || '45-Days'
        }).catch(err => console.error('Status update email dispatch error:', err));
      }

      setEditingApp(null);
    } catch (err) {
      console.error('Error saving application edit:', err);
    } finally {
      setIsSavingAppEdit(false);
    }
  };

  // Inquiry Delete & Edit
  const handleDeleteInquiry = async (inq) => {
    if (window.confirm(`Delete inquiry from ${inq.fullName}?`)) {
      await deleteInquiry(inq.id);
      setInquiries(prev => prev.filter(i => i.id !== inq.id));
    }
  };

  const handleOpenEditInq = (inq) => {
    setEditingInq(inq);
    setInqEditForm({
      fullName: inq.fullName || '',
      email: inq.email || '',
      subject: inq.subject || '',
      message: inq.message || ''
    });
  };

  const handleSaveEditInq = async (e) => {
    e.preventDefault();
    if (!editingInq) return;
    setIsSavingInqEdit(true);
    try {
      await updateInquiry(editingInq.id, inqEditForm);
      setInquiries(prev => prev.map(i => i.id === editingInq.id ? { ...i, ...inqEditForm } : i));
      setEditingInq(null);
    } catch (err) {
      console.error('Error saving inquiry edit:', err);
    } finally {
      setIsSavingInqEdit(false);
    }
  };

  // Issue Certificate & Quick Issue with Automated Email Dispatch
  const handleQuickIssue = async (app) => {
    const nextId = await getNextCertificateId();
    setCertForm({
      certificateId: nextId,
      studentName: app.fullName,
      studentEmail: app.email,
      domain: `${app.domain} (${app.duration})`,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      grade: 'Excellence (A+)',
      skills: 'React.js, JavaScript, HTML/CSS, REST APIs'
    });
    setActiveTab('issue-cert');
  };

  const handleIssueCert = async (e) => {
    e.preventDefault();
    setCertError('');
    if (!certForm.certificateId || !certForm.studentName || !certForm.studentEmail) {
      setCertError('Please fill in Certificate ID, Student Name, and Student Email.');
      return;
    }

    setIsIssuing(true);
    const certData = {
      ...certForm,
      performanceGrade: certForm.grade,
      skills: certForm.skills.split(',').map(s => s.trim())
    };

    const result = await issueCertificate(certData);

    if (result.success) {
      // Automated Email Notification to Candidate on Certificate Issuance
      sendCertificateEmail({
        studentEmail: certForm.studentEmail,
        studentName: certForm.studentName,
        certificateId: certForm.certificateId,
        domain: certForm.domain,
        grade: certForm.grade,
        issueDate: certForm.issueDate
      });

      setCertSubmitted(true);
      loadAllData();
    } else {
      setCertError('Failed to issue certificate. Please try again.');
    }
    setIsIssuing(false);
  };

  // Certificate Delete & Edit
  const handleDeleteCert = async (cert) => {
    if (window.confirm(`Are you sure you want to delete Certificate ${cert.certificateId}?`)) {
      await deleteIssuedCertificate(cert.certificateId, cert.id);
      setIssuedCerts(prev => prev.filter(c => c.certificateId !== cert.certificateId && c.id !== cert.id));
    }
  };

  const handleOpenEditCert = (cert) => {
    setEditingCert(cert);
    setCertEditForm({
      studentName: cert.studentName || '',
      studentEmail: cert.studentEmail || '',
      domain: cert.courseTitle || cert.domain || '',
      performanceGrade: cert.performanceGrade || cert.grade || 'Excellence (A+)'
    });
  };

  const handleSaveEditCert = async (e) => {
    e.preventDefault();
    if (!editingCert) return;
    setIsSavingCertEdit(true);

    try {
      const targetId = editingCert.id || editingCert.certificateId;
      await updateIssuedCertificate(targetId, {
        certificateId: editingCert.certificateId,
        studentName: certEditForm.studentName,
        studentEmail: certEditForm.studentEmail,
        courseTitle: certEditForm.domain,
        domain: certEditForm.domain,
        performanceGrade: certEditForm.performanceGrade
      });

      setIssuedCerts(prev => prev.map(c => 
        (c.certificateId === editingCert.certificateId || c.id === editingCert.id)
          ? { ...c, ...certEditForm }
          : c
      ));

      // Automated Email Trigger on Certificate Edit
      if (certEditForm.studentEmail) {
        sendCertIssuedEmail({
          studentEmail: certEditForm.studentEmail,
          studentName: certEditForm.studentName,
          certificateId: editingCert.certificateId,
          domain: certEditForm.domain,
          grade: certEditForm.performanceGrade,
          issueDate: editingCert.issueDate || new Date().toLocaleDateString()
        }).catch(err => console.error('Cert edit email trigger error:', err));
      }

      setEditingCert(null);
    } catch (err) {
      console.error('Error saving certificate edit:', err);
    } finally {
      setIsSavingCertEdit(false);
    }
  };

  // Filter Form Submissions by Form Source
  const heroQuickApps = applications.filter(a => 
    a.message === 'Applied from Hero Quick Form' || a.college === 'Quick Applied via Homepage'
  );

  const fullInternshipApps = applications.filter(a => 
    a.message !== 'Applied from Hero Quick Form' && a.college !== 'Quick Applied via Homepage'
  );

  return (
    <div className="pt-140 pb-100 pos-rel">
      <div className="container">
        {/* Admin Header */}
        <div 
          className="p-4 p-md-5 mb-5 text-white pos-rel"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(67, 29, 171, 0.6) 0%, rgba(1, 3, 21, 0.98) 100%)',
            border: '1px solid rgba(174, 109, 254, 0.4)'
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <UserAvatar name={currentUser?.displayName || currentUser?.email || 'Admin'} size={64} borderColor="#4ade80" />
              <div>
                <span className="badge bg-success mb-1">ADMINISTRATOR CONTROL PANEL</span>
                <h2 className="text-white mb-0" style={{ fontWeight: '700' }}>Appifyra Admin Portal</h2>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Logged in as: {currentUser?.email}</p>
              </div>
            </div>

            <button onClick={loadAllData} className="btn btn-outline-light btn-sm" title="Refresh All Data">
              <i className="fas fa-sync-alt me-1"></i> Refresh Data
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top border-secondary">
            <button 
              onClick={() => setActiveTab('hero-quick')}
              className={`btn ${activeTab === 'hero-quick' ? 'btn-primary' : 'btn-outline-light'}`}
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}
            >
              🚀 1. Hero Quick Applies ({heroQuickApps.length})
            </button>

            <button 
              onClick={() => setActiveTab('full-internship')}
              className={`btn ${activeTab === 'full-internship' ? 'btn-primary' : 'btn-outline-light'}`}
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}
            >
              🎓 2. Full Internship Applications ({fullInternshipApps.length})
            </button>

            <button 
              onClick={() => setActiveTab('contact-inquiries')}
              className={`btn ${activeTab === 'contact-inquiries' ? 'btn-primary' : 'btn-outline-light'}`}
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}
            >
              ✉️ 3. Contact Inquiries ({inquiries.length})
            </button>

            <button 
              onClick={() => setActiveTab('subscribers')}
              className={`btn ${activeTab === 'subscribers' ? 'btn-primary' : 'btn-outline-light'}`}
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}
            >
              📩 4. Community Subscribers ({subscribers.length})
            </button>

            <button 
              onClick={() => setActiveTab('issued-certs')}
              className={`btn ${activeTab === 'issued-certs' ? 'btn-info text-dark font-weight-bold' : 'btn-outline-info'}`}
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}
            >
              🏅 Issued Certificates ({issuedCerts.length})
            </button>

            <button 
              onClick={() => {
                setActiveTab('issue-cert');
                loadNextCertId();
              }}
              className={`btn ${activeTab === 'issue-cert' ? 'btn-success' : 'btn-outline-success'}`}
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}
            >
              📜 Issue Certificate Tool
            </button>
          </div>
        </div>

        {/* Global Application Edit Overlay */}
        {editingApp && (
          <div className="p-4 mb-4 text-white" style={{ backgroundColor: 'rgba(67, 29, 171, 0.3)', border: '1px solid rgba(174, 109, 254, 0.4)', borderRadius: '16px' }}>
            <h4 className="text-white mb-3"><i className="fas fa-edit me-2"></i> Edit Application for {editingApp.fullName}</h4>
            <form onSubmit={handleSaveEditApp}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted">Full Name</label>
                  <input type="text" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={appEditForm.fullName} onChange={(e) => setAppEditForm({ ...appEditForm, fullName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Email Address</label>
                  <input type="email" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={appEditForm.email} onChange={(e) => setAppEditForm({ ...appEditForm, email: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">Program Track</label>
                  <select className="form-select text-white" style={{ backgroundColor: '#090536' }} value={appEditForm.duration} onChange={(e) => setAppEditForm({ ...appEditForm, duration: e.target.value })}>
                    <option value="45-Days">45-Days</option>
                    <option value="6-Months">6-Months</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">Target Domain</label>
                  <input type="text" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={appEditForm.domain} onChange={(e) => setAppEditForm({ ...appEditForm, domain: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">Application Status</label>
                  <select className="form-select text-white" style={{ backgroundColor: '#090536' }} value={appEditForm.status} onChange={(e) => setAppEditForm({ ...appEditForm, status: e.target.value })}>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="col-12 mt-3 d-flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isSavingAppEdit} 
                    className="btn btn-success px-4 py-2 font-weight-bold"
                    style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                  >
                    {isSavingAppEdit ? (
                      <span><i className="fas fa-spinner fa-spin me-2"></i> Saving & Sending Notification...</span>
                    ) : (
                      <span><i className="fas fa-save me-1"></i> Save Changes</span>
                    )}
                  </button>
                  <button type="button" onClick={() => setEditingApp(null)} className="btn btn-secondary" style={{ borderRadius: '10px' }}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Global Inquiry Edit Overlay */}
        {editingInq && (
          <div className="p-4 mb-4 text-white" style={{ backgroundColor: 'rgba(67, 29, 171, 0.3)', border: '1px solid rgba(174, 109, 254, 0.4)', borderRadius: '16px' }}>
            <h4 className="text-white mb-3"><i className="fas fa-edit me-2"></i> Edit Contact Inquiry from {editingInq.fullName}</h4>
            <form onSubmit={handleSaveEditInq}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted">Sender Name</label>
                  <input type="text" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={inqEditForm.fullName} onChange={(e) => setInqEditForm({ ...inqEditForm, fullName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Sender Email</label>
                  <input type="email" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={inqEditForm.email} onChange={(e) => setInqEditForm({ ...inqEditForm, email: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted">Subject / Topic</label>
                  <input type="text" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={inqEditForm.subject} onChange={(e) => setInqEditForm({ ...inqEditForm, subject: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted">Message Body</label>
                  <textarea rows="3" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={inqEditForm.message} onChange={(e) => setInqEditForm({ ...inqEditForm, message: e.target.value })} required></textarea>
                </div>
                <div className="col-12 mt-3 d-flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isSavingInqEdit} 
                    className="btn btn-success px-4 py-2 font-weight-bold"
                    style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                  >
                    {isSavingInqEdit ? (
                      <span><i className="fas fa-spinner fa-spin me-2"></i> Saving Inquiry...</span>
                    ) : (
                      <span><i className="fas fa-save me-1"></i> Save Changes</span>
                    )}
                  </button>
                  <button type="button" onClick={() => setEditingInq(null)} className="btn btn-secondary" style={{ borderRadius: '10px' }}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Global Subscriber Edit Overlay */}
        {editingSub && (
          <div className="p-4 mb-4 text-white" style={{ backgroundColor: 'rgba(67, 29, 171, 0.3)', border: '1px solid rgba(174, 109, 254, 0.4)', borderRadius: '16px' }}>
            <h4 className="text-white mb-3"><i className="fas fa-edit me-2"></i> Edit Subscriber Email</h4>
            <form onSubmit={handleSaveEditSub}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label text-muted">Email Address</label>
                  <input type="email" className="form-control text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} value={subEditEmail} onChange={(e) => setSubEditEmail(e.target.value)} required />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isSavingSubEdit} 
                    className="btn btn-success px-4 py-2 font-weight-bold"
                    style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                  >
                    {isSavingSubEdit ? (
                      <span><i className="fas fa-spinner fa-spin me-2"></i> Saving Email...</span>
                    ) : (
                      <span><i className="fas fa-save me-1"></i> Save Email</span>
                    )}
                  </button>
                  <button type="button" onClick={() => setEditingSub(null)} className="btn btn-secondary" style={{ borderRadius: '10px' }}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Section 1: Hero Quick Apply Submissions */}
        {activeTab === 'hero-quick' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>Form 1: Hero Quick Apply Submissions</h3>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Submissions received directly from the Homepage Hero Quick Form.</p>
              </div>
              <span className="badge bg-primary px-3 py-2" style={{ fontSize: '14px' }}>Total: {heroQuickApps.length}</span>
            </div>

            {loading ? (
              <div className="text-center py-5 text-white"><i className="fas fa-spinner fa-spin me-2"></i> Loading Quick Submissions...</div>
            ) : heroQuickApps.length === 0 ? (
              <div className="p-5 text-center text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px' }}>
                <i className="fas fa-inbox mb-3 text-muted" style={{ fontSize: '38px' }}></i>
                <h4>No Hero Quick Submissions Yet</h4>
                <p className="text-muted">Applications submitted via the homepage Quick Apply form will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#a5b4fc' }}>
                      <th>Candidate Name</th>
                      <th>Candidate Email</th>
                      <th>Program Track</th>
                      <th>Target Domain</th>
                      <th>Status</th>
                      <th style={{ minWidth: '320px' }}>Actions Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroQuickApps.map(app => (
                      <tr key={app.id} className={updatingId === app.id ? 'row-status-updating' : ''}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <UserAvatar name={app.fullName} size={32} />
                            <strong className="text-white">{app.fullName}</strong>
                          </div>
                        </td>
                        <td className="text-info">{app.email}</td>
                        <td><span className="badge bg-secondary">{app.duration}</span></td>
                        <td style={{ color: '#c084fc', fontWeight: '600' }}>{app.domain}</td>
                        <td>
                          <span className={`badge status-badge-anim ${app.status === 'Approved' ? 'bg-success' : app.status === 'Completed' ? 'bg-info text-dark' : app.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {updatingId === app.id ? <i className="fas fa-spinner fa-spin me-1"></i> : null}
                            {app.status || 'Under Review'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button onClick={() => handleOpenEditApp(app)} className="btn btn-sm btn-outline-info btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Edit Candidate Info & Status">
                              <i className="fas fa-edit me-1"></i> Edit
                            </button>

                            <button onClick={() => handleDeleteApp(app)} className="btn btn-sm btn-outline-danger btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Delete Record">
                              <i className="fas fa-trash-alt me-1"></i> Delete
                            </button>

                            <button onClick={() => handleQuickIssue(app)} className="btn btn-sm btn-outline-success btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Issue Certificate">
                              <i className="fas fa-certificate me-1"></i> Cert
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Full Internship Applications */}
        {activeTab === 'full-internship' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>Form 2: Full Internship Applications</h3>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Detailed candidate applications submitted from the /internship page.</p>
              </div>
              <span className="badge bg-primary px-3 py-2" style={{ fontSize: '14px' }}>Total: {fullInternshipApps.length}</span>
            </div>

            {loading ? (
              <div className="text-center py-5 text-white"><i className="fas fa-spinner fa-spin me-2"></i> Loading Full Applications...</div>
            ) : fullInternshipApps.length === 0 ? (
              <div className="p-5 text-center text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px' }}>
                <i className="fas fa-user-graduate mb-3 text-muted" style={{ fontSize: '38px' }}></i>
                <h4>No Full Applications Yet</h4>
                <p className="text-muted">Applications submitted from the Internship Program page will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#a5b4fc' }}>
                      <th>Candidate Name</th>
                      <th>Email & Phone</th>
                      <th>University & Degree</th>
                      <th>Track & Domain</th>
                      <th>Resume</th>
                      <th>Status</th>
                      <th style={{ minWidth: '320px' }}>Actions Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullInternshipApps.map(app => (
                      <tr key={app.id} className={updatingId === app.id ? 'row-status-updating' : ''}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <UserAvatar name={app.fullName} size={32} />
                            <strong className="text-white">{app.fullName}</strong>
                          </div>
                        </td>
                        <td style={{ fontSize: '13px' }}>
                          <div className="text-info">{app.email}</div>
                          <div className="text-muted">{app.phone}</div>
                        </td>
                        <td style={{ fontSize: '13px' }}>
                          <div>{app.college}</div>
                          <div className="text-muted">{app.degree}</div>
                        </td>
                        <td>
                          <span className="badge bg-secondary me-1">{app.duration}</span>
                          <div style={{ fontSize: '13px', color: '#c084fc', marginTop: '2px' }}>{app.domain}</div>
                        </td>
                        <td>
                          {app.resumeUrl ? (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#38bdf8' }}>
                              <i className="fas fa-file-pdf me-1"></i> View Resume
                            </a>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '12px' }}>N/A</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge status-badge-anim ${app.status === 'Approved' ? 'bg-success' : app.status === 'Completed' ? 'bg-info text-dark' : app.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {updatingId === app.id ? <i className="fas fa-spinner fa-spin me-1"></i> : null}
                            {app.status || 'Under Review'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button onClick={() => handleOpenEditApp(app)} className="btn btn-sm btn-outline-info btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Edit Candidate Info & Status">
                              <i className="fas fa-edit me-1"></i> Edit
                            </button>

                            <button onClick={() => handleDeleteApp(app)} className="btn btn-sm btn-outline-danger btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Delete Record">
                              <i className="fas fa-trash-alt me-1"></i> Delete
                            </button>

                            <button onClick={() => handleQuickIssue(app)} className="btn btn-sm btn-outline-success btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Issue Certificate">
                              <i className="fas fa-certificate me-1"></i> Cert
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Contact & General Inquiries */}
        {activeTab === 'contact-inquiries' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>Form 3: Contact & General Inquiries</h3>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Inquiry messages submitted from the /contact page form.</p>
              </div>
              <span className="badge bg-primary px-3 py-2" style={{ fontSize: '14px' }}>Total: {inquiries.length}</span>
            </div>

            {loading ? (
              <div className="text-center py-5 text-white"><i className="fas fa-spinner fa-spin me-2"></i> Loading Inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-5 text-center text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px' }}>
                <i className="fas fa-envelope-open-text mb-3 text-muted" style={{ fontSize: '38px' }}></i>
                <h4>No Contact Inquiries Yet</h4>
                <p className="text-muted">Messages submitted via the Contact Us section will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#a5b4fc' }}>
                      <th>Sender Name</th>
                      <th>Email Address</th>
                      <th>Subject / Topic</th>
                      <th>Message Body</th>
                      <th>Date</th>
                      <th style={{ minWidth: '180px' }}>Actions Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq, idx) => (
                      <tr key={inq.id || idx}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <UserAvatar name={inq.fullName} size={32} />
                            <strong className="text-white">{inq.fullName}</strong>
                          </div>
                        </td>
                        <td className="text-info">{inq.email}</td>
                        <td style={{ color: '#c084fc', fontWeight: '600' }}>{inq.subject}</td>
                        <td style={{ fontSize: '13px', maxWidth: '280px' }}>{inq.message}</td>
                        <td className="text-muted" style={{ fontSize: '12px' }}>
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button onClick={() => handleOpenEditInq(inq)} className="btn btn-sm btn-outline-info btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Edit Inquiry">
                              <i className="fas fa-edit me-1"></i> Edit
                            </button>
                            <button onClick={() => handleDeleteInquiry(inq)} className="btn btn-sm btn-outline-danger btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Delete Inquiry">
                              <i className="fas fa-trash-alt me-1"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Community Newsletter Subscribers & Broadcast Tool */}
        {activeTab === 'subscribers' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>Community Newsletter & Broadcast Tool</h3>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>View all community subscribers and compose broadcast emails to send to all.</p>
              </div>
              <span className="badge bg-primary px-3 py-2" style={{ fontSize: '14px' }}>Total Subscribers: {subscribers.length}</span>
            </div>

            {/* Broadcast Newsletter Composer Box */}
            <div className="p-4 mb-4 text-white" style={{ backgroundColor: 'rgba(67, 29, 171, 0.35)', border: '1px solid rgba(174, 109, 254, 0.4)', borderRadius: '20px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="text-white mb-0" style={{ fontWeight: '700' }}>
                  <i className="fas fa-bullhorn text-warning me-2"></i> Send Broadcast Newsletter to All Subscribers
                </h4>
                <span className="badge bg-success" style={{ fontSize: '12px' }}>
                  Target: {subscribers.length} Recipient{subscribers.length === 1 ? '' : 's'}
                </span>
              </div>

              {broadcastStatus && (
                <div className={`alert py-2 mb-3 ${broadcastStatus.startsWith('✅') ? 'alert-success' : broadcastStatus.startsWith('⌛') ? 'alert-info' : 'alert-danger'}`} style={{ fontSize: '14px' }}>
                  {broadcastStatus}
                </div>
              )}

              <form onSubmit={handleSendBroadcast}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-white-50 mb-1" style={{ fontSize: '13px' }}>Newsletter Subject Line *</label>
                    <input 
                      type="text"
                      className="form-control text-white"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}
                      placeholder="e.g. 📢 New Tech Cohorts Open & Industry Updates"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-white-50 mb-1" style={{ fontSize: '13px' }}>Newsletter Message Content (HTML or Text) *</label>
                    <textarea 
                      className="form-control text-white"
                      rows={4}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px', fontSize: '14px' }}
                      placeholder="Type your announcement, newsletter content, or update message here..."
                      value={newsletterMessage}
                      onChange={(e) => setNewsletterMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-end">
                    <button
                      type="submit"
                      disabled={isSendingBroadcast || subscribers.length === 0}
                      className="btn btn-warning text-dark font-weight-bold px-4 py-2"
                      style={{ borderRadius: '10px' }}
                    >
                      {isSendingBroadcast ? (
                        <span><i className="fas fa-spinner fa-spin me-2"></i> Sending Broadcast...</span>
                      ) : (
                        <span><i className="fas fa-paper-plane me-2"></i> Send Broadcast to All {subscribers.length} Subscribers</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {loading ? (
              <div className="text-center py-5 text-white"><i className="fas fa-spinner fa-spin me-2"></i> Loading Subscribers...</div>
            ) : subscribers.length === 0 ? (
              <div className="p-5 text-center text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px' }}>
                <i className="fas fa-paper-plane mb-3 text-muted" style={{ fontSize: '38px' }}></i>
                <h4>No Newsletter Subscribers Yet</h4>
                <p className="text-muted">Emails submitted via the footer "Stay Updated" form will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#a5b4fc' }}>
                      <th>Subscriber Email</th>
                      <th>Subscribed Date</th>
                      <th style={{ minWidth: '180px' }}>Actions Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={sub.id || idx}>
                        <td className="text-info font-weight-bold">
                          <i className="fas fa-envelope me-2 text-muted"></i>
                          {sub.email}
                        </td>
                        <td className="text-muted" style={{ fontSize: '12px' }}>
                          {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button onClick={() => handleOpenEditSub(sub)} className="btn btn-sm btn-outline-info btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Edit Email">
                              <i className="fas fa-edit me-1"></i> Edit
                            </button>
                            <button onClick={() => handleDeleteSub(sub)} className="btn btn-sm btn-outline-danger btn-action-pill py-1 px-2" style={{ fontSize: '12px' }} title="Delete Subscriber">
                              <i className="fas fa-trash-alt me-1"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section 5: Issued Certificates Management */}
        {activeTab === 'issued-certs' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>Issued Certificates Management</h3>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>View, update student info/grade, or delete issued certificate records.</p>
              </div>
              <span className="badge bg-info text-dark px-3 py-2" style={{ fontSize: '14px', fontWeight: '700' }}>Total: {issuedCerts.length}</span>
            </div>

            {/* Edit Certificate Form Overlay */}
            {editingCert && (
              <div className="p-4 mb-4 text-white" style={{ backgroundColor: 'rgba(67, 29, 171, 0.3)', border: '1px solid rgba(174, 109, 254, 0.4)', borderRadius: '16px' }}>
                <h4 className="text-white mb-3"><i className="fas fa-edit me-2"></i> Update Certificate: {editingCert.certificateId}</h4>
                <form onSubmit={handleSaveEditCert}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted">Student Name</label>
                      <input 
                        type="text" 
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                        value={certEditForm.studentName}
                        onChange={(e) => setCertEditForm({ ...certEditForm, studentName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">Student Email</label>
                      <input 
                        type="email" 
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                        value={certEditForm.studentEmail}
                        onChange={(e) => setCertEditForm({ ...certEditForm, studentEmail: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">Program Domain Title</label>
                      <input 
                        type="text" 
                        className="form-control text-white"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                        value={certEditForm.domain}
                        onChange={(e) => setCertEditForm({ ...certEditForm, domain: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted">Performance Grade</label>
                      <select 
                        className="form-select text-white" 
                        style={{ backgroundColor: '#090536' }} 
                        value={certEditForm.performanceGrade} 
                        onChange={(e) => setCertEditForm({ ...certEditForm, performanceGrade: e.target.value })}
                      >
                        {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="col-12 mt-3 d-flex gap-2">
                      <button 
                        type="submit" 
                        disabled={isSavingCertEdit} 
                        className="btn btn-success px-4 py-2 font-weight-bold"
                        style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                      >
                        {isSavingCertEdit ? (
                          <span><i className="fas fa-spinner fa-spin me-2"></i> Saving & Sending Email...</span>
                        ) : (
                          <span><i className="fas fa-save me-1"></i> Save Changes</span>
                        )}
                      </button>
                      <button type="button" onClick={() => setEditingCert(null)} className="btn btn-secondary" style={{ borderRadius: '10px' }}>Cancel</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5 text-white"><i className="fas fa-spinner fa-spin me-2"></i> Loading Issued Certificates...</div>
            ) : issuedCerts.length === 0 ? (
              <div className="p-5 text-center text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px' }}>
                <i className="fas fa-award mb-3 text-muted" style={{ fontSize: '38px' }}></i>
                <h4>No Issued Certificates Found</h4>
                <p className="text-muted">Certificates issued to completed students will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#a5b4fc' }}>
                      <th>Certificate ID</th>
                      <th>Student Name</th>
                      <th>Student Email</th>
                      <th>Program / Track</th>
                      <th>Grade</th>
                      <th>Issue Date</th>
                      <th style={{ minWidth: '220px' }}>Actions Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuedCerts.map((cert, idx) => (
                      <tr key={cert.id || cert.certificateId || idx}>
                        <td className="text-warning font-monospace font-weight-bold">{cert.certificateId}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <UserAvatar name={cert.studentName} size={32} />
                            <strong className="text-white">{cert.studentName}</strong>
                          </div>
                        </td>
                        <td className="text-info">{cert.studentEmail}</td>
                        <td style={{ color: '#c084fc', fontWeight: '600' }}>{cert.courseTitle || cert.domain}</td>
                        <td><span className="badge bg-primary">{cert.performanceGrade || cert.grade || 'Excellence (A+)'}</span></td>
                        <td className="text-muted" style={{ fontSize: '12px' }}>{cert.issueDate || 'Recent'}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <a href={`/verify?id=${cert.certificateId}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-light btn-action-pill py-1 px-2" style={{ fontSize: '12px' }}>
                              <i className="fas fa-external-link-alt me-1"></i> Verify
                            </a>
                            <button onClick={() => handleOpenEditCert(cert)} className="btn btn-sm btn-outline-info btn-action-pill py-1 px-2" style={{ fontSize: '12px' }}>
                              <i className="fas fa-edit me-1"></i> Edit
                            </button>
                            <button onClick={() => handleDeleteCert(cert)} className="btn btn-sm btn-outline-danger btn-action-pill py-1 px-2" style={{ fontSize: '12px' }}>
                              <i className="fas fa-trash-alt me-1"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section 6: Issue Certificate Tool */}
        {activeTab === 'issue-cert' && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div 
                className="p-4 p-md-5 text-white pos-rel"
                style={{
                  borderRadius: '24px',
                  border: '1px solid rgba(74, 222, 128, 0.4)',
                  backgroundColor: 'rgba(9, 5, 54, 0.9)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div>
                    <span className="badge bg-success mb-1">OFFICIAL ISSUANCE TOOL</span>
                    <h3 className="text-white mb-0" style={{ fontWeight: '700' }}>Issue New Internship Certificate</h3>
                  </div>
                  <i className="fas fa-certificate text-success" style={{ fontSize: '36px' }}></i>
                </div>

                {certSubmitted ? (
                  <div className="p-4 text-center" style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', borderRadius: '16px', border: '1px solid rgba(74, 222, 128, 0.4)' }}>
                    <i className="fas fa-check-circle mb-3" style={{ fontSize: '48px', color: '#4ade80' }}></i>
                    <h3 className="text-white">Certificate Issued & Email Dispatched Successfully!</h3>
                    <p className="text-muted mt-2">
                      Certificate ID <strong className="text-warning">{certForm.certificateId}</strong> has been issued to <strong className="text-white">{certForm.studentName}</strong> ({certForm.studentEmail}) and stored in MongoDB. An automated notification email was sent via EmailJS.
                    </p>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                      <a 
                        href={`/verify?id=${certForm.certificateId}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-info text-dark font-weight-bold"
                        style={{ borderRadius: '10px' }}
                      >
                        <i className="fas fa-external-link-alt me-1"></i> Verify Certificate Online
                      </a>
                      <button 
                        onClick={() => {
                          setCertSubmitted(false);
                          loadNextCertId();
                        }}
                        className="btn btn-outline-light"
                        style={{ borderRadius: '10px' }}
                      >
                        Issue Another Certificate
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleIssueCert}>
                    {certError && (
                      <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '14px', borderRadius: '8px' }}>
                        <i className="fas fa-exclamation-circle me-2"></i>{certError}
                      </div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted">Certificate ID (Auto-Generated) *</label>
                        <input 
                          type="text" 
                          className="form-control text-warning font-monospace fw-bold"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                          value={certForm.certificateId}
                          onChange={(e) => setCertForm({ ...certForm, certificateId: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted">Issue Date *</label>
                        <input 
                          type="text" 
                          className="form-control text-white"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                          value={certForm.issueDate}
                          onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted">Student Candidate Name *</label>
                        <input 
                          type="text" 
                          className="form-control text-white"
                          placeholder="e.g. Mokarram Shahban"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                          value={certForm.studentName}
                          onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted">Student Email Address *</label>
                        <input 
                          type="email" 
                          className="form-control text-white"
                          placeholder="candidate@gmail.com"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                          value={certForm.studentEmail}
                          onChange={(e) => setCertForm({ ...certForm, studentEmail: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted">Program Track / Domain Title *</label>
                        <input 
                          type="text" 
                          className="form-control text-white"
                          placeholder="e.g. Web Development (45-Days)"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
                          value={certForm.domain}
                          onChange={(e) => setCertForm({ ...certForm, domain: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted">Performance Grade *</label>
                        <select 
                          className="form-select text-white"
                          style={{ backgroundColor: '#090536', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}
                          value={certForm.grade}
                          onChange={(e) => setCertForm({ ...certForm, grade: e.target.value })}
                        >
                          {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>

                      <div className="col-12 mt-4">
                        <button 
                          type="submit" 
                          disabled={isIssuing}
                          className="btn btn-success btn-lg w-100"
                          style={{ borderRadius: '12px', fontWeight: '700', padding: '14px' }}
                        >
                          {isIssuing ? (
                            <span><i className="fas fa-spinner fa-spin me-2"></i> Issuing & Dispatching Email...</span>
                          ) : (
                            <span><i className="fas fa-paper-plane me-2"></i> Issue Certificate & Send Email to Student</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
