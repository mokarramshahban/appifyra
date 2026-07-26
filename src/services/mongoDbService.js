import staticCertificates from '../data/certificates.json';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// LocalStorage helpers
const getLocalApps = () => {
  try { return JSON.parse(localStorage.getItem('appifyra_local_applications') || '[]'); } catch (e) { return []; }
};

const saveLocalApp = (app) => {
  try {
    const current = getLocalApps();
    localStorage.setItem('appifyra_local_applications', JSON.stringify([app, ...current]));
  } catch (e) {}
};

const getLocalInquiries = () => {
  try { return JSON.parse(localStorage.getItem('appifyra_local_inquiries') || '[]'); } catch (e) { return []; }
};

const saveLocalInquiry = (inq) => {
  try {
    const current = getLocalInquiries();
    localStorage.setItem('appifyra_local_inquiries', JSON.stringify([inq, ...current]));
  } catch (e) {}
};

const getLocalSubscribers = () => {
  try { return JSON.parse(localStorage.getItem('appifyra_local_subscribers') || '[]'); } catch (e) { return []; }
};

const saveLocalSubscriber = (sub) => {
  try {
    const current = getLocalSubscribers();
    const updated = [sub, ...current.filter(s => s.email !== sub.email)];
    localStorage.setItem('appifyra_local_subscribers', JSON.stringify(updated));
  } catch (e) {}
};

const getLocalCerts = () => {
  try { return JSON.parse(localStorage.getItem('appifyra_local_certificates') || '[]'); } catch (e) { return []; }
};

const saveLocalCert = (cert) => {
  try {
    const current = getLocalCerts();
    const updated = [cert, ...current.filter(c => c.certificateId !== cert.certificateId)];
    localStorage.setItem('appifyra_local_certificates', JSON.stringify(updated));
  } catch (e) {}
};

// Save Newsletter Subscriber
export const saveSubscriber = async (email) => {
  const cleanEmail = email.trim().toLowerCase();
  const newSub = { id: `sub_${Date.now()}`, email: cleanEmail, subscribedAt: new Date().toISOString() };
  saveLocalSubscriber(newSub);

  try {
    const res = await fetch(`${API_BASE}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });
    const data = await res.json();
    if (data.success) return { success: true, id: data.id };
  } catch (error) {}

  return { success: true, id: newSub.id };
};

// Admin: Get All Subscribers
export const getAllSubscribers = async () => {
  let mongoSubs = [];
  try {
    const res = await fetch(`${API_BASE}/api/subscribers`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) mongoSubs = data.data;
  } catch (error) {}

  const localSubs = getLocalSubscribers();
  const combined = [...localSubs, ...mongoSubs];
  const uniqueMap = new Map();
  combined.forEach(s => {
    if (s.email && !uniqueMap.has(s.email.toLowerCase())) {
      uniqueMap.set(s.email.toLowerCase(), s);
    }
  });

  return Array.from(uniqueMap.values());
};

// Admin: Update Subscriber Email
export const updateSubscriber = async (subId, newEmail) => {
  const cleanEmail = newEmail.trim().toLowerCase();
  try {
    const local = getLocalSubscribers();
    const updated = local.map(s => (s.id === subId || s._id === subId) ? { ...s, email: cleanEmail } : s);
    localStorage.setItem('appifyra_local_subscribers', JSON.stringify(updated));
  } catch (e) {}

  try {
    const res = await fetch(`${API_BASE}/api/subscribers/${subId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });
    const data = await res.json();
    return data.success;
  } catch (e) { return true; }
};

// Admin: Delete Subscriber
export const deleteSubscriber = async (subId) => {
  try {
    const local = getLocalSubscribers();
    const updated = local.filter(s => s.id !== subId && s._id !== subId);
    localStorage.setItem('appifyra_local_subscribers', JSON.stringify(updated));
  } catch (e) {}

  try {
    await fetch(`${API_BASE}/api/subscribers/${subId}`, { method: 'DELETE' });
  } catch (e) {}

  return true;
};

// Save Internship Application
export const saveInternshipApplication = async (appData) => {
  const newApp = { id: `app_${Date.now()}`, ...appData, status: 'Under Review', createdAt: new Date().toISOString() };
  saveLocalApp(newApp);

  try {
    const res = await fetch(`${API_BASE}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    const data = await res.json();
    if (data.success) return { success: true, id: data.id };
  } catch (error) {}

  return { success: true, id: newApp.id };
};

// Save Contact Inquiry
export const saveContactInquiry = async (inquiryData) => {
  const newInq = { id: `inq_${Date.now()}`, ...inquiryData, createdAt: new Date().toISOString() };
  saveLocalInquiry(newInq);

  try {
    const res = await fetch(`${API_BASE}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    const data = await res.json();
    if (data.success) return { success: true, id: data.id };
  } catch (error) {}

  return { success: true, id: newInq.id };
};

// Admin: Get All Contact Inquiries
export const getContactInquiries = async () => {
  let mongoInqs = [];
  try {
    const res = await fetch(`${API_BASE}/api/inquiries`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) mongoInqs = data.data;
  } catch (error) {}

  const localInqs = getLocalInquiries();
  const combined = [...localInqs, ...mongoInqs];
  const uniqueMap = new Map();
  combined.forEach(item => {
    const key = `${item.email}_${item.subject}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, item);
  });

  return Array.from(uniqueMap.values());
};

// Admin: Update Contact Inquiry
export const updateInquiry = async (inquiryId, updateData) => {
  try {
    const local = getLocalInquiries();
    const updated = local.map(item => (item.id === inquiryId || item._id === inquiryId) ? { ...item, ...updateData } : item);
    localStorage.setItem('appifyra_local_inquiries', JSON.stringify(updated));
  } catch (e) {}

  try {
    const res = await fetch(`${API_BASE}/api/inquiries/${inquiryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    return data.success;
  } catch (error) { return true; }
};

// Admin: Delete Contact Inquiry
export const deleteInquiry = async (inquiryId) => {
  try {
    const local = getLocalInquiries();
    const updated = local.filter(item => item.id !== inquiryId && item._id !== inquiryId);
    localStorage.setItem('appifyra_local_inquiries', JSON.stringify(updated));
  } catch (e) {}

  try {
    await fetch(`${API_BASE}/api/inquiries/${inquiryId}`, { method: 'DELETE' });
  } catch (e) {}

  return true;
};

// Admin: Get All Student Applications
export const getAllApplications = async () => {
  let mongoApps = [];
  try {
    const res = await fetch(`${API_BASE}/api/applications`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) mongoApps = data.data;
  } catch (error) {}

  const localApps = getLocalApps();
  const combined = [...localApps, ...mongoApps];
  const uniqueMap = new Map();
  combined.forEach(item => {
    const key = `${item.email}_${item.duration}_${item.domain}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, item);
  });

  return Array.from(uniqueMap.values());
};

// Student: Get Own Applications
export const getStudentApplications = async (userEmail) => {
  if (!userEmail) return [];
  const allApps = await getAllApplications();
  return allApps.filter(app => app.email && app.email.toLowerCase() === userEmail.toLowerCase());
};

// Admin: Update Application Details
export const updateApplication = async (appId, updateData) => {
  try {
    const local = getLocalApps();
    const updated = local.map(item => (item.id === appId || item._id === appId) ? { ...item, ...updateData } : item);
    localStorage.setItem('appifyra_local_applications', JSON.stringify(updated));
  } catch (e) {}

  try {
    const res = await fetch(`${API_BASE}/api/applications/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    return data.success;
  } catch (error) { return true; }
};

// Admin: Update Application Status
export const updateApplicationStatus = async (appId, newStatus) => {
  return updateApplication(appId, { status: newStatus });
};

// Admin: Delete Application Record
export const deleteApplication = async (appId) => {
  try {
    const local = getLocalApps();
    const updated = local.filter(item => item.id !== appId && item._id !== appId);
    localStorage.setItem('appifyra_local_applications', JSON.stringify(updated));
  } catch (e) {}

  try {
    await fetch(`${API_BASE}/api/applications/${appId}`, { method: 'DELETE' });
  } catch (error) {}

  return true;
};

// Admin & Student: Get All Issued Certificates
export const getAllCertificates = async () => {
  let mongoCerts = [];
  try {
    const res = await fetch(`${API_BASE}/api/certificates`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) mongoCerts = data.data;
  } catch (e) {}

  const localCerts = getLocalCerts();
  const combined = [...localCerts, ...mongoCerts];
  const uniqueMap = new Map();
  combined.forEach(c => {
    if (c.certificateId && !uniqueMap.has(c.certificateId)) {
      uniqueMap.set(c.certificateId, c);
    }
  });

  return Array.from(uniqueMap.values());
};

// Student: Get Student's Issued Certificates
export const getStudentCertificates = async (userEmail) => {
  if (!userEmail) return [];
  const cleanEmail = userEmail.trim().toLowerCase();
  const allCerts = await getAllCertificates();
  return allCerts.filter(c => c.studentEmail && c.studentEmail.toLowerCase() === cleanEmail);
};

// Admin: Auto-generate Next Sequential Certificate ID
export const getNextCertificateId = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/certificates/next-id`);
    const data = await res.json();
    if (data.success) return data.certificateId;
  } catch (error) {}

  const localCerts = getLocalCerts();
  const year = new Date().getFullYear();
  const nextSeq = String(localCerts.length + 1).padStart(3, '0');
  return `APP-${year}-${nextSeq}`;
};

// Admin: Issue New Certificate
export const issueCertificate = async (certData) => {
  const cleanId = certData.certificateId.trim().toUpperCase();
  const certObj = { ...certData, certificateId: cleanId, createdAt: new Date().toISOString() };
  saveLocalCert(certObj);

  try {
    const res = await fetch(`${API_BASE}/api/certificates/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certObj)
    });
    const data = await res.json();
    if (data.success) return { success: true, certId: data.certId };
  } catch (error) {}

  return { success: true, certId: cleanId };
};

// Admin: Update Issued Certificate
export const updateIssuedCertificate = async (certId, updateData) => {
  try {
    const local = getLocalCerts();
    const updated = local.map(c => c.certificateId === certId || c.id === certId ? { ...c, ...updateData } : c);
    localStorage.setItem('appifyra_local_certificates', JSON.stringify(updated));
  } catch (e) {}

  try {
    const res = await fetch(`${API_BASE}/api/certificates/${certId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    return data.success;
  } catch (e) { return true; }
};

// Admin: Delete Issued Certificate
export const deleteIssuedCertificate = async (certId, mongoId) => {
  try {
    const local = getLocalCerts();
    const updated = local.filter(c => c.certificateId !== certId && c.id !== certId && c.id !== mongoId);
    localStorage.setItem('appifyra_local_certificates', JSON.stringify(updated));
  } catch (e) {}

  if (mongoId) {
    try {
      await fetch(`${API_BASE}/api/certificates/${mongoId}`, { method: 'DELETE' });
    } catch (e) {}
  }
  return true;
};

// Lookup Certificate Credential
export const lookupCertificate = async (certId) => {
  const cleanId = certId.trim().toUpperCase();

  if (staticCertificates[cleanId]) return staticCertificates[cleanId];

  const localCerts = getLocalCerts();
  const localMatch = localCerts.find(c => c.certificateId === cleanId);
  if (localMatch) return localMatch;

  try {
    const res = await fetch(`${API_BASE}/api/certificates/${cleanId}`);
    const data = await res.json();
    if (data.success && data.data) return data.data;
  } catch (e) {}

  return null;
};
