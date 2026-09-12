// Cloudflare Pages Function: /api/contact
// Handles contact messages, inquiries, & subscribers on Cloudflare Edge

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestGet({ env }) {
  const db = env.DB || env.xpensive_films_db;
  try {
    if (!db) {
      return jsonResponse({ success: true, data: [] });
    }

    const { results } = await db.prepare(
      'SELECT id, name, email, message, type, created_at FROM contact_inquiries ORDER BY created_at DESC LIMIT 100'
    ).all();

    return jsonResponse({ success: true, data: results || [] });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function onRequestPost({ env, request }) {
  const db = env.DB || env.xpensive_films_db;
  try {
    const body = await request.json();
    const { name, email, message, type } = body;

    if (!email || !email.trim()) {
      return jsonResponse({ success: false, message: 'Email address is required' }, 400);
    }

    const cleanEmail = email.trim();
    const cleanName = name ? name.trim() : 'Website Visitor';
    const cleanMessage = message ? message.trim() : '';
    const inquiryType = type || 'inquiry';
    const id = 'inq_' + Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();

    // Save to Cloudflare D1
    if (db) {
      try {
        await db.prepare(
          'INSERT INTO contact_inquiries (id, name, email, message, type, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(id, cleanName, cleanEmail, cleanMessage, inquiryType, createdAt).run();
      } catch (dbErr) {
        console.warn('Could not insert inquiry to D1:', dbErr);
      }
    }

    // Send Email Notification to xpensivefilms.co@gmail.com
    await sendEmailNotification({
      env,
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      type: inquiryType,
      date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    });

    return jsonResponse({
      success: true,
      message: inquiryType === 'subscriber'
        ? 'Subscription confirmed! We will notify you when the new reel drops.'
        : 'Message received! Our production team will get in touch shortly.',
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

async function sendEmailNotification({ env, name, email, message, type, date }) {
  const isNotificationRequest = type === 'maintenance_notify' || type === 'subscriber';
  const subject = isNotificationRequest
    ? `🔔 New Launch Subscriber: ${email}`
    : `🎬 New Portfolio Message from ${name}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #07080d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width: 580px; background-color: #10121d; border: 1px solid #25283c; border-radius: 20px; padding: 32px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <tr>
                  <td>
                    <div style="display: inline-block; padding: 6px 14px; background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2)); border: 1px solid rgba(129,140,248,0.4); border-radius: 9999px; color: #a5b4fc; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 20px;">
                      ${isNotificationRequest ? '🔔 Launch Subscriber' : '🎬 Direct Portfolio Inquiry'}
                    </div>
                    <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">
                      ${isNotificationRequest ? 'New Subscriber Registered' : `Inquiry from ${name}`}
                    </h2>
                    <div style="background-color: #161828; border: 1px solid #25283c; border-radius: 14px; padding: 22px; margin: 20px 0;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="6">
                        <tr>
                          <td width="100" style="color: #94a3b8; font-size: 13px; font-weight: 600;">Name:</td>
                          <td style="color: #ffffff; font-size: 14px; font-weight: 500;">${name}</td>
                        </tr>
                        <tr>
                          <td width="100" style="color: #94a3b8; font-size: 13px; font-weight: 600;">Email:</td>
                          <td style="color: #38bdf8; font-size: 14px; font-weight: 500;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                          <td width="100" style="color: #94a3b8; font-size: 13px; font-weight: 600;">Type:</td>
                          <td style="color: #cbd5e1; font-size: 13px;">${type}</td>
                        </tr>
                        <tr>
                          <td width="100" style="color: #94a3b8; font-size: 13px; font-weight: 600;">Time:</td>
                          <td style="color: #94a3b8; font-size: 12px;">${date}</td>
                        </tr>
                        ${message ? `
                        <tr>
                          <td colspan="2" style="padding-top: 14px; border-top: 1px solid #25283c;">
                            <div style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">Message:</div>
                            <div style="color: #f1f5f9; font-size: 14px; line-height: 1.6; white-space: pre-wrap; background-color: #0b0d17; padding: 14px; border-radius: 8px; border: 1px solid #1e2238;">${message}</div>
                          </td>
                        </tr>
                        ` : ''}
                      </table>
                    </div>
                    <div style="text-align: center; margin-top: 24px;">
                      <a href="mailto:${email}?subject=Re:%20Xpensive%20Films%20Inquiry" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px;">
                        Reply to ${name}
                      </a>
                    </div>
                    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #1e2238; text-align: center; color: #64748b; font-size: 11px;">
                      Sent automatically from Xpensive Films Portfolio Edge Function
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

  const targetEmail = 'xpensivefilms.co@gmail.com';

  // 1. Try Resend (Primary direct email service)
  const resendApiKey = env.RESEND_API_KEY || env.RESEND_KEY;
  if (resendApiKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM || 'Xpensive Films <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: email,
          subject: subject,
          html: htmlContent,
        }),
      });
      if (resendRes.ok) {
        console.log('Email sent successfully via Resend');
        return;
      } else {
        const errorText = await resendRes.text();
        console.warn('Resend API returned error:', resendRes.status, errorText);
      }
    } catch (err) {
      console.warn('Resend send failed:', err.message);
    }
  }

  // 2. Try Brevo if BREVO_API_KEY is configured
  const brevoApiKey = env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Xpensive Films', email: env.BREVO_SENDER_EMAIL || 'notifications@xpensivefilms.com' },
          to: [{ email: targetEmail, name: 'Xpensive Films' }],
          replyTo: { email: email, name: name },
          subject: subject,
          htmlContent: htmlContent,
        }),
      });
      if (brevoRes.ok) {
        console.log('Email sent successfully via Brevo');
        return;
      }
    } catch (err) {
      console.warn('Brevo send failed:', err.message);
    }
  }

  // 3. Fallback to MailChannels (Native to Cloudflare Workers / Pages)
  try {
    const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: targetEmail, name: 'Xpensive Films' }],
          },
        ],
        from: {
          email: 'noreply@xpensivefilms.pages.dev',
          name: 'Xpensive Films Portfolio',
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: subject,
        content: [
          {
            type: 'text/html',
            value: htmlContent,
          },
        ],
      }),
    });
    if (mcRes.ok) {
      console.log('Email sent successfully via MailChannels');
    } else {
      const errText = await mcRes.text();
      console.warn('MailChannels response:', mcRes.status, errText);
    }
  } catch (mcErr) {
    console.warn('MailChannels send error:', mcErr.message);
  }
}

export async function onRequestDelete({ env, request }) {
  const db = env.DB || env.xpensive_films_db;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!db) {
      return jsonResponse({ success: false, message: 'D1 Database not bound' }, 500);
    }
    if (!id) {
      return jsonResponse({ success: false, message: 'Inquiry ID is required' }, 400);
    }

    await db.prepare('DELETE FROM contact_inquiries WHERE id = ?').bind(id).run();

    return jsonResponse({ success: true, message: `Inquiry ${id} deleted successfully` });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
