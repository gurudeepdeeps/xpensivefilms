import React, { memo, useState } from "react";
import { getSupabaseImageUrl } from "../utils/supabaseImages";
import SEO from "../components/SEO";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Sparkles } from "lucide-react";

const Services = memo(() => {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoaded = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Services data with unique images and text for each card
  const servicesData = [
    {
      id: 0,
      title: "Website Development",
      description:
        "We create custom, responsive websites that reflect your brand and engage your audience. From design to development, we build user-friendly sites that drive results and grow your online presence.",
      image: getSupabaseImageUrl("services-images", "website-development.webp"),
      category: "Development",
    },
    {
      id: 1,
      title: "Corporate Events",
      description:
        "We plan and manage professional corporate events that are seamless, impactful, and aligned with your brand. From conferences to product launches, we handle every detail to deliver a smooth and memorable experience.",
      image: getSupabaseImageUrl("services-images", "corporate-events.webp"),
      category: "Production",
    },
    {
      id: 2,
      title: "Bars & Restaurants",
      description:
        "We shoot and edit high-quality photos and videos that showcase your food, drinks, and atmosphere, helping your brand stand out and attract customers.",
      image: getSupabaseImageUrl("services-images", "bars-restaurants.webp"),
      category: "Media",
    },
    {
      id: 3,
      title: "Real Estate",
      description:
        "We shoot and edit professional photos and videos that highlight properties, enhance listings, and attract buyers. Our visuals focus on space, lighting, and detail to present each property at its best.",
      image: getSupabaseImageUrl("services-images", "real-estate.webp"),
      category: "Showcase",
    },
    {
      id: 4,
      title: "Testimonials",
      description:
        "We produce professional testimonial shoots that capture genuine client experiences with clarity and authenticity. From planning to filming and editing, we ensure each testimonial feels natural and credible.",
      image: getSupabaseImageUrl("services-images", "testimonials.webp"),
      category: "Branding",
    },
    {
      id: 5,
      title: "Digital Marketing",
      description:
        "We create data-driven digital marketing strategies that increase visibility, engagement, and conversions. From social media to online campaigns, we help brands connect with the right audience.",
      image: getSupabaseImageUrl("services-images", "digital-marketing.webp"),
      category: "Marketing",
    },
    {
      id: 6,
      title: "Social Media",
      description:
        "We manage your social media presence with strategic content, consistent posting, and audience engagement. Our approach helps build brand identity and grow followers.",
      image: getSupabaseImageUrl("services-images", "social-media.webp"),
      category: "Growth",
    },
    {
      id: 7,
      title: "Influencer Marketing",
      description:
        "We connect brands with relevant influencers to create authentic, engaging campaigns. From strategy to execution, we manage collaborations that increase reach, trust, and brand awareness.",
      image: getSupabaseImageUrl("services-images", "influencer-marketing.webp"),
      category: "Outreach",
    },
    {
      id: 8,
      title: "Podcast",
      description:
        "We handle podcast recording, editing, and production with a focus on clear sound and polished visuals. From setup to final delivery, we help create podcasts that engage audiences.",
      image: getSupabaseImageUrl("services-images", "podcast.webp"),
      category: "Audio/Video",
    },
  ];

  return (
    <>
      <SEO
        title="Our Services - Digital Marketing & Web Development | Xpensive Films"
        description="Explore the comprehensive digital marketing and web development services offered by Xpensive Films, including SEO, PPC, social media, and custom website design."
        keywords="Digital Marketing Services, Web Development, SEO, PPC Management, Social Media Marketing, Website Design"
      />
      {/* add id so hash links (#Services) can find this section */}
      <section id="Services" className="w-full relative py-12 sm:py-16 bg-transparent">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 bg-transparent">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> What We Deliver
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200">
              We Offer
            </h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
              High-impact solutions tailored to elevate your digital presence and brand identity.
            </p>
          </div>

          {/* Shadcn UI Carousel Component */}
          <div className="relative px-2 sm:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 sm:-ml-4">
                {servicesData.map((service) => (
                  <CarouselItem
                    key={service.id}
                    className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full bg-transparent border-0 shadow-none p-0 group flex flex-col justify-between">
                      <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                          {!loadedImages[service.id] && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-pulse" />
                          )}
                          <img
                            src={service.image}
                            alt={service.title}
                            className={`w-full h-full object-cover rounded-2xl transition-all duration-500 group-hover:scale-105 ${
                              loadedImages[service.id] ? "opacity-100" : "opacity-0"
                            }`}
                            loading="lazy"
                            onLoad={() => handleImageLoaded(service.id)}
                            onError={() => handleImageLoaded(service.id)}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="text-white font-bold text-base sm:text-lg mb-2 group-hover:text-purple-300 transition-colors">
                            {service.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="flex" />
              <CarouselNext className="flex" />
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
});

Services.displayName = "Services";

export default Services;