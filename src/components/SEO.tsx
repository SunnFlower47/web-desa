import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: any;
}

const SEO: React.FC<SEOProps> = ({
  title = "Website Resmi Desa Cibatu, Purwakarta",
  description = "Portal informasi desa, layanan surat online, data penduduk, transparansi keuangan, dan berita desa terbaru.",
  keywords = "Desa Cibatu, Purwakarta, Website Desa, Layanan Surat Online, Data Penduduk, Transparansi Desa, Berita Desa, Pemerintahan Desa",
  image = "https://pemdescibatu2001.online/logo desa cibatu.png",
  url = "https://pemdescibatu2001.online/",
  type = "website",
  structuredData
}) => {
  const fullTitle = title.includes("Desa Cibatu") ? title : `${title} - Desa Cibatu, Purwakarta`;
  const fullUrl = url.startsWith("http") ? url : `https://pemdescibatu2001.online${url}`;

  return (
    <Helmet>
      <html lang="id" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#059669" />

      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Desa Cibatu" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Desa Cibatu" />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO meta tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Desa Cibatu" />

      {/* Performance hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Default structured data for organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "GovernmentOrganization",
          "name": "Desa Cibatu",
          "alternateName": "Pemerintah Desa Cibatu",
          "description": "Pemerintah Desa Cibatu, Kecamatan Cibatu, Kabupaten Purwakarta, Jawa Barat",
          "url": "https://pemdescibatu2001.online/",
          "logo": "https://pemdescibatu2001.online/logo desa cibatu.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Desa Cibatu",
            "addressLocality": "Cibatu",
            "addressRegion": "Purwakarta",
            "addressCountry": "ID"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-851-569-8801",
            "email": "desacibatu.2001@gmail.com",
            "contactType": "customer service",
            "availableLanguage": "Indonesian"
          },
          "sameAs": [
            "https://pemdescibatu2001.online/"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
