import express from 'express';
import { 
  sendEmail, 
  certIssuedTemplate, 
  statusUpdateTemplate, 
  appReceivedTemplate,
  contactReceivedTemplate
} from '../services/emailService.js';

const router = express.Router();

// POST /api/email/certificate-issued
// Called when admin issues a certificate
router.post('/certificate-issued', async (req, res) => {
  try {
    const { studentEmail, studentName, certificateId, domain, grade, issueDate } = req.body;

    if (!studentEmail || !studentName || !certificateId) {
      return res.status(400).json({ success: false, message: 'studentEmail, studentName, and certificateId are required.' });
    }

    const template = certIssuedTemplate({ studentName, certificateId, domain, grade, issueDate });
    const result = await sendEmail({ to: studentEmail, ...template });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/status-update
// Called when admin changes application status
router.post('/status-update', async (req, res) => {
  try {
    const { studentEmail, studentName, status, domain, duration } = req.body;

    if (!studentEmail || !studentName || !status) {
      return res.status(400).json({ success: false, message: 'studentEmail, studentName, and status are required.' });
    }

    const template = statusUpdateTemplate({ studentName, status, domain, duration });
    const result = await sendEmail({ to: studentEmail, ...template });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/application-received
// Called when a student submits an application
router.post('/application-received', async (req, res) => {
  try {
    const { studentEmail, studentName, domain, duration } = req.body;

    if (!studentEmail || !studentName) {
      return res.status(400).json({ success: false, message: 'studentEmail and studentName are required.' });
    }

    const template = appReceivedTemplate({ studentName, domain, duration });
    const result = await sendEmail({ to: studentEmail, ...template });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/contact-received
// Called when a user submits a contact form
router.post('/contact-received', async (req, res) => {
  try {
    const { email, fullName, subject } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ success: false, message: 'email and fullName are required.' });
    }

    const template = contactReceivedTemplate({ fullName, subject });
    const result = await sendEmail({ to: email, ...template });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/email/test
// Quick health-check to confirm email service is configured
router.get('/test', async (req, res) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    return res.status(503).json({ 
      success: false, 
      message: 'Email service not configured. Add GMAIL_USER and GMAIL_APP_PASS to .env file.' 
    });
  }
  res.json({ 
    success: true, 
    message: `Email service ready. Sending from: ${process.env.GMAIL_USER}` 
  });
});

export default router;
