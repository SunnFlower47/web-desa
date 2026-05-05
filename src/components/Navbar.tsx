import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, Home, Newspaper, Info, Users, BarChart3, Phone, Heart, MessageSquare, MapPin, Search, Shield } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const mainNavigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Profil Desa', href: '/profil-desa', icon: Info },
    { name: 'Data Desa', href: '/data-desa', icon: Users },
    { name: 'Layanan', href: '/layanan-surat', icon: FileText },
    { name: 'Bantuan Sosial', href: '/bantuan-sosial', icon: Heart },
    { name: 'Pengaduan', href: '/pengaduan', icon: MessageSquare },
  ];

  const additionalNavigation = [
    { name: 'Kontak', href: '/kontak', icon: Phone },
    { name: 'Berita', href: '/berita', icon: Newspaper },
    { name: 'Peta Desa', href: '/peta-desa', icon: MapPin },
    { name: 'Transparansi', href: '/transparansi', icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                <img src="/logo desa cibatu.png" alt="Logo Desa Cibatu" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" loading="lazy" />
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Desa Cibatu</h1>
                  <p className="text-xs sm:text-sm text-gray-600">Kec. Cibatu, Kab. Purwakarta</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-2 flex-1 justify-center">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-700 shadow-sm'
                        : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}

              {/* Dropdown Desktop */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1">
                  <span>Menu Lainnya</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                  <div className="py-2">
                    {additionalNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 ${
                            isActive(item.href) ? 'bg-green-50 text-green-600' : ''
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Search & Mobile Menu */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-auto">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-green-600 focus:outline-none transition-colors rounded-lg hover:bg-gray-100"
                title="Cari"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden btn-mobile text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100 rounded-lg transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)}></div>

          {/* Sidebar */}
          <div className="relative ml-auto w-80 max-w-sm bg-white shadow-xl overflow-y-auto h-full transform transition-transform duration-300 ease-in-out translate-x-0">
            {/* Sidebar Header */}
            <div className="bg-white px-4 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/logo desa cibatu.png"
                    alt="Logo Desa Cibatu"
                    className="w-12 h-12 object-contain bg-gray-100 rounded-lg p-1"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Desa Cibatu</h2>
                    <p className="text-gray-600 text-sm">Kec. Cibatu, Kab. Purwakarta</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-600 bg-gray-100/50 hover:text-gray-800 hover:bg-gray-200/70 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <i className="fas fa-map-award-alt"></i>
                  <span>Desa Digital Terdepan 2025</span>
                </div>
              </div>
            </div>

            <div className="px-3 pt-3 pb-4 space-y-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item-mobile flex items-center space-x-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-700 shadow-sm'
                        : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Additional Navigation */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Menu Lainnya
                </div>
                {additionalNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`nav-item-mobile flex items-center space-x-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-green-100 text-green-700 shadow-sm'
                          : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar Modal */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
