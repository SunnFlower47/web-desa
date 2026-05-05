import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle, User, Calendar, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface SuratStatus {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  jenis_surat_nama?: string;
  status: string;
  tanggal_pengajuan: string;
  tanggal_surat: string;
  keperluan: string;
  tujuan?: string;
  keterangan_tambahan?: string;
  keterangan_admin?: string;
  penduduk: {
    nama: string;
    nik: string;
    alamat: string;
  };
  created_at: string;
  updated_at: string;
}

const StatusSurat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useScrollToTop();
  const [searchType, setSearchType] = useState<'nik' | 'nomor'>('nik');
  const [searchValue, setSearchValue] = useState(location.state?.nomorSurat || '');
  const [tanggalLahir, setTanggalLahir] = useState(''); // Tambahkan ini
  const [loading, setLoading] = useState(false);
  const [suratData, setSuratData] = useState<SuratStatus[]>([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [suratTypes, setSuratTypes] = useState<any[]>([]);

  // CAPTCHA state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.useRef<HTMLDivElement>(null);

  // Fungsi untuk reset captcha setelah verifikasi
  const resetCaptcha = () => {
    setCaptchaToken(null);
    if (typeof (window as any).grecaptcha !== 'undefined') {
      (window as any).grecaptcha.reset();
    }
  };

  React.useEffect(() => {
    // Memastikan reCAPTCHA v2 dirender
    const timer = setTimeout(() => {
        if (typeof (window as any).grecaptcha !== 'undefined' && recaptchaRef.current) {
            try {
                (window as any).grecaptcha.render(recaptchaRef.current, {
                    'sitekey': process.env.REACT_APP_RECAPTCHA_V2_SITE_KEY,
                    'callback': (token: string) => setCaptchaToken(token),
                    'expired-callback': () => setCaptchaToken(null)
                });
            } catch (e) {
                console.log('reCAPTCHA already rendered or error:', e);
            }
        }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (value?: string, type?: 'nik' | 'nomor') => {
    const searchVal = value || searchValue;
    const searchTyp = type || searchType;

    if (!searchVal.trim()) {
      setError('Silakan masukkan NIK atau nomor surat');
      return;
    }

    if (!captchaToken) {
      setError('Harap selesaikan captcha terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      let response;
      if (searchTyp === 'nik') {
        // Validate NIK format
        if (!/^\d{16}$/.test(searchVal)) {
          setError('NIK harus 16 digit angka');
          setLoading(false);
          return;
        }
        if (!tanggalLahir) {
            setError('Silakan pilih tanggal lahir Anda');
            setLoading(false);
            return;
        }
        response = await api.getHistory({ 
            nik: searchVal, 
            tanggal_lahir: tanggalLahir 
        }, { captchaToken });
      } else {
        response = await api.getSuratByNomor(searchVal, { captchaToken });
      }

      if (response.success) {
        setSuratData(response.data || []);
        if (!response.data || response.data.length === 0) {
          setError('Tidak ditemukan surat dengan data yang dimasukkan');
          resetCaptcha();
        }
      } else {
        setError(response.message || 'Terjadi kesalahan saat mencari surat');
        setSuratData([]);
        resetCaptcha();
      }
    } catch (error: any) {
      console.error('Error searching surat:', error);
      setError('Terjadi kesalahan saat mencari surat');
      setSuratData([]);
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // Fetch surat types on component mount
  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.getSuratTypes();
        setSuratTypes(response.data || []);
      } catch (err) {
        console.error('Error fetching types:', err);
      }
    };
    fetchTypes();
  }, []);

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { color: string; icon: React.ReactNode; label: string } } = {
      'pending': {
        color: 'text-yellow-600 bg-yellow-100',
        icon: <Clock className="w-4 h-4" />,
        label: 'Menunggu Verifikasi'
      },
      'diproses': {
        color: 'text-blue-600 bg-blue-100',
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        label: 'Sedang Diproses'
      },
      'selesai': {
        color: 'text-green-600 bg-green-100',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Selesai'
      },
      'ditolak': {
        color: 'text-red-600 bg-red-100',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Ditolak'
      },
      // Legacy support
      'approved': {
        color: 'text-green-600 bg-green-100',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Disetujui'
      },
      'completed': {
        color: 'text-green-600 bg-green-100',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Selesai'
      },
      'rejected': {
        color: 'text-red-600 bg-red-100',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Ditolak'
      }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const getJenisSuratName = (jenisSurat: string, fallbackName?: string): string => {
    if (fallbackName) return fallbackName;
    if (!jenisSurat) return 'Jenis Surat';

    const jenisMap: { [key: string]: string } = {
      'sku': 'Surat Keterangan Usaha (SKU)',
      'keterangan-domisili': 'Surat Keterangan Domisili',
      'pengantar': 'Surat Pengantar',
      'pindah': 'Surat Keterangan Pindah',
      'kematian': 'Surat Keterangan Kematian',
      'kelahiran': 'Surat Keterangan Kelahiran',
      'sktm_dewasa': 'Surat Keterangan Tidak Mampu (SKTM) - Dewasa',
      'sktm_anak': 'Surat Keterangan Tidak Mampu (SKTM) - Anak'
    };

    if (jenisMap[jenisSurat]) return jenisMap[jenisSurat];

    // Cek di dynamic types dengan pengaman null
    const dynamicType = suratTypes.find(t => t && t.id && t.id.toString() === jenisSurat.toString());
    return dynamicType ? dynamicType.name : jenisSurat;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <SEO
        title="Status Surat - Desa Cibatu"
        description="Cek status pengajuan surat di Desa Cibatu, Purwakarta. Pantau progress surat keterangan Anda secara online dengan mudah dan cepat."
        keywords="Status Surat, Cek Surat, Pengajuan Surat, Desa Cibatu, Purwakarta, Tracking Surat"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-green-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-green-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-medium">Kembali</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Cek Status Surat</h1>
          <p className="text-green-100">Pantau status pengajuan surat Anda secara real-time</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cari Status Surat</h2>
            <p className="text-gray-600">Masukkan NIK atau nomor surat untuk melihat status pengajuan</p>
          </div>

          {/* Search Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSearchType('nik')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'nik'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Cari dengan NIK
              </button>
              <button
                onClick={() => setSearchType('nomor')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'nomor'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Cari dengan Nomor Surat
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchType === 'nik'
                    ? 'Masukkan NIK (16 digit)'
                    : 'Masukkan nomor surat'
                }
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                maxLength={searchType === 'nik' ? 16 : undefined}
              />
              {searchType === 'nomor' && (
                <button
                    onClick={() => handleSearch()}
                    disabled={loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                    <Search className="w-4 h-4" />
                    )}
                </button>
              )}
            </div>

            {searchType === 'nik' && (
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="date"
                        value={tanggalLahir}
                        onChange={(e) => setTanggalLahir(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                        onClick={() => handleSearch()}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        <span>Cari Riwayat</span>
                    </button>
                </div>
            )}
          </div>

          {/* reCAPTCHA v2 Widget */}
          <div className="max-w-md mx-auto mt-6 flex justify-center">
            <div ref={recaptchaRef}></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && !loading && (
          <div className="space-y-6">
            {suratData.length > 0 ? (
              suratData.map((surat) => {
                const statusInfo = getStatusInfo(surat.status);
                return (
                  <div key={surat.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {getJenisSuratName(surat.jenis_surat, surat.jenis_surat_nama)}
                        </h3>
                        <p className="text-gray-600">Nomor Surat: <span className="font-medium">{surat.nomor_surat}</span></p>
                      </div>
                      <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="font-medium text-sm">{statusInfo.label}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Detail Surat */}
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Detail Surat
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                          <div className="flex justify-between border-b border-gray-50 py-2">
                            <span className="text-gray-600">Keperluan:</span>
                            <span className="font-medium text-right max-w-xs">{surat.keperluan}</span>
                          </div>
                          {surat.tujuan && (
                            <div className="flex justify-between border-b border-gray-50 py-2">
                              <span className="text-gray-600">Tujuan:</span>
                              <span className="font-medium text-right max-w-xs">{surat.tujuan}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-b border-gray-50 py-2">
                            <span className="text-gray-600">Tanggal Pengajuan:</span>
                            <span className="font-medium">{formatDate(surat.tanggal_pengajuan)}</span>
                          </div>
                          {surat.keterangan_admin && (
                             <div className="flex justify-between border-b border-gray-50 py-2 md:col-span-2">
                                <span className="text-gray-600">Catatan Admin:</span>
                                <span className="font-bold text-orange-600 text-right">{surat.keterangan_admin}</span>
                             </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${surat.status !== 'pending' ? 'bg-green-500' : 'bg-green-500'} rounded-full`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pengajuan Terkirim</p>
                            <p className="text-xs text-gray-600">{formatDate(surat.created_at || surat.tanggal_pengajuan)}</p>
                          </div>
                        </div>

                        {(surat.status === 'diproses' || surat.status === 'selesai' || surat.status === 'approved' || surat.status === 'completed') && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Sedang Diproses Admin</p>
                              <p className="text-xs text-gray-600">Verifikasi berkas & data pemohon</p>
                            </div>
                          </div>
                        )}

                        {(surat.status === 'selesai' || surat.status === 'completed') && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Surat Selesai</p>
                              <p className="text-xs text-gray-600">{formatDate(surat.updated_at)}</p>
                              <p className="text-[10px] text-green-600 font-bold uppercase mt-1 italic">Silakan ambil surat di kantor desa</p>
                            </div>
                          </div>
                        )}

                        {(surat.status === 'ditolak' || surat.status === 'rejected') && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Pengajuan Ditolak</p>
                              <p className="text-xs text-gray-600">{formatDate(surat.updated_at)}</p>
                            </div>
                          </div>
                        )}

                        {surat.status === 'pending' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Menunggu Antrian</p>
                              <p className="text-xs text-gray-600">Petugas akan segera memproses pengajuan Anda</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Keterangan Tambahan */}
                    {surat.keterangan_tambahan && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Keterangan Tambahan</h4>
                        <p className="text-gray-600 text-sm">{surat.keterangan_tambahan}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Data</h3>
                <p className="text-gray-600">Tidak ditemukan surat dengan data yang dimasukkan</p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Informasi Penting
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Status surat akan diperbarui secara real-time</li>
            <li>• Jika surat sudah disetujui, Anda dapat mengambilnya di kantor desa</li>
            <li>• Untuk pertanyaan lebih lanjut, hubungi kantor desa</li>
            <li>• Pastikan NIK yang dimasukkan sudah terdaftar di sistem desa</li>
          </ul>
        </div>
      </div>
      </div>
    </>
  );
};

export default StatusSurat;
