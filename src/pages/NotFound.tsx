import React from 'react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <>
      <SEO
        title="404 - Halaman Tidak Ditemukan - Desa Cibatu"
        description="Halaman yang Anda cari tidak ditemukan. Kembali ke beranda Desa Cibatu untuk melanjutkan browsing."
        keywords="404, Halaman Tidak Ditemukan, Error, Desa Cibatu"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-exclamation-triangle text-red-600 text-3xl"></i>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-8">Maaf, halaman yang Anda cari tidak ditemukan.</p>
          <a
            href="/"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
