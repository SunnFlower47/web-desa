import React from 'react';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const TentangDesa: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  return (
    <>
      <SEO
        title="Tentang Desa Cibatu"
        description="Pelajari sejarah, visi misi, dan perkembangan Desa Cibatu, Purwakarta. Dari daerah agraris menjadi sentra industri dengan keragaman budaya yang tinggi."
        keywords="Tentang Desa Cibatu, Sejarah Desa, Visi Misi Desa, Perkembangan Desa, Purwakarta, Jawa Barat"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Tentang Desa Cibatu</h1>
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
            <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
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
            <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
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

      {/* Additional Info Section */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Profil Desa Cibatu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-calendar-alt text-white"></i>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Tahun Berdiri</h4>
            <p className="text-gray-600">1860</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-user text-white"></i>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Kepala Desa Pertama</h4>
            <p className="text-gray-600">Ki Arpan</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-map-marker-alt text-white"></i>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Lokasi</h4>
            <p className="text-gray-600">Kec. Cibatu, Kab. Purwakarta</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-industry text-white"></i>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Karakteristik</h4>
            <p className="text-gray-600">Agraris ke Industri</p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TentangDesa;
