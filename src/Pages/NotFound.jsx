import React from "react";
import { Link } from "react-router-dom";
import { Home, Video, Mail } from "lucide-react";
import SEO from "../components/SEO";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col justify-between overflow-hidden relative">
      <SEO
        title="404 - Page Not Found | Xpensive Films"
        description="The page you are looking for does not exist or has been moved. Explore Xpensive Films services and portfolio."
      />
      
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
          404 Error
        </div>

        <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-pink-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl sm:text-4xl font-bold mb-4">
          Scene Not Found
        </h2>

        <p className="text-gray-400 max-w-md mx-auto text-base sm:text-lg mb-8 leading-relaxed">
          Looks like the frame you were looking for was cut out during editing. Let’s get you back on script.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Home className="w-5 h-5" /> Back to Home
          </Link>

          <a
            href="/#Portofolio"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-semibold flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all"
          >
            <Video className="w-5 h-5" /> View Portfolio
          </a>
          
          <a
            href="/#Contact"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-semibold flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all"
          >
            <Mail className="w-5 h-5" /> Contact Us
          </a>
        </div>
      </div>

      <footer className="py-6 border-t border-white/5 text-center text-xs text-gray-500">
        © 2026 Xpensive Films™. All Rights Reserved.
      </footer>
    </div>
  );
};

export default NotFound;
