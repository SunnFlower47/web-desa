import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Phone, ArrowRight, Building, Home, File, User, Heart, PlusCircle } from 'lucide-react';
import { api } from '../services/api';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const LayananSurat: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const [suratTypes, setSuratTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuratTypes = async () => {
      try {
        const response = await api.getSuratTypes();
        setSuratTypes(response.data || []);
      } catch (error) {
        console.error('Error fetching surat types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuratTypes();
  }, []);

  const getIconForSuratType = (id: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'sku': <Building className="w-6 h-6" />,
      'keterangan-domisili': <Home className="w-6 h-6" />,
      'pengantar': <File className="w-6 h-6" />,
      'pindah': <User className="w-6 h-6" />,
      'kematian': <User className="w-6 h-6" />,
      'kelahiran': <User className="w-6 h-6" />,
      'sktm_dewasa': <Heart className="w-6 h-6" />,
      'sktm_anak': <Heart className="w-6 h-6" />
    };
    return iconMap[id] || <FileText className="w-6 h-6" />;
  };

  const getColorForSuratType = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'green': 'text-green-600 bg-green-100',
      'blue': 'text-blue-600 bg-blue-100',
      'red': 'text-red-600 bg-red-100',
      'purple': 'text-purple-600 bg-purple-100',
      'indigo': 'text-indigo-600 bg-indigo-100',
      'gray': 'text-gray-600 bg-gray-100'
    };
    return colorMap[color] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Layanan Surat Desa Cibatu"
        description="Ajukan surat keterangan online di Desa Cibatu, Purwakarta. Layanan surat SKU, SKTM, Domisili, dan surat keterangan lainnya dengan proses cepat dan mudah."
        keywords="Layanan Surat Desa, Pengajuan Surat Online, SKU Desa, SKTM Desa, Surat Domisili, Surat Keterangan Desa, Layanan Administrasi Desa"
        url="/layanan-surat"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Layanan Surat Desa Cibatu",
          "description": "Layanan pengajuan surat keterangan online di Desa Cibatu",
          "url": "https://pemdescibatu2001.online/layanan-surat",
          "provider": {
            "@type": "GovernmentOrganization",
            "name": "Desa Cibatu"
          },
          "serviceType": "Administrative Service",
          "areaServed": {
            "@type": "Place",
            "name": "Desa Cibatu, Purwakarta"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "IDR",
            "description": "Layanan gratis untuk warga Desa Cibatu"
          }
        }}
      />
      {/* Hero Section with Background Image - Extended */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Background Image with Green Filter */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/foto-sawah-4.webp)',
            filter: 'hue-rotate(60deg) saturate(1.5) brightness(0.8)'
          }}
        ></div>
        <div className="absolute inset-0 bg-green-600/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Layanan Surat Desa</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Ajukan surat administrasi desa secara online dengan mudah dan terpercaya
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">{suratTypes.length || 7}</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Jenis Surat</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">Senin-Jumat</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Jam Kerja</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">100%</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Gratis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards - Overlapping */}
      <div className="relative -mt-16 z-10 px-4">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {/* Ajukan Surat Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ajukan Surat</h3>
                <p className="text-gray-600 mb-6">
                  Ajukan surat administrasi secara online dengan mudah
                </p>
                    <Link
                      to="/pengajuan-surat"
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Mulai Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
              </div>
            </div>

            {/* Cek Status Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cek Status</h3>
                <p className="text-gray-600 mb-6">
                  Pantau status pengajuan surat Anda secara real-time
                </p>
                    <Link
                      to="/status-surat"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Cek Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
              </div>
            </div>

            {/* Bantuan Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bantuan</h3>
                <p className="text-gray-600 mb-6">
                  Hubungi kami untuk bantuan dan informasi lebih lanjut
                </p>
                    <Link
                      to="/kontak"
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Hubungi Kami</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-16 z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Jenis Surat yang Tersedia */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Jenis Surat yang Tersedia
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pilih jenis surat yang Anda butuhkan dan lihat persyaratan yang diperlukan
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                {/* Section 1: Template-based */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Layanan Surat Umum
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suratTypes.filter(s => s.category !== 'Lainnya').map((surat) => (
                      <div key={surat.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorForSuratType(surat.color)}`}>
                            {getIconForSuratType(surat.id)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{surat.name}</h3>
                            <p className="text-sm text-gray-600">{surat.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <Link
                            to="/pengajuan-surat"
                            className="flex items-center text-sm text-green-600 font-bold hover:text-green-700 transition-colors"
                          >
                            <span>Ajukan Sekarang</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Other Letters */}
                {suratTypes.some(s => s.category === 'Lainnya') && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <PlusCircle className="w-5 h-5 mr-2 text-orange-600" />
                      Surat Lainnya
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {suratTypes.filter(s => s.category === 'Lainnya').map((surat) => (
                        <div key={surat.id} className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow border-2 border-dashed border-gray-200 flex flex-col h-full">
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{surat.name}</h3>
                              <p className="text-sm text-gray-600">{surat.description || 'Proses manual oleh admin'}</p>
                            </div>
                          </div>
                          
                          {surat.persyaratan && (
                            <div className="mt-auto pt-4 border-t border-gray-200 mb-4">
                              <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Persyaratan:</h4>
                              <p className="text-xs text-gray-500 whitespace-pre-line italic">
                                {surat.persyaratan}
                              </p>
                            </div>
                          )}
                          
                          <div>
                            <Link
                              to="/pengajuan-surat"
                              className="flex items-center text-sm text-orange-600 font-bold hover:text-orange-700 transition-colors"
                            >
                              <span>Ajukan Sekarang</span>
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default LayananSurat;
