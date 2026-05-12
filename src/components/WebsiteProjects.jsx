import React, { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
];

const WebsiteProjects = () => {
  const [loadedImages, setLoadedImages] = useState({});
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= 768);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const handleImageLoaded = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const goNext = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.round(el.clientWidth * 0.86), behavior: 'smooth' });
  }, []);

  const goPrev = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -Math.round(el.clientWidth * 0.86), behavior: 'smooth' });
  }, []);

  return (
    <section id="WebsiteProjects" className="portfolio-style-section pt-16 pb-0">
      <style>{`
        .portfolio-style-section { background: transparent; overflow: hidden; }
        .website-projects-slider{width:100%;max-width:900px;margin:0 auto;position:relative;background:transparent}
        .website-projects-slider .slider-wrapper{display:flex;gap:1rem;align-items:flex-start;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:8px;scrollbar-width:none}
        .website-projects-slider .slider-wrapper::-webkit-scrollbar{display:none}
        .website-projects-slider .slider-card{flex:0 0 calc((100% - 2rem)/3);max-width:280px;scroll-snap-align:center;border-radius:12px;overflow:hidden;background:transparent;cursor:pointer}
        .website-projects-slider .project-card{min-height:520px}
        .website-projects-slider .nav-button{position:absolute;top:50%;transform:translateY(-50%);width:45px;height:45px;border-radius:12px;background:#030014;border:2px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;z-index:10}
        .website-projects-slider .nav-button.prev{left:10px}
        .website-projects-slider .nav-button.next{right:10px}
        .website-projects-slider .showcase-title{font-size:3rem;font-weight:700;margin-bottom:2rem;background:linear-gradient(45deg,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-align:center}
        @media (max-width: 1024px){
          .website-projects-slider .slider-card{flex:0 0 calc((100% - 1rem)/2);max-width:48%}
        }
        @media (max-width: 768px){
          .website-projects-slider { padding-left: 0; padding-right: 0; }
          .website-projects-slider .slider-wrapper { padding-left: 32px; padding-right: 32px; }
          .website-projects-slider .slider-card {
            flex: 0 0 100vw;
            max-width: 100vw;
            margin-left: 0;
            margin-right: 0;
            aspect-ratio: auto;
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            padding: 0;
          }
          .website-projects-slider .project-card {
            min-height: 430px;
            padding: 1.1rem 0.7rem 1.2rem 0.7rem;
            box-shadow: 0 4px 24px 0 rgba(99,102,241,0.10);
            border-radius: 18px;
            width: 100%;
            max-width: 98vw;
            margin: 0 auto;
            box-sizing: border-box;
            word-break: break-word;
            overflow-wrap: break-word;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .website-projects-slider .project-title, .website-projects-slider .project-description {
            word-break: break-word;
            overflow-wrap: break-word;
          }
          .website-projects-slider .project-image{height:150px}
          .website-projects-slider .project-title{font-size:1.1rem}
          .website-projects-slider .project-description{font-size:.88rem;line-height:1.5}
          .website-projects-slider .nav-button {
            display: flex;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #030014;
            border: 2px solid rgba(255,255,255,0.08);
            z-index: 20;
            box-shadow: 0 2px 8px 0 rgba(99,102,241,0.10);
            align-items: center;
            justify-content: center;
          }
          .website-projects-slider .nav-button.prev { left: 2px; }
          .website-projects-slider .nav-button.next { right: 2px; }
        }
        @media (max-width: 480px){
          .website-projects-slider .slider-card{flex:0 0 98vw;max-width:98vw}
          .website-projects-slider .project-card{min-height:400px;padding:1rem}
          .website-projects-slider .project-image{height:138px}
        }
      `}</style>
      <div className="showcase-container px-6 mx-auto max-w-6xl">
        <div className="text-center mb-0">
          <h3 className="inline-block text-3xl md:text-5xl font-bold mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] showcase-title">
            <span style={{
              color: '#6366f1',
              backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Website Projects
            </span>
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-1">
            Explore my journey through projects, and technical expertise. Each section represents a milestone in my continuous learning path.
          </p>
        </div>
        <div className="website-projects-slider">
          <>
            <button type="button" aria-label="Previous" className="nav-button prev" onClick={goPrev}><ChevronLeft size={20} /></button>
            <button type="button" aria-label="Next" className="nav-button next" onClick={goNext}><ChevronRight size={20} /></button>
          </>
          <div ref={sliderRef} className="slider-wrapper">
          {projects.map(p => (
            <div key={p.id} className="slider-card">
              <div className="project-card bg-[#0b0720] rounded-2xl p-5 sm:p-6 shadow-lg border border-white/5 h-full flex flex-col justify-between min-h-[520px] sm:min-h-[560px]">
                <div>
                  <div className="rounded-lg overflow-hidden mb-6">
                    {!loadedImages[p.id] && (
                      <div className="project-image w-full h-44 rounded-lg bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-pulse" />
                    )}
                    <img
                      src={p.image}
                      alt={p.title}
                      className={`project-image w-full h-44 sm:h-56 object-cover rounded-lg ${loadedImages[p.id] ? 'opacity-100' : 'opacity-0'}`}
                      loading="lazy"
                      onLoad={() => handleImageLoaded(p.id)}
                      onError={() => handleImageLoaded(p.id)}
                    />
                  </div>
                  <h4 className="project-title text-xl font-bold text-white mb-2">{p.title}</h4>
                  <p className="project-description text-gray-400 text-sm mb-4 leading-relaxed">{p.description}</p>
                </div>

                <div className="flex justify-center mt-4">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white px-4 py-2 rounded-lg">Live Website</a>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteProjects;
