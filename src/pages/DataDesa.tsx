import React, { useState } from 'react';
import { Users, Heart, TrendingUp, Calendar, Clock, GraduationCap, Building, MapPin, BarChart3, Briefcase } from 'lucide-react';
import { useStatisticsData, useSemiStaticData } from '../hooks/useApiCache';
import { api } from '../services/api';
import { StatCardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const DataDesa: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const [activeTab, setActiveTab] = useState('penduduk');

  // Menggunakan cache dengan prioritas berbeda
  const { data, loading: statsLoading } = useStatisticsData(
    () => api.getStatistics()
  );

  const { data: umkmData, loading: umkmLoading } = useStatisticsData(
    async () => {
      const response = await api.getUMKM({ per_page: 100 });
      if (response.success && response.data) {
        // API mengembalikan data dalam format pagination
        return { success: true, data: response.data.data || [] };
      }
      return { success: false, data: [] };
    }
  );

  const { data: fasilitasData, loading: fasilitasLoading } = useSemiStaticData(
    async () => {
      const response = await api.getFacilities({ limit: 100 });
      if (response.success && response.data) {
        // API mengembalikan data langsung dalam array
        return { success: true, data: Array.isArray(response.data) ? response.data : [] };
      }
      return { success: false, data: [] };
    }
  );

  // Loading hanya jika data belum ada sama sekali
  const loading = !data && !umkmData && !fasilitasData && (statsLoading || umkmLoading || fasilitasLoading);

  const tabs = [
    { id: 'penduduk', name: 'Penduduk', icon: Users },
    { id: 'umkm', name: 'UMKM', icon: Building },
    { id: 'fasilitas', name: 'Fasilitas', icon: MapPin },
    { id: 'statistik', name: 'Statistik', icon: BarChart3 }
  ];

  const pendudukStats = [
    {
      title: 'Total Penduduk',
      value: data?.total_penduduk?.toLocaleString('id-ID') || '0',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Laki-laki',
      value: data?.laki_laki?.toLocaleString('id-ID') || '0',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Perempuan',
      value: data?.perempuan?.toLocaleString('id-ID') || '0',
      icon: Heart,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      title: 'Usia Produktif',
      value: data?.usia_produktif?.toLocaleString('id-ID') || '0',
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Usia Lansia',
      value: data?.usia_lansia?.toLocaleString('id-ID') || '0',
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const pendidikanStats = [
    { level: 'TAMAT SD/SEDERAJAT', count: data?.pendidikan?.tamat_sd || 977 },
    { level: 'SLTA/SEDERAJAT', count: data?.pendidikan?.slta || 849 },
    { level: 'TIDAK/BLM SEKOLAH', count: data?.pendidikan?.tidak_sekolah || 703 },
    { level: 'SLTP/SEDERAJAT', count: data?.pendidikan?.sltp || 626 },
    { level: 'BELUM TAMAT SD/SEDERAJAT', count: data?.pendidikan?.belum_tamat_sd || 400 }
  ];

  const pekerjaanStats = [
    { job: 'BELUM/TIDAK BEKERJA', count: data?.pekerjaan?.belum_tidak_bekerja || 948 },
    { job: 'MENGURUS RUMAH TANGGA', count: data?.pekerjaan?.mengurus_rumah_tangga || 948 },
    { job: 'PELAJAR/MAHASISWA', count: data?.pekerjaan?.pelajar_mahasiswa || 584 },
    { job: 'KARYAWAN SWASTA', count: data?.pekerjaan?.karyawan_swasta || 561 },
    { job: 'BURUH HARIAN LEPAS', count: data?.pekerjaan?.buruh_harian_lepas || 385 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Data Desa</h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8">Informasi lengkap tentang Desa Cibatu</p>

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
  title="Data Desa Cibatu"
  description="Lihat data lengkap penduduk, UMKM, dan fasilitas Desa Cibatu, Purwakarta. Informasi statistik demografi, ekonomi, dan infrastruktur desa yang terupdate."
  keywords="Data Desa Cibatu, Statistik Penduduk, UMKM Desa, Fasilitas Desa, Demografi Desa, Data Kependudukan Purwakarta"
  url="/data-desa"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Data Desa Cibatu",
    "description": "Dataset lengkap tentang penduduk, UMKM, dan fasilitas Desa Cibatu.",
    "url": "https://pemdescibatu2001.online/data-desa",
    "keywords": [
      "Data Desa Cibatu",
      "Statistik Desa",
      "UMKM Cibatu",
      "Fasilitas Desa Cibatu",
      "Demografi Purwakarta"
    ],
    "inLanguage": "id",
    "dateModified": "2025-10-28T00:00:00+07:00",
    "temporalCoverage": "2024-01-01/2025-12-31",
    "publisher": {
      "@type": "Organization",
      "name": "Desa Cibatu",
      "url": "https://pemdescibatu2001.online"
    },
    "creator": {
      "@type": "Organization",
      "name": "Pemerintah Desa Cibatu",
      "url": "https://pemdescibatu2001.online"
    },
    "license": "https://pemdescibatu2001.online/kebijakan-data",
    "spatialCoverage": {
      "@type": "Place",
      "name": "Desa Cibatu, Purwakarta, Jawa Barat, Indonesia",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-6.5567",
        "longitude": "107.4431"
      }
    },
    "distribution": [
      {
        "@type": "DataDownload",
        "contentUrl": "https://pemdescibatu2001.online/data-desa",
        "encodingFormat": "text/html",
        "name": "Halaman Data Desa Cibatu"
      }
    ],
    "isPartOf": {
      "@type": "WebSite",
      "name": "Portal Resmi Desa Cibatu",
      "url": "https://pemdescibatu2001.online"
    },
    "mainEntityOfPage": "https://pemdescibatu2001.online/data-desa"
  }}
/>


      {/* Hero Section with Background Image - Extended */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Background Image with Green Filter */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/foto-sawah-1.webp)',
            filter: 'hue-rotate(60deg) saturate(1.5) brightness(0.8)'
          }}
        ></div>
        <div className="absolute inset-0 bg-green-600/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Data Desa Cibatu</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Informasi lengkap tentang data kependudukan, UMKM, fasilitas, dan statistik desa
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto mt-8">
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
                <div className="text-sm font-bold leading-tight text-white">{umkmData?.length || 0}</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">UMKM</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">{fasilitasData?.length || 0}</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Fasilitas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Between Background and White Container */}
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
          {activeTab === 'penduduk' && (
          <>
            {/* Data Kependudukan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                Data Kependudukan
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {pendudukStats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                    <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
                ))}
                </div>
              </div>

            {/* Tingkat Pendidikan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
                  Tingkat Pendidikan
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendidikanStats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stat.count.toLocaleString('id-ID')}</div>
                    <div className="text-sm text-gray-600">{stat.level}</div>
                      </div>
                    ))}
                    </div>
                </div>

            {/* Jenis Pekerjaan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 text-green-600 mr-2" />
                Jenis Pekerjaan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pekerjaanStats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stat.count.toLocaleString('id-ID')}</div>
                    <div className="text-sm text-gray-600">{stat.job}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'umkm' && (
          <div className="space-y-6">
            {/* UMKM Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Building className="w-5 h-5 text-green-600 mr-2" />
                Ringkasan UMKM Desa Cibatu
                </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{umkmData?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total UMKM</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Array.isArray(umkmData) ? umkmData.filter((u: any) => u.status_usaha === 'aktif').length : 0}
                  </div>
                  <div className="text-sm text-gray-600">Aktif</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Array.isArray(umkmData) ? umkmData.filter((u: any) => u.is_unggulan).length : 0}
                  </div>
                  <div className="text-sm text-gray-600">Unggulan</div>
                      </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Array.isArray(umkmData) ? umkmData.filter((u: any) => u.is_verified).length : 0}
                    </div>
                  <div className="text-sm text-gray-600">Terverifikasi</div>
                </div>
              </div>
            </div>

            {/* UMKM List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Building className="w-5 h-5 text-green-600 mr-2" />
                Daftar UMKM
              </h3>
              {umkmData && Array.isArray(umkmData) && umkmData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {umkmData.map((umkm: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-lg font-semibold text-gray-900">{umkm.nama_usaha}</div>
                        <div className="flex space-x-1">
                          {umkm.is_unggulan && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Unggulan
                            </span>
                          )}
                          {umkm.is_verified && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium">Pemilik:</span> {umkm.nama_pemilik}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Jenis:</span> {umkm.jenis_usaha}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Alamat:</span> {umkm.alamat_usaha}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">RT/RW:</span> {umkm.rt}/{umkm.rw}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Status:</span>
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            umkm.status_usaha === 'aktif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {umkm.status_usaha}
                          </span>
                        </div>
                        {umkm.no_telepon && (
                          <div className="text-gray-600">
                            <span className="font-medium">Telepon:</span> {umkm.no_telepon}
                          </div>
                        )}
                        </div>
                      </div>
                    ))}
                  </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Data UMKM akan segera tersedia</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'fasilitas' && (
          <div className="space-y-6">
            {/* Fasilitas Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 text-green-600 mr-2" />
                Ringkasan Fasilitas Desa Cibatu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{fasilitasData?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total Fasilitas</div>
                    </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Array.isArray(fasilitasData) ? fasilitasData.filter((f: any) => f.jenis === 'puskesmas').length : 0}
                    </div>
                  <div className="text-sm text-gray-600">Kesehatan</div>
                    </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Array.isArray(fasilitasData) ? fasilitasData.filter((f: any) => f.jenis === 'pendidikan').length : 0}
                  </div>
                  <div className="text-sm text-gray-600">Pendidikan</div>
                </div>
              </div>
            </div>

            {/* Fasilitas List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 text-green-600 mr-2" />
                Daftar Fasilitas
              </h3>
              {fasilitasData && Array.isArray(fasilitasData) && fasilitasData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {fasilitasData.map((fasilitas: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-lg font-semibold text-gray-900">{fasilitas.nama}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          fasilitas.jenis === 'puskesmas'
                            ? 'bg-red-100 text-red-800'
                            : fasilitas.jenis === 'pendidikan'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {fasilitas.jenis}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium">Jenis:</span> {fasilitas.jenis}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Alamat:</span> {fasilitas.alamat}
                        </div>
                        {fasilitas.keterangan && (
                          <div className="text-gray-600">
                            <span className="font-medium">Keterangan:</span> {fasilitas.keterangan}
                          </div>
                        )}
                        {fasilitas.koordinat && (fasilitas.koordinat.lat || fasilitas.koordinat.lng) && (
                          <div className="text-gray-600">
                            <span className="font-medium">Koordinat:</span>
                            {fasilitas.koordinat.lat && fasilitas.koordinat.lng
                              ? ` ${fasilitas.koordinat.lat}, ${fasilitas.koordinat.lng}`
                              : ' Tidak tersedia'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Data fasilitas akan segera tersedia</p>
                </div>
              )}
            </div>
            </div>
          )}

          {activeTab === 'statistik' && (
          <div className="space-y-6">
            {/* Statistik Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                Statistik Umum Desa Cibatu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{data?.total_penduduk?.toLocaleString('id-ID') || '0'}</div>
                  <div className="text-sm text-gray-600">Total Penduduk</div>
                    </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{data?.total_kk?.toLocaleString('id-ID') || '0'}</div>
                  <div className="text-sm text-gray-600">Kartu Keluarga</div>
                    </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{data?.total_rt?.toLocaleString('id-ID') || '0'}</div>
                  <div className="text-sm text-gray-600">RT</div>
                    </div>
                  </div>
                </div>

            {/* Demografi Berdasarkan Usia */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                Demografi Berdasarkan Usia
              </h3>
              {data?.age_groups && data.age_groups.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {data.age_groups.map((group: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xl font-bold text-green-600">{group.total}</div>
                      <div className="text-sm text-gray-600">{group.age_group} tahun</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Data demografi akan segera tersedia</p>
                </div>
              )}
            </div>

            {/* Statistik Layanan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                Statistik Layanan Desa
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{data?.total_berita?.toLocaleString('id-ID') || '0'}</div>
                  <div className="text-sm text-gray-600">Berita</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{data?.total_pengajuan?.toLocaleString('id-ID') || '0'}</div>
                  <div className="text-sm text-gray-600">Pengajuan Surat</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{umkmData?.length || 0}</div>
                  <div className="text-sm text-gray-600">UMKM</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{fasilitasData?.length || 0}</div>
                  <div className="text-sm text-gray-600">Fasilitas</div>
                </div>
              </div>
            </div>

            {/* Statistik Demografi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                Komposisi Demografi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Jenis Kelamin</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Laki-laki</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${data?.laki_laki && data?.total_penduduk ? (data.laki_laki / data.total_penduduk) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-900">{data?.laki_laki?.toLocaleString('id-ID') || '0'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Perempuan</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-pink-600 h-2 rounded-full"
                            style={{
                              width: `${data?.perempuan && data?.total_penduduk ? (data.perempuan / data.total_penduduk) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-900">{data?.perempuan?.toLocaleString('id-ID') || '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Usia Produktif vs Lansia</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Usia Produktif (15-64)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${data?.usia_produktif && data?.total_penduduk ? (data.usia_produktif / data.total_penduduk) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-900">{data?.usia_produktif?.toLocaleString('id-ID') || '0'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Usia Lansia (65+)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{
                              width: `${data?.usia_lansia && data?.total_penduduk ? (data.usia_lansia / data.total_penduduk) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-900">{data?.usia_lansia?.toLocaleString('id-ID') || '0'}</span>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Data Statistik Real-time</h4>
                  <p className="text-gray-700 mb-3">
                    Semua data statistik yang ditampilkan diambil langsung dari sistem database desa
                    dan diperbarui secara real-time. Data ini mencerminkan kondisi terkini desa Cibatu.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      <BarChart3 className="w-3 h-3 inline mr-1" />
                      Data Terkini
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Update Otomatis
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Security Notice */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-blue-600" />
                    </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Perlindungan Data Pribadi</h4>
              <p className="text-gray-700 mb-3">
                Website ini hanya menampilkan data statistik agregat untuk keperluan informasi publik.
                Data pribadi penduduk seperti NIK, nama lengkap, dan alamat detail tidak ditampilkan
                untuk melindungi privasi dan keamanan data warga.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  <Users className="w-3 h-3 inline mr-1" />
                  Data Terlindungi
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Sesuai UU Perlindungan Data Pribadi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDesa;
