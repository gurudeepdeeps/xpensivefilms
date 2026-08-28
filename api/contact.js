import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Optional Supabase client to store subscribers if Supabase credentials are available
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://rrwbwviwesnczadgjhde.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_JcEPZ33wrf_WHa_U75L7Dw_AosVNuio";
const supabase = createClient(supabaseUrl, supabaseKey);

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

    const isNotificationRequest = type === 'maintenance_notify';
    const clientName = name || (isNotificationRequest ? 'Subscriber' : 'Anonymous Client');

    // 1. Store Subscriber in Supabase (if subscribers table exists)
    if (isNotificationRequest) {
      try {
        await supabase.from('subscribers').insert([{ email, created_at: new Date().toISOString() }]);
      } catch (dbErr) {
        console.warn("Supabase subscriber logging note:", dbErr.message);
      }
    }

    // 2. Email Notification Sent to Admin (xpensivefilms.co@gmail.com)
    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #07080d; font-family: sans-serif; color: #ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 10px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" style="max-width: 600px; background-color: #10121d; border: 1px solid #25283c; border-radius: 20px; padding: 30px;">
                  <tr>
                    <td>
                      <h1 style="color: #a78bfa; margin-top: 0;">XPENSIVE FILMS</h1>
                      <p style="font-size: 12px; color: #fbbf24; text-transform: uppercase; letter-spacing: 2px;">
                        ${isNotificationRequest ? '🔔 NEW BACK-ONLINE SUBSCRIBER' : '🎬 NEW PORTFOLIO CLIENT INQUIRY'}
                      </p>
                      <hr style="border: 0; border-top: 1px solid #25283c; margin: 20px 0;" />
                      <p><strong>From:</strong> ${clientName}</p>
                      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #a78bfa;">${email}</a></p>
                      <p><strong>Message / Context:</strong></p>
                      <div style="background-color: #0b0c14; border-left: 4px solid #8b5cf6; padding: 15px; border-radius: 8px; color: #e2e8f0;">
                        ${message || `Subscriber ${email} signed up to be notified when site maintenance completes on Sept 6.`}
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

    await transporter.sendMail({
      from: `"Xpensive Films System" <${smtpUser}>`,
      to: 'xpensivefilms.co@gmail.com',
      replyTo: email,
      subject: isNotificationRequest
        ? `🔔 Back-Online Subscriber Registered: ${email}`
        : `🎬 New Portfolio Message from ${clientName}`,
      html: adminHtmlContent,
    });

    // 3. Email Sent Directly to Subscribed Visitor Confirming Sept 6 Launch
    const visitorHtmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #07080d; font-family: sans-serif; color: #ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 10px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="580" style="max-width: 580px; background-color: #10121d; border: 1px solid #25283c; border-radius: 20px; padding: 32px; text-align: left;">
                  <tr>
                    <td>
                      <h2 style="color: #a78bfa; margin-top: 0;">🎬 You're Subscribed to Xpensive Films!</h2>
                      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        Thank you for subscribing! Our studio site is currently undergoing scheduled infrastructure upgrades.
                      </p>
                      <div style="background-color: #161828; border: 1px solid #313552; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                        <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block;">Official Launch Date</span>
                        <span style="font-size: 22px; font-weight: 800; color: #fbbf24;">September 6, 2026</span>
                      </div>
                      <p style="color: #cbd5e1; font-size: 14px;">
                        We will send you an email alert the moment our platform goes live with upgraded 4K video reels and new digital creations.
                      </p>
                      <hr style="border: 0; border-top: 1px solid #25283c; margin: 24px 0;" />
                      <p style="font-size: 12px; color: #64748b;">
                        For urgent inquiries, email us at <a href="mailto:xpensivefilms.co@gmail.com" style="color: #a78bfa;">xpensivefilms.co@gmail.com</a> or WhatsApp <a href="https://wa.me/916363770057" style="color: #34d399;">+91 6363770057</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: `"Xpensive Films Studio" <${smtpUser}>`,
        to: email,
        subject: `🎬 Subscription Confirmed - Xpensive Films Launches Sept 6`,
        html: visitorHtmlContent,
      });
    } catch (visitorMailErr) {
      console.warn("Visitor confirmation mail warning:", visitorMailErr);
    }

    return res.status(200).json({ success: true, message: 'Subscriber email processed & confirmation delivered via Nodemailer SMTP' });
  } catch (err) {
    console.error("Nodemailer SMTP Handler Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to send email via SMTP',
    });
  }
}
