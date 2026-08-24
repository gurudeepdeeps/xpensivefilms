import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "Xpensive Films | Digital Marketing & Video Editing Agency",
  description = "Xpensive Films - Xpensive by Quality, Not by Money. Professional video editing, corporate media, social media marketing, and web development.",
  keywords = "Xpensive Films, Video Editing, Digital Marketing, Web Development, SEO, Corporate Videos",
  name = "Xpensive Films",
  type = "website",
  image = "/share-image.webp",
  canonical = "https://xpensivefilms.vercel.app/",
}) {
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://xpensivefilms.vercel.app${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large" />

      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonical} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
}