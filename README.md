# 🚀 Xpensive Films Portfolio

A modern, interactive portfolio website for Xpensive Films, showcasing creative projects, services, and brand identity.

## 📔 Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Firebase & Supabase Configuration](#firebase--supabase-configuration)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Services](#services)
- [Portfolio](#portfolio)
- [Stats](#stats)
- [Contribute](#contribute)
- [Acknowledgements](#acknowledgements)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features
- Responsive, animated landing page
- Dynamic portfolio with categorized video and image showcases
- Services section with detailed cards
- About page with brand story and stats
- Contact form
- Smooth navigation and scroll animations
- Error boundaries for robust UX
- Integration with Firebase and Supabase for data and media
- Modern UI with Tailwind CSS, MUI, and custom gradients

## 🌐 Demo
Live demo: [https://xpensivefilms.vercel.app]

## ‼️ Folder Structure
```
Xpensive Films Portfolio/
├── public/
│   ├── CardProject_images/
│   ├── services-images/
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── Pages/
│   ├── styles/
│   ├── firebase.js
│   ├── supabase.js
│   └── ...
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## ⚙️ Tech Stack
- React 18
- Vite
- Tailwind CSS
- MUI (Material UI)
- Framer Motion, GSAP, AOS (animations)
- Firebase, Supabase (backend)
- Headless UI, Shadcn UI
- Lottie animations
- React Router
- Styled Components

## 🧰 Setup & Installation
1. Make sure Git and NodeJS are installed.
2. Clone this repository:
   ```bash
   git clone <repo-url>
   cd Xpensive Films Portfolio
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## 🔑 Firebase & Supabase Configuration
### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a web app and copy the Firebase config object.
3. Create a `.env` file or update `src/firebase.js`:
   ```js
   // src/firebase.js
   import { initializeApp } from "firebase/app";
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   const app = initializeApp(firebaseConfig);
   export default app;
   ```
4. Replace placeholders with your actual Firebase credentials.

### Supabase Setup
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Copy your `SUPABASE_URL` and `SUPABASE_KEY` from Project Settings > API.
3. Create a `.env` file or update `src/supabase.js`:
   ```js
   // src/supabase.js
   import { createClient } from '@supabase/supabase-js';
   const supabaseUrl = "YOUR_SUPABASE_URL";
   const supabaseKey = "YOUR_SUPABASE_KEY";
   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

## 📸 Screenshots
> Main Landing Page
- ![Modern Portfolio Landing Page](public/screenshots/main.png)
> About Page
- ![Modern About Page](public/screenshots/about.png)
> Works Page
- ![Showcase your projects](public/screenshots/works.png)
> Contact Page
- ![Functional Contact form](public/screenshots/contact.png)

## 🛠️ Services
- Corporate Events
- Bars & Restaurants
- Real Estate
- Testimonials
- Digital Marketing
- Social Media Management
- Influencer Marketing
- Podcast Production

## 🎬 Portfolio
Sample projects include:
- Logo Reveal Animation
- Car Delivery Video Edit
- Podcast Reel Sample
See `src/constants/portfolioVideos.js` for the video lists.

### Adding Videos (Carousel)
The main video carousels/grids are driven by `src/constants/portfolioVideos.js`.

1. Add the video file using one of these options:
   - **Supabase (recommended for large videos):** upload to Storage bucket `portfolio-videos` (public), then set `path: 'your-file.mp4'`.
   - **Local file:** put the file in `public/videos/` and set `path: '/videos/your-file.mp4'`.
2. Add an entry to `videoSlides[0].cards` (carousel).
3. Ensure `category` matches a key in `videoCategories`.

## 🔧 Stats
- [PageSpeed Insights - Vercel](https://pagespeed.web.dev/analysis?url=https://xpensivefilms.vercel.app)
- [PageSpeed Insights - Netlify](https://pagespeed.web.dev/analysis?url=https://gurudeepv-portfolio.netlify.app)

## 🙌 Contribute
You might encounter some bugs while using this app. You are more than welcome to contribute. Just submit changes via pull request and I will review them before merging. Make sure you follow community guidelines.

## 💎 Acknowledgements
- [framer-motion](https://www.npmjs.com/package/framer-motion)
- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [tailwindcss](https://www.npmjs.com/package/tailwindcss)
- [vite](https://www.npmjs.com/package/vite)
- [supabase](https://www.npmjs.com/package/@supabase/supabase-js)
- [firebase](https://www.npmjs.com/package/firebase)
- [mui](https://mui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## © License
This project is licensed under the MIT License. See the LICENSE file for details.

## 📬 Contact
- Gurudeep V
- [Portfolio Website](https://xpensivefilms.vercel.app)
- [Email](mailto:xpensivefilms.co@gmail.com)

---

> **Readme by DEEPS**
