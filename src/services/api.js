/**
 * Centralized Cloudflare API Client
 * Replaces direct Supabase client calls with lightweight REST fetch endpoints
 */

const API_BASE = '/api';

export const api = {
  // ==========================================
  // Portfolio Videos & Categories
  // ==========================================
  async getPortfolio() {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        categories: data.categories || [],
        videos: data.videos || [],
      };
    } catch (err) {
      console.warn('Fallback portfolio data used:', err);
      return {
        categories: [
          { key: 'all', label: 'All' },
          { key: 'commercials', label: 'Commercials' },
          { key: 'music_videos', label: 'Music Videos' },
          { key: 'reels', label: 'Social Reels & Promos' },
        ],
        videos: [],
      };
    }
  },

  async addPortfolioCategory(key, label) {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_category', key, label }),
    });
    return res.json();
  },

  async addPortfolioVideo(videoData) {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_video', ...videoData }),
    });
    return res.json();
  },

  async deletePortfolioItem(id, table) {
    const res = await fetch(`${API_BASE}/portfolio?id=${encodeURIComponent(id)}&table=${encodeURIComponent(table)}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // ==========================================
  // Web Projects & Categories
  // ==========================================
  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        categories: data.categories || [],
        projects: data.projects || [],
      };
    } catch (err) {
      console.warn('Fallback web projects data used:', err);
      return {
        categories: [{ name: 'Web Applications' }, { name: 'E-Commerce' }, { name: 'Landing Pages' }],
        projects: [],
      };
    }
  },

  async addWebCategory(name) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_category', name }),
    });
    return res.json();
  },

  async addWebProject(projectData) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_project', ...projectData }),
    });
    return res.json();
  },

  async deleteWebItem(id, table) {
    const res = await fetch(`${API_BASE}/projects?id=${encodeURIComponent(id)}&table=${encodeURIComponent(table)}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // ==========================================
  // Comments
  // ==========================================
  async getComments() {
    try {
      const res = await fetch(`${API_BASE}/comments`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Fallback comments data used:', err);
      return [];
    }
  },

  async postComment(userName, content) {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, content }),
    });
    return res.json();
  },

  async deleteComment(id) {
    const res = await fetch(`${API_BASE}/comments?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // ==========================================
  // Contact & Inquiries
  // ==========================================
  async sendContact(payload) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // ==========================================
  // File / Media Upload (R2)
  // ==========================================
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },
};
