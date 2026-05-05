import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, Newspaper, MapPin, Building2, FileText, Users, Briefcase } from 'lucide-react';
import { api } from '../services/api';

interface SearchResult {
  id: number | string;
  title: string;
  type: 'berita' | 'fasilitas' | 'umkm' | 'layanan' | 'halaman' | 'perangkat';
  description?: string;
  url?: string;
  slug?: string;
  category?: string;
}

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setRecentSearches(prev => {
      const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Search function
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowRecent(true);
      return;
    }

    setIsLoading(true);
    setShowRecent(false);

    try {
      const allResults: SearchResult[] = [];

      // Search berita (internal + external)
      try {
        const beritaResponse = await api.getNews({ search: searchQuery, per_page: 5 });
        const beritaResults = beritaResponse.data?.map((item: any) => ({
          id: item.id,
          title: item.judul || item.title,
          type: 'berita' as const,
          description: item.excerpt || item.ringkasan || item.description,
          url: item.is_external ? item.link : `/berita/${item.slug || item.id}`,
          slug: item.slug,
          category: item.kategori || 'Berita'
        })) || [];
        allResults.push(...beritaResults);
      } catch (error) {
        console.log('Berita search error:', error);
      }

      // Search penduduk - REMOVED untuk keamanan data sensitif
      // try {
      //   const pendudukResponse = await api.searchResidents(searchQuery);
      //   const pendudukResults = pendudukResponse.data?.map((item: any) => ({
      //     id: item.id,
      //     title: item.nama,
      //     type: 'penduduk' as const,
      //     description: `RT ${item.rt}/RW ${item.rw} - ${item.alamat}`,
      //     url: `/data-desa#penduduk`,
      //     category: 'Data Penduduk'
      //   })) || [];
      //   allResults.push(...pendudukResults);
      // } catch (error) {
      //   console.log('Penduduk search error:', error);
      // }

      // Search fasilitas
      try {
        const fasilitasResponse = await api.getFacilities({ search: searchQuery, limit: 5 });
        const fasilitasResults = fasilitasResponse.data?.map((item: any) => ({
          id: item.id,
          title: item.nama_fasilitas,
          type: 'fasilitas' as const,
          description: `${item.jenis_fasilitas} - ${item.alamat}`,
          url: `/data-desa#fasilitas`,
          category: 'Fasilitas Desa'
        })) || [];
        allResults.push(...fasilitasResults);
      } catch (error) {
        console.log('Fasilitas search error:', error);
      }

      // Search UMKM
      try {
        const umkmResponse = await api.getUMKM({ per_page: 5 });
        const umkmResults = umkmResponse.data?.filter((item: any) =>
          item.nama_usaha?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.jenis_usaha?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.pemilik?.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((item: any) => ({
          id: item.id,
          title: item.nama_usaha,
          type: 'umkm' as const,
          description: `${item.jenis_usaha} - ${item.pemilik}`,
          url: `/data-desa#umkm`,
          category: 'UMKM'
        })) || [];
        allResults.push(...umkmResults);
      } catch (error) {
        console.log('UMKM search error:', error);
      }

      // Search layanan surat
      try {
        const layananResponse = await api.getSuratTypes();
        const layananResults = layananResponse.data?.filter((item: any) =>
          item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((item: any) => ({
          id: item.id,
          title: item.nama,
          type: 'layanan' as const,
          description: item.deskripsi,
          url: `/layanan-surat`,
          category: 'Layanan Surat'
        })) || [];
        allResults.push(...layananResults);
      } catch (error) {
        console.log('Layanan search error:', error);
      }

      // Search perangkat desa
      try {
        const perangkatResponse = await api.getPerangkatDesa();
        const perangkatResults = perangkatResponse.data?.filter((item: any) =>
          item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.jabatan?.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((item: any) => ({
          id: item.id,
          title: item.nama,
          type: 'perangkat' as const,
          description: `${item.jabatan} - ${item.nik}`,
          url: `/profil-desa#struktur`,
          category: 'Perangkat Desa'
        })) || [];
        allResults.push(...perangkatResults);
      } catch (error) {
        console.log('Perangkat search error:', error);
      }

      // Static pages search
      const staticPages: SearchResult[] = [
        {
          id: 'home',
          title: 'Beranda',
          type: 'halaman',
          description: 'Halaman utama website Desa Cibatu',
          url: '/',
          category: 'Halaman'
        },
        {
          id: 'profil',
          title: 'Profil Desa',
          type: 'halaman',
          description: 'Informasi lengkap tentang Desa Cibatu',
          url: '/profil-desa',
          category: 'Halaman'
        },
        {
          id: 'data',
          title: 'Data Desa',
          type: 'halaman',
          description: 'Data penduduk, UMKM, dan fasilitas desa',
          url: '/data-desa',
          category: 'Halaman'
        },
        {
          id: 'layanan',
          title: 'Layanan Surat',
          type: 'halaman',
          description: 'Pengajuan surat keterangan dan dokumen',
          url: '/layanan-surat',
          category: 'Halaman'
        },
        {
          id: 'pengajuan',
          title: 'Pengajuan Surat',
          type: 'halaman',
          description: 'Form pengajuan surat keterangan',
          url: '/pengajuan-surat',
          category: 'Halaman'
        },
        {
          id: 'status',
          title: 'Status Surat',
          type: 'halaman',
          description: 'Cek status pengajuan surat',
          url: '/status-surat',
          category: 'Halaman'
        },
        {
          id: 'bantuan',
          title: 'Bantuan Sosial',
          type: 'halaman',
          description: 'Informasi dan cek bantuan sosial',
          url: '/bantuan-sosial',
          category: 'Halaman'
        },
        {
          id: 'pengaduan',
          title: 'Pengaduan',
          type: 'halaman',
          description: 'Kirim pengaduan dan keluhan',
          url: '/pengaduan',
          category: 'Halaman'
        },
        {
          id: 'berita',
          title: 'Berita',
          type: 'halaman',
          description: 'Berita terkini Desa Cibatu',
          url: '/berita',
          category: 'Halaman'
        },
        {
          id: 'kontak',
          title: 'Kontak Desa',
          type: 'halaman',
          description: 'Informasi kontak perangkat desa',
          url: '/kontak',
          category: 'Halaman'
        }
      ];

      // Filter static pages based on search query
      const filteredStaticPages = staticPages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.description && page.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      allResults.push(...filteredStaticPages);

      setResults(allResults);
      saveRecentSearch(searchQuery);

    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [saveRecentSearch]);

  // Handle input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults([]);
        setShowRecent(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      if (result.type === 'berita' && result.url.startsWith('http')) {
        window.open(result.url, '_blank');
      } else {
        window.location.href = result.url;
      }
    }
    onClose();
  };

  // Handle recent search click
  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'berita':
        return <Newspaper className="w-4 h-4 text-blue-500" />;
      case 'fasilitas':
        return <MapPin className="w-4 h-4 text-purple-500" />;
      case 'umkm':
        return <Briefcase className="w-4 h-4 text-orange-500" />;
      case 'layanan':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'halaman':
        return <Building2 className="w-4 h-4 text-gray-500" />;
      case 'perangkat':
        return <Users className="w-4 h-4 text-teal-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative flex items-start justify-center pt-4 sm:pt-16 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
              {/* Search Input */}
          <div className="flex items-center p-4 sm:p-6 border-b border-gray-200">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mr-3" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari berita, fasilitas, UMKM, layanan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-base sm:text-lg outline-none placeholder-gray-400"
        />
                <button
              onClick={onClose}
              className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {isLoading ? (
              <div className="p-4 sm:p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-500">Mencari...</p>
              </div>
            ) : showRecent && recentSearches.length > 0 ? (
              <div className="p-4 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Pencarian Terbaru
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Hapus
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(search)}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center"
                    >
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
                  </div>
                ) : results.length > 0 ? (
              <div className="p-4 sm:p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Hasil Pencarian ({results.length})
                </h3>
                <div className="space-y-2">
                    {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                              {result.title}
                          </h4>
                          {result.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {result.description}
                            </p>
                          )}
                          <div className="flex items-center mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              result.type === 'berita' ? 'bg-blue-100 text-blue-700' :
                              result.type === 'fasilitas' ? 'bg-purple-100 text-purple-700' :
                              result.type === 'umkm' ? 'bg-orange-100 text-orange-700' :
                              result.type === 'layanan' ? 'bg-indigo-100 text-indigo-700' :
                              result.type === 'halaman' ? 'bg-gray-100 text-gray-700' :
                              result.type === 'perangkat' ? 'bg-teal-100 text-teal-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {result.category || (
                                result.type === 'berita' ? 'Berita' :
                                result.type === 'fasilitas' ? 'Fasilitas' :
                                result.type === 'umkm' ? 'UMKM' :
                                result.type === 'layanan' ? 'Layanan' :
                                result.type === 'halaman' ? 'Halaman' :
                                result.type === 'perangkat' ? 'Perangkat' :
                                'Lainnya'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                    ))}
                  </div>
              </div>
            ) : query.trim() ? (
              <div className="p-4 sm:p-6 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada hasil ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">
                  Coba kata kunci yang berbeda
                </p>
                  </div>
                ) : (
              <div className="p-4 sm:p-6 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Mulai mengetik untuk mencari</p>
                <p className="text-sm text-gray-400 mt-1">
                  Berita, penduduk, fasilitas, UMKM, layanan, halaman
                </p>
                  </div>
                )}
          </div>

          {/* Quick Tips */}
          <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="flex items-center">
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd>
                  <span className="ml-1">Tutup</span>
                </span>
                <span className="flex items-center">
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">↵</kbd>
                  <span className="ml-1">Pilih</span>
                </span>
              </div>
              <span className="hidden sm:inline">Tekan untuk navigasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
