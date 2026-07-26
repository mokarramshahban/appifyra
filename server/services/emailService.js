import nodemailer from 'nodemailer';
import dns from 'dns';

// Force Node.js process-wide DNS to prefer IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');

// Create Gmail SMTP Transporter using Nodemailer's built-in Gmail service handler
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS
    }
  });
};

// ─── Base Styles ─────────────────────────────────────────────────────────────
const baseEmailStyle = `
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #050614;
  padding: 40px 15px;
  color: #e2e8f0;
`;

const cardStyle = `
  max-width: 600px;
  margin: 0 auto;
  background: #0d1127;
  border: 1px solid rgba(174, 109, 254, 0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const headerStyle = `
  background: linear-gradient(135deg, #2b1055 0%, #7541c8 50%, #431DAB 100%);
  padding: 36px 30px;
  text-align: center;
`;

const bodyStyle = `
  padding: 32px 30px;
  color: #cbd5e1;
  font-size: 15px;
  line-height: 1.7;
`;

const footerStyle = `
  background: #090c1d;
  padding: 24px 30px;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 12px;
  color: #94a3b8;
`;

const LOGO_HTML = `
  <a href="https://appifyra.vercel.app" target="_blank" style="text-decoration:none; display:inline-block;">
    <img src="https://appifyra.vercel.app/assets/img/logo/logo-white.png" alt="Appifyra" style="height:38px; border:0; outline:none; vertical-align:middle;" />
  </a>
`;

// ─── Template 1: Internship Application Received ────────────────────────────
export const appReceivedTemplate = ({ studentName, domain, duration }) => ({
  subject: `✅ Application Received — Appifyra Internship Program`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          ${LOGO_HTML}
          <p style="color:#e0d3ff; margin:8px 0 0 0; font-size:13px; font-weight:500;">Internship Admissions Team</p>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:17px; color:#ffffff; font-weight:600; margin-top:0;">Dear ${studentName},</p>
          <p>
            Thank you for applying to the <strong>Appifyra Internship Program</strong>! 🚀 We have successfully received your application. Our admissions team will review your profile shortly.
          </p>

          <div style="background:rgba(67, 29, 171, 0.15); border:1px solid rgba(174, 109, 254, 0.3); border-radius:12px; padding:20px; margin:24px 0;">
            <table style="width:100%; border-collapse:collapse; color:#e2e8f0; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#94a3b8; width:130px;">🎓 Target Track</td>
                <td style="padding:6px 0; font-weight:700; color:#c084fc;">${domain}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#94a3b8;">⏱️ Duration</td>
                <td style="padding:6px 0; font-weight:600;">${duration}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#94a3b8;">📌 Application Status</td>
                <td style="padding:6px 0; font-weight:700; color:#facc15;">Under Review</td>
              </tr>
            </table>
          </div>

          <p style="font-size:14px; color:#94a3b8;">
            You can log into your Student Dashboard anytime to track your application status in real-time.
          </p>

          <div style="text-align:center; margin:30px 0 10px 0;">
            <a href="https://appifyra.vercel.app/dashboard" style="display:inline-block; background:linear-gradient(90deg, #6366f1, #a855f7); color:#ffffff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px; box-shadow:0 4px 15px rgba(168, 85, 247, 0.4);">
              Go to Student Dashboard
            </a>
          </div>
        </div>
        <div style="${footerStyle}">
          Team Appifyra • <a href="mailto:appifyra@gmail.com" style="color:#a855f7; text-decoration:none;">appifyra@gmail.com</a><br/>
          © ${new Date().getFullYear()} Appifyra. All rights reserved.
        </div>
      </div>
    </div>
  `
});

// ─── Template 2: Application Status Update ────────────────────────────────────
export const statusUpdateTemplate = ({ studentName, status, domain, duration }) => {
  const statusColor = status === 'Approved' ? '#4ade80' : status === 'Rejected' ? '#f87171' : status === 'Completed' ? '#38bdf8' : '#facc15';
  const statusMessage = {
    'Approved': `Great news! 🎉 Your internship application for <strong>${domain}</strong> has been <strong>Approved</strong>. Our program coordinator will reach out to you shortly with onboarding details.`,
    'Rejected': `Thank you for your interest in Appifyra. After evaluating your profile, we regret to inform you that your application was not selected for this cohort. You are eligible to reapply in 30 days.`,
    'Completed': `Congratulations! 🏅 You have successfully completed your internship in <strong>${domain}</strong> (${duration}). Your official completion certificate is ready!`,
    'Under Review': `Your application for <strong>${domain}</strong> is currently undergoing secondary review by our tech leads.`
  }[status] || `Your application status for ${domain} has been updated to <strong>${status}</strong>.`;

  return {
    subject: `📋 Application Status Update: ${status} — Appifyra`,
    html: `
      <div style="${baseEmailStyle}">
        <div style="${cardStyle}">
          <div style="${headerStyle}">
            ${LOGO_HTML}
            <p style="color:#e0d3ff; margin:8px 0 0 0; font-size:13px; font-weight:500;">Application Status Notification</p>
          </div>
          <div style="${bodyStyle}">
            <p style="font-size:17px; color:#ffffff; font-weight:600; margin-top:0;">Dear ${studentName},</p>
            <p style="line-height:1.7;">${statusMessage}</p>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:20px; margin:24px 0;">
              <table style="width:100%; border-collapse:collapse; font-size:14px;">
                <tr>
                  <td style="padding:6px 0; color:#94a3b8; width:130px;">📌 Updated Status</td>
                  <td style="padding:6px 0; font-weight:700; color:${statusColor}; font-size:16px;">${status}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#94a3b8;">🎓 Domain & Duration</td>
                  <td style="padding:6px 0; font-weight:600; color:#e2e8f0;">${domain} (${duration})</td>
                </tr>
              </table>
            </div>

            <div style="text-align:center; margin:30px 0 10px 0;">
              <a href="https://appifyra.vercel.app/dashboard" style="display:inline-block; background:linear-gradient(90deg, #6366f1, #a855f7); color:#ffffff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px;">
                View Student Dashboard
              </a>
            </div>
          </div>
          <div style="${footerStyle}">
            Team Appifyra Admissions • appifyra@gmail.com<br/>
            © ${new Date().getFullYear()} Appifyra. All rights reserved.
          </div>
        </div>
      </div>
    `
  };
};

// ─── Template 3: Certificate Issued ───────────────────────────────────────────
export const certIssuedTemplate = ({ studentName, certificateId, domain, grade, issueDate }) => ({
  subject: `🎉 Your Certificate ${certificateId} Has Been Issued — Appifyra`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          ${LOGO_HTML}
          <p style="color:#e0d3ff; margin:8px 0 0 0; font-size:13px; font-weight:500;">Official Credential Issuance</p>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:17px; color:#ffffff; font-weight:600; margin-top:0;">Dear ${studentName},</p>
          <p style="line-height:1.7;">
            Congratulations! 🎓 Your official <strong>Appifyra Certificate of Completion</strong> has been issued and verified.
          </p>

          <div style="background:linear-gradient(135deg, rgba(67,29,171,0.2), rgba(168,85,247,0.2)); border:1px solid #a855f7; border-radius:14px; padding:22px; margin:24px 0;">
            <table style="width:100%; border-collapse:collapse; font-size:14px; color:#e2e8f0;">
              <tr>
                <td style="padding:6px 0; color:#94a3b8; width:140px;">📜 Certificate ID</td>
                <td style="padding:6px 0; font-weight:800; color:#c084fc; font-size:16px;">${certificateId}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#94a3b8;">🎓 Program Domain</td>
                <td style="padding:6px 0; font-weight:600;">${domain}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#94a3b8;">🌟 Grade Achieved</td>
                <td style="padding:6px 0; font-weight:700; color:#4ade80;">${grade}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#94a3b8;">📅 Issue Date</td>
                <td style="padding:6px 0; font-weight:600;">${issueDate}</td>
              </tr>
            </table>
          </div>

          <div style="text-align:center; margin:28px 0 10px 0;">
            <a href="https://appifyra.vercel.app/verify?id=${certificateId}" style="display:inline-block; background:linear-gradient(90deg, #6366f1, #a855f7); color:#ffffff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px; box-shadow:0 4px 15px rgba(168, 85, 247, 0.4);">
              Verify & View Online Certificate
            </a>
          </div>
        </div>
        <div style="${footerStyle}">
          Appifyra Certification Board • appifyra@gmail.com<br/>
          © ${new Date().getFullYear()} Appifyra. All rights reserved.
        </div>
      </div>
    </div>
  `
});

// ─── Template 4: Client Service Inquiry Received ────────────────────────────
export const contactReceivedTemplate = ({ fullName, subject, serviceType }) => ({
  subject: `📩 Service Request Received — Appifyra`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          ${LOGO_HTML}
          <p style="color:#e0d3ff; margin:8px 0 0 0; font-size:13px; font-weight:500;">Client Services & Development Team</p>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:17px; color:#ffffff; font-weight:600; margin-top:0;">Dear ${fullName},</p>
          <p>
            Thank you for contacting <strong>Appifyra Client Services</strong>! 💼 We have received your inquiry regarding <strong>"${subject || serviceType || 'Software Development'}"</strong>.
          </p>

          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:20px; margin:24px 0;">
            <p style="margin:0; font-size:14px; color:#94a3b8;">
              Our technical consultant will review your project scope and get back to you within <strong>24 business hours</strong> with a detailed proposal.
            </p>
          </div>

          <div style="text-align:center; margin:30px 0 10px 0;">
            <a href="https://appifyra.vercel.app" style="display:inline-block; background:linear-gradient(90deg, #6366f1, #a855f7); color:#ffffff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px;">
              Visit Appifyra Services
            </a>
          </div>
        </div>
        <div style="${footerStyle}">
          Team Appifyra • appifyra@gmail.com<br/>
          © ${new Date().getFullYear()} Appifyra. All rights reserved.
        </div>
      </div>
    </div>
  `
});

// ─── Template 5: Service Inquiry Status Update ──────────────────────────────
export const inquiryStatusTemplate = ({ fullName, serviceType, status, message }) => ({
  subject: `💼 Update on your Service Inquiry: ${status} — Appifyra`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          ${LOGO_HTML}
          <p style="color:#e0d3ff; margin:8px 0 0 0; font-size:13px; font-weight:500;">Client Services Update</p>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:17px; color:#ffffff; font-weight:600; margin-top:0;">Dear ${fullName},</p>
          <p>
            Here is an update regarding your service request for <strong>${serviceType || 'Development Services'}</strong>:
          </p>

          <div style="background:rgba(67, 29, 171, 0.15); border:1px solid rgba(174, 109, 254, 0.3); border-radius:12px; padding:20px; margin:24px 0;">
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#94a3b8; width:130px;">📌 Status</td>
                <td style="padding:6px 0; font-weight:700; color:#a855f7;">${status}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding:6px 0; color:#94a3b8; vertical-align:top;">📝 Message / Note</td>
                <td style="padding:6px 0; color:#e2e8f0;">${message}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <p style="font-size:14px; color:#94a3b8;">
            If you have any questions, feel free to reply directly to this email or write to us at <a href="mailto:appifyra@gmail.com" style="color:#a855f7;">appifyra@gmail.com</a>.
          </p>
        </div>
        <div style="${footerStyle}">
          Team Appifyra • appifyra@gmail.com<br/>
          © ${new Date().getFullYear()} Appifyra. All rights reserved.
        </div>
      </div>
    </div>
  `
});

// ─── Template 6: Newsletter Welcome Confirmation ─────────────────────────────
export const newsletterWelcomeTemplate = ({ email }) => ({
  subject: `✨ Welcome to the Appifyra Tech Community!`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          ${LOGO_HTML}
          <p style="color:#e0d3ff; margin:8px 0 0 0; font-size:13px; font-weight:500;">Community Newsletter</p>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:17px; color:#ffffff; font-weight:600; margin-top:0;">Hello!</p>
          <p>
            Welcome to the <strong>Appifyra Community</strong>! 🎉 Your email (<strong>${email}</strong>) is now subscribed to receive our latest tech insights, internship openings, and engineering updates.
          </p>
          <p style="font-size:14px; color:#94a3b8;">
            We promise no spam — only high-value tech opportunities and tech articles.
          </p>
        </div>
        <div style="${footerStyle}">
          Team Appifyra • appifyra@gmail.com<br/>
          © ${new Date().getFullYear()} Appifyra. All rights reserved.
        </div>
      </div>
    </div>
  `
});

// ─── Template 7: Broadcast Newsletter ─────────────────────────────────────────
export const broadcastNewsletterTemplate = ({ subject, messageHtml }) => ({
  subject: subject || '📢 Latest Updates from Appifyra',
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          ${LOGO_HTML}
          <p style="color:#e0d3ff; margin:8px 0 0 0; font-size:13px; font-weight:500;">Community Broadcast</p>
        </div>
        <div style="${bodyStyle}">
          ${messageHtml}
        </div>
        <div style="${footerStyle}">
          You are receiving this email because you subscribed to Appifyra updates.<br/>
          Team Appifyra • appifyra@gmail.com • © ${new Date().getFullYear()} Appifyra
        </div>
      </div>
    </div>
  `
});

// ─── Core Send Email Function ────────────────────────────────────────────────
export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
      console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASS missing in environment.');
      return { success: false, error: 'Email credentials missing' };
    }
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Appifyra" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email send error to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};
