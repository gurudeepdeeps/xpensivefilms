// Cloudflare Pages Function: /api/contact
// Handles contact messages & launch alert subscribers on Cloudflare Edge

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestPost({ env, request }) {
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

    // Save to Cloudflare D1 if configured
    if (env.DB) {
      try {
        await env.DB.prepare(
          'INSERT INTO contact_inquiries (id, name, email, message, type) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, cleanName, cleanEmail, cleanMessage, inquiryType).run();
      } catch (dbErr) {
        console.warn('Could not insert inquiry to D1:', dbErr);
      }
    }

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
