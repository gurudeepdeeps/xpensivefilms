import { ExternalLink, Youtube, Play } from 'lucide-react';
import PropTypes from 'prop-types';


const CardProject = ({ Img, Title, Description, ProjectLink, YoutubeLink, embedLink, id }) => {
  // Handle kasus ketika ProjectLink kosong
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink kosong");
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };
  
  const handleDetails = (e) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
    }
  };
  

  return (
    <div className="slider-card">
      <div className="project-card-glass rounded-[24px] overflow-hidden h-full flex flex-col">
        <div className="image-container relative group/img overflow-hidden h-56">
          {embedLink ? (
            <iframe 
              width="100%" 
              height="100%" 
              src={embedLink}
              title={Title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
            />
          )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            {Title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-3 font-light">
            {Description}
          </p>
          <div className="mt-auto flex flex-col gap-2">
            {ProjectLink && (
              <a
                href={ProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="live-preview-btn group/btn relative inline-flex items-center gap-2 w-full justify-center py-3 px-4 rounded-2xl bg-white/5 hover:bg-transparent text-white font-bold transition-all duration-400 border border-white/10 hover:border-transparent"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Live Demo
                  <ExternalLink className="w-4 h-4" />
                </span>
              </a>
            )}
            {YoutubeLink && (
              <a
                href={YoutubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors duration-200 w-full justify-center"
              >
                <span className="text-sm font-medium">YouTube</span>
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {!ProjectLink && !YoutubeLink && (
              <span className="text-gray-500 text-sm text-center">Demo Not Available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CardProject.propTypes = {
  Img: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
  ProjectLink: PropTypes.string.isRequired,
  YoutubeLink: PropTypes.string,
  embedLink: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default CardProject;