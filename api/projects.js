import { queryD1, executeD1 } from './_d1.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { type } = req.query;

      if (type === 'categories') {
        const results = await queryD1('SELECT * FROM web_categories ORDER BY created_at ASC');
        return res.status(200).json({ success: true, data: results || [] });
      }

      if (type === 'projects') {
        const results = await queryD1('SELECT * FROM web_projects ORDER BY created_at DESC');
        return res.status(200).json({ success: true, data: results || [] });
      }

      const categories = (await queryD1('SELECT * FROM web_categories ORDER BY created_at ASC')) || [
        { name: 'Web Applications' },
        { name: 'E-Commerce' },
        { name: 'Landing Pages' },
      ];
      const projects = (await queryD1('SELECT * FROM web_projects ORDER BY created_at DESC')) || [];

      return res.status(200).json({
        success: true,
        categories,
        projects,
      });
    }

    if (req.method === 'POST') {
      const { action, name, title, category, description, image, url } = req.body || {};

      if (action === 'add_category') {
        if (!name) {
          return res.status(400).json({ success: false, message: 'Category name required' });
        }
        const id = 'wcat_' + Math.random().toString(36).substring(2, 9);
        await executeD1('INSERT INTO web_categories (id, name) VALUES (?, ?)', [id, name.trim()]);
        return res.status(200).json({ success: true, id, name });
      }

      if (action === 'add_project') {
        if (!title || !url) {
          return res.status(400).json({ success: false, message: 'Title and URL required' });
        }
        const id = 'proj_' + Math.random().toString(36).substring(2, 9);
        await executeD1(
          'INSERT INTO web_projects (id, title, category, description, image, url) VALUES (?, ?, ?, ?, ?, ?)',
          [id, title.trim(), category?.trim() || '', description?.trim() || '', image?.trim() || '', url.trim()]
        );
        return res.status(200).json({ success: true, id });
      }

      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    if (req.method === 'DELETE') {
      const { id, table } = req.query;
      if (!id || !table) {
        return res.status(400).json({ success: false, message: 'ID and table required' });
      }
      const validTable = table === 'web_categories' ? 'web_categories' : 'web_projects';
      await executeD1(`DELETE FROM ${validTable} WHERE id = ?`, [id]);
      return res.status(200).json({ success: true, message: `Record ${id} deleted` });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Projects API Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
