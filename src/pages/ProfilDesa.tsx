import React, { useState } from 'react';
import { MapPin, Users, Building, Calendar, Clock, Award, Target, Eye, Users2, FileText, Phone, Mail, Globe } from 'lucide-react';
import { useStatisticsData, useSemiStaticData, useStaticData } from '../hooks/useApiCache';
import { api } from '../services/api';
import { StatCardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ProfilDesa: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const [activeTab, setActiveTab] = useState('tentang');

  // Menggunakan cache dengan prioritas berbeda
  const { data, loading: statsLoading } = useStatisticsData(
    () => api.getStatistics()
  );

  const { data: desaInfo, loading: desaLoading } = useSemiStaticData(
    () => api.getDesaInfo()
  );

  const { data: strukturDesaGrouped, loading: strukturLoading } = useStaticData(
    async () => {
      const response = await api.getStrukturDesa();
      if (response.success && response.grouped) {
        // API mengembalikan grouped data di level root
        return { success: true, data: response.grouped || {} };
      }
      return { success: false, data: {} };
    }
  );

  // Loading hanya jika data belum ada sama sekali
  const loading = !data && !desaInfo && !strukturDesaGrouped && (statsLoading || desaLoading || strukturLoading);

  const tabs = [
    { id: 'tentang', name: 'Tentang Desa', icon: Building },
    { id: 'sejarah', name: 'Sejarah', icon: Calendar },
    { id: 'visi-misi', name: 'Visi & Misi', icon: Target },
    { id: 'struktur', name: 'Struktur Organisasi', icon: Users2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Profil Desa</h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8">Mengenal lebih dekat Desa Cibatu</p>

              {/* Summary Cards Skeleton */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto mt-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <StatCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <TableSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Profil Desa Cibatu"
        description="Pelajari sejarah, visi misi, dan struktur organisasi Desa Cibatu, Purwakarta. Informasi lengkap tentang pemerintahan desa, geografis, dan perkembangan desa."
        keywords="Profil Desa Cibatu, Sejarah Desa, Visi Misi Desa, Struktur Organisasi Desa, Pemerintahan Desa Cibatu, Geografis Desa"
        url="/profil-desa"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "GovernmentOrganization",
          "name": "Pemerintah Desa Cibatu",
          "description": "Profil lengkap Desa Cibatu termasuk sejarah, visi misi, dan struktur organisasi",
          "url": "https://pemdescibatu2001.online/profil-desa",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Desa Cibatu",
            "addressLocality": "Cibatu",
            "addressRegion": "Purwakarta",
            "addressCountry": "ID"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Indonesian"
          }
        }}
      />
      {/* Hero Section with Background Image */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Background Image with Green Filter */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/foto-sawah-5.webp)',
            filter: 'hue-rotate(60deg) saturate(1.5) brightness(0.8)'
          }}
        ></div>
        <div className="absolute inset-0 bg-green-600/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Profil Desa Cibatu</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Mengenal lebih dekat tentang Desa Cibatu, sejarah, visi misi, dan struktur organisasinya
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">Kec. Cibatu</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Lokasi</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">{data?.total_penduduk?.toLocaleString('id-ID') || '0'}</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Penduduk</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">Jawa Barat</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Provinsi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative -mt-16 z-10 px-4">
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 md:p-4 w-full max-w-5xl">
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:flex md:space-x-4 lg:space-x-6 gap-2 md:gap-0 w-full md:w-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center space-y-2 py-4 px-2 md:px-4 lg:px-6 rounded-lg font-medium text-sm transition-colors min-h-[80px] w-full md:w-[140px] lg:w-[160px] ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-center leading-tight text-xs md:text-sm">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-8 relative z-0">

        {/* Tentang Desa */}
        {activeTab === 'tentang' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Building className="w-5 h-5 text-green-600 mr-2" />
                Tentang Desa Cibatu
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  Desa Cibatu adalah sebuah desa yang terletak di Kecamatan Cibatu, Kabupaten Purwakarta,
                  Provinsi Jawa Barat. Desa ini memiliki luas wilayah yang cukup luas dengan topografi yang
                  bervariasi dari dataran rendah hingga perbukitan.
                </p>
                <p className="text-gray-700 mb-4">
                  Desa Cibatu dikenal sebagai desa yang memiliki potensi pertanian yang cukup baik,
                  terutama dalam bidang pertanian padi dan sayuran. Selain itu, desa ini juga memiliki
                  potensi wisata alam yang menarik dengan pemandangan sawah terasering yang indah.
                </p>
                <p className="text-gray-700">
                  Masyarakat Desa Cibatu dikenal sebagai masyarakat yang ramah, gotong royong, dan
                  memiliki semangat kebersamaan yang tinggi dalam membangun desa mereka.
                </p>
              </div>
            </div>

            {/* Informasi Umum */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 text-green-600 mr-2" />
                Informasi Umum Desa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Alamat Lengkap</div>
                      <div className="text-sm text-gray-600">
                        {desaInfo?.desa?.alamat_lengkap || 'Jl. Cibatu Km. 15, Desa Cibatu, Kec. Cibatu, Kab. Purwakarta, Cibatu, Purwakarta, Jawa Barat 41161'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Lokasi Administratif</div>
                      <div className="text-sm text-gray-600">
                        {desaInfo?.desa ? `${desaInfo.desa.kecamatan}, ${desaInfo.desa.kabupaten}, ${desaInfo.desa.provinsi}` : 'Kec. Cibatu, Kab. Purwakarta, Jawa Barat'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Jumlah Penduduk</div>
                      <div className="text-sm text-gray-600">{data?.total_penduduk?.toLocaleString('id-ID') || '0'} jiwa</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Jumlah KK</div>
                      <div className="text-sm text-gray-600">{data?.total_kk?.toLocaleString('id-ID') || '0'} keluarga</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Hari Kerja</div>
                      <div className="text-sm text-gray-600">Senin - Jumat</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Jam Kerja</div>
                      <div className="text-sm text-gray-600">08:00 - 16:00 WIB</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Telepon</div>
                      <div className="text-sm text-gray-600">
                        {desaInfo?.desa?.telepon || '0+62 838-7982-7147'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-sm text-gray-600">
                        {desaInfo?.desa?.email || 'desacibatu.2001@gmail.com'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Website</div>
                      <div className="text-sm text-gray-600">
                        {desaInfo?.desa?.website || 'https://desa-cibatu.id'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Kode Pos</div>
                      <div className="text-sm text-gray-600">
                        {desaInfo?.desa?.kode_pos || '41161'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sejarah Desa */}
        {activeTab === 'sejarah' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                Sejarah Desa Cibatu
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  Desa Cibatu memiliki sejarah yang panjang dan kaya akan nilai-nilai budaya.
                  Nama "Cibatu" sendiri berasal dari kata "Ci" yang berarti air dan "Batu" yang
                  berarti batu, yang menggambarkan kondisi geografis desa yang memiliki sumber air
                  dan bebatuan.
                </p>
                <p className="text-gray-700 mb-4">
                  Pada masa kolonial Belanda, Desa Cibatu merupakan salah satu wilayah yang
                  memiliki potensi pertanian yang besar. Masyarakat desa pada saat itu sudah
                  mengenal sistem pertanian yang terorganisir dengan baik.
                </p>
                <p className="text-gray-700 mb-4">
                  Setelah kemerdekaan Indonesia, Desa Cibatu terus berkembang menjadi desa yang
                  mandiri dengan berbagai program pembangunan yang dilaksanakan oleh pemerintah
                  dan masyarakat setempat.
                </p>
                <p className="text-gray-700">
                  Hingga saat ini, Desa Cibatu terus berupaya untuk meningkatkan kesejahteraan
                  masyarakatnya melalui berbagai program pembangunan yang berkelanjutan.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                Timeline Perkembangan Desa
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-gray-900">1945 - Kemerdekaan Indonesia</div>
                    <div className="text-sm text-gray-600">Desa Cibatu menjadi bagian dari Republik Indonesia</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-gray-900">1960-an - Pembangunan Infrastruktur</div>
                    <div className="text-sm text-gray-600">Pembangunan jalan dan infrastruktur dasar desa</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-gray-900">1980-an - Modernisasi Pertanian</div>
                    <div className="text-sm text-gray-600">Pengenalan teknologi pertanian modern</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-gray-900">2000-an - Era Digital</div>
                    <div className="text-sm text-gray-600">Pengenalan teknologi informasi dan komunikasi</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-gray-900">2020-an - Desa Digital</div>
                    <div className="text-sm text-gray-600">Transformasi menuju desa digital terdepan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visi & Misi */}
        {activeTab === 'visi-misi' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                Visi Desa Cibatu
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Visi</h4>
                    <p className="text-gray-700 text-lg">
                      "Terwujudnya Desa Cibatu yang Maju, Mandiri, dan Berkelanjutan dengan
                      Masyarakat yang Sejahtera, Berbudaya, dan Berdaya Saing"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                Misi Desa Cibatu
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Meningkatkan Kualitas Sumber Daya Manusia</h4>
                    <p className="text-gray-700 text-sm">
                      Melalui pendidikan, pelatihan, dan pengembangan keterampilan masyarakat
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Mengembangkan Ekonomi Kerakyatan</h4>
                    <p className="text-gray-700 text-sm">
                      Melalui pemberdayaan UMKM, pertanian, dan sektor produktif lainnya
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Memperkuat Infrastruktur Desa</h4>
                    <p className="text-gray-700 text-sm">
                      Melalui pembangunan jalan, jembatan, dan fasilitas umum yang memadai
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Melestarikan Budaya dan Lingkungan</h4>
                    <p className="text-gray-700 text-sm">
                      Melalui pelestarian adat istiadat dan pengelolaan lingkungan yang berkelanjutan
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Meningkatkan Pelayanan Publik</h4>
                    <p className="text-gray-700 text-sm">
                      Melalui digitalisasi dan peningkatan kualitas pelayanan kepada masyarakat
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Struktur Organisasi */}
        {activeTab === 'struktur' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users2 className="w-5 h-5 text-green-600 mr-2" />
                Struktur Organisasi Pemerintah Desa Cibatu
              </h3>

              {strukturLoading ? (
                <div className="space-y-6">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : strukturDesaGrouped && Object.keys(strukturDesaGrouped).length > 0 ? (
                <div className="space-y-8">
                  {/* Kepala Desa */}
                  {(strukturDesaGrouped.kepala_desa || []).map((item: any) => (
                    <div key={item.id} className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-green-200 shadow-lg">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="relative flex items-start space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Award className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-2xl font-bold text-gray-900">{item.nama}</h4>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              Kepala Desa
                            </span>
                          </div>
                          <p className="text-lg text-gray-700 mb-4">{item.jabatan}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">HP: {item.no_hp}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">Email: {item.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">RT {item.rt}/RW {item.rw}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">Dusun: {item.dusun}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Sekretaris */}
                  {(strukturDesaGrouped.sekretaris || []).map((item: any) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-xl font-bold text-gray-900">{item.nama}</h4>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              Sekretaris
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{item.jabatan}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>HP: {item.no_hp}</span>
                            <span>RT {item.rt}/RW {item.rw}</span>
                            <span>Dusun: {item.dusun}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Kepala Urusan */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 text-purple-600 mr-2" />
                      Kepala Urusan & Staf
                    </h3>

                    {/* Kasi Pemerintahan */}
                    {strukturDesaGrouped.kasi_pemerintahan && strukturDesaGrouped.kasi_pemerintahan.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800 flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Kasi Pemerintahan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(strukturDesaGrouped.kasi_pemerintahan || []).map((item: any) => (
                            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">{item.nama}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{item.jabatan}</p>
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</p>
                                    <p className="text-xs text-gray-500">Dusun: {item.dusun}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Kasi Kesejahteraan */}
                    {strukturDesaGrouped.kasi_kesejahteraan && strukturDesaGrouped.kasi_kesejahteraan.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Kasi Kesejahteraan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(strukturDesaGrouped.kasi_kesejahteraan || []).map((item: any) => (
                            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">{item.nama}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{item.jabatan}</p>
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</p>
                                    <p className="text-xs text-gray-500">Dusun: {item.dusun}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Kasi Pelayanan */}
                    {strukturDesaGrouped.kasi_pelayanan && strukturDesaGrouped.kasi_pelayanan.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Kasi Pelayanan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(strukturDesaGrouped.kasi_pelayanan || []).map((item: any) => (
                            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">{item.nama}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{item.jabatan}</p>
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</p>
                                    <p className="text-xs text-gray-500">Dusun: {item.dusun}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* KAUR */}
                    {strukturDesaGrouped.staf_kaur && strukturDesaGrouped.staf_kaur.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800 flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          KAUR
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(strukturDesaGrouped.staf_kaur || []).map((item: any) => (
                            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">{item.nama}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{item.jabatan}</p>
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</p>
                                    <p className="text-xs text-gray-500">Dusun: {item.dusun}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Kepala Dusun */}
                  {strukturDesaGrouped.kepala_dusun && strukturDesaGrouped.kepala_dusun.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Building className="w-5 h-5 text-orange-600 mr-2" />
                        Kepala Dusun
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(strukturDesaGrouped.kepala_dusun || []).map((item: any) => (
                          <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{item.nama}</h4>
                                <p className="text-sm text-gray-600 mb-2">{item.jabatan}</p>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-500">Dusun: {item.dusun}</p>
                                  <p className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ketua RT */}
                  {strukturDesaGrouped.ketua_rt && strukturDesaGrouped.ketua_rt.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users2 className="w-5 h-5 text-blue-600 mr-2" />
                        Ketua RT
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(strukturDesaGrouped.ketua_rt || []).map((item: any) => (
                          <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users2 className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{item.nama}</h4>
                                <p className="text-sm text-gray-600 mb-2">{item.jabatan}</p>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-500">Dusun: {item.dusun}</p>
                                  <p className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</p>
                                  {item.no_hp && <p className="text-xs text-gray-500">HP: {item.no_hp}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ketua RW */}
                  {strukturDesaGrouped.ketua_rw && strukturDesaGrouped.ketua_rw.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users2 className="w-5 h-5 text-purple-600 mr-2" />
                        Ketua RW
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(strukturDesaGrouped.ketua_rw || []).map((item: any) => (
                          <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users2 className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{item.nama}</h4>
                                <p className="text-sm text-gray-600 mb-2">{item.jabatan}</p>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-500">Dusun: {item.dusun}</p>
                                  <p className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</p>
                                  {item.no_hp && <p className="text-xs text-gray-500">HP: {item.no_hp}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback jika tidak ada data RT/RW */}
                  {(!strukturDesaGrouped.ketua_rt || strukturDesaGrouped.ketua_rt.length === 0) &&
                   (!strukturDesaGrouped.ketua_rw || strukturDesaGrouped.ketua_rw.length === 0) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users2 className="w-5 h-5 text-blue-600 mr-2" />
                        Struktur RT/RW
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <div className="text-center py-8">
                          <Users2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">Data RT/RW Belum Tersedia</h4>
                          <p className="text-gray-500 max-w-md mx-auto">Data ketua RT dan RW akan segera diisi oleh admin. Silakan hubungi kantor desa untuk informasi lebih lanjut.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BUMDes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Building className="w-5 h-5 text-green-600 mr-2" />
                      Badan Usaha Milik Desa (BUMDes)
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <div className="text-center py-8">
                        <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">BUMDes Belum Dibentuk</h4>
                        <p className="text-gray-500 max-w-md mx-auto">Badan Usaha Milik Desa (BUMDes) "Cibatu Mandiri" sedang dalam proses pembentukan. Informasi lebih lanjut akan diumumkan kemudian.</p>
                      </div>
                    </div>
                  </div>

                  {/* BPD */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users2 className="w-5 h-5 text-indigo-600 mr-2" />
                      Badan Permusyawaratan Desa (BPD)
                    </h3>
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Users2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">Badan Permusyawaratan Desa</h4>
                          <p className="text-gray-600">Lembaga perwakilan masyarakat desa</p>
                          <p className="text-sm text-gray-500 mt-2">BPD berfungsi sebagai lembaga legislatif di tingkat desa yang mewakili kepentingan masyarakat dalam pengambilan keputusan pembangunan desa.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users2 className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Struktur Organisasi</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Data struktur organisasi pemerintah desa akan segera tersedia. Silakan hubungi admin untuk informasi lebih lanjut.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilDesa;
