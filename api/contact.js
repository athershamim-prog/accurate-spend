const nodemailer = require('nodemailer');

const REQUIRED_FIELDS = ['first-name', 'last-name', 'email', 'company', 'company-type'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  const missing = REQUIRED_FIELDS.filter(f => !body[f] || !String(body[f]).trim());
  if (missing.length) {
    return res.status(400).json({ error: 'Missing required fields', fields: missing });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body['email'])) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const product         = body['product']           || 'Accurate Spend';
  const firstName       = body['first-name'].trim();
  const lastName        = body['last-name'].trim();
  const email           = body['email'].trim();
  const phone           = body['phone']             || '—';
  const company         = body['company'].trim();
  const companyType     = body['company-type']      || '—';
  const role            = body['role']              || '—';
  const reportingStatus = body['reporting-status']  || '—';
  const message         = body['message']           || '—';

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `New Demo Request — ${product} | ${firstName} ${lastName} (${company})`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin: 0; padding: 0; background: #f0f6ff; font-family: Arial, sans-serif; color: #1a3363; }
    .wrap { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #1a3363; padding: 28px 32px; }
    .header span { color: #00a896; }
    .header h1 { margin: 0; color: #fff; font-size: 20px; font-weight: 700; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.65); font-size: 13px; }
    .body { padding: 28px 32px; }
    .badge { display: inline-block; background: #e6f7f6; color: #007f71; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 20px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    td { padding: 10px 0; border-bottom: 1px solid #f0f6ff; font-size: 14px; vertical-align: top; }
    td:first-child { color: #64748b; width: 40%; font-weight: 600; padding-right: 12px; }
    td:last-child { color: #1a3363; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; font-size: 14px; color: #334155; line-height: 1.6; margin-top: 20px; white-space: pre-wrap; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; }
    .reply-btn { display: inline-block; margin-top: 20px; background: #00a896; color: #fff; text-decoration: none; padding: 11px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Accurate<span>Spend</span></h1>
      <p>New demo request received from your website</p>
    </div>
    <div class="body">
      <div class="badge">${product}</div>
      <table>
        <tr><td>Name</td><td>${firstName} ${lastName}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${email}" style="color:#00a896;">${email}</a></td></tr>
        <tr><td>Phone</td><td>${phone}</td></tr>
        <tr><td>Company</td><td>${company}</td></tr>
        <tr><td>Company Type</td><td>${companyType}</td></tr>
        <tr><td>Role</td><td>${role}</td></tr>
        <tr><td>Reporting Status</td><td>${reportingStatus}</td></tr>
      </table>
      ${message !== '—' ? `<div class="message-box">${message}</div>` : ''}
      <a href="mailto:${email}" class="reply-btn">Reply to ${firstName}</a>
    </div>
    <div class="footer">Accurate Spend &nbsp;·&nbsp; 39649 Dorchester Circle, Canton, MI 48188 &nbsp;·&nbsp; (734) 239-1680</div>
  </div>
</body>
</html>`;

  const text = `New Demo Request — ${product}

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${company}
Company Type: ${companyType}
Role: ${role}
Reporting Status: ${reportingStatus}

Message:
${message}`;

  await transporter.sendMail({
    from: `"Accurate Spend Website" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: email,
    subject,
    text,
    html,
  });

  return res.status(200).json({ ok: true });
};
