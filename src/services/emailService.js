// Custom Email Service — calls our own Express backend API
// No third-party limits. Emails sent from appifyra@gmail.com via Nodemailer

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const postEmail = async (endpoint, payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/email/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      console.log(`✅ Email dispatched via /api/email/${endpoint}`);
    } else {
      console.warn(`⚠️ Email not sent: ${data.message || data.error}`);
    }
    return data;
  } catch (err) {
    console.warn('Email service unavailable (backend offline):', err.message);
    return { success: false };
  }
};

// Send certificate issued notification to student
export const sendCertificateEmail = ({ studentEmail, studentName, certificateId, domain, grade, issueDate }) =>
  postEmail('certificate-issued', { studentEmail, studentName, certificateId, domain, grade, issueDate });

// Send application status update notification to student
export const sendStatusUpdateEmail = ({ studentEmail, studentName, status, domain, duration }) =>
  postEmail('status-update', { studentEmail, studentName, status, domain, duration });

// Send application received confirmation to student (on submission)
export const sendAppReceivedEmail = ({ studentEmail, studentName, domain, duration }) =>
  postEmail('application-received', { studentEmail, studentName, domain, duration });

// Send contact message received confirmation to user
export const sendContactReceivedEmail = ({ email, fullName, subject }) =>
  postEmail('contact-received', { email, fullName, subject });
