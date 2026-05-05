import React from 'react';
import { Shield, FileText, Users, Lock, Eye, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const KebijakanData: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const sections = [
    {
      id: 'tujuan',
      title: 'Tujuan Kebijakan Data',
      icon: FileText,
      content: [
        'Meningkatkan transparansi dan akuntabilitas pemerintahan desa',
        'Memfasilitasi akses informasi publik sesuai dengan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik',
        'Mendorong partisipasi masyarakat dalam pembangunan desa',
        'Mendukung pengambilan keputusan berbasis data yang akurat'
      ]
    },
    {
      id: 'ruang-lingkup',
      title: 'Ruang Lingkup',
      icon: Users,
      content: [
        'Data kependudukan dan demografi desa',
        'Data ekonomi dan UMKM',
        'Data infrastruktur dan fasilitas umum',
        'Data statistik pembangunan desa',
        'Data layanan publik dan administrasi'
      ]
    },
    {
      id: 'prinsip-dasar',
      title: 'Prinsip Dasar',
      icon: Shield,
      content: [
        'Transparansi: Data publik harus dapat diakses dengan mudah',
        'Akurasi: Data yang disajikan harus akurat dan terbaru',
        'Keterbukaan: Informasi publik harus terbuka kecuali yang dikecualikan',
        'Perlindungan Privasi: Data pribadi warga harus dilindungi',
        'Keadilan: Akses data harus merata untuk semua pihak'
      ]
    }
  ];

  const dataTypes = [
    {
      category: 'Data Terbuka',
      description: 'Data yang dapat diakses dan digunakan oleh publik',
      examples: [
        'Statistik kependudukan agregat',
        'Data UMKM (tanpa informasi pribadi)',
        'Informasi fasilitas umum',
        'Data pembangunan infrastruktur',
        'Laporan keuangan desa'
      ],
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      category: 'Data Terbatas',
      description: 'Data yang memerlukan persetujuan khusus untuk akses',
      examples: [
        'Data penduduk dengan identitas terbatas',
        'Informasi keuangan detail',
        'Data perencanaan pembangunan',
        'Dokumen internal pemerintahan'
      ],
      icon: Lock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      category: 'Data Rahasia',
      description: 'Data yang tidak dapat diakses publik',
      examples: [
        'Data pribadi warga (NIK, alamat detail)',
        'Informasi keamanan desa',
        'Data medis warga',
        'Informasi keluarga yang sensitif'
      ],
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const rights = [
    {
      title: 'Hak Masyarakat',
      items: [
        'Mengakses data publik yang tersedia',
        'Mengajukan permintaan informasi tambahan',
        'Menggunakan data untuk keperluan penelitian dan analisis',
        'Memberikan masukan terkait kualitas data',
        'Mengajukan keberatan jika data tidak akurat'
      ],
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Kewajiban Pemerintah Desa',
      items: [
        'Menyediakan akses data publik yang mudah',
        'Memastikan akurasi dan ketepatan waktu data',
        'Melindungi data pribadi warga',
        'Menyediakan mekanisme pengaduan',
        'Melakukan evaluasi berkala kualitas data'
      ],
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const restrictions = [
    {
      title: 'Pembatasan Akses',
      description: 'Data tertentu tidak dapat diakses karena alasan:',
      items: [
        'Perlindungan privasi dan data pribadi',
        'Keamanan nasional dan ketertiban umum',
        'Rahasia dagang dan informasi komersial',
        'Informasi yang dapat merugikan pihak ketiga',
        'Data yang sedang dalam proses investigasi'
      ],
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Kebijakan Data - Desa Cibatu"
        description="Kebijakan data dan informasi publik Desa Cibatu. Transparansi, akuntabilitas, dan perlindungan privasi dalam pengelolaan data desa."
        keywords="Kebijakan Data, Transparansi Publik, Informasi Desa, Perlindungan Data, Keterbukaan Informasi, Desa Cibatu"
        url="/kebijakan-data"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Kebijakan Data Desa Cibatu",
          "description": "Kebijakan data dan informasi publik Desa Cibatu",
          "url": "https://pemdescibatu2001.online/kebijakan-data",
          "publisher": {
            "@type": "Organization",
            "name": "Desa Cibatu",
            "url": "https://pemdescibatu2001.online"
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0]
        }}
      />

      {/* Hero Section with Green Background */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Green Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800"></div>
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kebijakan Data</h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Transparansi, Akuntabilitas, dan Perlindungan Data dalam Pemerintahan Desa Cibatu
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Shield className="w-4 h-4 inline mr-2" />
                Perlindungan Data
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Eye className="w-4 h-4 inline mr-2" />
                Transparansi Publik
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Users className="w-4 h-4 inline mr-2" />
                Partisipasi Masyarakat
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Kebijakan Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kebijakan Data Desa Cibatu merupakan pedoman dalam pengelolaan, penyimpanan, dan akses
                terhadap data dan informasi publik. Kebijakan ini dibuat untuk memastikan transparansi
                pemerintahan desa sambil tetap melindungi privasi dan keamanan data warga.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Kebijakan ini mengacu pada Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik
                dan Peraturan Menteri Dalam Negeri No. 47 Tahun 2016 tentang Pedoman Umum Tata Kelola
                Pemerintahan Desa.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Classification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            Klasifikasi Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataTypes.map((type, index) => (
              <div key={index} className={`${type.bgColor} rounded-lg p-6`}>
                <div className="flex items-center mb-4">
                  <type.icon className={`w-6 h-6 ${type.color} mr-3`} />
                  <h4 className={`text-lg font-semibold ${type.color}`}>{type.category}</h4>
                </div>
                <p className="text-gray-700 mb-4">{type.description}</p>
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800">Contoh:</h5>
                  <ul className="space-y-1">
                    {type.examples.map((example, exIndex) => (
                      <li key={exIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rights and Obligations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {rights.map((right, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 ${right.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                  <right.icon className={`w-6 h-6 ${right.color}`} />
                </div>
                <h3 className={`text-xl font-bold ${right.color}`}>{right.title}</h3>
              </div>
              <ul className="space-y-3">
                {right.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Restrictions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{restrictions[0].title}</h3>
              <p className="text-gray-700 mb-4">{restrictions[0].description}</p>
              <ul className="space-y-2">
                {restrictions[0].items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Kontak dan Pengaduan</h4>
              <p className="text-gray-700 mb-4">
                Jika Anda memiliki pertanyaan, saran, atau pengaduan terkait kebijakan data dan akses informasi,
                silakan menghubungi kami melalui:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Kantor Desa Cibatu</h5>
                  <p className="text-sm text-gray-600">
                    Jl. Cibatu Km. 15, Desa Cibatu, Kec. Cibatu, Kab. Purwakarta23<br />
                    Desa Cibatu, Kec. Cibatu<br />
                    Kabupaten Purwakarta, Jawa Barat
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Kontak</h5>
                  <p className="text-sm text-gray-600">
                    Email: desacibatu.2001@gmail.com<br />
                    Telepon: +62 838-7982-7147<br />
                    Jam Kerja: Senin - Jumat, 08:00 - 16:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Dokumen ini terakhir diperbarui pada: {new Date().toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KebijakanData;
