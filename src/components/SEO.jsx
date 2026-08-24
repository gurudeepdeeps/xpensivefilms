import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, name, type, image }) {
  const shareImage = image || '/share-image.webp';
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={shareImage} />
    </Helmet>
  );
}