import { useState, useEffect, memo } from "react";
import SocialFloat from '../components/SocialFloat';
import PropTypes from 'prop-types';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Instagram,
  Sparkles,
  Play,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Timeline Animation Component
const EditingTimelineAnimation = memo(({ isHovering }) => {
  const [playheadPosition, setPlayheadPosition] = useState(0);

  useEffect(() => {
    let animationFrame;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const duration = 5000; // 5 second loop
      const progress = (elapsed % duration) / duration;
      setPlayheadPosition(progress * 100);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Video clip data
  const clips = [
    { id: 1, duration: 25, color: "from-blue-500 to-purple-600", label: "Intro" },
    { id: 2, duration: 30, color: "from-purple-500 to-pink-600", label: "Scene 1" },
    { id: 3, duration: 25, color: "from-pink-500 to-red-600", label: "Transition" },
    { id: 4, duration: 20, color: "from-red-500 to-orange-600", label: "Scene 2" },
  ];

  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      {/* Timeline Container */}
      <div className="w-full px-4 sm:px-8">
        {/* Time Ruler */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
          <span>0s</span>
          <span>30s</span>
          <span>60s</span>
        </div>

        {/* Main Timeline Track */}
        <div className="relative w-full h-20 bg-black/50 rounded-lg border border-white/10 overflow-hidden backdrop-blur-sm group">
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600 z-30 transition-all duration-75"
            style={{
              left: `${playheadPosition}%`,
              boxShadow: "0 0 10px rgba(96, 165, 250, 0.8)",
            }}
          >
            {/* Playhead indicator */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full border border-white/50"></div>
          </div>

          {/* Clips Container */}
          <div className="flex h-full w-full">
            {clips.map((clip, idx) => {
              const widthPercent = (clip.duration / totalDuration) * 100;
              return (
                <div
                  key={clip.id}
                  className={`relative h-full flex items-center justify-center text-white/70 font-medium text-xs border-r border-white/5 transition-all duration-300 ${
                    idx === 0 ? "" : ""
                  }`}
                  style={{ width: `${widthPercent}%` }}
                >
                  {/* Clip Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${clip.color} opacity-20 group-hover:opacity-40 transition-opacity`}
                  ></div>

                  {/* Clip Border */}
                  <div className="absolute inset-0 border-l border-r border-white/20"></div>

                  {/* Clip Label & Icon */}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <Play className="w-3 h-3 text-white/50" />
                    <span className="hidden sm:inline">{clip.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hover Highlight Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>

        {/* Audio Waveform (Optional visual enhancement) */}
        <div className="mt-4 flex items-end justify-around h-12 gap-0.5">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-sm opacity-30 hover:opacity-60 transition-opacity"
              style={{
                height: `${Math.sin(i * 0.5 + playheadPosition / 10) * 40 + 50}%`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Time Display */}
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {((playheadPosition / 100) * totalDuration).toFixed(1)}s
        </div>
        <div className="text-xs text-gray-500 mt-1">Timeline Animation</div>
      </div>
    </div>
  );
});

EditingTimelineAnimation.displayName = 'EditingTimelineAnimation';

// Memoized Components
const StatusBadge = memo(() => (
  <div
    className="inline-block animate-float lg:mx-0"
    data-aos="zoom-in"
    data-aos-delay="400"
  >
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          Ready to Innovate..
        </span>
      </div>
    </div>
  </div>
));

StatusBadge.displayName = 'StatusBadge';

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-center text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Digital Marketing &amp; <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Video Editing</span>
        </span>
      </span>
    </h1>
  </div>
));

MainTitle.displayName = 'MainTitle';

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon
            className={`w-4 h-4 text-gray-200 ${
              text === "Contact"
                ? "group-hover:translate-x-1"
                : "group-hover:rotate-45"
            } transform transition-all duration-300 z-10`}
          />
        </span>
      </div>
    </button>
  </a>
));

CTAButton.displayName = 'CTAButton';

CTAButton.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

import SEO from '../components/SEO';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener("resize", initAOS);
    return () => window.removeEventListener("resize", initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden" id="Home">
      <SEO 
        title="Xpensive Media - Premier Digital Marketing & Web Development"
        description="Xpensive Media offers top-tier digital marketing, SEO, and web development services to elevate your brand. Drive growth with our innovative and results-driven solutions."
        keywords="Digital Marketing, Xpensive Media, Web Development, SEO Services, Social Media Marketing, Content Creation"
        type="website"
      />
      <div
        className={`relative z-10 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-[5%] sm:px-6 lg:px-[0%] min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div
              className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="space-y-4 sm:space-y-6">
                <StatusBadge />
                <MainTitle />

                {/* CTA Buttons */}
                <div
                  className="flex flex-row gap-3 w-full justify-center"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                >
                  <CTAButton
                    href="#Portofolio"
                    text="Projects"
                    icon={ExternalLink}
                  />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>
              </div>
            </div>

            {/* Right Column - Editing Timeline Animation */}
            <div
              className="w-full py-[10%] sm:py-0 lg:w-1/2 h-auto lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-8 lg:mt-0"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600"
            >
              <div className="relative w-full opacity-90">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                    isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                  }`}
                ></div>

                <div
                  className={`relative z-10 w-full opacity-90 transform transition-transform duration-500 ${
                    isHovering ? "scale-105" : "scale-100"
                  }`}
                >
                  <EditingTimelineAnimation isHovering={isHovering} />
                </div>

                <div
                  className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    isHovering ? "opacity-50" : "opacity-20"
                  }`}
                >
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                      isHovering ? "scale-110" : "scale-100"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SocialFloat />
    </div>
  );
};

export default memo(Home);