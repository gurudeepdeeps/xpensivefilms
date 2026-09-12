import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "Xpensive Films | X Films & Xpensive Media | Video Editing & Digital Marketing",
  description = "Xpensive Films (X Films / Xpensive Media) - 'Xpensive by Quality, Not by Money'. Premier creative agency offering professional video editing, digital marketing services, social media marketing, and custom web development.",
  keywords = "Xpensive Films, X Films, xpensive films, x films, Xpensive Media, xpensive media, _x.films, Video Editing, Video Editing Agency, Digital Marketing, Digital Marketing Services, Social Media Marketing, Corporate Video Production, Real Estate Videography, Podcast Production, Website Development",
  name = "Xpensive Films | X Films",
  type = "website",
  image = "/share-image.webp",
  canonical = "https://xpensivefilms.pages.dev/",
  schema = null,
}) {
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://xpensivefilms.pages.dev${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Optional Injected Page Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}