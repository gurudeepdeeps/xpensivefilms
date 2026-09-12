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
      const results = (await queryD1('SELECT id, userName, content, created_at FROM comments ORDER BY created_at DESC LIMIT 100')) || [];
      return res.status(200).json({ success: true, data: results });
    }

    if (req.method === 'POST') {
      const { userName, content } = req.body || {};
      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
      }

      const author = (userName && userName.trim()) ? userName.trim() : 'Anonymous';
      const cleanContent = content.trim();
      const id = 'comm_' + Math.random().toString(36).substring(2, 9);
      const createdAt = new Date().toISOString();

      await executeD1(
        'INSERT INTO comments (id, userName, content, created_at) VALUES (?, ?, ?, ?)',
        [id, author, cleanContent, createdAt]
      );

      return res.status(200).json({
        success: true,
        data: {
          id,
          userName: author,
          content: cleanContent,
          created_at: createdAt,
        },
      });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Comment ID is required' });
      }
      await executeD1('DELETE FROM comments WHERE id = ?', [id]);
      return res.status(200).json({ success: true, message: `Comment ${id} deleted` });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Comments API Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
