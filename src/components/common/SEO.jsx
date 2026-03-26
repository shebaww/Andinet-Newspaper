// src/components/common/SEO.jsx
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'article' }) => {
  const siteTitle = 'The Andinet Gazette';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = description || 'Independent journalism for the modern age';
  const siteUrl = url || 'https://andinet-gazette.com';
  const siteImage = image || 'https://andinet-gazette.com/og-image.jpg';

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* Additional */}
      <link rel="canonical" href={siteUrl} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
