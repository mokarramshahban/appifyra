import express from 'express';
import Subscriber from '../models/Subscriber.js';
import { 
  sendEmail, 
  certIssuedTemplate, 
  statusUpdateTemplate, 
  appReceivedTemplate,
  contactReceivedTemplate,
  broadcastNewsletterTemplate
} from '../services/emailService.js';

const router = express.Router();

// POST /api/email/certificate-issued
router.post('/certificate-issued', async (req, res) => {
  try {
    const { studentEmail, studentName, certificateId, domain, grade, issueDate } = req.body;
    if (!studentEmail || !studentName || !certificateId) {
      return res.status(400).json({ success: false, message: 'studentEmail, studentName, and certificateId are required.' });
    }

    // Respond immediately so UI doesn't hang
    res.json({ success: true, message: 'Certificate email dispatch initiated.' });

    // Background email send
    const template = certIssuedTemplate({ studentName, certificateId, domain, grade, issueDate });
    sendEmail({ to: studentEmail, ...template }).catch(err => console.error('Cert email error:', err));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/status-update
router.post('/status-update', async (req, res) => {
  try {
    const { studentEmail, studentName, status, domain, duration } = req.body;
    if (!studentEmail || !studentName || !status) {
      return res.status(400).json({ success: false, message: 'studentEmail, studentName, and status are required.' });
    }

    // Respond immediately so UI doesn't hang
    res.json({ success: true, message: 'Status update email dispatch initiated.' });

    // Background email send
    const template = statusUpdateTemplate({ studentName, status, domain, duration });
    sendEmail({ to: studentEmail, ...template }).catch(err => console.error('Status update email error:', err));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/application-received
router.post('/application-received', async (req, res) => {
  try {
    const { studentEmail, studentName, domain, duration } = req.body;
    if (!studentEmail || !studentName) {
      return res.status(400).json({ success: false, message: 'studentEmail and studentName are required.' });
    }

    res.json({ success: true, message: 'Application received email dispatch initiated.' });

    const template = appReceivedTemplate({ studentName, domain, duration });
    sendEmail({ to: studentEmail, ...template }).catch(err => console.error('App received email error:', err));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/contact-received
router.post('/contact-received', async (req, res) => {
  try {
    const { email, fullName, subject, serviceType } = req.body;
    if (!email || !fullName) {
      return res.status(400).json({ success: false, message: 'email and fullName are required.' });
    }

    res.json({ success: true, message: 'Contact received email dispatch initiated.' });

    const template = contactReceivedTemplate({ fullName, subject, serviceType });
    sendEmail({ to: email, ...template }).catch(err => console.error('Contact email error:', err));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/broadcast -> Admin Broadcast Newsletter to All Subscribers
router.post('/broadcast', async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' });
    }

    const subscribers = await Subscriber.find();
    if (!subscribers || subscribers.length === 0) {
      return res.status(400).json({ success: false, message: 'No subscribers found in database.' });
    }

    const recipientEmails = subscribers.map(s => s.email).filter(Boolean);
    const template = broadcastNewsletterTemplate({ subject, messageHtml: message.replace(/\n/g, '<br/>') });

    res.json({
      success: true,
      message: `Broadcast initiated to ${recipientEmails.length} subscribers! Emails are sending in the background.`,
      totalSubscribers: recipientEmails.length
    });

    // Background broadcast loop
    (async () => {
      for (const recipient of recipientEmails) {
        await sendEmail({ to: recipient, ...template }).catch(err => console.error(`Broadcast item error ${recipient}:`, err));
      }
    })();
  } catch (err) {
    console.error('Error broadcasting newsletter:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/email/test
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
