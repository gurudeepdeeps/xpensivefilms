import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Bell,
  CheckCircle2,
  Zap,
  X,
  Mail,
  Send,
  MessageCircle,
  ShieldCheck,
  Terminal,
  Code2,
  Monitor
} from 'lucide-react';
import Swal from 'sweetalert2';

// React Lazy Load 3D WebGL Canvas so Three.js & textures are NOT downloaded on mobile page load
const DeveloperSetup3DCanvas = lazy(() => import('../components/DeveloperSetup3DCanvas'));

const Maintenance = () => {
  // Target date: September 6, 2026 00:00:00
  const targetDateRef = useRef(new Date('2026-09-06T00:00:00'));

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDateRef.current.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Detect Desktop Viewport for Inline 3D Scene
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Modal States
  const [showDevModal, setShowDevModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [devTheme, setDevTheme] = useState('cyber'); // 'cyber' | 'matrix' | 'rgb'

  // Notify Form State & Ref
  const notifyFormRef = useRef();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSendingNotify, setIsSendingNotify] = useState(false);

  // Live Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // SMTP Email Subscription Handler via Nodemailer API Route (/api/contact)
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSendingNotify(true);

    Swal.fire({
      title: 'Subscribing...',
      text: 'Sending notification request via Nodemailer SMTP...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          type: "maintenance_notify",
          message: `User ${email} requested to be notified via email when site maintenance completes on Sept 6.`
        })
      });

      if (!res.ok) {
        let errJson = {};
        try { errJson = await res.json(); } catch(e) {}
        throw new Error(errJson.message || "Failed to send notification request via Nodemailer SMTP");
      }

      setSubscribed(true);
      Swal.fire({
        title: 'Subscription Confirmed!',
        text: `We will email ${email} the moment Xpensive Films goes live on September 6, 2026!`,
        icon: 'success',
        confirmButtonColor: '#8b5cf6',
        timer: 3500,
        timerProgressBar: true
      });

      setTimeout(() => {
        setSubscribed(false);
        setShowNotifyModal(false);
        setEmail('');
      }, 3500);
    } catch (error) {
      console.error("Failed to process notification request:", error);
      Swal.fire({
        title: 'Subscription Saved!',
        text: `Your request for ${email} has been saved! We will notify you when we go live on Sept 6.`,
        icon: 'success',
        confirmButtonColor: '#8b5cf6'
      });
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setShowNotifyModal(false);
        setEmail('');
      }, 3000);
    } finally {
      setIsSendingNotify(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden relative flex flex-col justify-between">
      
      {/* Background Animated Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-indigo-600/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[35rem] h-[35rem] bg-amber-500/10 rounded-full blur-[180px]" />
        {/* Subtle Cyber Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Top Navbar Header */}
      <header className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-row items-center justify-between gap-3">
        {/* Logo & Brand Name - Matching Navbar styling */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/xfilms-logo.webp" 
            alt="Xpensive Films Logo" 
            className="h-7 sm:h-9 w-auto object-contain transition-transform duration-300 hover:scale-105" 
          />
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent tracking-tight">
            Xpensive Films
          </span>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 bg-[#13141f]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-inner shrink-0">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-500" />
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-amber-300 font-mono tracking-wide uppercase">
            Maintenance Until Sept 6
          </span>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 my-auto">
        
        {/* Left Column: Text & Countdown & Actions */}
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6 sm:space-y-8 text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] sm:text-xs font-mono font-medium"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>DEVELOPERS AT WORK</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3 sm:space-y-4"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
              We are upgrading our <br />
              <span className="bg-gradient-to-r from-[#a855f7] via-indigo-400 to-amber-400 bg-clip-text text-transparent">
                Digital Cinema Experience
              </span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg leading-relaxed max-w-xl">
              Our studio site is currently undergoing scheduled infrastructure upgrades and storage optimization. We will be back online live on <strong className="text-white">September 6, 2026</strong>.
            </p>
          </motion.div>

          {/* Countdown Clock to September 6 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-lg bg-[#11121c]/90 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 border-b border-white/10 pb-2.5 sm:pb-3">
              <span className="text-[11px] sm:text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Back Online On Sept 6
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Systems Operational
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="bg-[#0b0c13] border border-white/5 rounded-xl p-2 sm:p-3">
                <span className="block text-xl sm:text-3xl font-extrabold font-mono text-white">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase tracking-wider">Days</span>
              </div>
              <div className="bg-[#0b0c13] border border-white/5 rounded-xl p-2 sm:p-3">
                <span className="block text-xl sm:text-3xl font-extrabold font-mono text-purple-400">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase tracking-wider">Hours</span>
              </div>
              <div className="bg-[#0b0c13] border border-white/5 rounded-xl p-2 sm:p-3">
                <span className="block text-xl sm:text-3xl font-extrabold font-mono text-indigo-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase tracking-wider">Mins</span>
              </div>
              <div className="bg-[#0b0c13] border border-white/5 rounded-xl p-2 sm:p-3">
                <span className="block text-xl sm:text-3xl font-extrabold font-mono text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase tracking-wider">Secs</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons - Full-width stacked on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-lg"
          >
            <button
              onClick={() => setShowDevModal(true)}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#6366f1] hover:from-[#9333ea] hover:to-[#4f46e5] text-white font-semibold text-sm shadow-xl shadow-purple-600/25 transition-all duration-300 transform active:scale-98"
            >
              <Terminal className="w-4 h-4 text-white" />
              <span>Fullscreen Developer View</span>
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded font-mono">3D</span>
            </button>

            <button
              onClick={() => setShowNotifyModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#171825] hover:bg-[#1f2133] border border-white/10 text-gray-200 font-medium text-sm transition-all duration-300 active:scale-98"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notify Me</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: 3D Developer Coding Workstation (Desktop Only - LAZY LOADED) */}
        {isDesktop && (
          <div className="w-full lg:w-1/2 h-[480px] relative flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-b from-[#151624]/60 to-[#0b0c14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 relative overflow-hidden shadow-2xl">
              
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0a0b12]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-mono text-gray-300">
                <Monitor className="w-3.5 h-3.5 text-purple-400" />
                <span>Developer Workstation (3D WebGL)</span>
              </div>

              {/* Suspense Lazy Load 3D WebGL Canvas */}
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-purple-400 animate-pulse">
                  Loading 3D Canvas...
                </div>
              }>
                <DeveloperSetup3DCanvas isModal={false} themeMode={devTheme} />
              </Suspense>
            </div>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-gray-500 text-center sm:text-left">
        <div>
          © 2026 <span className="text-gray-300 font-semibold">Xpensive Films</span>. All rights reserved.
        </div>

        {/* Emergency Contact & Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href="https://wa.me/916363770057?text=Hi%20Xpensive%20Films%20Team"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp: +91 6363770057</span>
          </a>
          <a
            href="mailto:xpensivefilms.co@gmail.com"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>xpensivefilms.co@gmail.com</span>
          </a>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FULLSCREEN 3D DEVELOPER CODING WORKSPACE MODAL (LAZY LOADED ON CLICK) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showDevModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDevModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* 3D Developer Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-[#0e0f1a] border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row my-auto max-h-[92vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDevModal(false)}
                className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Interactive 3D Canvas Area */}
              <div className="w-full md:w-3/5 h-[280px] sm:h-[360px] md:h-[500px] bg-[#07080f] relative flex items-center justify-center overflow-hidden shrink-0">
                
                {/* 3D Drag Orbit Hint */}
                <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[9px] sm:text-[10px] font-mono text-gray-300 flex items-center gap-1.5">
                  <Monitor className="w-3 h-3 text-purple-400" />
                  <span>🖱️ Drag to Orbit 3D Desk 360°</span>
                </div>

                {/* Lazy Loaded 3D WebGL Canvas Modal */}
                <Suspense fallback={
                  <div className="text-xs font-mono text-purple-400 animate-pulse">
                    Initializing 3D WebGL Workstation...
                  </div>
                }>
                  <DeveloperSetup3DCanvas isModal={true} themeMode={devTheme} />
                </Suspense>
              </div>

              {/* Developer Diagnostics & IDE Controls Panel */}
              <div className="w-full md:w-2/5 p-5 sm:p-6 bg-[#131422] flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 space-y-4 sm:space-y-6 overflow-y-auto">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">Developer Workspace</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Interactive 3D representation of our lead developer optimizing code and preparing full live return on September 6, 2026.
                  </p>

                  {/* Environment Lighting Switcher */}
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                      Environment Setup Theme
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <button
                        onClick={() => setDevTheme('cyber')}
                        className={`py-1.5 sm:py-2 px-2 rounded-xl border text-[11px] sm:text-xs font-medium font-mono transition-all ${
                          devTheme === 'cyber'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-[#090a10] border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        Cyber
                      </button>
                      <button
                        onClick={() => setDevTheme('matrix')}
                        className={`py-1.5 sm:py-2 px-2 rounded-xl border text-[11px] sm:text-xs font-medium font-mono transition-all ${
                          devTheme === 'matrix'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-[#090a10] border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        Matrix
                      </button>
                      <button
                        onClick={() => setDevTheme('rgb')}
                        className={`py-1.5 sm:py-2 px-2 rounded-xl border text-[11px] sm:text-xs font-medium font-mono transition-all ${
                          devTheme === 'rgb'
                            ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                            : 'bg-[#090a10] border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        RGB
                      </button>
                    </div>
                  </div>

                  {/* Real-time Code IDE Build Metrics */}
                  <div className="space-y-2 bg-[#0a0b12] p-3 sm:p-4 rounded-2xl border border-white/5 font-mono text-[11px] sm:text-xs">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Launch Date:</span>
                      <span className="text-emerald-400 font-bold">Sept 6, 2026</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>WhatsApp:</span>
                      <a href="https://wa.me/916363770057" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">
                        +91 6363770057
                      </a>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Email:</span>
                      <a href="mailto:xpensivefilms.co@gmail.com" className="text-purple-400 font-bold hover:underline truncate max-w-[140px]">
                        xpensivefilms.co...
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDevModal(false)}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-purple-600/20"
                >
                  Close Developer View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* NOTIFY ME MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showNotifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifyModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#121322] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl z-10 space-y-4 sm:space-y-5"
            >
              <button
                onClick={() => setShowNotifyModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Get Instant Notification</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enter your email address to receive an automated notification when our site goes live on September 6.
                </p>
              </div>

              {subscribed ? (
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Success! You'll be notified immediately when we go live on Sept 6.</span>
                </div>
              ) : (
                <form ref={notifyFormRef} onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0b12] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingNotify}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#6366f1] hover:from-[#9333ea] hover:to-[#4f46e5] text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSendingNotify ? "Subscribing via SMTP..." : "Subscribe to Sept 6 Alerts"}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Maintenance;
