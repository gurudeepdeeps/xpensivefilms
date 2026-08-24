import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import Services from "./Pages/Services";
import ThankYouPage from "./Pages/ThankYou";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Terms from "./Pages/Terms";
import NotFound from "./Pages/NotFound";
import CookieConsent from "./components/CookieConsent";

const Footer = () => (
  <footer>
    <div className="container mx-auto px-4 py-6">
      <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <span>
          © 2026{" "}
          <a href="#" className="hover:underline text-white font-medium">
            Xpensive Films™
          </a>
          . All Rights Reserved.
        </span>
        <div className="flex items-center gap-6 text-xs">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    // if there's a hash in URL (e.g., /#About) scroll to it after navigation
    if (typeof window !== 'undefined' && location && location.hash) {
      const id = location.hash;
      setTimeout(() => {
        const section = document.querySelector(id);
        if (section) {
          const top = section.offsetTop - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <AnimatedBackground />
      <Home />
      <About />
      <Portofolio />
      <ContactPage />
      <Footer />
    </>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </>
  );
}

export default App;