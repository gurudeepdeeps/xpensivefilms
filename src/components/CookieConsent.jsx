import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("xpensivefilms_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("xpensivefilms_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("xpensivefilms_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 p-5 rounded-2xl bg-gray-900/90 border border-white/10 backdrop-blur-xl shadow-2xl text-white animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
          <Cookie className="w-6 h-6" />
        </div>
        <div className="flex-1 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p className="font-semibold text-white mb-1">We value your privacy</p>
          We use cookies to optimize website traffic and improve your browsing experience.
        </div>
        <button
          onClick={handleDecline}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <button
          onClick={handleDecline}
          className="px-4 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 transition-all"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-xs text-white font-semibold hover:opacity-90 transition-all shadow-md"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
