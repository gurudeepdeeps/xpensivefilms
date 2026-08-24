import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { getSupabaseImageUrl } from '../utils/supabaseImages';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const projects = [
  {
    id: 1,
    title: 'The Wed 24',
    description: 'Developed a dynamic Full-Stack web application using HTML for Kiran A N, a creative Photographer.',
    image: getSupabaseImageUrl('website-projects-images', 'thewed24.webp'),
    url: 'https://thewed24.com',
    tag: 'Photography'
  },
  {
    id: 2,
    title: 'Likhith Portfolio',
    description: 'Developed a dynamic 3D web applications using React js for Likhith D A, a creative video editor.',
    image: getSupabaseImageUrl('website-projects-images', 'likhith-portfolio.webp'),
    url: 'https://portfolio-likhith.vercel.app',
    tag: 'Portfolio 3D'
  },
  {
    id: 3,
    title: 'South-Indian Wedding Invitation',
    description: 'Developed a south-indian wedding invitation dynamic web applications using React js.',
    image: getSupabaseImageUrl('website-projects-images', 'weddinginvitation-vg.webp'),
    url: 'https://wedding-invitation-vg.vercel.app',
    tag: 'Web Invitation'
  },
  {
    id: 4,
    title: 'Goat Ready Mutton Predictor',
    description: 'Developed a dynamic Full-Stack web application using React js for Goat Ready Mutton Predictor.',
    image: getSupabaseImageUrl('website-projects-images', 'goatreadymutton.webp'),
    url: 'https://goat-ready-mutton.vercel.app',
    tag: 'Full Stack App'
  },
  {
    id: 5,
    title: 'Karunadu Editors Club',
    description: 'Developed and maintaining a dynamic web applications using HTML for Karnataka Editors.',
    image: getSupabaseImageUrl('website-projects-images', 'kec.webp'),
    url: 'https://karunadu-editors-club.vercel.app',
    tag: 'Organization'
  },
  {
    id: 6,
    title: 'M S Properties',
    description: 'Developed a dynamic web applications using HTML for Yogesh Gowda, a popular Real-estate Business.',
    image: getSupabaseImageUrl('website-projects-images', 'ms-properties.webp'),
    url: 'https://ms-properties.vercel.app',
    tag: 'Real Estate'
  },
  {
    id: 7,
    title: 'LagnaPatra Studio',
    description: 'Developed web applications using HTML for My LagnaPatra Studio, digital wedding invitation website studio.',
    image: getSupabaseImageUrl('website-projects-images', 'lagnapatra-studio.webp'),
    url: 'https://lagnapatra.vercel.app',
    tag: 'Studio Website'
  },
];

const WebsiteProjects = () => {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoaded = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="WebsiteProjects" className="relative py-20 bg-transparent overflow-hidden">
      <div className="relative px-4 sm:px-8 flex flex-col items-center max-w-7xl mx-auto">
        <div className="relative z-10 w-full text-center mb-10">
          <Badge variant="purple" className="mb-4 text-xs tracking-wider uppercase">
            Web Development
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#7f5af0] via-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-4 tracking-tight">
            Web Creations
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light">
            Crafting immersive digital experiences through clean code, responsive layouts, and modern design solutions.
          </p>
        </div>

        {/* Shadcn UI Carousel */}
        <div className="w-full relative px-6 sm:px-10">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {projects.map((project) => (
                <CarouselItem key={project.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Card className="flex flex-col h-[470px] overflow-hidden hover:border-purple-500/40 hover:shadow-purple-500/10 transition-all duration-300 group">
                      <div className="relative h-48 w-full overflow-hidden bg-black/40">
                        <img
                          src={project.image}
                          alt={project.title}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                            loadedImages[project.id] ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => handleImageLoaded(project.id)}
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="backdrop-blur-md bg-black/60 text-xs">
                            {project.tag}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="flex flex-col flex-1 p-6 justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-white mb-2 truncate group-hover:text-purple-300 transition-colors">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="text-gray-300 text-sm font-light leading-relaxed line-clamp-3">
                            {project.description}
                          </CardDescription>
                        </div>

                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 w-full"
                        >
                          <Button variant="default" className="w-full gap-2">
                            Live Preview <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default WebsiteProjects;