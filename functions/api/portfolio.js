// Cloudflare Pages Function: /api/portfolio
// Handles video categories and portfolio videos via D1 SQLite binding (env.DB)

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

export async function onRequestGet({ env, request }) {
  const db = env.DB || env.xpensive_films_db;
  const url = new URL(request.url);
  const type = url.searchParams.get('type'); // 'videos' | 'categories' | 'all'

  try {
    if (!db) {
      // Fallback in case D1 binding is not yet attached
      return jsonResponse({
        success: true,
        categories: [
          { key: 'all', label: 'All' },
          { key: 'commercials', label: 'Commercials' },
          { key: 'music_videos', label: 'Music Videos' },
          { key: 'reels', label: 'Social Reels & Promos' },
        ],
        videos: [],
      });
    }

    if (type === 'categories') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM video_categories ORDER BY created_at ASC'
      ).all();
      return jsonResponse({ success: true, data: results || [] });
    }

    if (type === 'videos') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM portfolio_videos ORDER BY created_at DESC'
      ).all();
      return jsonResponse({ success: true, data: results || [] });
    }

    // Default: fetch both categories and videos
    const [catResult, vidResult] = await Promise.all([
      env.DB.prepare('SELECT * FROM video_categories ORDER BY created_at ASC').all(),
      env.DB.prepare('SELECT * FROM portfolio_videos ORDER BY created_at DESC').all(),
    ]);

    return jsonResponse({
      success: true,
      categories: catResult.results || [],
      videos: vidResult.results || [],
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json();
    const { action } = body; // 'add_video' | 'add_category'

    if (!env.DB) {
      return jsonResponse({ success: false, message: 'D1 Database not bound' }, 500);
    }

    if (action === 'add_category') {
      const { key, label } = body;
      if (!key || !label) {
        return jsonResponse({ success: false, message: 'Key and Label are required' }, 400);
      }
      const id = 'vcat_' + Math.random().toString(36).substring(2, 9);
      await env.DB.prepare(
        'INSERT INTO video_categories (id, key, label) VALUES (?, ?, ?)'
      ).bind(id, key.toLowerCase().trim(), label.trim()).run();

      return jsonResponse({ success: true, id, key, label });
    }

    if (action === 'add_video') {
      const { title, category, path, thumbnail, description } = body;
      if (!title || !category || !path) {
        return jsonResponse({ success: false, message: 'Title, category and video path are required' }, 400);
      }
      const id = 'vid_' + Math.random().toString(36).substring(2, 9);
      await env.DB.prepare(
        'INSERT INTO portfolio_videos (id, title, category, path, thumbnail, description) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, title.trim(), category.trim(), path.trim(), thumbnail?.trim() || '', description?.trim() || '').run();

      return jsonResponse({ success: true, id });
    }

    return jsonResponse({ success: false, message: 'Invalid action' }, 400);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const table = url.searchParams.get('table'); // 'video_categories' | 'portfolio_videos'

    if (!env.DB) {
      return jsonResponse({ success: false, message: 'D1 Database not bound' }, 500);
    }
    if (!id || !table) {
      return jsonResponse({ success: false, message: 'ID and table parameters required' }, 400);
    }

    const validTable = table === 'video_categories' ? 'video_categories' : 'portfolio_videos';
    await env.DB.prepare(`DELETE FROM ${validTable} WHERE id = ?`).bind(id).run();

    return jsonResponse({ success: true, message: `Record ${id} deleted successfully` });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
