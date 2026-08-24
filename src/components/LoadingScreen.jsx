import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-[#050212] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Background glow orb layers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-ping opacity-30 pointer-events-none" />

      {/* Main loading container */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-md">
        
        {/* Animated Logo + Rotating Lens Rings */}
        <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
          {/* Outer Ring counter-spin */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-indigo-500 animate-spin transition-all" style={{ animationDuration: '3s' }} />
          
          {/* Inner Ring spin */}
          <div className="absolute -inset-2 rounded-full border border-dashed border-indigo-400/40 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />

          {/* Glowing Backing Shield */}
          <div className="absolute inset-2 bg-gradient-to-tr from-purple-900/60 via-indigo-950/80 to-purple-900/60 rounded-full blur-md animate-pulse" />

          {/* Xpensive Films Logo */}
          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-2 flex items-center justify-center bg-black/50 border border-white/20 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <img
              src="/xfilms-logo.webp"
              alt="Xpensive Films Logo"
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300 drop-shadow-md">
            Xpensive Films
          </h2>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-purple-300/80">
            Xpensive by Quality, Not by Money.
          </p>
        </div>

        {/* Progress Bar with Glowing Pulse Tip */}
        <div className="w-48 sm:w-56 h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner mt-2">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-[loading-bar_1.8s_ease-in-out_infinite] w-full" />
        </div>

        {/* Status text */}
        <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 animate-pulse">
          Crafting Experience...
        </span>
      </div>

      {/* Inline Keyframe for Smooth Loading Bar Animation */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
