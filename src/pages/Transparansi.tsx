import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, BarChart3, TrendingUp, Building2, Users, Filter } from 'lucide-react';
import api from '../services/api';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface ApbdesData {
  tahun: number;
  total_anggaran: number;
  realisasi: number;
  persentase: number;
  pendapatan: Array<{
    sumber: string;
    jumlah: number;
    realisasi: number;
    persentase: number;
  }>;
  belanja: Array<{
    bidang: string;
    jumlah: number;
    realisasi: number;
    persentase: number;
  }>;
}

interface ProyekData {
  id: number;
  nama: string;
  deskripsi: string;
  lokasi: string;
  anggaran: number;
  progress: number;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

interface BantuanSosialData {
  total_program: number;
  total_penerima: number;
  total_dana: number;
  program: Array<{
    id: number;
    nama_program: string;
    deskripsi: string;
    total_dana: number;
    jumlah_penerima: number;
    status: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
  }>;
}

const Transparansi: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [apbdesData, setApbdesData] = useState<ApbdesData | null>(null);
  const [proyekData, setProyekData] = useState<ProyekData[]>([]);
  const [bantuanSosialData, setBantuanSosialData] = useState<BantuanSosialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate years for dropdown (current year ± 5 years)
  const availableYears = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel using the proper API methods
      const [apbdesResponse, proyekResponse, bantuanResponse] = await Promise.all([
        api.getApbdesData(selectedYear),
        api.getProyekPembangunan(selectedYear),
        api.getBantuanSosialTransparansi(selectedYear)
      ]);

      if (apbdesResponse.success) {
        setApbdesData(apbdesResponse.data as ApbdesData);
      }

      if (proyekResponse.success) {
        setProyekData(proyekResponse.data as ProyekData[]);
      }

      if (bantuanResponse.success) {
        setBantuanSosialData(bantuanResponse.data as BantuanSosialData);
      }

    } catch (err) {
      console.error('Error fetching transparansi data:', err);
      setError('Gagal memuat data transparansi');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'selesai':
        return 'bg-green-100 text-green-800';
      case 'berjalan':
        return 'bg-blue-100 text-blue-800';
      case 'rencana':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'selesai':
        return 'Selesai';
      case 'berjalan':
        return 'Berjalan';
      case 'rencana':
        return 'Rencana';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Transparansi Desa Cibatu"
        description="Lihat transparansi keuangan Desa Cibatu, Purwakarta. Data APBDes, proyek pembangunan, dan bantuan sosial yang transparan dan akuntabel untuk masyarakat."
        keywords="Transparansi Desa, APBDes Desa, Proyek Pembangunan Desa, Bantuan Sosial Desa, Keuangan Desa Transparan, Akuntabilitas Desa"
        url="/transparansi"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "Transparansi Keuangan Desa Cibatu",
          "description": "Informasi transparan tentang keuangan, proyek, dan bantuan sosial Desa Cibatu",
          "url": "https://pemdescibatu2001.online/transparansi",
          "provider": {
            "@type": "GovernmentOrganization",
            "name": "Desa Cibatu"
          },
          "category": "Government Finance",
          "areaServed": {
            "@type": "Place",
            "name": "Desa Cibatu, Purwakarta"
          }
        }}
      />
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white h-[550px]">
        <div className="container mx-auto px-4 py-16 h-full flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Transparansi Desa</h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto">
              Informasi keuangan dan program pembangunan desa yang transparan
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold leading-tight text-white">APBDes {selectedYear}</div>
              <div className="text-xs opacity-90 mt-1 text-green-100">Anggaran Desa</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold leading-tight text-white">{proyekData.length}</div>
              <div className="text-xs opacity-90 mt-1 text-green-100">Proyek</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold leading-tight text-white">
                {apbdesData ? `${apbdesData.persentase}%` : '0%'}
              </div>
              <div className="text-xs opacity-90 mt-1 text-green-100">Realisasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* APBDes Card - Overlapping */}
      <div className="relative -mt-20 z-10 px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            {/* APBDes Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="bg-green-100 p-2 md:p-3 rounded-xl mr-3 md:mr-4">
                    <BarChart3 className="w-5 h-5 md:w-7 md:h-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">APBDes {selectedYear}</h2>
                    <p className="text-xs md:text-sm text-gray-500">Anggaran Pendapatan & Belanja Desa</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl px-3 md:px-4 py-2">
                  <Filter className="w-3 h-3 md:w-4 md:h-4 text-gray-500 mr-2" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="bg-transparent border-none focus:ring-0 text-xs md:text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data APBDes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : apbdesData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 md:p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">ANGGARAN</span>
                  </div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Total Anggaran</h3>
                  <p className="text-lg md:text-2xl font-bold text-green-700">
                    {formatCurrency(apbdesData.total_anggaran)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 md:p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">REALISASI</span>
                  </div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Realisasi</h3>
                  <p className="text-lg md:text-2xl font-bold text-blue-700">
                    {formatCurrency(apbdesData.realisasi)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 md:p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">PROGRESS</span>
                  </div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Persentase</h3>
                  <p className="text-lg md:text-2xl font-bold text-purple-700">
                    {apbdesData.persentase}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">Realisasi Anggaran</span>
                  <span className="text-sm font-bold text-gray-700">{apbdesData.persentase}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(apbdesData.persentase, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sumber Pendapatan */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Sumber Pendapatan</h3>
                  <div className="space-y-4">
                    {apbdesData.pendapatan.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">{item.sumber}</h4>
                          <span className="text-sm font-medium text-green-600">{item.persentase}%</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Anggaran: {formatCurrency(item.jumlah)}</p>
                          <p>Realisasi: {formatCurrency(item.realisasi)}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(item.persentase, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Penggunaan Anggaran */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Penggunaan Anggaran</h3>
                  <div className="space-y-4">
                    {apbdesData.belanja.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">{item.bidang}</h4>
                          <span className="text-sm font-medium text-blue-600">{item.persentase}%</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Anggaran: {formatCurrency(item.jumlah)}</p>
                          <p>Realisasi: {formatCurrency(item.realisasi)}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(item.persentase, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Belum ada data APBDes untuk tahun {selectedYear}</p>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      {/* Proyek & Bantuan Sosial Cards */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Proyek Pembangunan Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8">
            <div className="flex items-center mb-6 md:mb-8">
              <div className="bg-orange-100 p-2 md:p-3 rounded-xl mr-3 md:mr-4">
                <Building2 className="w-5 h-5 md:w-7 md:h-7 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Proyek Pembangunan</h2>
                <p className="text-xs md:text-sm text-gray-500">Program Pembangunan Infrastruktur</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 text-sm">Memuat data proyek...</p>
              </div>
            ) : proyekData.length > 0 ? (
              <div className="space-y-4">
                {proyekData.map((proyek) => (
                  <div key={proyek.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{proyek.nama}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proyek.status)}`}>
                        {getStatusText(proyek.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{proyek.deskripsi}</p>
                    <div className="text-sm text-gray-600 mb-2">
                      <p><strong>Lokasi:</strong> {proyek.lokasi}</p>
                      <p><strong>Anggaran:</strong> {formatCurrency(proyek.anggaran)}</p>
                      <p><strong>Progress:</strong> {proyek.progress}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(proyek.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada data proyek pembangunan</p>
              </div>
            )}
          </div>

          {/* Bantuan Sosial Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8">
            <div className="flex items-center mb-6 md:mb-8">
              <div className="bg-pink-100 p-2 md:p-3 rounded-xl mr-3 md:mr-4">
                <Users className="w-5 h-5 md:w-7 md:h-7 text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Bantuan Sosial</h2>
                <p className="text-xs md:text-sm text-gray-500">Program Bantuan Masyarakat</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 text-sm">Memuat data bantuan sosial...</p>
              </div>
            ) : bantuanSosialData && bantuanSosialData.program.length > 0 ? (
              <div className="space-y-4">
                {bantuanSosialData.program.map((program) => (
                  <div key={program.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{program.nama_program}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                        {getStatusText(program.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{program.deskripsi}</p>
                    <div className="text-sm text-gray-600">
                      <p><strong>Total Dana:</strong> {formatCurrency(program.total_dana)}</p>
                      <p><strong>Jumlah Penerima:</strong> {formatNumber(program.jumlah_penerima)} orang</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada data bantuan sosial</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Content Below */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparansi Terbuka</h3>
            <p className="text-gray-600 leading-relaxed">
              Data transparansi ini diperbarui secara berkala untuk memberikan informasi yang akurat dan terkini.
              Kami berkomitmen untuk menjaga transparansi dalam pengelolaan keuangan dan program pembangunan desa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transparansi;
