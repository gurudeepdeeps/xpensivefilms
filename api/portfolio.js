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
        const results = await queryD1('SELECT * FROM video_categories ORDER BY created_at ASC');
        return res.status(200).json({ success: true, data: results || [] });
      }

      if (type === 'videos') {
        const results = await queryD1('SELECT * FROM portfolio_videos ORDER BY created_at DESC');
        return res.status(200).json({ success: true, data: results || [] });
      }

      const categories = (await queryD1('SELECT * FROM video_categories ORDER BY created_at ASC')) || [];
      const videos = (await queryD1('SELECT * FROM portfolio_videos ORDER BY created_at DESC')) || [];

      return res.status(200).json({
        success: true,
        categories,
        videos,
      });
    }

    if (req.method === 'POST') {
      const { action, key, label, title, category, path, thumbnail, description } = req.body || {};

      if (action === 'add_category') {
        if (!key || !label) {
          return res.status(400).json({ success: false, message: 'Key and label required' });
        }
        const id = 'vcat_' + Math.random().toString(36).substring(2, 9);
        await executeD1('INSERT INTO video_categories (id, key, label) VALUES (?, ?, ?)', [
          id,
          key.toLowerCase().trim(),
          label.trim(),
        ]);
        return res.status(200).json({ success: true, id, key, label });
      }

      if (action === 'add_video') {
        if (!title || !category || !path) {
          return res.status(400).json({ success: false, message: 'Title, category, and path required' });
        }
        const id = 'vid_' + Math.random().toString(36).substring(2, 9);
        await executeD1(
          'INSERT INTO portfolio_videos (id, title, category, path, thumbnail, description) VALUES (?, ?, ?, ?, ?, ?)',
          [id, title.trim(), category.trim(), path.trim(), thumbnail?.trim() || '', description?.trim() || '']
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
      const validTable = table === 'video_categories' ? 'video_categories' : 'portfolio_videos';
      await executeD1(`DELETE FROM ${validTable} WHERE id = ?`, [id]);
      return res.status(200).json({ success: true, message: `Record ${id} deleted` });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Portfolio API Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
