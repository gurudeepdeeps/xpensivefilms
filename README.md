# 🚀 Xpensive Films Portfolio

A modern, interactive portfolio website for Xpensive Films, showcasing creative projects, services, web creations, and brand identity.

## 📔 Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Supabase Backend & Authentication](#supabase-backend--authentication)
- [Admin Dashboard](#admin-dashboard)
- [Services](#services)
- [Portfolio](#portfolio)
- [Contact](#contact)

---

## ✨ Features
- Responsive, animated landing page
- Dynamic portfolio with categorized video and web creations showcases
- Live real-time comments and web projects powered by Supabase
- Admin Control Panel (`/admin`) for project & category management
- Modern UI with Tailwind CSS, Shadcn UI, and custom gradients
- Accessible cookie banner, privacy policy, terms, and custom 404 page

## 🌐 Demo
Live demo: [https://xpensivefilms.vercel.app]

## ‼️ Folder Structure
```
Xpensive Films Portfolio/
├── public/
│   ├── share-image.webp
│   ├── site.webmanifest
│   └── xfilms-logo.webp
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/ (Shadcn UI Primitives)
│   ├── constants/
│   ├── Pages/
│   │   ├── Admin.jsx
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Portofolio.jsx
│   │   └── Services.jsx
│   ├── lib/utils.js
│   └── supabase.js
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## ⚙️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Shadcn UI (Carousel, Button, Card, Badge, Dialog, Tabs, Table, Alert)
- **Backend & Database**: Supabase (PostgreSQL, Supabase Auth, Realtime & Storage)
- **Animations**: Framer Motion, GSAP, AOS, Lenis smooth scroll
- **SEO & PWA**: React Helmet Async, OpenGraph meta, site.webmanifest, sitemap.xml

## 🧰 Setup & Installation
1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd Xpensive Films Portfolio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 🔑 Supabase Configuration
1. Go to [Supabase Console](https://supabase.com/) and select project.
2. Configure credentials in `src/supabase.js`:
   ```js
   import { createClient } from '@supabase/supabase-js';

   const SUPABASE_URL = "https://rrwbwviwesnczadgjhde.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-key";

   export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```

## 🛡️ Admin Dashboard
Access the admin portal at `/admin` to manage:
- Web Creations & Categories
- User Comments moderation
- Contact form inquiry logs
