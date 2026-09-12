-- =========================================================
-- Cloudflare D1 Database Schema for Xpensive Films Portfolio
-- =========================================================

-- 1. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  userName TEXT NOT NULL DEFAULT 'Anonymous',
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Video Portfolio Categories Table
CREATE TABLE IF NOT EXISTS video_categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Portfolio Videos Table
CREATE TABLE IF NOT EXISTS portfolio_videos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  path TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Inquiries / Subscribers Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'inquiry',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- Initial Seed Data
-- =========================================================

-- Default Video Categories
INSERT OR IGNORE INTO video_categories (id, key, label) VALUES
  ('cat_all', 'all', 'All');
