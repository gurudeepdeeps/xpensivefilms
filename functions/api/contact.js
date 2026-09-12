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
