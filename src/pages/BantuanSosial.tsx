import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, Search, RefreshCcw, User, Info, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface CaptchaData {
  question: string;
  cache_key: string;
}

interface BantuanSosialItem {
  id?: number;
  program: string;
  jenis: string;
  nilai: string;
  status: string;
  nomor_kartu: string | null;
  sistem_pembayaran?: 'sekali' | 'triwulanan';
  tanggal_penerimaan?: string | null;
  keterangan?: string | null;
  triwulan?: {
    triwulan_1: {
      tanggal: string | null;
      jumlah: number;
      status: string;
    };
    triwulan_2: {
      tanggal: string | null;
      jumlah: number;
      status: string;
    };
    triwulan_3: {
      tanggal: string | null;
      jumlah: number;
      status: string;
    };
  } | null;
}

interface SearchResultData {
  penduduk?: {
    nama: string;
    nik: string;
    alamat: string;
    rt: string;
    rw: string;
    dusun: string;
  };
  bantuan_sosials?: BantuanSosialItem[];
}

const BantuanSosial: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const [nik, setNik] = useState<string>('');
  const [tanggalLahir, setTanggalLahir] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResultData | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Memastikan reCAPTCHA v2 dirender
    const timer = setTimeout(() => {
        if (typeof (window as any).grecaptcha !== 'undefined' && recaptchaRef.current) {
            try {
                // Hanya render jika belum ada konten di dalamnya
                if (recaptchaRef.current.innerHTML === '') {
                    (window as any).grecaptcha.render(recaptchaRef.current, {
                        'sitekey': process.env.REACT_APP_RECAPTCHA_V2_SITE_KEY,
                        'callback': (token: string) => setCaptchaToken(token),
                        'expired-callback': () => setCaptchaToken(null)
                    });
                }
            } catch (e) {
                console.log('reCAPTCHA already rendered or error:', e);
            }
        }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const resetCaptcha = () => {
    setCaptchaToken(null);
    if (typeof (window as any).grecaptcha !== 'undefined') {
        try {
            (window as any).grecaptcha.reset();
        } catch (e) {
            console.log('No reCAPTCHA widget to reset');
        }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSearchResult(null);
    setLoading(true);
    setHasSearched(true);

    // Validasi input
    if (!nik) {
      setError('NIK wajib diisi.');
      setLoading(false);
      return;
    }

    if (!tanggalLahir) {
      setError('Tanggal lahir wajib diisi.');
      setLoading(false);
      return;
    }

    if (!captchaToken) {
      setError('Harap centang kotak "I\'m not a robot" terlebih dahulu.');
      setLoading(false);
      return;
    }

    if (!/^\d{16}$/.test(nik)) {
      setError('NIK harus 16 digit angka.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.searchBantuanSosial({
        nik,
        tanggal_lahir: tanggalLahir,
      }, { captchaToken }); // Kirim token via header

      if (response.success) {
        setSearchResult(response.data);
      } else {
        if (response.message?.includes('tidak ditemukan') || response.message?.includes('NOT_FOUND')) {
          setError(`Data bantuan sosial tidak ditemukan untuk NIK ${nik.substring(0, 4)}****${nik.substring(nik.length - 4)}. Pastikan NIK dan tanggal lahir sudah benar.`);
        } else if (response.message?.includes('reCAPTCHA') || response.message?.includes('captcha')) {
          setError('Verifikasi keamanan gagal. Silakan coba lagi.');
          resetCaptcha();
        } else if (response.message?.includes('Terlalu banyak percobaan') || response.message?.includes('RATE_LIMITED')) {
          setError('Terlalu banyak percobaan. Silakan tunggu beberapa saat sebelum mencoba lagi.');
        } else {
          setError(response.message || 'Terjadi kesalahan saat mencari data.');
        }
      }
    } catch (err: any) {
      console.error('Error searching bantuan sosial:', err);
      if (err.message?.includes('404') || err.message?.includes('NOT_FOUND')) {
        setError(`Data bantuan sosial tidak ditemukan untuk NIK ${nik.substring(0, 4)}****${nik.substring(nik.length - 4)}. Pastikan NIK dan tanggal lahir sudah benar.`);
      } else if (err.message?.includes('reCAPTCHA') || err.message?.includes('captcha')) {
        setError('Verifikasi keamanan gagal. Silakan coba lagi.');
        resetCaptcha();
      } else if (err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
        setError('Terlalu banyak percobaan. Silakan tunggu beberapa saat sebelum mencoba lagi.');
      } else if (err.message?.includes('422') || err.message?.includes('Unprocessable Entity')) {
        setError('Data yang dimasukkan tidak valid. Silakan periksa kembali NIK dan tanggal lahir.');
      } else {
        setError(err.message || 'Terjadi kesalahan saat mencari data. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'nonaktif':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Tidak tersedia';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Bantuan Sosial Desa Cibatu"
        description="Cek status bantuan sosial di Desa Cibatu, Purwakarta. Informasi program bantuan sosial, penerima bantuan, dan cara mengakses bantuan untuk warga yang membutuhkan."
        keywords="Bantuan Sosial Desa, Program Bantuan Sosial, Penerima Bantuan Sosial, Bantuan Masyarakat, Bantuan Warga Desa, Bantuan Sosial Purwakarta"
        url="/bantuan-sosial"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Bantuan Sosial Desa Cibatu",
          "description": "Layanan informasi dan pengecekan status bantuan sosial di Desa Cibatu",
          "url": "https://pemdescibatu2001.online/bantuan-sosial",
          "provider": {
            "@type": "GovernmentOrganization",
            "name": "Desa Cibatu"
          },
          "serviceType": "Social Assistance",
          "areaServed": {
            "@type": "Place",
            "name": "Desa Cibatu, Purwakarta"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "IDR",
            "description": "Layanan gratis untuk warga Desa Cibatu"
          }
        }}
      />
      {/* Hero Section with Background Image */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/foto-sawah-2.webp)',
            filter: 'hue-rotate(60deg) saturate(1.5) brightness(0.8)'
          }}
        ></div>
        <div className="absolute inset-0 bg-green-600/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bantuan Sosial Desa</h1>
            <p className="text-xl text-green-100 mb-8">
              Cek status bantuan sosial dengan aman dan terpercaya menggunakan sistem keamanan tinggi
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">100%</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Aman</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">Verifikasi</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">CAPTCHA</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">24/7</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Tersedia</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form - Overlapping */}
      <div className="relative -mt-16 z-10 px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                  <Search className="w-6 h-6 mr-2 text-green-600" />
                  Cari Data Bantuan Sosial
                </h2>
                <p className="text-gray-600">Masukkan NIK dan tanggal lahir Anda untuk mengecek status bantuan.</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                {/* NIK */}
                <div>
                  <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-2">
                    NIK (16 digit)
                  </label>
                  <input
                    type="text"
                    id="nik"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Masukkan NIK lengkap..."
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    maxLength={16}
                    required
                    inputMode="numeric"
                    pattern="[0-9]{16}"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    id="tanggalLahir"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    required
                  />
                </div>

                {/* CAPTCHA reCAPTCHA v2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verifikasi Keamanan (Wajib)
                  </label>
                  <div className="flex justify-center md:justify-start">
                    <div ref={recaptchaRef}></div>
                  </div>
                  <p className="mt-2 text-sm text-green-600">
                    Verifikasi ini membantu melindungi data warga dari akses tidak sah melalui analisis perilaku Google.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{error}</span>
                    </p>
                  </div>
                )}

                {/* Search Button */}
                <button
                  type="submit"
                  onClick={handleSearch}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    loading ? 'bg-green-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mencari Data...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Cari Data Bantuan Sosial</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-16 z-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Results */}
          {hasSearched && !loading && (
            <div className="space-y-6">
              {searchResult ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Hasil Pencarian Bantuan Sosial</h2>
                    <p className="text-gray-600">Data bantuan sosial untuk {searchResult.penduduk?.nama || 'N/A'}.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Data Penduduk */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Informasi Penduduk
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nama:</span>
                          <span className="font-medium">{searchResult.penduduk?.nama || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">NIK:</span>
                          <span className="font-medium">
                            {searchResult.penduduk?.nik || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alamat:</span>
                          <span className="font-medium text-right max-w-xs">
                            {searchResult.penduduk ?
                              `${searchResult.penduduk.alamat}, RT ${searchResult.penduduk.rt}/RW ${searchResult.penduduk.rw}, ${searchResult.penduduk.dusun}` :
                              'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Daftar Bantuan Sosial */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Info className="w-5 h-5 mr-2" />
                        Daftar Bantuan Sosial ({searchResult.bantuan_sosials?.length || 0})
                      </h3>
                      {searchResult.bantuan_sosials && searchResult.bantuan_sosials.length > 0 ? (
                        <div className="space-y-4">
                          {searchResult.bantuan_sosials.map((bantuan: BantuanSosialItem, index: number) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <p className="font-medium text-gray-900">
                                  {bantuan.program}
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bantuan.status)}`}>
                                  {bantuan.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>Jenis: {bantuan.jenis}</p>
                                <p>Jumlah: {bantuan.nilai}</p>
                                {bantuan.nomor_kartu && <p>Nomor Kartu: {bantuan.nomor_kartu}</p>}

                                {/* Sistem Pembayaran */}
                                {bantuan.sistem_pembayaran === 'triwulanan' ? (
                                  <div className="mt-3">
                                    <p className="font-medium text-gray-800 mb-2">Sistem Pembayaran Triwulanan:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      {bantuan.triwulan && (
                                        <>
                                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <p className="font-medium text-gray-800 text-xs">Triwulan 1</p>
                                            <p className="text-sm text-gray-600">Rp {bantuan.triwulan.triwulan_1.jumlah.toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-gray-500">
                                              {bantuan.triwulan.triwulan_1.tanggal ? formatDate(bantuan.triwulan.triwulan_1.tanggal) : 'Belum ditentukan'}
                                            </p>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <p className="font-medium text-gray-800 text-xs">Triwulan 2</p>
                                            <p className="text-sm text-gray-600">Rp {bantuan.triwulan.triwulan_2.jumlah.toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-gray-500">
                                              {bantuan.triwulan.triwulan_2.tanggal ? formatDate(bantuan.triwulan.triwulan_2.tanggal) : 'Belum ditentukan'}
                                            </p>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <p className="font-medium text-gray-800 text-xs">Triwulan 3</p>
                                            <p className="text-sm text-gray-600">Rp {bantuan.triwulan.triwulan_3.jumlah.toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-gray-500">
                                              {bantuan.triwulan.triwulan_3.tanggal ? formatDate(bantuan.triwulan.triwulan_3.tanggal) : 'Belum ditentukan'}
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="mt-2">Tanggal Penerimaan: {bantuan.tanggal_penerimaan || 'Belum ditentukan'}</p>
                                )}

                                {bantuan.keterangan && <p>Keterangan: {bantuan.keterangan}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Tidak ada bantuan sosial yang aktif untuk NIK ini.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">Data Bantuan Sosial Tidak Ditemukan</h3>
                    <p className="text-gray-600 mb-4">
                      Atas nama <strong>{nik.substring(0, 4)}****{nik.substring(nik.length - 4)}</strong> tidak terdaftar sebagai penerima bantuan sosial.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Informasi:</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Data bantuan sosial akan diperbarui secara berkala</li>
                      <li>• Jika ada perubahan data, hubungi kantor desa</li>
                      <li>• Sistem ini menggunakan keamanan tinggi untuk melindungi data pribadi</li>
                      <li>• Pastikan NIK dan tanggal lahir yang dimasukkan sudah benar</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BantuanSosial;
