import React, { useState, useEffect } from 'react';
import ParallaxSlider from '../components/ParallaxSlider';
import TestimoniSlider from '../components/TestimoniSlider';
import TestimoniModal from '../components/TestimoniModal';
import LazyImage from '../components/LazyImage';
import LoadingState from '../components/LoadingState';
import SEO from '../components/SEO';
import { api } from '../services/api';
import { useStatisticsData, useFrequentData } from '../hooks/useApiCache';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Home: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  // State untuk modal testimoni
  const [isTestimoniModalOpen, setIsTestimoniModalOpen] = useState(false);

  // Menggunakan cache hook untuk statistics
  const { data: statistics } = useStatisticsData(
    () => api.getStatistics()
  );

  // Menggunakan cache hook untuk news
  const { data: news } = useFrequentData(
    () => api.getNewsCombined({ internal_limit: 2, external_limit: 1 }).then(res => ({ success: true, data: res.data || [] }))
  );

  // Menggunakan cache hook untuk testimonials
  const { data: testimonials } = useStatisticsData(
    () => api.getTestimonials({ limit: 5 }).then(res => ({ success: true, data: res.data || [] }))
  );

  // Parallax slider slides data
  const [slides, setSlides] = useState([
    {
      id: 1,
      image: '/foto-sawah-1.webp',
      badge: 'Desa Digital Terdepan 2024',
      badgeIcon: 'fas fa-shield-alt',
      title: 'Selamat Datang di Desa Cibatu',
      subtitle: 'Desa Maju, Mandiri, dan Sejahtera',
      description: 'Selamat datang di website resmi Desa Cibatu. Mari bersama-sama membangun desa yang lebih baik untuk masa depan yang cerah.',
      buttonText: 'Jelajahi Desa',
      buttonLink: '/profil-desa',
      stats: [
        { value: '3,917', label: 'Jiwa', color: 'text-green-400' },
        { value: '1,410', label: 'KK', color: 'text-blue-400' },
        { value: '10', label: 'RT', color: 'text-purple-400' }
      ],
      cards: [
        {
          icon: 'fas fa-home',
          title: 'Desa Cibatu',
          description: 'Desa yang terletak di Kecamatan Cibatu, Kabupaten Purwakarta'
        },
        {
          icon: 'fas fa-heart',
          title: 'Gotong Royong',
          description: 'Membangun desa dengan semangat gotong royong dan kebersamaan'
        }
      ]
    },
    {
      id: 2,
      image: '/foto-sawah-2.webp',
      badge: 'Layanan Digital',
      badgeIcon: 'fas fa-laptop',
      title: 'Layanan Administrasi Online',
      subtitle: 'Cepat, Mudah, Transparan',
      description: 'Pengajuan surat keterangan, domisili, dan layanan lainnya secara online tanpa ribet.',
      buttonText: 'Ajukan Surat Online',
      buttonLink: '/layanan-surat',
      stats: [
        { value: '3,917', label: 'Jiwa', color: 'text-green-400' },
        { value: '1,410', label: 'KK', color: 'text-blue-400' },
        { value: '10', label: 'RT', color: 'text-purple-400' }
      ],
      cards: [
        {
          icon: 'fas fa-users-cog',
          title: 'Smart Governance',
          description: 'Sistem pemerintahan digital yang transparan dan efisien'
        },
        {
          icon: 'fas fa-map-marker-alt',
          title: 'Digital Ecosystem',
          description: 'Ekosistem digital terintegrasi untuk semua kebutuhan warga'
        }
      ]
    },
    {
      id: 3,
      image: '/foto-sawah-2.webp',
      badge: 'Inovasi Desa',
      badgeIcon: 'fas fa-lightbulb',
      title: 'Pembangunan Berkelanjutan',
      subtitle: 'Masa Depan Cerah',
      description: 'Komitmen membangun desa yang maju, mandiri, dan sejahtera untuk generasi mendatang.',
      buttonText: 'Pelajari Lebih Lanjut',
      buttonLink: '/profil-desa',
      stats: [
        { value: '3,917', label: 'Jiwa', color: 'text-green-400' },
        { value: '1,410', label: 'KK', color: 'text-blue-400' },
        { value: '10', label: 'RT', color: 'text-purple-400' }
      ],
      cards: [
        {
          icon: 'fas fa-chart-line',
          title: 'Real-time Monitoring',
          description: 'Pantau perkembangan proyek dan penggunaan anggaran secara real-time'
        },
        {
          icon: 'fas fa-file-invoice-dollar',
          title: 'Akuntabilitas Publik',
          description: 'Setiap rupiah anggaran dapat dipertanggungjawabkan kepada masyarakat'
        }
      ]
    },
    {
      id: 4,
      image: '/foto-sawah-5.webp',
      badge: 'Pelayanan Prima',
      badgeIcon: 'fas fa-star',
      title: 'Berita dan Informasi Terkini',
      subtitle: 'Update Terbaru Desa',
      description: 'Dapatkan informasi terbaru seputar kegiatan, pembangunan, dan program desa.',
      buttonText: 'Lihat Berita',
      buttonLink: '/berita',
      stats: [
        { value: '3,917', label: 'Jiwa', color: 'text-green-400' },
        { value: '1,410', label: 'KK', color: 'text-blue-400' },
        { value: '10', label: 'RT', color: 'text-purple-400' }
      ],
      cards: [
        {
          icon: 'fas fa-newspaper',
          title: 'Berita Terkini',
          description: 'Informasi terbaru tentang kegiatan dan program desa'
        },
        {
          icon: 'fas fa-bullhorn',
          title: 'Pengumuman',
          description: 'Pengumuman penting untuk seluruh warga Desa Cibatu'
        }
      ]
    }
  ]);

  // Update slides dengan data dari cache
  useEffect(() => {
    if (statistics) {
      setSlides(prevSlides => prevSlides.map(slide => ({
        ...slide,
        stats: [
          { value: `${statistics.total_penduduk?.toLocaleString('id-ID') || '0'}`, label: 'Jiwa', color: 'text-green-400' },
          { value: `${statistics.total_kk?.toLocaleString('id-ID') || '0'}`, label: 'KK', color: 'text-blue-400' },
          { value: `${statistics.total_rt || '0'}`, label: 'RT', color: 'text-purple-400' }
        ]
      })));
    }
  }, [statistics]);


  const quickAccessItems = [
    {
      icon: 'fas fa-file-alt',
      title: 'Cetak Surat',
      description: 'SKU, SKTM, Domisili, dll',
      link: '/layanan-surat',
      bgColor: 'bg-green-500',
      iconColor: 'bg-green-600'
    },
    {
      icon: 'fas fa-exclamation-triangle',
      title: 'Pengaduan',
      description: 'Laporkan masalah desa',
      link: '/pengaduan',
      bgColor: 'bg-orange-500',
      iconColor: 'bg-orange-600'
    },
    {
      icon: 'fas fa-gift',
      title: 'Bantuan Sosial',
      description: 'BLT, PKH, BPNT',
      link: '/bantuan-sosial',
      bgColor: 'bg-blue-500',
      iconColor: 'bg-blue-600'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Peta Desa',
      description: 'Lokasi & fasilitas',
      link: '/peta-desa',
      bgColor: 'bg-purple-500',
      iconColor: 'bg-purple-600'
    },
    {
      icon: 'fas fa-phone',
      title: 'Kontak Desa',
      description: 'Hubungi perangkat desa',
      link: '/kontak',
      bgColor: 'bg-red-500',
      iconColor: 'bg-red-600'
    }
  ];

  return (
    <>
      <SEO
        title="Beranda - Desa Cibatu"
        description="Selamat datang di website resmi Desa Cibatu, Purwakarta. Portal informasi desa dengan layanan surat online, data penduduk, transparansi keuangan, dan berita terbaru."
        keywords="Desa Cibatu, Purwakarta, Beranda, Layanan Desa, Informasi Desa, Pemerintahan Desa"
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Website Resmi Desa Cibatu",
          "url": "https://pemdescibatu2001.online/",
          "description": "Portal informasi desa dengan layanan surat online, data penduduk, transparansi keuangan, dan berita terbaru",
          "publisher": {
            "@type": "GovernmentOrganization",
            "name": "Desa Cibatu"
          }
        }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Parallax Slider */}
      <ParallaxSlider
        slides={slides}
        autoPlay={true}
        autoPlayInterval={6000}
        showDots={true}
        showArrows={true}
      />

      {/* Quick Access */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Akses Cepat Layanan
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Layanan desa yang mudah dan cepat diakses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {quickAccessItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 ${item.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${item.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <a
                  href={item.link}
                  className={`btn-mobile inline-block ${item.bgColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  Akses
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Desa Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Tentang Desa Cibatu</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Desa Cibatu adalah desa yang terletak di Kecamatan Cibatu, Kabupaten Purwakarta, Provinsi Jawa Barat.
              Didirikan pada tahun 1860 dengan kepala desa pertama Ki Arpan, desa ini berkembang dari daerah agraris
              menjadi sentra industri dengan keragaman penduduk yang tinggi dari berbagai suku dan budaya.
            </p>
          </div>

          {/* Key Principles Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Masyarakat Sejahtera</h3>
              <p className="text-gray-600">
                Meningkatkan kesejahteraan masyarakat melalui program-program unggulan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bullseye text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visi Masa Depan</h3>
              <p className="text-gray-600">
                Menjadi desa yang maju, mandiri, dan berkelanjutan di tahun 2030
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gotong Royong</h3>
              <p className="text-gray-600">
                Mempertahankan nilai-nilai kebersamaan dan gotong royong
              </p>
            </div>
          </div>

          {/* Vision & Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-green-50 rounded-xl p-8 border border-green-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-bullseye text-green-600 text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Visi</h3>
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed italic">
                "Terwujudnya Desa Cibatu yang maju, mandiri, sejahtera, dan berkelanjutan melalui peningkatan kualitas sumber daya manusia, pengembangan ekonomi kerakyatan, dan pelestarian lingkungan hidup."
              </blockquote>
            </div>

            {/* Mission */}
            <div className="bg-green-50 rounded-xl p-8 border border-green-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-heart text-green-600 text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Misi</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                  <span className="text-gray-700">
                    Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                  <span className="text-gray-700">
                    Mengembangkan ekonomi kerakyatan berbasis potensi lokal
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                  <span className="text-gray-700">
                    Meningkatkan kualitas pendidikan dan kesehatan masyarakat
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                  <span className="text-gray-700">
                    Melestarikan nilai-nilai budaya dan gotong royong
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Desa Section */}
      <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
            <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Sejarah & Perkembangan Desa</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Dari daerah agraris hingga menjadi sentra industri modern, Desa Cibatu memiliki sejarah panjang yang membentuk identitasnya saat ini.
            </p>
          </div>

          {/* Timeline Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Timeline Sejarah</h3>

            {/* Desktop Timeline */}
            <div className="hidden lg:block relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 to-blue-500"></div>

              {/* Timeline Events */}
              <div className="space-y-12">
                {/* 1860 - Pendirian Desa */}
                <div className="flex items-center flex-row">
                  <div className="w-5/12 pr-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-book text-white text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-green-500 mb-2">1860</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Pendirian Desa</h4>
                          <p className="text-gray-600 leading-relaxed">Desa Cibatu didirikan dengan kepala desa pertama Ki Arpan. Pada masa ini, desa masih berupa daerah agraris dengan mayoritas penduduk bekerja sebagai petani.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </div>

                {/* 1860-1880 - Era Ki Arpan */}
                <div className="flex items-center flex-row-reverse">
                  <div className="w-5/12 pl-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-users text-white text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-blue-500 mb-2">1860-1880</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Era Ki Arpan</h4>
                          <p className="text-gray-600 leading-relaxed">Masa kepemimpinan Ki Arpan yang membangun fondasi pemerintahan desa dan mengembangkan sistem gotong royong di masyarakat.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </div>

                {/* Awal 1900 - Perkembangan Pertanian */}
                <div className="flex items-center flex-row">
                  <div className="w-5/12 pr-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-seedling text-white text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-purple-500 mb-2">Awal 1900</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Perkembangan Pertanian</h4>
                          <p className="text-gray-600 leading-relaxed">Desa mengalami perkembangan pesat di sektor pertanian dengan pengenalan teknologi pertanian modern dan sistem irigasi yang lebih baik.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </div>

                {/* 2007 - Modernisasi */}
                <div className="flex items-center flex-row-reverse">
                  <div className="w-5/12 pl-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-road text-white text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-yellow-500 mb-2">2007</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Modernisasi</h4>
                          <p className="text-gray-600 leading-relaxed">Dimulainya era modernisasi dengan pembangunan infrastruktur jalan, listrik, dan telekomunikasi yang menghubungkan desa dengan kota.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </div>

                {/* Sekarang - Sentra Industri */}
                <div className="flex items-center flex-row">
                  <div className="w-5/12 pr-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-industry text-white text-lg"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-red-500 mb-2">Sekarang</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Sentra Industri</h4>
                          <p className="text-gray-600 leading-relaxed">Desa Cibatu kini berkembang menjadi sentra industri dengan berbagai perusahaan yang memberikan lapangan kerja bagi masyarakat.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </div>
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="lg:hidden">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 w-1 h-full bg-gradient-to-b from-green-400 to-blue-500"></div>

                {/* Timeline Events */}
                <div className="space-y-8">
                  {/* 1860 */}
                  <div className="relative pl-16">
                    <div className="absolute left-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-book text-white text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold text-green-500 mb-1">1860</div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Pendirian Desa</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">Desa Cibatu didirikan dengan kepala desa pertama Ki Arpan.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1860-1880 */}
                  <div className="relative pl-16">
                    <div className="absolute left-4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-users text-white text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold text-blue-500 mb-1">1860-1880</div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Era Ki Arpan</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">Masa kepemimpinan Ki Arpan yang membangun fondasi pemerintahan desa.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Awal 1900 */}
                  <div className="relative pl-16">
                    <div className="absolute left-4 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-seedling text-white text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold text-purple-500 mb-1">Awal 1900</div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Perkembangan Pertanian</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">Perkembangan pesat di sektor pertanian dengan teknologi modern.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2007 */}
                  <div className="relative pl-16">
                    <div className="absolute left-4 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-road text-white text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold text-yellow-500 mb-1">2007</div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Modernisasi</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">Era modernisasi dengan pembangunan infrastruktur.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sekarang */}
                  <div className="relative pl-16">
                    <div className="absolute left-4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-industry text-white text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold text-red-500 mb-1">Sekarang</div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Sentra Industri</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">Berkembang menjadi sentra industri modern.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asal Usul Nama Section */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Asal Usul Nama "Cibatu"</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Nama "Cibatu" berasal dari sungai kecil yang mengalir di wilayah desa yang bernama "Cibatu Kolot".
                    Dalam bahasa Sunda, "Ci" berarti air atau sungai, sedangkan "Batu" merujuk pada bebatuan yang
                    banyak ditemukan di sekitar sungai tersebut.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Menurut cerita turun-temurun, sungai Cibatu Kolot dulunya menjadi sumber air utama bagi masyarakat
                    setempat. Airnya yang jernih dan melimpah membuat daerah ini menjadi tempat yang subur untuk
                    pertanian dan pemukiman.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Selain itu, ada juga cerita mistis yang menyebutkan bahwa daerah Cibatu dikenal sebagai zona aman
                    dari berbagai bencana alam. Hal ini membuat banyak penduduk dari daerah lain yang bermigrasi
                    ke wilayah ini, sehingga membentuk komunitas yang beragam seperti sekarang.
                  </p>
                </div>
              </div>

              {/* Info Card */}
              <div className="lg:col-span-1">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-mountain text-white text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Cibatu Kolot</h4>
                    <p className="text-gray-600">Sungai yang menjadi asal nama desa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Berita Terbaru</h2>
            <a
              href="/berita"
              className="btn-mobile text-green-600 hover:text-green-700 font-semibold inline-flex items-center space-x-2"
            >
              <span>Lihat Semua</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(news || []).map((item: any) => (
                <div key={item.id || item.slug} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                  <LazyImage
                    src={item.image || '/foto-sawah-1.webp'}
                    alt={item.title}
                    className="w-full h-48"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{item.excerpt}</p>

                    {/* Conditional Link based on news type */}
                    <div className="mt-auto">
                      {item.is_external ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-mobile inline-flex items-center justify-center space-x-2 w-full py-2 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group text-sm sm:text-base"
                        >
                          <i className="fas fa-external-link-alt"></i>
                          <span className="truncate">Baca di {item.source}</span>
                          <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </a>
                      ) : (
                        <a
                          href={`/berita/${item.slug || item.id}`}
                          className="btn-mobile inline-flex items-center justify-center space-x-2 w-full py-2 px-3 sm:px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 group text-sm sm:text-base"
                        >
                          <i className="fas fa-newspaper"></i>
                          <span>Baca selengkapnya</span>
                          <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : news === null ? (
            <LoadingState text="Memuat berita terbaru..." />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada berita tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Testimoni Masyarakat
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Dengarkan pengalaman dan kesan masyarakat Desa Cibatu tentang pelayanan dan perkembangan desa
            </p>
            <button
              onClick={() => setIsTestimoniModalOpen(true)}
              className="btn-mobile bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Berikan Testimoni</span>
            </button>
          </div>

          {(testimonials || []).length > 0 ? (
            <TestimoniSlider testimonials={(testimonials || []).map((testimonial: any) => ({
              id: testimonial.id,
              nama: testimonial.is_anonymous ? 'Warga Anonim' : testimonial.nama,
              komentar: testimonial.testimoni,
              rating: testimonial.rating || 0,
              avatar: undefined // Tidak ada field avatar di API
            }))} />
          ) : testimonials === null ? (
            <LoadingState text="Memuat testimoni masyarakat..." />
          ) : (
            <div className="text-center py-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Testimoni</h3>
                <p className="text-gray-500 mb-4">Jadilah yang pertama memberikan testimoni tentang Desa Cibatu</p>
                <button
                  onClick={() => setIsTestimoniModalOpen(true)}
                  className="btn-mobile bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Berikan Testimoni Pertama</span>
                </button>
              </div>
            </div>
          )}
          </div>
        </section>

      {/* Testimoni Modal */}
      <TestimoniModal
        isOpen={isTestimoniModalOpen}
        onClose={() => setIsTestimoniModalOpen(false)}
      />
      </div>
    </>
  );
};

export default Home;
