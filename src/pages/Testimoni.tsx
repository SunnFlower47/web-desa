import React, { useState } from 'react';
import { Star, MessageCircle, User, Calendar, Filter } from 'lucide-react';
import { api } from '../services/api';
import { useFrequentData } from '../hooks/useApiCache';
import TestimoniModal from '../components/TestimoniModal';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Testimoni: React.FC = () => {
  useScrollToTop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'rating'>('latest');

  // Get all testimonials without limit
  const { data: testimonials, loading } = useFrequentData(
    () => api.getTestimonials().then(res => ({ success: true, data: res.data || [] }))
  );

  // Get testimonial categories
  const { data: categories } = useFrequentData(
    () => api.getTestimonials().then(res => {
      const cats = Array.from(new Set(res.data?.map((t: any) => t.kategori).filter(Boolean)));
      return { success: true, data: cats };
    })
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter and sort testimonials
  const filteredTestimonials = (testimonials as any[] || [])
    .filter((testimonial: any) =>
      !selectedCategory || testimonial.kategori === selectedCategory
    )
    .sort((a: any, b: any) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: (testimonials as any[])?.length || 0,
    averageRating: (testimonials as any[])?.length > 0
      ? ((testimonials as any[]).reduce((sum: number, t: any) => sum + (t.rating || 0), 0) / (testimonials as any[]).length).toFixed(1)
      : '0.0',
    categories: (categories as string[])?.length || 0
  };

  return (
    <>
      <SEO
        title="Testimoni Warga - Desa Cibatu"
        description="Baca testimoni dan pengalaman warga Desa Cibatu tentang pelayanan dan kehidupan di desa kami."
        keywords="testimoni, pengalaman warga, desa cibatu, pelayanan desa"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                <MessageCircle className="inline-block w-8 h-8 mr-3 text-green-600" />
                Testimoni Warga
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dengarkan pengalaman dan pendapat warga Desa Cibatu tentang pelayanan dan kehidupan di desa kami
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-gray-600">Total Testimoni</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.averageRating}</h3>
              <p className="text-gray-600">Rating Rata-rata</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.categories}</h3>
              <p className="text-gray-600">Kategori</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Semua Kategori</option>
                    {(categories as string[])?.map((category: string) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urutkan
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'latest' | 'rating')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="latest">Terbaru</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Berikan Testimoni</span>
              </button>
            </div>
          </div>

          {/* Testimonials Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.is_anonymous ? 'Warga Anonim' : testimonial.nama}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(testimonial.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {testimonial.rating || 0}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.testimoni}"
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(testimonial.created_at)}</span>
                    </div>
                    {testimonial.kategori && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {testimonial.kategori}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedCategory ? 'Tidak Ada Testimoni' : 'Belum Ada Testimoni'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedCategory
                    ? `Tidak ada testimoni untuk kategori "${selectedCategory}"`
                    : 'Jadilah yang pertama memberikan testimoni tentang Desa Cibatu'
                  }
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Berikan Testimoni</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Testimoni Modal */}
      <TestimoniModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Testimoni;
