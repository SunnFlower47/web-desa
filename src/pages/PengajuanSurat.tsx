import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, User, MapPin, CheckCircle, AlertCircle, Loader2, PlusCircle, Mail, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface SuratType {
  id: string;
  name: string;
  description: string;
  persyaratan?: string;
  form_json?: any[];
  icon: string;
  color: string;
  category?: string;
  has_template?: boolean;
  virtual_id?: string;
}

interface FormData {
  penduduk_id: string;
  nik_pengaju: string;
  nama_pengaju: string;
  email_pengaju: string;
  no_hp_pengaju: string;
  jenis_surat: string;
  keperluan: string;
  tujuan: string;
  tanggal_surat: string;
  tanggal_lahir: string;
  keterangan_tambahan: string;
  data_tambahan: { [key: string]: any };
  file_lampiran: File | null;
}

const PengajuanSurat: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useScrollToTop();

  const [suratTypes, setSuratTypes] = useState<SuratType[]>([]);
  const [selectedSuratType, setSelectedSuratType] = useState<SuratType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormData>({
    penduduk_id: '',
    nik_pengaju: '',
    nama_pengaju: '',
    email_pengaju: '',
    no_hp_pengaju: '',
    jenis_surat: '',
    keperluan: '',
    tujuan: '',
    tanggal_surat: new Date().toISOString().split('T')[0],
    tanggal_lahir: '', // Tambahkan ini
    keterangan_tambahan: '',
    data_tambahan: {},
    file_lampiran: null
  });

  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.useRef<HTMLDivElement>(null);

  // Fungsi untuk reset captcha setelah verifikasi (agar bisa dipakai lagi jika gagal)
  const resetCaptcha = () => {
    setCaptchaToken(null);
    if (typeof (window as any).grecaptcha !== 'undefined') {
      try {
        (window as any).grecaptcha.reset();
      } catch (e) {
        // Abaikan jika memang tidak ada widget yang aktif
        console.log('No reCAPTCHA widget to reset');
      }
    }
  };

  useEffect(() => {
    // Memastikan reCAPTCHA v2 dirender saat masuk step 3
    if (step === 3) {
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
    }
  }, [step, loading]); // Tambahkan 'loading' agar terpicu setelah loading selesai

  // Load data dari sessionStorage saat pertama kali buka halaman
  useEffect(() => {
    const savedData = sessionStorage.getItem('pengajuan_surat_draft');
    if (savedData) {
      try {
        // Decode dari Base64
        const decoded = atob(savedData);
        const parsed = JSON.parse(decoded);
        
        // Cek apakah draft sudah kadaluwarsa (misal: 30 menit)
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (parsed.timestamp && (now - parsed.timestamp < thirtyMinutes)) {
            setStep(parsed.step);
            setVerified(parsed.verified);
            setSelectedSuratType(parsed.selectedSuratType);
            
            // Pastikan file_lampiran dikosongkan karena File object tidak bisa disimpan di sessionStorage
            setFormData({
                ...parsed.formData,
                file_lampiran: null
            });
        } else {
            console.log('Draft pengajuan sudah kadaluwarsa.');
            sessionStorage.removeItem('pengajuan_surat_draft');
        }
      } catch (e) {
        console.error('Gagal memuat draft pengajuan:', e);
        sessionStorage.removeItem('pengajuan_surat_draft');
      }
    }

    const fetchSuratTypes = async () => {
      try {
        const response = await api.getSuratTypes();
        setSuratTypes(response.data || []);
      } catch (error) {
        console.error('Error fetching surat types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuratTypes();
  }, []);

  // Simpan data ke sessionStorage setiap ada perubahan
  useEffect(() => {
    if (!loading) {
      // Buat salinan data tanpa file_lampiran
      const { file_lampiran, ...dataToSave } = formData;
      
      const draftData = JSON.stringify({
        formData: dataToSave,
        step,
        verified,
        selectedSuratType,
        timestamp: Date.now()
      });
      
      sessionStorage.setItem('pengajuan_surat_draft', btoa(draftData));
    }
  }, [formData, step, verified, selectedSuratType, loading]);

  const handleSuratTypeSelect = (suratType: SuratType) => {
    setSelectedSuratType(suratType);
    setFormData(prev => ({ ...prev, jenis_surat: suratType.id }));
    setStep(2);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDataTambahanChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      data_tambahan: { ...prev.data_tambahan, [field]: value }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, file_lampiran: 'File harus berformat PDF' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file_lampiran: 'Ukuran file maksimal 2MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, file_lampiran: file }));
      setErrors(prev => ({ ...prev, file_lampiran: '' }));
    }
  };

  const verifyNik = async () => {
    if (!formData.nik_pengaju || formData.nik_pengaju.length < 16) {
      setErrors(prev => ({ ...prev, nik_pengaju: 'Masukkan 16 digit NIK' }));
      return;
    }

    if (!formData.tanggal_lahir) {
      setErrors(prev => ({ ...prev, tanggal_lahir: 'Masukkan tanggal lahir sesuai KTP' }));
      return;
    }

    // reCAPTCHA v3 (Invisible) ditangani otomatis oleh ApiService.request
    setVerifying(true);
    try {
      const response = await api.searchPenduduk({ 
        nik: formData.nik_pengaju, 
        tanggal_lahir: formData.tanggal_lahir 
      });
      
      if (response.success) {
        // Karena server hanya kirim true & ID, kita set penduduk_id
        setFormData(prev => ({
          ...prev,
          penduduk_id: response.data.id
        }));
        setVerified(true);
        setErrors(prev => ({ ...prev, nik_pengaju: '', tanggal_lahir: '' }));
      } else {
        setErrors(prev => ({ ...prev, nik_pengaju: response.message || 'Data tidak cocok' }));
        setVerified(false);
        resetCaptcha();
      }
    } catch (error: any) {
      console.error('Error verifying NIK:', error);
      setErrors(prev => ({ ...prev, nik_pengaju: error.message || 'Gagal verifikasi' }));
      resetCaptcha();
    } finally {
      setVerifying(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validasi Penduduk
    if (!formData.penduduk_id) {
      newErrors.nik_pengaju = 'Harap verifikasi NIK terlebih dahulu';
    }

    // Validasi Jenis Surat Lainnya (Jika pilih kategori Surat Lainnya)
    if (selectedSuratType?.id === 'surat-lainnya' || (selectedSuratType as any)?.virtual_id === 'surat-lainnya') {
       if (!selectedSuratType?.id || selectedSuratType.id === 'surat-lainnya') {
         newErrors.surat_type_dropdown = 'Harap pilih jenis surat lainnya';
       }
    }

    // Validasi NIK
    if (!formData.nik_pengaju) {
      newErrors.nik_pengaju = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(formData.nik_pengaju)) {
      newErrors.nik_pengaju = 'NIK harus 16 digit angka';
    }

    // Validasi nama
    if (!formData.nama_pengaju.trim()) {
      newErrors.nama_pengaju = 'Nama wajib diisi';
    }

    // Validasi email
    if (formData.email_pengaju && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_pengaju)) {
      newErrors.email_pengaju = 'Format email tidak valid';
    }

    // Validasi keperluan
    if (!formData.keperluan.trim()) {
      newErrors.keperluan = 'Keperluan wajib diisi';
    }

    // Validasi tanggal surat
    if (!formData.tanggal_surat) {
      newErrors.tanggal_surat = 'Tanggal surat wajib diisi';
    }

    // Validasi file lampiran
    if (!formData.file_lampiran) {
      newErrors.file_lampiran = 'File persyaratan (PDF) wajib diunggah';
    }

    // Validasi data tambahan berdasarkan form_json
    if (selectedSuratType && selectedSuratType.form_json) {
      selectedSuratType.form_json.forEach(field => {
        if (!formData.data_tambahan[field.name]) {
          newErrors[`data_tambahan.${field.name}`] = `${field.label} wajib diisi`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Legacy helpers removed - using dynamic form_json instead

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    if (!captchaToken) {
      setErrors({ submit: 'Harap centang kotak "I\'m not a robot" terlebih dahulu' });
      return;
    }
 
    setLoading(true);
    try {
      const submitData = new FormData();
      // Use the actual master ID if it was chosen from dropdown, otherwise use the template ID
      submitData.append('surat_type', selectedSuratType?.id || '');
      submitData.append('penduduk_id', formData.penduduk_id || '');
      submitData.append('nik', formData.nik_pengaju || ''); // WAJIB untuk keamanan ganda di backend
      submitData.append('tanggal_lahir', formData.tanggal_lahir || ''); // WAJIB untuk keamanan ganda di backend
      submitData.append('keperluan', formData.keperluan);
      submitData.append('tujuan', formData.tujuan);
      submitData.append('tanggal_surat', formData.tanggal_surat);
      submitData.append('email_pengaju', formData.email_pengaju);
      submitData.append('keterangan_tambahan', formData.keterangan_tambahan || '');
      submitData.append('data_tambahan', JSON.stringify(formData.data_tambahan));
      
      if (formData.file_lampiran) {
        submitData.append('file_lampiran', formData.file_lampiran);
      }

      // Sertakan captchaToken agar lolos Middleware di server
      const response = await api.submitSuratPengajuan(submitData, { captchaToken });

      if (response.success) {
        // Bersihkan draft karena sudah berhasil
        sessionStorage.removeItem('pengajuan_surat_draft');
        
        navigate('/status-surat', {
          state: {
            nomorSurat: response.data?.nomor_surat,
            message: 'Pengajuan surat berhasil dikirim',
            success: true
          }
        });
      } else {
        // Jika ada error validasi detail dari server
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat().join(', ');
            setErrors({ submit: `Gagal: ${errorMessages}` });
        } else {
            setErrors({ submit: response.message || 'Terjadi kesalahan saat mengirim pengajuan' });
        }
      }
    } catch (error: any) {
      console.error('Error submitting surat:', error);
      if (error.data?.errors) {
        const errorMessages = Object.values(error.data.errors).flat().join(', ');
        setErrors({ submit: `Gagal Validasi: ${errorMessages}` });
      } else {
        setErrors({ submit: error.message || 'Terjadi kesalahan saat mengirim pengajuan' });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
          <span className="text-sm font-semibold">1</span>
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
          <span className="text-sm font-semibold">2</span>
        </div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
          <span className="text-sm font-semibold">3</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <SEO
        title="Pengajuan Surat Online - Desa Cibatu"
        description="Ajukan surat keterangan online di Desa Cibatu, Purwakarta. Layanan surat SKU, SKTM, Domisili, dan surat keterangan lainnya dengan proses cepat dan mudah."
        keywords="Pengajuan Surat Online, Surat Keterangan, SKU, SKTM, Domisili, Desa Cibatu, Purwakarta, Layanan Online"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-green-600 text-white py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                to="/layanan-surat"
                className="flex items-center space-x-2 text-green-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Pengajuan Surat Online</h1>
            <p className="text-green-100 mt-2">Ajukan surat administrasi desa secara online</p>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        {step === 1 && (
            <div className="space-y-8">
              {!selectedSuratType?.id ? (
                // Tahap 1.1: Surat Utama (Template) + Kartu "Surat Lainnya"
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suratTypes.filter(t => t.has_template).map((type) => (
                    <div
                        key={type.id}
                        onClick={() => handleSuratTypeSelect(type)}
                        className="bg-white rounded-2xl p-6 border-2 border-gray-100 transition-all cursor-pointer hover:shadow-lg hover:border-green-300"
                    >
                        <div className="flex flex-col h-full">
                        <div className="flex items-start space-x-4 mb-4">
                            <div className={`w-12 h-12 ${getColorForSuratType(type.color)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <span className={type.icon}></span>
                            </div>
                            <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{type.name}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{type.description}</p>
                            </div>
                        </div>
                        <div className="mt-auto flex items-center text-green-600 font-bold text-xs uppercase">
                            <span>Pilih Template</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                        </div>
                    </div>
                    ))}

                    {/* Kartu "Surat Lainnya" dengan Ikon Plus */}
                    <div
                    onClick={() => setSelectedSuratType({ id: 'browse-manual' } as any)}
                    className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300 transition-all cursor-pointer hover:shadow-lg hover:border-orange-400"
                    >
                    <div className="flex flex-col h-full">
                        <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <PlusCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Surat Lainnya</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Lihat daftar jenis surat manual lainnya</p>
                        </div>
                        </div>
                        <div className="mt-auto flex items-center text-orange-600 font-bold text-xs uppercase">
                            <span>Lihat Daftar</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                    </div>
                </div>
              ) : selectedSuratType?.id === 'browse-manual' ? (
                // Tahap 1.2: Daftar Kartu Surat Manual (Hasil klik "Surat Lainnya")
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <PlusCircle className="w-5 h-5 mr-2 text-orange-600" />
                            Pilih Jenis Surat Manual
                        </h2>
                        <button 
                            onClick={() => setSelectedSuratType(null)}
                            className="text-sm text-gray-500 hover:text-gray-800 flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suratTypes.filter(t => !t.has_template).map((type) => (
                            <div
                                key={type.id}
                                onClick={() => handleSuratTypeSelect(type)}
                                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center group-hover:bg-orange-100">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{type.name}</h4>
                                            <p className="text-xs text-gray-500">{type.description || 'Proses manual oleh admin'}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              ) : null}
            </div>
        )}

        {/* Step 2: Data Pribadi */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Data Pribadi Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Data Pribadi</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.nik_pengaju}
                      onChange={(e) => {
                        handleInputChange('nik_pengaju', e.target.value);
                        setVerified(false);
                      }}
                      className={`input-mobile w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.nik_pengaju ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan NIK 16 digit"
                      maxLength={16}
                    />
                  </div>
                  {errors.nik_pengaju && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.nik_pengaju}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.tanggal_lahir}
                      onChange={(e) => {
                        handleInputChange('tanggal_lahir', e.target.value);
                        setVerified(false);
                      }}
                      className={`input-mobile w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.tanggal_lahir ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      onClick={verifyNik}
                      disabled={verifying || verified}
                      className="absolute right-2 top-2 px-3 py-1 bg-green-600 text-white rounded-md text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                      {verifying ? '...' : (verified ? 'OK' : 'Verifikasi')}
                    </button>
                  </div>
                  
                  {/* reCAPTCHA v2 dihapus dari sini karena sekarang pakai v3 otomatis */}

                  {verified && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Data Terverifikasi
                    </p>
                  )}
                  {errors.tanggal_lahir && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.tanggal_lahir}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama_pengaju}
                    readOnly={verified}
                    onChange={(e) => handleInputChange('nama_pengaju', e.target.value)}
                    className={`input-mobile w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      verified ? 'bg-gray-50' : ''
                    } ${
                      errors.nama_pengaju ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.nama_pengaju && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.nama_pengaju}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email_pengaju}
                    onChange={(e) => handleInputChange('email_pengaju', e.target.value)}
                    className={`input-mobile w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.email_pengaju ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan email (opsional)"
                    inputMode="email"
                  />
                  {errors.email_pengaju && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email_pengaju}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. HP
                  </label>
                  <input
                    type="tel"
                    value={formData.no_hp_pengaju}
                    onChange={(e) => handleInputChange('no_hp_pengaju', e.target.value)}
                    className="input-mobile w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Masukkan nomor HP (opsional)"
                    inputMode="tel"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(3)}
                  disabled={!verified}
                  className="btn-mobile bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>Lanjutkan</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Data Tambahan & Alamat */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Data Tambahan Card - DYNAMIC RENDERER */}
            {selectedSuratType && selectedSuratType.form_json && selectedSuratType.form_json.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Data Tambahan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedSuratType.form_json.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} <span className="text-red-500">*</span>
                      </label>

                      {field.type === 'select' ? (
                        <select
                          value={formData.data_tambahan[field.name] || ''}
                          onChange={(e) => handleDataTambahanChange(field.name, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors[`data_tambahan.${field.name}`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Pilih {field.label}</option>
                          {field.options && Array.isArray(field.options) ? field.options.map((opt: any) => (
                            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                              {typeof opt === 'string' ? opt : opt.label}
                            </option>
                          )) : (
                            // Fallback options for legacy/manual input if any
                            field.name === 'jenis_kelamin_bayi' ? (
                                <>
                                    <option value="LAKI-LAKI">LAKI-LAKI</option>
                                    <option value="PEREMPUAN">PEREMPUAN</option>
                                </>
                            ) : null
                          )}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={formData.data_tambahan[field.name] || ''}
                          onChange={(e) => handleDataTambahanChange(field.name, e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors[`data_tambahan.${field.name}`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={formData.data_tambahan[field.name] || ''}
                          onChange={(e) => handleDataTambahanChange(field.name, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors[`data_tambahan.${field.name}`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                        />
                      )}

                      {errors[`data_tambahan.${field.name}`] && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors[`data_tambahan.${field.name}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keperluan & Tujuan Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Detail Keperluan</h2>
              </div>

              <div className="space-y-6">
                {/* Persyaratan Muncul Di Sini */}
                {selectedSuratType?.persyaratan && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl mb-6">
                        <h4 className="text-xs font-bold text-orange-800 uppercase mb-2 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Persyaratan Dokumen:
                        </h4>
                        <p className="text-sm text-orange-700 whitespace-pre-line italic leading-relaxed">
                            {selectedSuratType.persyaratan}
                        </p>
                    </div>
                )}

                {/* Field Keperluan / Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {!selectedSuratType?.has_template ? 'Deskripsi / Detail Keperluan' : 'Keperluan'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.keperluan}
                    onChange={(e) => handleInputChange('keperluan', e.target.value)}
                    rows={!selectedSuratType?.has_template ? 4 : 2}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.keperluan ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={!selectedSuratType?.has_template ? 'Jelaskan secara detail maksud dan tujuan pengajuan surat ini...' : 'Masukkan alasan/tujuan pengajuan surat'}
                  />
                  {errors.keperluan && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.keperluan}
                    </p>
                  )}
                </div>

                {/* Field Tujuan */}
                {selectedSuratType?.has_template && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tujuan Surat
                    </label>
                    <input
                      type="text"
                      value={formData.tujuan}
                      onChange={(e) => handleInputChange('tujuan', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Contoh: Puskesmas Cibatu, Bank BRI, dsb"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Pengajuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_surat}
                    onChange={(e) => handleInputChange('tanggal_surat', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.tanggal_surat ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.tanggal_surat && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.tanggal_surat}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan Tambahan / Catatan
                  </label>
                  <textarea
                    value={formData.keterangan_tambahan}
                    onChange={(e) => handleInputChange('keterangan_tambahan', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tambahkan catatan tambahan jika ada"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Unggah Berkas Persyaratan (PDF) <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <FileText className={`w-10 h-10 mb-2 ${formData.file_lampiran ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {formData.file_lampiran ? formData.file_lampiran.name : 'Klik untuk pilih file PDF (Maks. 2MB)'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Gabungkan semua syarat dokumen dalam satu file PDF</span>
                    </label>
                  </div>
                  {errors.file_lampiran && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.file_lampiran}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="mb-6 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-4">Harap selesaikan verifikasi keamanan di bawah ini sebelum mengirim:</p>
                <div ref={recaptchaRef}></div>
                
                {errors.submit && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg w-full">
                    <p className="text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.submit}
                    </p>
                    </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Kirim Pengajuan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </React.Fragment>
  );
};

// Helper functions
function getIconForSuratType(id: string): React.ReactNode {
  const iconMap: { [key: string]: React.ReactNode } = {
    'sku': <FileText className="w-6 h-6" />,
    'keterangan-domisili': <MapPin className="w-6 h-6" />,
    'pengantar': <FileText className="w-6 h-6" />,
    'pindah': <User className="w-6 h-6" />,
    'kematian': <User className="w-6 h-6" />,
    'kelahiran': <User className="w-6 h-6" />,
    'sktm_dewasa': <CheckCircle className="w-6 h-6" />,
    'sktm_anak': <CheckCircle className="w-6 h-6" />
  };
  return iconMap[id] || <FileText className="w-6 h-6" />;
}

function getColorForSuratType(color: string): string {
  const colorMap: { [key: string]: string } = {
    'green': 'text-green-600 bg-green-100',
    'blue': 'text-blue-600 bg-blue-100',
    'red': 'text-red-600 bg-red-100',
    'purple': 'text-purple-600 bg-purple-100',
    'indigo': 'text-indigo-600 bg-indigo-100',
    'gray': 'text-gray-600 bg-gray-100'
  };
  return colorMap[color] || 'text-gray-600 bg-gray-100';
}

export default PengajuanSurat;
