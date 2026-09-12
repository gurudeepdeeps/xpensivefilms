# 🚀 Xpensive Films Portfolio

A modern, interactive portfolio website for Xpensive Films, showcasing creative projects, video editing reels, services, and brand identity.

## 📔 Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Cloudflare D1 & R2 Backend](#cloudflare-d1--r2-backend)
- [Admin Dashboard](#admin-dashboard)
- [Services](#services)
- [Portfolio](#portfolio)
- [Contact](#contact)

---

## ✨ Features
- Responsive, animated landing page
- Dynamic portfolio with categorized video showcase reels
- Live real-time comments and video reels powered by Cloudflare D1 & R2
- Admin Control Panel (`/admin`) for portfolio video & category management
- Modern UI with Tailwind CSS, Shadcn UI, and custom gradients
- Accessible cookie banner, privacy policy, terms, and custom 404 page

## 🌐 Demo
Live demo: [https://xpensivefilms.pages.dev]

## ‼️ Folder Structure
```
Xpensive Films Portfolio/
├── functions/
│   └── api/ (Cloudflare Pages Edge Functions)
│       ├── comments.js
│       ├── contact.js
│       ├── portfolio.js
│       └── upload.js
├── public/
│   ├── _redirects (Cloudflare SPA routing)
│   ├── share-image.webp
│   ├── site.webmanifest
│   └── xfilms-logo.webp
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/ (Shadcn UI Primitives)
│   ├── Pages/
│   │   ├── Admin.jsx
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Portofolio.jsx
│   │   └── Services.jsx
│   └── services/api.js
├── d1/
│   └── schema.sql
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── wrangler.toml
└── README.md
```

## ⚙️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Shadcn UI (Carousel, Button, Card, Badge, Dialog, Tabs, Table, Alert)
- **Backend & Database**: Cloudflare Pages Functions, Cloudflare D1 (Serverless SQLite), Cloudflare R2 Media Storage
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

## 🔑 Cloudflare D1 & R2 Configuration
1. Initialize Cloudflare D1 SQLite Database:
   ```bash
   npx wrangler d1 execute xpensive_films_db --file=./d1/schema.sql
   ```
2. Cloudflare Pages automatically links D1 & R2 using `wrangler.toml`.

## 🛡️ Admin Dashboard
Access the admin portal at `/admin` to manage:
- Portfolio Videos & Categories
- User Comments moderation
- Contact form inquiry logs
