// Cloudflare Pages Function: /api/projects
// Handles web categories and web projects via D1 SQLite binding (env.DB)

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
  const url = new URL(request.url);
  const type = url.searchParams.get('type'); // 'categories' | 'projects' | 'all'

  try {
    if (!env.DB) {
      return jsonResponse({
        success: true,
        categories: [{ name: 'Web Applications' }, { name: 'E-Commerce' }, { name: 'Landing Pages' }],
        projects: [],
      });
    }

    if (type === 'categories') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM web_categories ORDER BY created_at ASC'
      ).all();
      return jsonResponse({ success: true, data: results || [] });
    }

    if (type === 'projects') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM web_projects ORDER BY created_at DESC'
      ).all();
      return jsonResponse({ success: true, data: results || [] });
    }

    const [catResult, projResult] = await Promise.all([
      env.DB.prepare('SELECT * FROM web_categories ORDER BY created_at ASC').all(),
      env.DB.prepare('SELECT * FROM web_projects ORDER BY created_at DESC').all(),
    ]);

    return jsonResponse({
      success: true,
      categories: catResult.results || [],
      projects: projResult.results || [],
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!env.DB) {
      return jsonResponse({ success: false, message: 'D1 Database not bound' }, 500);
    }

    if (action === 'add_category') {
      const { name } = body;
      if (!name) {
        return jsonResponse({ success: false, message: 'Category name is required' }, 400);
      }
      const id = 'wcat_' + Math.random().toString(36).substring(2, 9);
      await env.DB.prepare(
        'INSERT INTO web_categories (id, name) VALUES (?, ?)'
      ).bind(id, name.trim()).run();

      return jsonResponse({ success: true, id, name });
    }

    if (action === 'add_project') {
      const { title, category, description, image, url } = body;
      if (!title || !url) {
        return jsonResponse({ success: false, message: 'Title and URL are required' }, 400);
      }
      const id = 'proj_' + Math.random().toString(36).substring(2, 9);
      await env.DB.prepare(
        'INSERT INTO web_projects (id, title, category, description, image, url) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, title.trim(), category?.trim() || '', description?.trim() || '', image?.trim() || '', url.trim()).run();

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
    const table = url.searchParams.get('table'); // 'web_categories' | 'web_projects'

    if (!env.DB) {
      return jsonResponse({ success: false, message: 'D1 Database not bound' }, 500);
    }
    if (!id || !table) {
      return jsonResponse({ success: false, message: 'ID and table parameters required' }, 400);
    }

    const validTable = table === 'web_categories' ? 'web_categories' : 'web_projects';
    await env.DB.prepare(`DELETE FROM ${validTable} WHERE id = ?`).bind(id).run();

    return jsonResponse({ success: true, message: `Record ${id} deleted successfully` });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
