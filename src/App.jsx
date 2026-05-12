import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import Services from "./Pages/Services";

import { AnimatePresence } from 'framer-motion';




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
      <footer>
        <center>
          <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
          <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
            © 2026{" "}
            <a href="#" className="hover:underline">
              Xpensive Media™
            </a>
            . All Rights Reserved
          </span>
        </center>
      </footer>
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    {/* Project details page removed */}
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2026{" "}
          <a href="#" className="hover:underline">
            Xpensive Media™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<Services />} />
    </Routes>
  );
}

export default App;