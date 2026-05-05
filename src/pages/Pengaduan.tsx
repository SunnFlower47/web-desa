import React, { useState } from 'react';
import { FileText, Clock, Users, Shield, User, Phone, MapPin, Mail, AlertCircle, Camera, Send } from 'lucide-react';
import { api } from '../services/api';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Pengaduan: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();

  const [formData, setFormData] = useState({
    nama_pelapor: '',
    telepon: '',
    nik_pelapor: '',
    email: '',
    alamat: '',
    kategori: '',
    prioritas: 'sedang',
    judul: '',
    deskripsi: '',
    lokasi: '',
    foto: null as FileList | null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string | FileList | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi form
    if (!formData.nama_pelapor || !formData.alamat || !formData.judul || !formData.deskripsi || !formData.kategori) {
      setError('Mohon lengkapi semua field yang wajib diisi (nama, alamat, judul, deskripsi, dan kategori).');
      setLoading(false);
      return;
    }

    try {
      // Debug form data
      console.log('Pengaduan form data:', formData);

      const response = await api.submitPengaduan(formData);

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Terjadi kesalahan saat mengirim pengaduan.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 5) {
      setError('Maksimal 5 foto yang dapat diupload.');
      return;
    }
    handleInputChange('foto', files);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengaduan Terkirim!</h2>
          <p className="text-gray-600 mb-6">
            Terima kasih atas pengaduan Anda. Tim kami akan memproses pengaduan ini dalam 1-3 hari kerja.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                nama_pelapor: '',
                telepon: '',
                nik_pelapor: '',
                email: '',
                alamat: '',
                kategori: '',
                prioritas: 'sedang',
                judul: '',
                deskripsi: '',
                lokasi: '',
                foto: null
              });
            }}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Kirim Pengaduan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Pengaduan Desa Cibatu"
        description="Kirim pengaduan dan keluhan ke Pemerintah Desa Cibatu, Purwakarta. Layanan pengaduan online yang aman, cepat, dan responsif untuk meningkatkan pelayanan desa."
        keywords="Pengaduan Desa, Keluhan Desa, Laporan Masyarakat, Pengaduan Online Desa, Layanan Pengaduan Desa, Komplain Desa"
        url="/pengaduan"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Layanan Pengaduan Desa Cibatu",
          "description": "Layanan pengaduan dan keluhan online untuk warga Desa Cibatu",
          "url": "https://pemdescibatu2001.online/pengaduan",
          "provider": {
            "@type": "GovernmentOrganization",
            "name": "Desa Cibatu"
          },
          "serviceType": "Complaint Service",
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
            backgroundImage: 'url(/foto-sawah-1.webp)',
            filter: 'hue-rotate(60deg) saturate(1.5) brightness(0.8)'
          }}
        ></div>
        <div className="absolute inset-0 bg-green-600/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Layanan Pengaduan</h1>
            <p className="text-xl text-green-100 mb-8">
              Laporkan masalah atau keluhan Anda kepada pemerintah desa dengan mudah dan cepat
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">1-3</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Hari Proses</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">24/7</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Layanan</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">100%</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Respon</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Overlapping */}
      <div className="relative -mt-16 z-10 px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Form Pengaduan</h2>
                <p className="text-gray-600">Isi form di bawah ini untuk melaporkan masalah atau keluhan Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Data Pelapor */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Data Pelapor
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Masukkan nama lengkap"
                        value={formData.nama_pelapor}
                        onChange={(e) => handleInputChange('nama_pelapor', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telepon
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Masukkan nomor telepon"
                          value={formData.telepon}
                          onChange={(e) => handleInputChange('telepon', e.target.value)}
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIK (Opsional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Masukkan NIK (16 digit)"
                        value={formData.nik_pelapor}
                        onChange={(e) => handleInputChange('nik_pelapor', e.target.value)}
                        maxLength={16}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Masukkan email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap *
                      </label>
                      <div className="relative">
                        <textarea
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                          rows={3}
                          placeholder="Masukkan alamat lengkap"
                        value={formData.alamat}
                        onChange={(e) => handleInputChange('alamat', e.target.value)}
                          required
                        />
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Pengaduan */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Data Pengaduan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.kategori}
                        onChange={(e) => handleInputChange('kategori', e.target.value)}
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="infrastruktur">Infrastruktur</option>
                        <option value="keamanan">Keamanan</option>
                        <option value="kebersihan">Kebersihan</option>
                        <option value="administrasi">Administrasi</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioritas
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.prioritas}
                        onChange={(e) => handleInputChange('prioritas', e.target.value)}
                      >
                        <option value="rendah">Rendah</option>
                        <option value="sedang">Sedang</option>
                        <option value="tinggi">Tinggi</option>
                        <option value="darurat">Darurat</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Pengaduan *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Ringkasan singkat masalah yang dilaporkan"
                        value={formData.judul}
                        onChange={(e) => handleInputChange('judul', e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Lengkap *
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        rows={4}
                        placeholder="Jelaskan secara detail masalah yang Anda laporkan..."
                        value={formData.deskripsi}
                        onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Kejadian
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Contoh: Kp Cibatu Kolot RT 009/004"
                        value={formData.lokasi}
                        onChange={(e) => handleInputChange('lokasi', e.target.value)}
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foto Pendukung */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-green-600" />
                    Foto Pendukung (Opsional)
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                    <input
                      type="file"
                      id="foto-pendukung"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="foto-pendukung" className="cursor-pointer">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-2">Klik untuk memilih foto</p>
                      <p className="text-sm text-gray-500">(Maksimal 5 foto)</p>
                    </label>
                    {formData.foto && (
                      <div className="mt-4">
                        <p className="text-sm text-green-600">
                          {formData.foto.length} foto dipilih
                        </p>
                      </div>
                    )}
                  </div>
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    loading ? 'bg-green-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim Pengaduan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Kirim Pengaduan</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Informasi Penting & Kontak Darurat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informasi Penting */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-green-600" />
                  Informasi Penting
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Pengaduan akan diproses dalam 1-3 hari kerja
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Prioritas darurat akan diproses segera
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Foto pendukung membantu proses investigasi
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Data pribadi akan dijaga kerahasiaannya
                  </li>
                </ul>
              </div>

              {/* Kontak Darurat */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Kontak Darurat
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Kantor Desa: -</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    <span>WhatsApp: -</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Email: desacibatu.2001@gmail.com</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Kontak Darurat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaduan;
