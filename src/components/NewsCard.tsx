import React from 'react';

interface NewsCardProps {
  id: number | string;
  title: string;
  excerpt: string;
  image?: string;
  published_at: string;
  slug?: string;
  source?: string;
  category?: string;
  is_external?: boolean;
  link?: string;
  url?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  excerpt,
  image,
  published_at,
  slug,
  source,
  category,
  is_external = false,
  link,
  url
}) => {
  const newsUrl = link || url || (slug ? `/berita/${slug}` : id ? `/berita/${id}` : '#');
  const target = is_external ? '_blank' : '_self';
  const rel = is_external ? 'noopener noreferrer' : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="h-48 overflow-hidden relative">
          <img
            className="w-full h-full object-cover"
            src={image}
            alt={title}
          />
          {is_external && source && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {source}
            </div>
          )}
          {category && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {category}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          <a
            href={newsUrl}
            target={target}
            rel={rel}
            className="hover:text-green-600 transition-colors"
          >
            {title}
          </a>
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          <i className="far fa-calendar-alt mr-2"></i>
          {new Date(published_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {source && (
              <span>
                <i className="fas fa-user mr-1"></i>
                {source}
              </span>
            )}
          </div>
          <a
            href={newsUrl}
            target={target}
            rel={rel}
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors"
          >
            {is_external ? `Baca di ${source} →` : 'Baca Selengkapnya'}
            <i className="fas fa-arrow-right ml-2 text-sm"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
