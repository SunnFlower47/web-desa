import React, { useState } from 'react';

const FloatingCTA: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {/* Main CTA Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-mobile group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-green-500/50"
          aria-label={isOpen ? "Close help menu" : "Open help menu"}
        >
          <div className="relative">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'} text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:scale-110'}`}></i>
            {!isOpen && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap animate-fadeInUp">
            <span className="flex items-center">
              Butuh Bantuan?
            </span>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-6 min-w-56 sm:min-w-72 animate-fadeInUp">
          <div className="text-center mb-3 sm:mb-6">
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <i className="fas fa-headset text-white text-sm sm:text-2xl"></i>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Butuh Bantuan?</h3>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Pilih layanan yang Anda butuhkan</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <a
              href="/pengajuan-surat"
              className="btn-mobile group block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center rounded-md sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-base"
            >
              <i className="fas fa-file-alt mr-1.5 sm:mr-3 group-hover:animate-bounce"></i>
              <span className="hidden sm:inline">Ajukan Surat Online</span>
              <span className="sm:hidden">Ajukan Surat</span>
            </a>

            <a
              href="/status-surat"
              className="btn-mobile group block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center rounded-md sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-base"
            >
              <i className="fas fa-search mr-1.5 sm:mr-3 group-hover:animate-bounce"></i>
              <span className="hidden sm:inline">Cek Status Surat</span>
              <span className="sm:hidden">Cek Status</span>
            </a>

            <a
              href="/kontak"
              className="btn-mobile group block w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-center rounded-md sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-base"
            >
              <i className="fas fa-phone mr-1.5 sm:mr-3 group-hover:animate-bounce"></i>
              <span className="hidden sm:inline">Hubungi Kami</span>
              <span className="sm:hidden">Kontak</span>
            </a>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <i className="fas fa-times text-sm sm:text-lg"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingCTA;
