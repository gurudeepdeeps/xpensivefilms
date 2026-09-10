// Cloudflare Pages Function: /api/comments
// Handles public comments and admin moderation via D1 SQLite binding (env.DB)

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
  try {
    if (!env.DB) {
      return jsonResponse({
        success: true,
        data: [
          {
            id: 'demo_1',
            userName: 'Alex Rivera',
            content: 'Incredible cinematography and sound design on the latest commercial reel!',
            created_at: new Date().toISOString(),
          },
        ],
      });
    }

    const { results } = await env.DB.prepare(
      'SELECT id, userName, content, created_at FROM comments ORDER BY created_at DESC LIMIT 100'
    ).all();

    return jsonResponse({ success: true, data: results || [] });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json();
    const { userName, content } = body;

    if (!content || !content.trim()) {
      return jsonResponse({ success: false, message: 'Comment content cannot be empty' }, 400);
    }

    const author = (userName && userName.trim()) ? userName.trim() : 'Anonymous';
    const cleanContent = content.trim();
    const id = 'comm_' + Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();

    if (env.DB) {
      await env.DB.prepare(
        'INSERT INTO comments (id, userName, content, created_at) VALUES (?, ?, ?, ?)'
      ).bind(id, author, cleanContent, createdAt).run();
    }

    return jsonResponse({
      success: true,
      data: {
        id,
        userName: author,
        content: cleanContent,
        created_at: createdAt,
      },
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!env.DB) {
      return jsonResponse({ success: false, message: 'D1 Database not bound' }, 500);
    }
    if (!id) {
      return jsonResponse({ success: false, message: 'Comment ID is required' }, 400);
    }

    await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();

    return jsonResponse({ success: true, message: `Comment ${id} deleted successfully` });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
