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

-- 2. Web Projects Categories Table
CREATE TABLE IF NOT EXISTS web_categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Web Projects Table
CREATE TABLE IF NOT EXISTS web_projects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image TEXT,
  url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Video Portfolio Categories Table
CREATE TABLE IF NOT EXISTS video_categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Portfolio Videos Table
CREATE TABLE IF NOT EXISTS portfolio_videos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  path TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Contact Inquiries / Subscribers Table
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
  ('cat_all', 'all', 'All'),
  ('cat_commercials', 'commercials', 'Commercials'),
  ('cat_music_videos', 'music_videos', 'Music Videos'),
  ('cat_reels', 'reels', 'Social Reels & Promos'),
  ('cat_corporate', 'corporate', 'Corporate Films');

-- Default Web Categories
INSERT OR IGNORE INTO web_categories (id, name) VALUES
  ('wcat_web', 'Web Applications'),
  ('wcat_ecommerce', 'E-Commerce'),
  ('wcat_landing', 'Landing Pages'),
  ('wcat_creative', 'Creative & 3D Web');

-- Sample Initial Comments
INSERT OR IGNORE INTO comments (id, userName, content) VALUES
  ('comm_1', 'Alex Rivera', 'Incredible cinematography and sound design on the latest commercial reel!'),
  ('comm_2', 'Sarah Chen', 'The 3D interactive portfolio interface is super smooth and futuristic.');
