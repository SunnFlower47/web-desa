import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, TrendingUp, Newspaper, Globe, Home, Filter, Clock, Building2, BarChart3, FileText } from 'lucide-react';
import { api } from '../services/api';
import { useFrequentData } from '../hooks/useApiCache';
import LazyImage from '../components/LazyImage';
import { NewsCardSkeleton } from '../components/SkeletonLoader';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface BeritaItem {
  id: number | string;
  judul?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  ringkasan?: string;
  description?: string;
  gambar?: string;
  image?: string;
  kategori?: string;
  category?: string;
  published_at: string;
  created_at?: string;
  author?: {
    name: string;
  };
  penulis?: string;
  is_external?: boolean;
  source?: string;
  url?: string;
  link?: string;
  views?: number;
}

const Berita: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const [currentType, setCurrentType] = useState<'combined' | 'internal' | 'external'>('combined');
  const [currentSource, setCurrentSource] = useState<'antara' | 'tempo'>('antara');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [imageErrorIds, setImageErrorIds] = useState<Set<string | number>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch categories - cache lebih lama untuk mengurangi request
  const { data: categories } = useFrequentData(
    () => api.getNewsCategories().then((res: any) => res.data || [])
  );

  // Fetch featured berita - hanya untuk combined type
  const { data: featuredBerita } = useFrequentData(
    () => api.getFeaturedNews().then((res: any) => res.data || [])
  );

  const [beritaData, setBeritaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch berita data dengan useEffect
  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (currentType === 'combined') {
          response = await api.getNewsCombined({
            internal_limit: 3,
            external_limit: 3,
            source: currentSource
          });
        } else if (currentType === 'external') {
          response = await api.getExternalNews({
            source: currentSource,
            limit: 6
          });
        } else if (currentType === 'internal') {
          // Pastikan hanya mengambil berita internal
          response = await api.getNews({
          search: searchQuery,
          kategori: selectedCategory,
          page: currentPage,
            per_page: 6
          });
        } else {
          response = { data: [] };
        }

        const data = response.data || [];

        // Handle different response structures - only internal berita has pagination
        const lastPage = currentType === 'internal' ?
          ((response as any).pagination?.last_page || 1) : 1;

        setLastPage(lastPage);
        setBeritaData(data);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat berita');
        setBeritaData([]);
    } finally {
      setLoading(false);
    }
    };

    fetchBerita();
  }, [currentType, currentSource, searchQuery, selectedCategory, currentPage]);

  const handleTypeChange = (newType: 'combined' | 'internal' | 'external') => {
    setCurrentType(newType);
    setCurrentPage(1);
  };

  const handleSourceChange = (newSource: 'antara' | 'tempo') => {
    setCurrentSource(newSource);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    if (diffInHours < 48) return 'Kemarin';

    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSourceIcon = (source?: string) => {
    switch (source?.toLowerCase()) {
      case 'antara':
        return <Newspaper className="w-3 h-3" />;
      case 'tribun':
      case 'tempo':
        return <Globe className="w-3 h-3" />;
      default:
        return <Building2 className="w-3 h-3" />;
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source?.toLowerCase()) {
      case 'antara':
        return 'bg-orange-500';
      case 'tribun':
      case 'tempo':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const getImageUrl = (item: BeritaItem) => {
    const id = item.id || item.slug || "unknown";

    // Jika image sudah error, langsung return placeholder
    if (imageErrorIds.has(id)) {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE5NSAxNDVIMjA1VjE1NUgxOTVWMTQ1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
    }

    // Prioritas: gambar dari API, lalu image, lalu default
    if (item.gambar && item.gambar.startsWith('http')) return item.gambar;
    if (item.image && item.image.startsWith('http')) return item.image;

    // Jika tidak ada URL valid, langsung return placeholder untuk menghindari request berulang
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE5NSAxNDVIMjA1VjE1NUgxOTVWMTQ1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-6xl">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Gagal memuat berita</h3>
          <p className="text-gray-600 mb-6">Silakan coba lagi dalam beberapa saat</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Berita Desa Cibatu"
        description="Baca berita terbaru dan informasi terkini dari Desa Cibatu, Purwakarta. Update kegiatan desa, program pemerintah, dan perkembangan masyarakat."
        keywords="Berita Desa Cibatu, Informasi Desa, Kegiatan Desa, Program Pemerintah Desa, Berita Purwakarta"
        url="/berita"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Berita Desa Cibatu",
          "description": "Kumpulan berita dan informasi terbaru dari Desa Cibatu",
          "url": "https://pemdescibatu2001.online/berita",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Berita Desa Cibatu",
            "description": "Daftar berita dan informasi terbaru"
          }
        }}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                <Newspaper className="w-6 h-6 text-white" />
                </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Berita Desa Cibatu</h1>
                <p className="text-sm text-gray-600">Informasi terkini dan berita nasional</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{beritaData?.length || 0}</div>
                <div className="text-xs text-gray-500">Berita</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-xs text-gray-500">Sumber</div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Featured News */}
            {featuredBerita && featuredBerita.length > 0 && currentType === 'combined' && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Berita Terpopuler</h2>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    <LazyImage
                      src={getImageUrl(featuredBerita[0])}
                      alt={featuredBerita[0].judul || featuredBerita[0].title || 'Berita'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(featuredBerita[0].source)} text-white`}>
                          {getSourceIcon(featuredBerita[0].source)}
                          <span className="ml-1">{featuredBerita[0].source || 'Desa Cibatu'}</span>
                        </span>
                        <span className="text-sm opacity-90">{formatDate(featuredBerita[0].published_at)}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                        {featuredBerita[0].judul || featuredBerita[0].title}
                      </h3>
                      <p className="text-sm opacity-90 line-clamp-2">
                        {featuredBerita[0].excerpt || featuredBerita[0].ringkasan || featuredBerita[0].description || ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            {beritaData && beritaData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {beritaData.map((item: BeritaItem, index: number) => (
                    <article
                      key={item.id}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group ${
                        index === 0 && currentType === 'combined' ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div className="relative overflow-hidden">
                        <LazyImage
                          src={getImageUrl(item)}
                          alt={item.judul || item.title || 'Berita'}
                          className={`w-full group-hover:scale-105 transition-transform duration-300 ${
                            index === 0 && currentType === 'combined' ? 'h-48 md:h-64' : 'h-48'
                          }`}
                          onError={() => {
                            const id = item.id || item.slug || "unknown";
                            setImageErrorIds((prev: Set<string | number>) => new Set(prev).add(id));
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)} text-white shadow-lg`}>
                            {getSourceIcon(item.source)}
                            <span className="ml-1 hidden sm:inline">
                              {item.source || (item.is_external ? 'Eksternal' : 'Desa Cibatu')}
                            </span>
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>

                      <div className="p-6">
                        <div className="mb-3">
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                            {item.kategori || item.category || 'Berita'}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {item.judul || item.title}
                        </h2>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {item.excerpt || item.ringkasan || item.description || ''}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">
                              {item.author?.name || item.penulis || 'Admin'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(item.published_at)}</span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          {item.is_external ? (
                            <a
                              href={item.url || item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center space-x-2 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group"
                            >
                              <Globe className="w-4 h-4" />
                              <span className="truncate">Baca di {item.source}</span>
                            </a>
                          ) : (
                            <Link
                              to={`/berita/${item.slug || item.id}`}
                              className="inline-flex items-center justify-center space-x-2 w-full py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 group"
                            >
                              <Newspaper className="w-4 h-4" />
                              <span>Baca selengkapnya</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {lastPage > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span>←</span>
                      <span>Previous</span>
                    </button>

                    {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, lastPage))}
                      disabled={currentPage === lastPage}
                      className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span>Next</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Tidak ada berita ditemukan
                </h3>
                <p className="text-gray-500 text-lg mb-6">
                  Coba gunakan kata kunci atau kategori yang berbeda
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => handleTypeChange('combined')}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    <span>📊</span>
                    <span>Lihat Semua Berita</span>
                  </button>
                  <button
                    onClick={() => handleSourceChange('tempo')}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <span>🌐</span>
                    <span>Coba Tempo</span>
                  </button>
                </div>
              </div>
            )}
            </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-green-600" />
                  Filter Berita
                </h3>

                {/* Type Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Jenis Berita</h4>
                  <div className="space-y-2">
              <button
                      onClick={() => handleTypeChange('combined')}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentType === 'combined'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                      <BarChart3 className="w-4 h-4" />
                <span>Semua Berita</span>
              </button>
              <button
                      onClick={() => handleTypeChange('internal')}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentType === 'internal'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                      <Building2 className="w-4 h-4" />
                <span>Berita Desa</span>
              </button>
              <button
                      onClick={() => handleTypeChange('external')}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentType === 'external'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Berita Nasional</span>
              </button>
            </div>
          </div>

                {/* Source Filter */}
                {(currentType === 'external' || currentType === 'combined') && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Sumber Berita</h4>
                    <div className="space-y-2">
                <button
                        onClick={() => handleSourceChange('antara')}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentSource === 'antara'
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Antara News</span>
                </button>
                <button
                        onClick={() => handleSourceChange('tempo')}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentSource === 'tempo'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Tempo</span>
                </button>
              </div>
            </div>
          )}

                {/* Search and Category Filter for Internal */}
                {currentType === 'internal' && (
            <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Cari Berita Desa</h4>
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berita desa..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                <button
                  type="submit"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari</span>
                </button>
              </form>

                    {/* Categories */}
              {categories && categories.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h4>
                        <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryChange('')}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === ''
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Semua Kategori
                    </button>
                    {categories.map((category: string) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Statistik</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Berita</span>
                    <span className="text-lg font-bold text-green-600">{beritaData?.length || 0}</span>
          </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sumber Aktif</span>
                    <span className="text-lg font-bold text-blue-600">2</span>
                      </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Kategori</span>
                    <span className="text-lg font-bold text-purple-600">{categories?.length || 0}</span>
                        </div>
                        </div>
                      </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Menu Cepat</h3>
                <div className="space-y-2">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Beranda</span>
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
                    <BarChart3 className="w-4 h-4" />
                    <span>Data Desa</span>
                  </Link>
                  <Link
                    to="/layanan-surat"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Layanan Surat</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filter Berita</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              {/* Mobile filter content - same as sidebar */}
              <div className="space-y-6">
                {/* Type Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Jenis Berita</h4>
                  <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleTypeChange('combined');
                          setShowMobileFilters(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentType === 'combined'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Semua Berita</span>
                      </button>
                      <button
                        onClick={() => {
                          handleTypeChange('internal');
                          setShowMobileFilters(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentType === 'internal'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Berita Desa</span>
                      </button>
                    <button
                        onClick={() => {
                          handleTypeChange('external');
                          setShowMobileFilters(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentType === 'external'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                        <Globe className="w-4 h-4" />
                        <span>Berita Nasional</span>
                    </button>
                  </div>
                </div>

                {/* Source Filter */}
                {(currentType === 'external' || currentType === 'combined') && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Sumber Berita</h4>
                    <div className="space-y-2">
                        <button
                          onClick={() => {
                            handleSourceChange('antara');
                            setShowMobileFilters(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentSource === 'antara'
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Newspaper className="w-4 h-4" />
                          <span>Antara News</span>
                        </button>
                <button
                          onClick={() => {
                            handleSourceChange('tempo');
                            setShowMobileFilters(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentSource === 'tempo'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Globe className="w-4 h-4" />
                          <span>Tempo</span>
                </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
    </div>
  );
};

export default Berita;
