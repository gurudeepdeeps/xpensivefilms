import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '../supabase';
import WebsiteProjects from '../components/WebsiteProjects';
import { Badge } from '../components/ui/badge';

export default function FullWidthTabs() {
  const carouselRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const modalVideoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadedVideos, setLoadedVideos] = useState({});

  const handleVideoReady = useCallback((videoKey) => {
    setLoadedVideos((prev) => {
      if (prev[videoKey]) return prev;
      return { ...prev, [videoKey]: true };
    });
  }, []);

  const [dbCategories, setDbCategories] = useState([]);
  const [dbVideos, setDbVideos] = useState([]);

  // Fetch dynamic categories & videos from Supabase
  useEffect(() => {
    async function loadPortfolioFromSupabase() {
      try {
        const { data: catData } = await supabase.from('video_categories').select('*');
        if (catData) setDbCategories(catData);

        const { data: vidData } = await supabase.from('portfolio_videos').select('*');
        if (vidData) setDbVideos(vidData);
      } catch (e) {
        console.error("Supabase load portfolio failed:", e);
      }
    }
    loadPortfolioFromSupabase();
  }, []);

  const categories = useMemo(() => {
    return [{ key: 'all', label: 'All', icon: 'grid' }, ...dbCategories];
  }, [dbCategories]);

  const slides = useMemo(() => {
    return [{ id: 0, cards: dbVideos }];
  }, [dbVideos]);

  const filteredCards = useMemo(() => {
    if (activeCategory === 'all') {
      return slides.flatMap(slide => slide.cards);
    }
    return slides.flatMap(slide =>
      slide.cards.filter(card => card.category === activeCategory)
    );
  }, [activeCategory, slides]);

  // Add this effect to handle category changes on mobile
  useEffect(() => {
    if (isMobile && mobileScrollRef.current) {
      mobileScrollRef.current.scrollLeft = 0;
    }
  }, [activeCategory, isMobile]);

  // Add this effect to handle category changes on mobile
  useEffect(() => {
    if (isMobile && mobileScrollRef.current) {
      mobileScrollRef.current.scrollLeft = 0;
    }
  }, [activeCategory, isMobile]);

  // filter slides based on activeCategory; returns indices of slides that have at least one card matching category
  const visibleSlideIndices = slides
    .map((s, idx) => ({ idx, has: s.cards.some(c => activeCategory === 'all' ? true : c.category === activeCategory) }))
    .filter(x => x.has)
    .map(x => x.idx);

  // flattened list of cards matching the active category (useful for mobile swipe mode)
  // const filteredCards = slides.flatMap(s => s.cards).filter(c => activeCategory === 'all' ? true : c.category === activeCategory);

  // Helper: synchronous URL resolver for video tags
  const getVideoUrl = useCallback((path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
      return path;
    }
    const { data } = supabase.storage.from('portfolio-videos').getPublicUrl(path);
    return data?.publicUrl || path;
  }, []);

  // Helper: resolve a storage path to a download URL and assign to <video>
  async function safeAssignVideoSrc(el, path) {
    if (!el || !path) return false;
    try {
      const directUrl = /^https?:\/\//i.test(path) || path.startsWith('/');
      if (directUrl) {
        el.src = path;
        return true;
      }

      const { data } = supabase.storage.from('portfolio-videos').getPublicUrl(path);
      if (data && data.publicUrl) {
        el.src = data.publicUrl;
        return true;
      }

      return false;
    } catch (e) {
      try { console.error('[portfolio] assign video src failed', path, e); } catch (_) { }
      return false;
    }
  }

  // Preload video URL on component mount to ensure it's ready
  async function preloadVideoUrl(path) {
    try {
      const storage = getStorage();
      const url = await getDownloadURL(ref(storage, path));
      return url;
    } catch (e) {
      try { console.error('[portfolio] preload video url failed', path, e); } catch (_) { }
      return null;
    }
  }

  useEffect(() => {
    const targetIndex = visibleSlideIndices[0] ?? 0;
    setActiveIndex(targetIndex);
    const container = carouselRef.current;
    const wrapper = container?.querySelector('.carousel-item.active .slider-wrapper');
    if (wrapper) {
      try { wrapper.scrollTo({ left: 0, behavior: 'instant' }); } catch (_) { }
    }
  }, [activeCategory, visibleSlideIndices]);
  useEffect(() => {
    if (isMobile) {
      const el = mobileScrollRef.current;
      if (el) el.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [activeCategory, isMobile]);

  const goNext = useCallback(() => {
    if (isMobile) {
      const el = mobileScrollRef.current;
      if (!el) return;
      const step = Math.round(el.clientWidth * 0.85);
      el.scrollBy({ left: step, behavior: 'smooth' });
      return;
    }

    const visible = visibleSlideIndices;
    if (visible.length <= 1) {
      const container = carouselRef.current;
      const wrapper = container?.querySelector('.carousel-item.active .slider-wrapper');
      if (!wrapper) return;
      const step = Math.round(wrapper.clientWidth * 0.85);
      wrapper.scrollBy({ left: step, behavior: 'smooth' });
      return;
    }
    const curPos = visible.indexOf(activeIndex);
    const nextPos = (curPos + 1) % visible.length;
    setActiveIndex(visible[nextPos]);
  }, [isMobile, visibleSlideIndices, activeIndex]);

  const goPrev = useCallback(() => {
    if (isMobile) {
      const el = mobileScrollRef.current;
      if (!el) return;
      const step = Math.round(el.clientWidth * 0.85);
      el.scrollBy({ left: -step, behavior: 'smooth' });
      return;
    }

    const visible = visibleSlideIndices;
    if (visible.length <= 1) {
      const container = carouselRef.current;
      const wrapper = container?.querySelector('.carousel-item.active .slider-wrapper');
      if (!wrapper) return;
      const step = Math.round(wrapper.clientWidth * 0.85);
      wrapper.scrollBy({ left: -step, behavior: 'smooth' });
      return;
    }
    const curPos = visible.indexOf(activeIndex);
    const prevPos = (curPos - 1 + visible.length) % visible.length;
    setActiveIndex(visible[prevPos]);
  }, [isMobile, visibleSlideIndices, activeIndex]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    if (isMobile) return;

    const slidesEls = Array.from(container.querySelectorAll('.carousel-item'));
    // Preload current and adjacent slides for smoother autoplay
    const preloadIndices = new Set([activeIndex, activeIndex - 1, activeIndex + 1]);
    slidesEls.forEach((slideEl, i) => {
      const videos = slideEl.querySelectorAll('.showcase-video');
      const isPreloadCandidate = preloadIndices.has(i);
      if (i === activeIndex) {
        slideEl.classList.add('active');
        videos.forEach(v => {
          try {
            if (!v.src) {
              const ds = v.getAttribute('data-src');
              if (ds) {
                (async () => {
                  const ok = await safeAssignVideoSrc(v, ds);
                  if (ok) try { console.log('[portfolio] set src', ds); } catch (_) { }
                  else try { console.error('[portfolio] invalid video source, skipping', ds); } catch (_) { }
                })();
              }
            }
            // Ensure attributes that allow muted autoplay and eager loading
            v.preload = 'auto';
            try { v.loading = 'eager'; } catch (_) { }
            v.muted = true;
            v.setAttribute('muted', '');
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.autoplay = true;
            v.setAttribute('autoplay', '');
            v.loop = true; v.setAttribute('loop', '');

            v.load();

            const tryPlay = () => {
              try {
                try { console.log('[portfolio] tryPlay', v.src); } catch (_) { }
                const p = v.play();
                if (p && typeof p.then === 'function') {
                  p.then(() => { try { console.log('[portfolio] played', v.src); } catch (_) { } }).catch((err) => { try { console.error('[portfolio] play failed', v.src, err); } catch (_) { } });
                }
              } catch (e) { try { console.error('[portfolio] play exception', v.src, e); } catch (_) { } }
            };

            if (v.readyState >= 2) {
              tryPlay();
            } else {
              const onCan = () => tryPlay();
              v.addEventListener('loadeddata', onCan, { once: true });
              v.addEventListener('loadedmetadata', onCan, { once: true });
              v.addEventListener('canplay', onCan, { once: true });
              setTimeout(() => tryPlay(), 700);
            }
          } catch (e) { void e; }
        });
      } else {
        slideEl.classList.remove('active');
        videos.forEach(v => { try { v.pause(); v.currentTime = 0; } catch (e) { void e; } });

        if (isPreloadCandidate) {
          videos.forEach(v => {
            try {
              if (!v.src) {
                const ds = v.getAttribute('data-src');
                if (ds) { (async () => { const ok = await safeAssignVideoSrc(v, ds); if (ok) try { console.log('[portfolio] preload assigned', ds); } catch (_) { } else try { console.error('[portfolio] preload assign failed', ds); } catch (_) { } })(); }
              }
              v.preload = 'auto';
              try { v.loading = 'eager'; } catch (_) { }
              v.muted = true; v.setAttribute('muted', ''); v.playsInline = true; v.setAttribute('playsinline', ''); v.autoplay = true; v.setAttribute('autoplay', '');
              v.load();
            } catch (e) { void e; }
          });
        }
      }
    });
  }, [activeIndex, isMobile]);

  // Preload a small set of initial videos on mount / when cards change to improve autoplay reliability
  useEffect(() => {
    const el = carouselRef.current; if (!el) return;
    try {
      const vids = Array.from(el.querySelectorAll('video.showcase-video'));
      vids.slice(0, 4).forEach((v) => {
        try {
          if (!v.src) {
            const ds = v.getAttribute('data-src');
            if (ds) {
              (async () => {
                const ok = await safeAssignVideoSrc(v, ds);
                if (ok) {
                  try { console.log('[portfolio] initial preload assigned', ds); } catch (_) { }
                  v.load();
                  setTimeout(() => {
                    try {
                      if (v) {
                        const playPromise = v.play();
                        if (playPromise && typeof playPromise.then === 'function') {
                          playPromise.catch(() => {});
                        }
                      }
                    } catch (e) {
                      void e;
                    }
                  }, 100);
                } else {
                  try { console.error('[portfolio] initial preload failed', ds); } catch (_) { }
                }
              })();
            }
          }
          v.preload = 'auto';
          try { v.loading = 'eager'; } catch (_) { }
          v.muted = true; v.setAttribute('muted', ''); v.playsInline = true; v.setAttribute('playsinline', ''); v.autoplay = true; v.setAttribute('autoplay', ''); v.loop = true; v.setAttribute('loop', '');
          v.load();
          setTimeout(() => { try { const p = v.play(); if (p && typeof p.then === 'function') p.catch(() => { }); } catch (e) { void e; } }, 500);
        } catch (e) { void e; }
      });
    } catch (e) { void e; }
  }, [filteredCards]);

  useEffect(() => {
    if (!isMobile) return;
    const scrollEl = mobileScrollRef.current;
    if (!scrollEl) return;
    const vids = Array.from(scrollEl.querySelectorAll('video.showcase-video'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) {
          try {
            if (!v.src) {
              const ds = v.getAttribute('data-src');
              if (ds) {
                (async () => {
                  const ok = await safeAssignVideoSrc(v, ds);
                  if (ok) {
                    try { console.log('[portfolio] set src (observer)', ds); } catch (_) { }
                    v.preload = 'metadata';
                    try { v.loading = 'eager'; } catch (_) { }
                    v.muted = true;
                    v.setAttribute('muted', '');
                    v.playsInline = true;
                    v.setAttribute('playsinline', '');
                    v.autoplay = true;
                    v.setAttribute('autoplay', '');
                    v.load();

                    const onReady = () => {
                      try {
                        const p = v.play();
                        if (p && typeof p.then === 'function') p.catch(() => { });
                      } catch (e) { void e; }
                    };

                    if (v.readyState >= 2) {
                      onReady();
                    } else {
                      v.addEventListener('loadeddata', onReady, { once: true });
                      v.addEventListener('loadedmetadata', onReady, { once: true });
                      v.addEventListener('canplay', onReady, { once: true });
                      setTimeout(onReady, 700);
                    }
                  }
                })();
              }
            } else {
              if (v.paused) v.play().catch(() => { });
            }
          } catch (e) { void e; }
        } else {
          try { v.pause(); v.currentTime = 0; } catch (e) { void e; }
        }
      });
    }, { root: scrollEl, threshold: 0.3 });
    vids.forEach(v => observer.observe(v));
    return () => {
      vids.forEach(v => observer.unobserve(v));
      observer.disconnect();
    };
  }, [isMobile, filteredCards]);

  useEffect(() => {
    // keyboard navigation
    const onKey = (e) => {
      if (modalOpen && e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, goNext, goPrev]);

  // detect mobile/responsive mode
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play modal video when opened with sound & default browser/system controls
  useEffect(() => {
    const v = modalVideoRef.current;
    if (modalOpen && v) {
      v.currentTime = 0;
      v.muted = false;
      const tryPlay = () => {
        try {
          const p = v.play();
          if (p && typeof p.then === 'function') {
            p.catch(() => {
              // Fallback to muted autoplay if browser blocks unmuted playback
              v.muted = true;
              v.play().catch(() => {});
            });
          }
        } catch (_) {}
      };

      if (v.readyState >= 2) {
        tryPlay();
      } else {
        const onLoaded = () => tryPlay();
        v.addEventListener('loadeddata', onLoaded, { once: true });
        v.addEventListener('canplay', onLoaded, { once: true });
      }
    }

    if (!modalOpen && v) {
      try { v.pause(); v.currentTime = 0; } catch (e) { void e; }
    }
  }, [modalOpen, modalSrc]);

  const openModal = (path, title = '') => {
    setModalTitle(title || '');
    const realUrl = getVideoUrl(path);
    setModalSrc(realUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc('');
    setModalTitle('');
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
  };

  // Update modal video element
  return (
    <div id="Portofolio" className="portfolio-section">
      <style>{`
      :root {
        --primary-color: #6366f1;
        --bg-dark: #030014;
        --text-muted: rgba(255, 255, 255, 0.7);
      }
      
      .portfolio-section { 
        background: var(--bg-dark); 
        padding: 4rem 0 5rem 0; 
        color: #fff; 
        overflow: hidden; 
      }
      
      .showcase-container { 
        max-width: 1400px; 
        margin: 0 auto; 
        padding: 0 2rem; 
      }
      .slider-section { 
        padding: 2rem 0; 
        min-height: 50vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: transparent; 
      }
      
      .slider-container { 
        width: 100%; 
        max-width: 1100px; 
        margin: 0 auto; 
        position: relative; 
        background: transparent; 
      }
      
      .slider-wrapper { 
        display: flex; 
        gap: 1.5rem; 
        align-items: flex-start;
        overflow-x: auto; 
        scroll-snap-type: x mandatory; 
        -webkit-overflow-scrolling: touch; 
        padding: 20px 0;
        scrollbar-width: none;
      }
      
      .slider-wrapper::-webkit-scrollbar { display: none; }
      
      .slider-card { 
        flex: 0 0 calc((100% - 3rem) / 3); 
        border-radius: 24px; 
        overflow: hidden; 
        aspect-ratio: 9/16; 
        max-width: 320px; 
        background: rgba(255, 255, 255, 0.03); 
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer; 
        scroll-snap-align: center;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }
      
      .slider-card:hover {
        transform: translateY(-10px) scale(1.02);
        border-color: rgba(99, 102, 241, 0.5);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      }
      
      .video-thumbnail { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
      .slider-card:hover .video-thumbnail { transform: scale(1.1); }
      
      .video-skeleton { 
        position: absolute; 
        inset: 0; 
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)); 
        background-size: 200% 100%; 
        animation: portfolioShimmer 1.5s infinite; 
      }
      
      @keyframes portfolioShimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
      
      .video-overlay { 
        position: absolute; 
        inset: 0; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); 
        opacity: 0.6; 
        transition: all 0.3s ease; 
      }
      
      .slider-card:hover .video-overlay { opacity: 1; background: rgba(0,0,0,0.3); }
      
      .video-play-btn { 
        width: 60px; 
        height: 60px; 
        border-radius: 50%; 
        background: rgba(99, 102, 241, 0.9); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: #fff; 
        backdrop-filter: blur(4px);
        transform: scale(0.9);
        transition: all 0.4s ease;
      }
      
      .slider-card:hover .video-play-btn { transform: scale(1.1); background: #6366f1; box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
      
      .nav-button { 
        position: absolute; 
        top: 50%; 
        transform: translateY(-50%); 
        width: 50px; 
        height: 50px; 
        border-radius: 16px; 
        background: rgba(11, 7, 32, 0.8); 
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        z-index: 20; 
        color: white;
        transition: all 0.3s ease;
      }
      
      .nav-button:hover { background: #6366f1; border-color: transparent; transform: translateY(-50%) scale(1.1); }
      .nav-button.prev { left: -25px; } .nav-button.next { right: -25px; }
      
      @media (max-width: 1200px) {
        .nav-button.prev { left: 0; } .nav-button.next { right: 0; }
      }
      
      .portfolio-slider-dots { display: flex; justify-content: center; gap: 8px; margin-top: 2rem; list-style: none; }
      .website-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: all 0.3s ease; display: block; border: none; padding: 0; }
      .slick-active .website-dot { width: 24px; border-radius: 10px; background: #6366f1; }
      
      .carousel-item { display: none; }
      .carousel-item.active { display: block; }
      
      @media (max-width: 768px) {
        .portfolio-section { padding: 2rem 0 3rem 0; }
        .slider-card { flex: 0 0 85vw; max-width: 85vw; }
        .slider-wrapper { gap: 1rem; padding-left: 5vw; padding-right: 5vw; }
        .nav-button { width: 44px; height: 44px; }
        .nav-button.prev { left: 10px; } .nav-button.next { right: 10px; }
      }
      
      @media (max-width: 480px) {
        .category-list { justify-content: flex-start; padding-left: 1rem; }
        .nav-button { display: flex; } /* Ensure they show on mobile as requested */
      }
      `}</style>

      <div className="showcase-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-blue-400 to-[#a855f7]">
              Portfolio Showcase
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] mx-auto rounded-full mb-8 opacity-50"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Explore my creative journey through professional video editing, digital marketing, and technical expertise.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="flex items-center gap-2 mt-6 mb-12 overflow-x-auto max-w-full px-4 py-2 sm:flex-wrap sm:justify-center scrollbar-none whitespace-nowrap">
            {categories.map((cat) => (
              <Badge
                key={cat.key}
                variant={activeCategory === cat.key ? 'default' : 'secondary'}
                onClick={() => setActiveCategory(cat.key)}
                className={`cursor-pointer transition-all px-4 py-1.5 text-xs shrink-0 whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'scale-105 shadow-md shadow-indigo-500/20'
                    : 'hover:bg-white/10'
                }`}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        )}

        <section>
          {filteredCards.length === 0 ? (
            <div className="py-20 text-center text-gray-400 space-y-3 bg-white/5 rounded-3xl border border-white/10 my-8 max-w-3xl mx-auto backdrop-blur-xl">
              <p className="text-xl font-semibold text-slate-200">No Videos Available.</p>
              <p className="text-sm text-purple-300">New creative video reels coming soon. Stay tuned!</p>
            </div>
          ) : (
            <div className="slider-section">
              <div className="slider-container" ref={carouselRef}>
                <div className="carousel-inner">
                  {isMobile ? (
                    <div className={`carousel-item active`}>
                      <div className="slider-wrapper flat-slider" ref={mobileScrollRef}>
                        {filteredCards.map((card, idx) => (
                          (() => {
                            const videoKey = card.path || `mobile-${idx}`;
                            return (
                              <div
                                key={idx}
                                className="slider-card video-card"
                                data-category={card.category}
                                onClick={() => openModal(card.path, card.title)}
                              >
                                <div className="video-thumbnail-wrapper" style={{ position: 'relative', height: '100%' }}>
                                  {!loadedVideos[videoKey] && <div className="video-skeleton" />}
                                  <video
                                    className={`video-thumbnail showcase-video ${loadedVideos[videoKey] ? 'ready' : 'loading'}`}
                                    src={getVideoUrl(card.path)}
                                    data-src={card.path}
                                    muted
                                    autoPlay
                                    loop
                                    preload={isMobile ? "metadata" : "auto"}
                                    playsInline
                                    crossOrigin="anonymous"
                                    poster="/Conquer_Media.jpg"
                                    onLoadedData={() => handleVideoReady(videoKey)}
                                    onCanPlay={() => handleVideoReady(videoKey)}
                                    onError={(e) => {
                                      handleVideoReady(videoKey);
                                      try { e.currentTarget.pause(); } catch (_) { void 0; }
                                    }}
                                    loading="eager"
                                  />
                                  <div className="video-overlay">
                                    <div className="video-play-btn"><Play size={20} /></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()
                        ))}
                      </div>
                    </div>
                  ) : (
                    slides.map((slide, sIdx) => {
                      const visible = slide.cards.some(c => activeCategory === 'all' ? true : c.category === activeCategory);
                      return (
                        <div key={slide.id} className={`carousel-item ${sIdx === activeIndex && visible ? 'active' : ''}`}>
                          <div className="slider-wrapper">
                            {slide.cards.map((card, cIdx) => (
                              (activeCategory === 'all' || card.category === activeCategory) && (
                                (() => {
                                  const videoKey = card.path || `desktop-${slide.id}-${cIdx}`;
                                  return (
                                    <div
                                      key={cIdx}
                                      className="slider-card video-card"
                                      data-category={card.category}
                                      onClick={() => openModal(card.path, card.title)}
                                    >
                                      <div className="video-thumbnail-wrapper" style={{ position: 'relative', height: '100%' }}>
                                        {!loadedVideos[videoKey] && <div className="video-skeleton" />}
                                        <video
                                          className={`video-thumbnail showcase-video ${loadedVideos[videoKey] ? 'ready' : 'loading'}`}
                                          src={getVideoUrl(card.path)}
                                          data-src={card.path}
                                          muted
                                          autoPlay
                                          loop
                                          preload={isMobile ? "metadata" : "auto"}
                                          playsInline
                                          crossOrigin="anonymous"
                                          poster="/Conquer_Media.jpg"
                                          onLoadedData={() => handleVideoReady(videoKey)}
                                          onCanPlay={() => handleVideoReady(videoKey)}
                                          onError={(e) => {
                                            handleVideoReady(videoKey);
                                            try { e.currentTarget.pause(); } catch (_) { void 0; }
                                          }}
                                          loading="eager"
                                        />
                                        <div className="video-overlay">
                                          <div className="video-play-btn"><Play size={20} /></div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()
                              )
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Navigation Buttons */}
                  <button type="button" aria-label="Previous" className="nav-button prev" onClick={goPrev}><ChevronLeft /></button>
                  <button type="button" aria-label="Next" className="nav-button next" onClick={goNext}><ChevronRight /></button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Website Projects carousel section */}
        <WebsiteProjects />

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md">
            <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {modalTitle && (
                <div className="absolute top-3 left-4 z-10 font-medium text-xs sm:text-sm text-white/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                  {modalTitle}
                </div>
              )}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-10 text-white bg-black/60 rounded-full p-2 hover:bg-red-600 transition-colors backdrop-blur-md"
                aria-label="Close video"
              >
                <X size={18} />
              </button>

              <video
                ref={modalVideoRef}
                key={modalSrc}
                src={modalSrc}
                controls
                autoPlay
                playsInline
                controlsList="nodownload"
                className="w-full h-auto max-h-[85vh] rounded-2xl"
                onCanPlay={() => {
                  try {
                    const v = modalVideoRef.current;
                    if (v) {
                      v.muted = false;
                      const p = v.play();
                      if (p && typeof p.then === 'function') {
                        p.catch(() => {
                          v.muted = true;
                          v.play().catch(() => {});
                        });
                      }
                    }
                  } catch (_) {}
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}