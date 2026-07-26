import nodemailer from 'nodemailer';

// Create Gmail SMTP Transporter
// Uses Gmail App Password - no OAuth needed, no limitations
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,       // appifyra@gmail.com
      pass: process.env.GMAIL_APP_PASS    // Gmail App Password (16-char)
    }
  });
};

// ─── Email Templates ────────────────────────────────────────────────────────

const baseEmailStyle = `
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f4f4f4;
  padding: 30px 0;
`;

const cardStyle = `
  max-width: 580px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
`;

const headerStyle = `
  background: linear-gradient(135deg, #431DAB 0%, #AE6DFE 100%);
  padding: 32px 36px;
  text-align: center;
`;

const bodyStyle = `
  padding: 32px 36px;
`;

const footerStyle = `
  background: #f9f9f9;
  padding: 20px 36px;
  text-align: center;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #999;
`;

// ─── Template: Certificate Issued ───────────────────────────────────────────
export const certIssuedTemplate = ({ studentName, certificateId, domain, grade, issueDate }) => ({
  subject: `🎉 Your Certificate ${certificateId} Has Been Issued — Appifyra`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <img src="https://appifyra.com/assets/img/logo/logo.png" alt="Appifyra" style="height:40px; margin-bottom:12px;" />
          <h1 style="color:#fff; margin:0; font-size:24px; font-weight:700;">Certificate Issued!</h1>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:16px; color:#333;">Dear <strong>${studentName}</strong>,</p>
          <p style="color:#555; line-height:1.7;">
            Congratulations! 🎓 Your official <strong>Appifyra Completion Certificate</strong> has been successfully issued. Well done on completing your internship program!
          </p>

          <div style="background:#f0ebff; border-left:4px solid #431DAB; border-radius:8px; padding:20px 24px; margin:24px 0;">
            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0; color:#777; font-size:13px; width:140px;">📜 Certificate ID</td>
                <td style="padding:6px 0; font-weight:700; color:#431DAB; font-size:15px;">${certificateId}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#777; font-size:13px;">🎓 Program Domain</td>
                <td style="padding:6px 0; font-weight:600; color:#333;">${domain}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#777; font-size:13px;">🌟 Performance Grade</td>
                <td style="padding:6px 0; font-weight:600; color:#4ade80;">${grade}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#777; font-size:13px;">📅 Issue Date</td>
                <td style="padding:6px 0; font-weight:600; color:#333;">${issueDate}</td>
              </tr>
            </table>
          </div>

          <div style="text-align:center; margin:28px 0;">
            <a href="https://appifyra.com/dashboard" style="display:inline-block; background:linear-gradient(90deg,#431DAB,#AE6DFE); color:#fff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px;">
              View & Download Certificate
            </a>
          </div>
          <div style="text-align:center; margin-top:8px;">
            <a href="https://appifyra.com/verify?id=${certificateId}" style="color:#431DAB; font-size:13px; text-decoration:none;">
              Or verify online at appifyra.com/verify
            </a>
          </div>
          <p style="color:#777; font-size:13px; margin-top:24px;">We wish you all the best in your career journey ahead!</p>
        </div>
        <div style="${footerStyle}">
          Appifyra Certification Board • appifyra@gmail.com<br/>
          © ${new Date().getFullYear()} Appifyra. All rights reserved.
        </div>
      </div>
    </div>
  `
});

// ─── Template: Application Status Update ────────────────────────────────────
export const statusUpdateTemplate = ({ studentName, status, domain, duration }) => {
  const statusColor = status === 'Approved' ? '#4ade80' : status === 'Rejected' ? '#f87171' : status === 'Completed' ? '#38bdf8' : '#facc15';
  const statusMessage = {
    'Approved': `Great news! 🎉 Your internship application has been <strong>approved</strong>. Our team will reach out with next steps shortly.`,
    'Rejected': `We regret to inform you that your application was not selected at this time. You are welcome to re-apply after 30 days.`,
    'Completed': `Congratulations! 🏅 You have successfully completed your internship program. Your certificate will be issued shortly.`,
    'Under Review': `Your application is currently under review by our team. We'll notify you once a decision has been made.`
  }[status] || `Your application status has been updated.`;

  return {
    subject: `📋 Application Status Update: ${status} — Appifyra`,
    html: `
      <div style="${baseEmailStyle}">
        <div style="${cardStyle}">
          <div style="${headerStyle}">
            <img src="https://appifyra.com/assets/img/logo/logo.png" alt="Appifyra" style="height:40px; margin-bottom:12px;" />
            <h1 style="color:#fff; margin:0; font-size:24px; font-weight:700;">Application Update</h1>
          </div>
          <div style="${bodyStyle}">
            <p style="font-size:16px; color:#333;">Dear <strong>${studentName}</strong>,</p>
            <p style="color:#555; line-height:1.7;">${statusMessage}</p>

            <div style="background:#f9f9f9; border-radius:8px; padding:20px 24px; margin:24px 0;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0; color:#777; font-size:13px; width:140px;">📌 Current Status</td>
                  <td style="padding:6px 0; font-weight:700; color:${statusColor}; font-size:16px;">${status}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#777; font-size:13px;">🎓 Program</td>
                  <td style="padding:6px 0; font-weight:600; color:#333;">${domain} (${duration})</td>
                </tr>
              </table>
            </div>

            <div style="text-align:center; margin:28px 0;">
              <a href="https://appifyra.com/dashboard" style="display:inline-block; background:linear-gradient(90deg,#431DAB,#AE6DFE); color:#fff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px;">
                View My Dashboard
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

// ─── Template: Application Received Confirmation ────────────────────────────
export const appReceivedTemplate = ({ studentName, domain, duration }) => ({
  subject: `✅ Application Received — Appifyra Internship Program`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <img src="https://appifyra.com/assets/img/logo/logo.png" alt="Appifyra" style="height:40px; margin-bottom:12px;" />
          <h1 style="color:#fff; margin:0; font-size:24px; font-weight:700;">Application Received!</h1>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:16px; color:#333;">Dear <strong>${studentName}</strong>,</p>
          <p style="color:#555; line-height:1.7;">
            Thank you for applying to the <strong>Appifyra Internship Program</strong>! 🚀 We have received your application and our team will review it shortly.
          </p>

          <div style="background:#f0ebff; border-left:4px solid #431DAB; border-radius:8px; padding:20px 24px; margin:24px 0;">
            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0; color:#777; font-size:13px; width:140px;">🎓 Domain Applied</td>
                <td style="padding:6px 0; font-weight:600; color:#333;">${domain}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#777; font-size:13px;">⏱️ Duration Track</td>
                <td style="padding:6px 0; font-weight:600; color:#333;">${duration}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#777; font-size:13px;">📌 Status</td>
                <td style="padding:6px 0; font-weight:700; color:#facc15;">Under Review</td>
              </tr>
            </table>
          </div>

          <p style="color:#555; font-size:14px; line-height:1.7;">
            You can track your application status in real-time on your Student Dashboard. We'll email you as soon as there's an update.
          </p>

          <div style="text-align:center; margin:28px 0;">
            <a href="https://appifyra.com/dashboard" style="display:inline-block; background:linear-gradient(90deg,#431DAB,#AE6DFE); color:#fff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px;">
              Track My Application
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
});

// ─── Template: Contact Message Confirmation ──────────────────────────────────
export const contactReceivedTemplate = ({ fullName, subject }) => ({
  subject: `📩 Message Received — Appifyra`,
  html: `
    <div style="${baseEmailStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <img src="https://appifyra.com/assets/img/logo/logo.png" alt="Appifyra" style="height:40px; margin-bottom:12px;" />
          <h1 style="color:#fff; margin:0; font-size:24px; font-weight:700;">Message Received!</h1>
        </div>
        <div style="${bodyStyle}">
          <p style="font-size:16px; color:#333;">Dear <strong>${fullName}</strong>,</p>
          <p style="color:#555; line-height:1.7;">
            Thank you for reaching out to Appifyra! We have received your message regarding <strong>"${subject}"</strong> and our team will respond within 24-48 business hours.
          </p>
          <div style="text-align:center; margin:28px 0;">
            <a href="https://appifyra.com/contact" style="display:inline-block; background:linear-gradient(90deg,#431DAB,#AE6DFE); color:#fff; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:700; font-size:15px;">
              Visit Appifyra
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

// ─── Core Send Email Function ────────────────────────────────────────────────
export const sendEmail = async ({ to, subject, html }) => {
  try {
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
