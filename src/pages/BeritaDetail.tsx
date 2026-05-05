import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, Share2, Facebook, Twitter, Mail, Clock, Tag, Building2, Newspaper, Users, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import LazyImage from '../components/LazyImage';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface RelatedBerita {
  id: number;
  judul: string;
  slug: string;
  excerpt?: string;
  gambar?: string;
  kategori?: string;
  published_at: string;
  author?: {
    name: string;
  };
}

const BeritaDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useScrollToTop();
  const [imageError, setImageError] = useState(false);
  const [beritaData, setBeritaData] = useState<any>(null);
  const [relatedBerita, setRelatedBerita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clean slug - remove any extra characters
  const cleanSlug = slug ? slug.split(':')[0] : '';


  // Fetch berita data
  useEffect(() => {
    const fetchBerita = async () => {
      if (!cleanSlug) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.getNewsDetail(cleanSlug);

        if (response.success && response.data && response.data.berita) {
          setBeritaData(response.data.berita);
          setRelatedBerita(response.data.related || []);
        } else {
          setError('Berita tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal memuat berita');
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [cleanSlug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    if (diffInHours < 48) return 'Kemarin';

    return formatDate(dateString);
  };

  const getImageUrl = () => {
    if (imageError || !beritaData?.gambar) {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMTUwSDQ1MFYyNTBIMzUwVjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTM5MCAxNzBINDEwVjE4MEgzOTBWMTcwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
    }
    return beritaData.gambar;
  };

  const handleShare = (platform: string) => {
    const title = beritaData?.judul || 'Berita Desa Cibatu';
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !beritaData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-6xl">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Berita tidak ditemukan</h3>
          <p className="text-gray-600 mb-6">Berita yang Anda cari mungkin sudah dihapus atau tidak tersedia</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <Link
              to="/berita"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <Newspaper className="w-4 h-4" />
              <span>Lihat Berita Lain</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={beritaData?.judul ? `${beritaData.judul} - Desa Cibatu` : "Berita Desa Cibatu"}
        description={beritaData?.excerpt || beritaData?.ringkasan || "Baca berita terbaru dan informasi terkini dari Desa Cibatu, Purwakarta."}
        keywords={`${beritaData?.kategori || 'Berita'}, Desa Cibatu, Purwakarta, ${beritaData?.judul || ''}`}
        image={beritaData?.gambar}
        url={`/berita/${slug}`}
        type="article"
        structuredData={beritaData ? {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": beritaData.judul,
          "description": beritaData.excerpt || beritaData.ringkasan,
          "image": beritaData.gambar,
          "author": {
            "@type": "Person",
            "name": beritaData.author?.name || beritaData.penulis || "Admin Desa Cibatu"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Desa Cibatu",
            "logo": {
              "@type": "ImageObject",
              "url": "https://pemdescibatu2001.online/logo desa cibatu.png"
            }
          },
          "datePublished": beritaData.published_at,
          "dateModified": beritaData.created_at
        } : undefined}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{beritaData.views || 0} dilihat</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Bagikan ke Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Bagikan ke Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Bagikan ke WhatsApp"
                >
                  <span className="text-lg">📱</span>
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Bagikan via Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
        {/* Article Header */}
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-64 md:h-80 lg:h-96">
                <LazyImage
                  src={getImageUrl()}
                  alt={beritaData.judul}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                {/* Category Badge */}
                {beritaData.kategori && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
              <Tag className="w-3 h-3 mr-1" />
                      {beritaData.kategori}
            </span>
                  </div>
                )}
          </div>

              {/* Article Content */}
              <div className="p-6 lg:p-8">
          {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {beritaData.judul}
          </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{beritaData.author?.name || 'Admin Desa'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(beritaData.published_at)}</span>
            </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getRelativeTime(beritaData.published_at)}</span>
            </div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>Desa Cibatu</span>
              </div>
          </div>

          {/* Excerpt */}
                {beritaData.excerpt && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-gray-700 font-medium italic">
                      {beritaData.excerpt}
              </p>
            </div>
          )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: beritaData.konten }}
                  />
        </div>

                {/* Tags */}
                {beritaData.tags && beritaData.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Tag:</h3>
                    <div className="flex flex-wrap gap-2">
                    {beritaData.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                    </div>
          </div>
        )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {/* Share Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-green-600" />
                  Bagikan Berita
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span className="text-lg">📱</span>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
                  </button>
          </div>
        </div>

              {/* Related News */}
              {relatedBerita && relatedBerita.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Newspaper className="w-5 h-5 mr-2 text-green-600" />
                    Berita Terkait
                  </h3>
                  <div className="space-y-4">
                    {relatedBerita.map((berita: RelatedBerita) => (
                <Link
                        key={berita.id}
                        to={`/berita/${berita.slug || berita.id}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                            <LazyImage
                              src={berita.gambar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg1MFY1MEgzMFYzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTM4IDM4SDQyVjQySDM4VjM4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K"}
                              alt={berita.judul}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1">
                              {berita.judul}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                              {berita.excerpt || ''}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>{getRelativeTime(berita.published_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2 text-green-600" />
                  Menu Cepat
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/berita"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Newspaper className="w-4 h-4" />
                    <span>Semua Berita</span>
                  </Link>
                  <Link
                    to="/profil-desa"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Profil Desa</span>
                  </Link>
                  <Link
                    to="/data-desa"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Data Desa</span>
                  </Link>
                  <Link
                    to="/layanan-surat"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Newspaper className="w-4 h-4" />
                    <span>Layanan Surat</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default BeritaDetail;
