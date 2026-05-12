import React, { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getSupabaseImageUrl } from '../utils/supabaseImages';

const projects = [
  {
    id: 1,
    title: 'The Wed 24',
    description: 'Developed a dynamic Full-Stack web application using HTML for Kiran A N, an creative Photographer.',
    image: getSupabaseImageUrl('website-projects-images', 'thewed24.webp'),
    url: 'https://thewed24.com'
  },
  {
    id: 2,
    title: 'Likhith Portfolio',
    description: 'Developed a dynamic 3D web applications using React js for Likhith D A, an creative video editor.',
    image: getSupabaseImageUrl('website-projects-images', 'likhith-portfolio.webp'),
    url: 'https://portfolio-likhith.vercel.app'
  },
  {
    id: 3,
    title: 'South-Indian Wedding Invitation',
    description: 'Developed a south-indian wedding invitation dynamic web applications using React js.',
    image: getSupabaseImageUrl('website-projects-images', 'weddinginvitation-vg.webp'),
    url: 'https://wedding-invitation-vg.vercel.app'
  },
  {
    id: 4,
    title: 'Goat Ready Mutton Predictor',
    description: 'Developed a dynamic Full-Stack web application using React js for Goat Ready Mutton Predictor.',
    image: getSupabaseImageUrl('website-projects-images', 'goatreadymutton.webp'),
    url: 'https://goat-ready-mutton.vercel.app'
  },
  {
    id: 5,
    title: 'Karunadu Editors Club',
    description: 'Developed and maintaining a dynamic web applications using HTML for Karnataka Editors, service provided for Karnataka Editors.',
    image: getSupabaseImageUrl('website-projects-images', 'kec.webp'),
    url: 'https://karunadu-editors-club.vercel.app'
  },
  {
    id: 6,
    title: 'M S Properties',
    description: 'Developed a dynamic web applications using HTML for Yogesh Gowda, a most popular Real-estate Business.',
    image: getSupabaseImageUrl('website-projects-images', 'ms-properties.webp'),
    url: 'https://ms-properties.vercel.app'
  },
  {
    id: 7,
    title: 'LagnaPatra Studio',
    description: 'Developed a dynamic web applications using HTML for My LagnaPatra Studio, a most popular digital wedding invitation websites studio.',
    image: getSupabaseImageUrl('website-projects-images', 'lagnapatra-studio.webp'),
    url: 'https://lagnapatra.vercel.app'
  },
];

const WebsiteProjects = () => {
  const [loadedImages, setLoadedImages] = useState({});
  const sliderRef = useRef(null);

  const handleImageLoaded = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const goNext = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  }, []);

  const goPrev = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  }, []);

  return (
    <section id="WebsiteProjects" className="relative py-20 bg-transparent">
      <style>{`
        .website-projects-slider {
          position: relative;
          padding: 0 10px;
        }
        .slider-wrapper {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 24px 2rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }
        .slider-wrapper::-webkit-scrollbar {
          display: none;
        }
        .slider-card {
          flex: 0 0 280px;
          max-width: 280px;
          margin-left: 0;
          margin-right: 0;
          scroll-snap-align: start;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .slider-wrapper {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .slider-card {
            flex: 0 0 340px;
            max-width: 340px;
            margin-left: 0;
            margin-right: 0;
          }
        }
        @media (max-width: 768px) {
          .slider-card {
            flex: 0 0 80vw;
            max-width: 70vw;
            margin-left: 0;
            margin-right: 0;
          }
          .slider-wrapper {
            gap: 1rem;
            padding-left: 10vw;
            padding-right: 10vw;
          }
        }
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: 18px;
          background: rgba(11, 7, 32, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 30;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
          opacity: 1 !important;
          visibility: visible !important;
        }
        .nav-button:hover {
          background: rgba(99, 102, 241, 1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.5);
        }
        .nav-button:active {
          transform: translateY(-50%) scale(0.95);
        }
        .nav-button.prev { left: -25px; }
        .nav-button.next { right: -25px; }
        
        @media (max-width: 1280px) {
          .nav-button.prev { left: -10px; }
          .nav-button.next { right: -20px; }
        }

        @media (max-width: 768px) {
          .nav-button {
            width: 44px;
            height: 44px;
            border-radius: 14px;
          }
          .nav-button.prev { left: -30px; }
          .nav-button.next { right: -30px; }
        }

        .project-card-glass {
          background: rgba(11, 7, 32, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* Removed ::before and all hover effects for static appearance */
        
        /* Removed ::after gradient overlay for full transparency */

        .live-preview-btn {
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
      `}</style>

      {/* Recreated Web Creations Section */}
      <section className="relative bg-transparent  px-4 sm:px-8 flex flex-col items-center" style={{ background: 'transparent', boxShadow: 'none' }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center mb-4">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[#7f5af0] via-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-4 tracking-tight">Web Creations</h2>
          <p className="text-lg md:text-2xl text-slate-200 mb-6 font-light">Crafting immersive digital experiences through clean code and innovative design solutions.</p>
        </div>
        <div className="relative w-full max-w-7xl mx-auto flex items-center">
          <button type="button" aria-label="Previous" className="nav-button prev absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-lg" onClick={goPrev}><ChevronLeft size={28} /></button>
          <div ref={sliderRef} className="slider-wrapper flex gap-8 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth w-full items-center">
            {projects.map((project) => (
              <div key={project.id} className="slider-card flex-shrink-0 snap-start flex justify-center items-center">
                <div className="project-card-glass rounded-3xl overflow-hidden flex flex-col h-[500px] relative mx-auto">
                  <div className="image-container relative h-52 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${loadedImages[project.id] ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => handleImageLoaded(project.id)}
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-4 px-6 pb-2">
                    <h3 className="text-2xl font-bold text-white mb-2 truncate drop-shadow">{project.title}</h3>
                    <p className="text-gray-200 text-base mb-4 flex-grow line-clamp-3 font-light">{project.description}</p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-semibold shadow-md hover:scale-105 transition-transform"
                    >
                      Live Preview <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" aria-label="Next" className="nav-button next absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-lg" onClick={goNext}><ChevronRight size={28} /></button>
        </div>
        {/* Decorative blurred backgrounds removed for cleaner look */}
      </section>
      
      {/* Decorative background elements removed for cleaner look */}
    </section>
  );
};

export default WebsiteProjects;