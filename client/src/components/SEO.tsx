import React from 'react';
import Helmet from 'react-helmet';
import socialBanner from 'assets/images/social_banner.png';

interface SEOProps {
  title: string;
  description?: string;
  isBugPage?: boolean;
}
const SEO: React.FC<SEOProps> = ({ title, description, isBugPage }) => {
  const url = 'https://bugvilla.herokuapp.com';
  const social = {
    siteLogo: `src/static/logo.svg`,
    siteBanner: `${url}/images/social-banner.png`,
    twitter: '@anuraghazru',
  };

  const desc =
    description ||
    'Universal bug tracker for everyone! BugVilla allows team members to collaborate, discuss and kill bugs effectively.';

  return (
    <Helmet>
      {/* General tags */}
      <title>{title}</title>
      <meta name="url" content={url} />
      <meta name="description" content={desc} />
      <meta name="image" content={socialBanner} />
      <link rel="canonical" href={url} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {isBugPage ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={socialBanner} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={social.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={socialBanner} />
    </Helmet>
  );
};

export default SEO;
