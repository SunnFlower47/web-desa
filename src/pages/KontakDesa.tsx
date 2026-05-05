import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Globe, Users, Building, Send } from 'lucide-react';
import { api } from '../services/api';
import { useSemiStaticData } from '../hooks/useApiCache';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const KontakDesa: React.FC = () => {
  // Scroll to top when component mounts
  useScrollToTop();


  // Menggunakan cache hook untuk contact info
  const { data: desaInfo, loading: desaLoading } = useSemiStaticData(
    () => api.getDesaInfo()
  );

  const [kontakDesa, setKontakDesa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    subjek: '',
    pesan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchKontakDesa = async () => {
      try {
        // Fetch kontak desa
        const kontakResponse = await api.getKontakDesa();
        setKontakDesa(kontakResponse.data.kontak_publik || []);
      } catch (error) {
        console.error('Error fetching kontak desa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKontakDesa();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await api.submitContact(formData);
      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(response.message || 'Pesan berhasil dikirim!');
        setFormData({
          nama: '',
          email: '',
          telepon: '',
          subjek: '',
          pesan: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.message || 'Terjadi kesalahan saat mengirim pesan');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Terjadi kesalahan saat mengirim pesan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjekOptions = [
    'Informasi Umum',
    'Layanan Surat',
    'Bantuan Sosial',
    'Pengaduan',
    'Saran & Masukan',
    'Lainnya'
  ];

  if (desaLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat informasi kontak...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Kontak Desa Cibatu"
        description="Hubungi Pemerintah Desa Cibatu, Purwakarta. Informasi kontak lengkap, jam kerja, dan cara mengirim pesan. Layanan responsif dalam 24 jam."
        keywords="Kontak Desa Cibatu, Hubungi Desa, Alamat Desa, Telepon Desa, Email Desa, Jam Kerja Desa, Layanan Desa"
        url="/kontak"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Kontak Desa Cibatu",
          "description": "Halaman kontak dan informasi komunikasi dengan Pemerintah Desa Cibatu",
          "url": "https://pemdescibatu2001.online/kontak",
          "mainEntity": {
            "@type": "GovernmentOrganization",
            "name": "Desa Cibatu",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+62 838-7982-7147",
              "email": "desacibatu.2001@gmail.com",
              "contactType": "customer service",
              "availableLanguage": "Indonesian",
              "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "16:00"
              }
            }
          }
        }}
      />
      {/* Hero Section with Green Background */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Green Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontak Desa Cibatu</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Hubungi kami untuk informasi lebih lanjut atau kirim pesan langsung
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">{kontakDesa.length}</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Kontak</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">8</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Jam Kerja</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold leading-tight text-white">3</div>
                <div className="text-xs opacity-90 mt-1 text-green-100">Cara Kontak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards - Overlapping */}
      <div className="relative -mt-16 z-10 px-4">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
            {/* Informasi Kontak Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Informasi Kontak</h2>
              </div>

              <div className="space-y-6">
                {/* Alamat Kantor Desa */}
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Alamat Kantor Desa</h3>
                    <p className="text-gray-600">
                      {desaInfo?.desa?.alamat_lengkap || 'Jl. Cibatu Km. 15, Desa Cibatu, Kec. Cibatu, Kab. Purwakarta, Cibatu, Purwakarta, Jawa Barat 41161'}
                    </p>
                  </div>
                </div>

                {/* Telepon */}
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-600">{desaInfo?.desa?.telepon || '+62 838-7982-7147'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {desaInfo?.desa?.jam_kerja || 'Senin - Jumat, 08:00 - 16:00 WIB'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{desaInfo?.desa?.email || 'desacibatu.2001@gmail.com'}</p>
                    <p className="text-sm text-gray-500 mt-1">Senin - Jumat, 08:00 - 16:00 WIB</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start space-x-4">
                  <Globe className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                    <p className="text-gray-600">{desaInfo?.desa?.website || 'https://pemdescibatu2001.online'}</p>
                    <p className="text-sm text-gray-500 mt-1">Informasi terkini desa</p>
                  </div>
                </div>
              </div>

              {/* Jam Pelayanan */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Jam Pelayanan</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Senin - Jumat</span>
                    <span className="font-medium">08:00 - 16:00 WIB</span>
                  </div>


                </div>
              </div>
            </div>

            {/* Form Kirim Pesan Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <Send className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Kirim Pesan</h2>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{submitMessage}</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama Lengkap */}
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="contoh@email.com"
                  />
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="telepon"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                {/* Subjek */}
                <div>
                  <label htmlFor="subjek" className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek *
                  </label>
                  <select
                    id="subjek"
                    name="subjek"
                    value={formData.subjek}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="">Pilih subjek</option>
                    {subjekOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pesan */}
                <div>
                  <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    placeholder="Tuliskan pesan Anda di sini..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Kontak Perangkat Desa */}
        {kontakDesa.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Kontak Perangkat Desa</h2>
              <p className="text-gray-600">Hubungi perangkat desa untuk informasi lebih lanjut</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kontakDesa.map((kontak, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Building className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{kontak.nama}</h3>
                      <p className="text-sm text-gray-600">{kontak.jabatan}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {kontak.telepon && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-green-600 mr-2" />
                        <span>{kontak.telepon}</span>
                      </div>
                    )}
                    {kontak.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-green-600 mr-2" />
                        <span>{kontak.email}</span>
                      </div>
                    )}
                    {kontak.alamat && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{kontak.alamat}</span>
                      </div>
                    )}
                    {kontak.jam_operasional && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-green-600 mr-2" />
                        <span>{kontak.jam_operasional}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KontakDesa;
