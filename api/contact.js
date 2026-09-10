import nodemailer from 'nodemailer';
import { executeD1 } from './_d1.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, message, type } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    // SMTP Credentials
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || 'xpensivefilms.co@gmail.com';
    const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

    // Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const isNotificationRequest = type === 'maintenance_notify' || type === 'subscriber';
    const clientName = name || (isNotificationRequest ? 'Subscriber' : 'Anonymous Client');

    // 1. Store Subscriber/Inquiry in Cloudflare D1
    try {
      const id = 'inq_' + Math.random().toString(36).substring(2, 9);
      await executeD1(
        'INSERT INTO contact_inquiries (id, name, email, message, type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, clientName, email.trim(), message || '', type || 'inquiry', new Date().toISOString()]
      );
    } catch (dbErr) {
      console.warn("Cloudflare D1 inquiry logging note:", dbErr.message);
    }

    // 2. Email Notification Sent to Admin (xpensivefilms.co@gmail.com)
    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #07080d; font-family: sans-serif; color: #ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 10px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="580" style="max-width: 580px; background-color: #10121d; border: 1px solid #25283c; border-radius: 20px; padding: 32px; text-align: left;">
                  <tr>
                    <td>
                      <div style="display: inline-block; padding: 6px 12px; background-color: #1e1b4b; border: 1px solid #4338ca; border-radius: 8px; color: #818cf8; font-size: 12px; font-weight: bold; margin-bottom: 20px;">
                        ${isNotificationRequest ? '🔔 NEW LAUNCH SUBSCRIBER' : '🎬 DIRECT CLIENT INQUIRY'}
                      </div>
                      <h2 style="color: #ffffff; margin-top: 0; font-size: 22px;">
                        ${isNotificationRequest ? 'Launch Alert Registered' : `Inquiry from ${clientName}`}
                      </h2>
                      <div style="background-color: #161828; border: 1px solid #25283c; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px;"><strong>Name:</strong> <span style="color: #ffffff;">${clientName}</span></p>
                        <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px;"><strong>Email:</strong> <span style="color: #38bdf8;">${email}</span></p>
                        ${message ? `<p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 13px;"><strong>Message:</strong><br/><span style="color: #ffffff; white-space: pre-wrap;">${message}</span></p>` : ''}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    if (smtpPass) {
      await transporter.sendMail({
        from: `"Xpensive Films System" <${smtpUser}>`,
        to: 'xpensivefilms.co@gmail.com',
        replyTo: email,
        subject: isNotificationRequest
          ? `🔔 Back-Online Subscriber Registered: ${email}`
          : `🎬 New Portfolio Message from ${clientName}`,
        html: adminHtmlContent,
      });
    }

    return res.status(200).json({ success: true, message: 'Message received and recorded successfully.' });
  } catch (err) {
    console.error("Nodemailer SMTP Handler Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to process contact submission',
    });
  }
}
