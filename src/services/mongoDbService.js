import staticCertificates from '../data/certificates.json';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── DELETED BLACKLIST TRACKERS ─────────────────────────────────────────────
const getDeletedCertificates = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_deleted_certificates') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const addDeletedCertificate = (...ids) => {
  try {
    const current = getDeletedCertificates();
    const additions = ids.filter(Boolean).map(id => String(id).trim().toUpperCase());
    const updated = Array.from(new Set([...current, ...additions]));
    localStorage.setItem('appifyra_deleted_certificates', JSON.stringify(updated));
  } catch (e) {}
};

const getDeletedApplications = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_deleted_applications') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const addDeletedApplication = (...ids) => {
  try {
    const current = getDeletedApplications();
    const additions = ids.filter(Boolean).map(id => String(id).trim());
    const updated = Array.from(new Set([...current, ...additions]));
    localStorage.setItem('appifyra_deleted_applications', JSON.stringify(updated));
  } catch (e) {}
};

const getDeletedInquiries = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_deleted_inquiries') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const addDeletedInquiry = (...ids) => {
  try {
    const current = getDeletedInquiries();
    const additions = ids.filter(Boolean).map(id => String(id).trim());
    const updated = Array.from(new Set([...current, ...additions]));
    localStorage.setItem('appifyra_deleted_inquiries', JSON.stringify(updated));
  } catch (e) {}
};

const getDeletedSubscribers = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_deleted_subscribers') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const addDeletedSubscriber = (...ids) => {
  try {
    const current = getDeletedSubscribers();
    const additions = ids.filter(Boolean).map(x => String(x).trim().toLowerCase());
    const updated = Array.from(new Set([...current, ...additions]));
    localStorage.setItem('appifyra_deleted_subscribers', JSON.stringify(updated));
  } catch (e) {}
};

// ─── LOCAL STORAGE HELPERS ──────────────────────────────────────────────────
const getLocalApps = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_local_applications') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const saveLocalApp = (app) => {
  try {
    const current = getLocalApps();
    localStorage.setItem('appifyra_local_applications', JSON.stringify([app, ...current]));
  } catch (e) {}
};

const getLocalInquiries = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_local_inquiries') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const saveLocalInquiry = (inq) => {
  try {
    const current = getLocalInquiries();
    localStorage.setItem('appifyra_local_inquiries', JSON.stringify([inq, ...current]));
  } catch (e) {}
};

const getLocalSubscribers = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_local_subscribers') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const saveLocalSubscriber = (sub) => {
  try {
    const current = getLocalSubscribers();
    const updated = [sub, ...current.filter(s => s.email !== sub.email)];
    localStorage.setItem('appifyra_local_subscribers', JSON.stringify(updated));
  } catch (e) {}
};

const getLocalCerts = () => {
  try {
    const res = JSON.parse(localStorage.getItem('appifyra_local_certificates') || '[]');
    return Array.isArray(res) ? res : [];
  } catch (e) { return []; }
};

const saveLocalCert = (cert) => {
  try {
    const current = getLocalCerts();
    const updated = [cert, ...current.filter(c => c.certificateId !== cert.certificateId)];
    localStorage.setItem('appifyra_local_certificates', JSON.stringify(updated));
  } catch (e) {}
};

// ─── SUBSCRIBERS CRUD ───────────────────────────────────────────────────────
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
    if (data && data.success) return { success: true, id: data.id };
  } catch (error) {}

  return { success: true, id: newSub.id };
};

export const getAllSubscribers = async () => {
  const deleted = getDeletedSubscribers();
  let mongoSubs = [];
  try {
    const res = await fetch(`${API_BASE}/api/subscribers`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) mongoSubs = data.data;
    }
  } catch (error) {}

  const localSubs = getLocalSubscribers();
  const combined = Array.isArray(localSubs) && Array.isArray(mongoSubs) ? [...localSubs, ...mongoSubs] : [];
  const uniqueMap = new Map();

  if (Array.isArray(combined)) {
    combined.forEach(s => {
      if (!s || typeof s !== 'object') return;
      const subIdStr = String(s.id || s._id || '');
      const emailStr = String(s.email || '').toLowerCase();
      if (deleted.includes(subIdStr) || deleted.includes(emailStr)) return;

      if (emailStr && !uniqueMap.has(emailStr)) {
        uniqueMap.set(emailStr, s);
      }
    });
  }

  return Array.from(uniqueMap.values());
};

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
    return !!(data && data.success);
  } catch (error) { return true; }
};

export const deleteSubscriber = async (subIdOrEmail, extraEmail) => {
  const subId = subIdOrEmail;
  const email = extraEmail || (typeof subIdOrEmail === 'string' && subIdOrEmail.includes('@') ? subIdOrEmail : null);

  addDeletedSubscriber(subId, email);

  try {
    const local = getLocalSubscribers();
    const updated = local.filter(item => {
      if (subId && (item.id === subId || item._id === subId)) return false;
      if (email && item.email && item.email.toLowerCase() === email.toLowerCase()) return false;
      return true;
    });
    localStorage.setItem('appifyra_local_subscribers', JSON.stringify(updated));
  } catch (e) {}

  try {
    if (subId) await fetch(`${API_BASE}/api/subscribers/${subId}`, { method: 'DELETE' });
  } catch (e) {}

  return true;
};

// ─── CONTACT INQUIRIES CRUD ─────────────────────────────────────────────────
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
    if (data && data.success) return { success: true, id: data.id };
  } catch (error) {}

  return { success: true, id: newInq.id };
};

export const getContactInquiries = async () => {
  const deleted = getDeletedInquiries();
  let mongoInqs = [];
  try {
    const res = await fetch(`${API_BASE}/api/inquiries`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) mongoInqs = data.data;
    }
  } catch (error) {}

  const localInqs = getLocalInquiries();
  const combined = Array.isArray(localInqs) && Array.isArray(mongoInqs) ? [...localInqs, ...mongoInqs] : [];
  const uniqueMap = new Map();

  if (Array.isArray(combined)) {
    combined.forEach(item => {
      if (!item || typeof item !== 'object') return;
      const idStr = String(item.id || item._id || '');
      const emailStr = String(item.email || '').toLowerCase();
      const compKey = `${item.email}_${item.subject}`;

      if (deleted.includes(idStr) || deleted.includes(emailStr) || deleted.includes(compKey)) return;

      if (!uniqueMap.has(compKey)) uniqueMap.set(compKey, item);
    });
  }

  return Array.from(uniqueMap.values());
};

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
    return !!(data && data.success);
  } catch (error) { return true; }
};

export const deleteInquiry = async (inquiryIdOrObj, extraObj) => {
  const targetObj = typeof inquiryIdOrObj === 'object' ? inquiryIdOrObj : (typeof extraObj === 'object' ? extraObj : null);
  const inquiryId = typeof inquiryIdOrObj === 'string' ? inquiryIdOrObj : (targetObj?.id || targetObj?._id);

  addDeletedInquiry(inquiryId, targetObj?.id, targetObj?._id, targetObj?.email, targetObj?.email ? `${targetObj.email}_${targetObj.subject}` : null);

  try {
    const local = getLocalInquiries();
    const updated = local.filter(item => {
      if (inquiryId && (item.id === inquiryId || item._id === inquiryId)) return false;
      if (targetObj && targetObj.email && item.email === targetObj.email && item.subject === targetObj.subject) return false;
      return true;
    });
    localStorage.setItem('appifyra_local_inquiries', JSON.stringify(updated));
  } catch (e) {}

  try {
    if (inquiryId) await fetch(`${API_BASE}/api/inquiries/${inquiryId}`, { method: 'DELETE' });
  } catch (e) {}

  return true;
};

// ─── INTERNSHIP APPLICATIONS CRUD ──────────────────────────────────────────
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
    if (data && data.success) return { success: true, id: data.id };
  } catch (error) {}

  return { success: true, id: newApp.id };
};

export const getAllApplications = async () => {
  const deleted = getDeletedApplications();
  let mongoApps = [];
  try {
    const res = await fetch(`${API_BASE}/api/applications`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) mongoApps = data.data;
    }
  } catch (error) {}

  const localApps = getLocalApps();
  const combined = Array.isArray(localApps) && Array.isArray(mongoApps) ? [...localApps, ...mongoApps] : [];
  const uniqueMap = new Map();

  if (Array.isArray(combined)) {
    combined.forEach(item => {
      if (!item || typeof item !== 'object') return;
      const idStr = String(item.id || item._id || '');
      const emailStr = String(item.email || '').toLowerCase();
      const compKey = `${item.email}_${item.duration}_${item.domain}`;

      if (deleted.includes(idStr) || deleted.includes(emailStr) || deleted.includes(compKey)) return;

      if (!uniqueMap.has(compKey)) uniqueMap.set(compKey, item);
    });
  }

  return Array.from(uniqueMap.values());
};

export const getStudentApplications = async (userEmail) => {
  if (!userEmail) return [];
  const allApps = await getAllApplications();
  return Array.isArray(allApps) ? allApps.filter(app => app && app.email && app.email.toLowerCase() === userEmail.toLowerCase()) : [];
};

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
    return !!(data && data.success);
  } catch (error) { return true; }
};

export const updateApplicationStatus = async (appId, newStatus) => {
  return updateApplication(appId, { status: newStatus });
};

export const deleteApplication = async (appIdOrObj, extraObj) => {
  const targetObj = typeof appIdOrObj === 'object' ? appIdOrObj : (typeof extraObj === 'object' ? extraObj : null);
  const appId = typeof appIdOrObj === 'string' ? appIdOrObj : (targetObj?.id || targetObj?._id);

  addDeletedApplication(
    appId, 
    targetObj?.id, 
    targetObj?._id, 
    targetObj?.email, 
    targetObj?.email ? `${targetObj.email}_${targetObj.duration}_${targetObj.domain}` : null
  );

  try {
    const local = getLocalApps();
    const updated = local.filter(item => {
      if (appId && (item.id === appId || item._id === appId)) return false;
      if (targetObj && targetObj.email && item.email === targetObj.email && item.duration === targetObj.duration && item.domain === targetObj.domain) return false;
      return true;
    });
    localStorage.setItem('appifyra_local_applications', JSON.stringify(updated));
  } catch (e) {}

  try {
    if (appId) await fetch(`${API_BASE}/api/applications/${appId}`, { method: 'DELETE' });
  } catch (error) {}

  return true;
};

// ─── CERTIFICATES CRUD ──────────────────────────────────────────────────────
export const getAllCertificates = async () => {
  const deleted = getDeletedCertificates();
  let mongoCerts = [];
  try {
    const res = await fetch(`${API_BASE}/api/certificates`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) mongoCerts = data.data;
    }
  } catch (e) {}

  const localCerts = getLocalCerts();
  const combined = Array.isArray(localCerts) && Array.isArray(mongoCerts) ? [...localCerts, ...mongoCerts] : [];
  const uniqueMap = new Map();

  if (Array.isArray(combined)) {
    combined.forEach(c => {
      if (!c || typeof c !== 'object') return;
      const certIdStr = String(c.certificateId || c.id || c._id || '').toUpperCase();
      const mongoIdStr = String(c._id || c.id || '').toUpperCase();
      const studentEmailStr = String(c.studentEmail || c.email || '').toLowerCase();

      if (deleted.includes(certIdStr) || deleted.includes(mongoIdStr) || deleted.includes(studentEmailStr)) return;

      if (certIdStr && !uniqueMap.has(certIdStr)) {
        uniqueMap.set(certIdStr, c);
      }
    });
  }

  // Include static JSON fallback certificates if not deleted
  if (Array.isArray(staticCertificates)) {
    staticCertificates.forEach(sc => {
      if (!sc || typeof sc !== 'object') return;
      const certIdStr = String(sc.certificateId || '').toUpperCase();
      const studentEmailStr = String(sc.studentEmail || '').toLowerCase();

      if (deleted.includes(certIdStr) || deleted.includes(studentEmailStr)) return;

      if (certIdStr && !uniqueMap.has(certIdStr)) {
        uniqueMap.set(certIdStr, sc);
      }
    });
  }

  return Array.from(uniqueMap.values());
};

export const getStudentCertificates = async (userEmail) => {
  if (!userEmail) return [];
  const allCerts = await getAllCertificates();
  return Array.isArray(allCerts) ? allCerts.filter(c => c && c.studentEmail && c.studentEmail.toLowerCase() === userEmail.toLowerCase()) : [];
};

export const getNextCertificateId = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/certificates/next-id`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.nextId) return data.nextId;
    }
  } catch (e) {}

  const allCerts = await getAllCertificates();
  const num = Array.isArray(allCerts) ? allCerts.length + 1 : 1;
  return `APP-2026-${String(num).padStart(3, '0')}`;
};

export const issueCertificate = async (certData) => {
  saveLocalCert(certData);

  try {
    const res = await fetch(`${API_BASE}/api/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certData)
    });
    const data = await res.json();
    if (data && data.success) return { success: true, certificateId: data.certificateId || certData.certificateId };
  } catch (error) {}

  return { success: true, certificateId: certData.certificateId };
};

export const updateIssuedCertificate = async (certId, updateData) => {
  try {
    const local = getLocalCerts();
    const updated = local.map(c => (c.certificateId === certId || c.id === certId || c._id === certId) ? { ...c, ...updateData } : c);
    localStorage.setItem('appifyra_local_certificates', JSON.stringify(updated));
  } catch (e) {}

  try {
    const res = await fetch(`${API_BASE}/api/certificates/${certId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    return !!(data && data.success);
  } catch (error) { return true; }
};

export const deleteIssuedCertificate = async (certIdOrObj, extraCert) => {
  const targetObj = typeof certIdOrObj === 'object' ? certIdOrObj : (typeof extraCert === 'object' ? extraCert : null);
  const certId = typeof certIdOrObj === 'string' ? certIdOrObj : (targetObj?.certificateId || targetObj?.id || targetObj?._id);

  addDeletedCertificate(
    certId, 
    targetObj?.certificateId, 
    targetObj?.id, 
    targetObj?._id, 
    targetObj?.studentEmail
  );

  try {
    const local = getLocalCerts();
    const updated = local.filter(item => {
      if (certId && (item.certificateId === certId || item.id === certId || item._id === certId)) return false;
      if (targetObj && targetObj.studentEmail && item.studentEmail === targetObj.studentEmail) return false;
      return true;
    });
    localStorage.setItem('appifyra_local_certificates', JSON.stringify(updated));
  } catch (e) {}

  try {
    if (certId) await fetch(`${API_BASE}/api/certificates/${certId}`, { method: 'DELETE' });
  } catch (e) {}

  return true;
};

export const lookupCertificate = async (queryStr) => {
  if (!queryStr) return null;
  const deleted = getDeletedCertificates();
  const queryUpper = queryStr.trim().toUpperCase();

  if (deleted.includes(queryUpper)) return null;

  try {
    const res = await fetch(`${API_BASE}/api/certificates/verify/${encodeURIComponent(queryUpper)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.data) {
        const c = data.data;
        const certIdStr = String(c.certificateId || c.id || c._id || '').toUpperCase();
        const mongoIdStr = String(c._id || c.id || '').toUpperCase();
        const studentEmailStr = String(c.studentEmail || c.email || '').toLowerCase();

        if (deleted.includes(certIdStr) || deleted.includes(mongoIdStr) || deleted.includes(studentEmailStr)) {
          return null;
        }
        return c;
      }
    }
  } catch (e) {}

  const allCerts = await getAllCertificates();
  return Array.isArray(allCerts) ? (allCerts.find(c => {
    const id = (c.certificateId || c.id || '').trim().toUpperCase();
    return id === queryUpper;
  }) || null) : null;
};
