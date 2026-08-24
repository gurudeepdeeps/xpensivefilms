import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';
import { supabase } from '../supabase';

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

const WebsiteProjects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadedImages, setLoadedImages] = useState({});

  const fetchWebProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('web_projects').select('*');
      if (error) {
        console.error("Supabase fetch web_projects error:", error);
      } else if (data) {
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchWebCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('web_categories').select('*');
      if (error) {
        console.error("Supabase fetch web_categories error:", error);
      } else if (data) {
        const catNames = data.map((item) => item.name);
        setCategories(['All', ...catNames]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchWebProjects();
    fetchWebCategories();

    // Supabase Realtime subscriptions
    const projectsChannel = supabase
      .channel('public:web_projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'web_projects' }, () => {
        fetchWebProjects();
      })
      .subscribe();

    const categoriesChannel = supabase
      .channel('public:web_categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'web_categories' }, () => {
        fetchWebCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, [fetchWebProjects, fetchWebCategories]);

  const handleImageLoaded = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="WebsiteProjects" className="relative py-20 bg-transparent overflow-hidden">
      <div className="relative px-4 sm:px-8 flex flex-col items-center max-w-7xl mx-auto">
        <div className="relative z-10 w-full text-center mb-8">
          <Badge variant="purple" className="mb-4 text-xs tracking-wider uppercase">
            Web Development
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#7f5af0] via-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-4 tracking-tight">
            Web Creations
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light">
            Crafting immersive digital experiences through clean code, responsive layouts, and modern design solutions.
          </p>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 mt-6 overflow-x-auto max-w-full px-4 py-2 sm:flex-wrap sm:justify-center scrollbar-none whitespace-nowrap">
              {categories.map((cat, idx) => (
                <Badge
                  key={idx}
                  variant={selectedCategory === cat ? 'default' : 'secondary'}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer transition-all px-4 py-1.5 text-xs shrink-0 whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'scale-105 shadow-md shadow-indigo-500/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Shadcn UI Carousel */}
        <div className="w-full relative px-6 sm:px-10">
          {filteredProjects.length === 0 ? (
            <div className="py-20 text-center text-gray-400 space-y-3 bg-white/5 rounded-3xl border border-white/10 my-8 max-w-3xl mx-auto backdrop-blur-xl p-8">
              <p className="text-xl font-semibold text-slate-200">No Web Creations Available</p>
              <p className="text-sm text-purple-300">New web development projects coming soon. Check back shortly!</p>
            </div>
          ) : (
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {filteredProjects.map((project) => (
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
                              {project.category || 'Web'}
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
          )}
        </div>
      </div>
    </section>
  );
};

export default WebsiteProjects;