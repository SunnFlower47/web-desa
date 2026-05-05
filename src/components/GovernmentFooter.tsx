    import React from 'react';
    import { MapPin, Phone, Mail } from 'lucide-react';
    import { useStaticData } from '../hooks/useApiCache';
    import { api } from '../services/api';

    const GovernmentFooter: React.FC = () => {
    // Menggunakan cache STATIC untuk data info desa (24 jam cache - jarang berubah)
    const { data: desaInfo, loading: desaLoading } = useStaticData(
        () => api.getDesaInfo()
    );

    const loading = desaLoading;

    if (loading) {
        return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
            </div>
        </footer>
        );
    }

    return (
        <footer className="bg-gray-900 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo dan Info */}
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <img
                    src="/logo desa cibatu.png"
                    alt="Logo Desa Cibatu"
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                        // Fallback ke icon jika logo tidak ditemukan
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                        nextElement.style.display = 'block';
                        }
                    }}
                    />
                    <svg className="w-8 h-8 text-white hidden" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold">{desaInfo?.desa?.nama_desa || 'Desa Cibatu'}</h3>
                    <p className="text-sm text-gray-400">
                    {desaInfo?.desa?.kecamatan || 'Kec. Cibatu'}, {desaInfo?.desa?.kabupaten || 'Kab. Purwakarta'}
                    </p>
                </div>
                </div>
                <p className="text-gray-300 mb-4">
                {desaInfo?.deskripsi || 'Portal informasi desa yang menyediakan layanan administrasi online, data kependudukan, dan transparansi keuangan untuk masyarakat Desa Cibatu.'}
                </p>
                <div className="flex space-x-4">
                {/* Instagram */}
                <a href="https://www.instagram.com/cibatu_purwakarta?igsh=MTk0MDhoOTZ1YWF2dA==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
                {/* YouTube */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24h11.483v-9.294H9.692V11.01h3.116V8.414c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.309h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.676V1.325C24 .597 23.403 0 22.675 0z"/>
                </svg>
                </a>

                {/* Email */}
                <a href={`mailto:${desaInfo?.desa?.email || 'admin@desacibatu.com'}`} className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                </a>
                </div>
            </div>

            {/* Layanan */}
            <div>
                <h4 className="text-lg font-semibold mb-4">Layanan</h4>
                <ul className="space-y-2">
                <li><a href="/layanan-surat" className="text-gray-300 hover:text-white transition-colors">Layanan Surat</a></li>
                <li><a href="/status-surat" className="text-gray-300 hover:text-white transition-colors">Status Surat</a></li>
                <li><a href="/data-desa" className="text-gray-300 hover:text-white transition-colors">Data Desa</a></li>
                <li><a href="/transparansi" className="text-gray-300 hover:text-white transition-colors">Transparansi</a></li>
                <li><a href="/bantuan-sosial" className="text-gray-300 hover:text-white transition-colors">Bantuan Sosial</a></li>
                </ul>
            </div>

            {/* Kontak */}
            <div>
                <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{desaInfo?.desa?.alamat_lengkap || 'Jl. Cibatu Km. 15, Cibatu, Purwakarta, Jawa Barat 41161'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                    <Phone className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{desaInfo?.desa?.telepon || '+62 838-7982-7147'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                    <Mail className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{desaInfo?.desa?.email || 'desacibatu.2001@gmail.com'}</span>
                </li>
                </ul>
            </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <p className="text-gray-400 text-sm">
                    © 2024 {desaInfo?.desa?.nama_desa || 'Desa Cibatu'}. Semua hak dilindungi undang-undang.
                </p>
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/profil-desa" className="text-gray-400 hover:text-white text-sm transition-colors">Profil Desa</a>
                <a href="/kontak" className="text-gray-400 hover:text-white text-sm transition-colors">Kontak</a>
                <a href="/pengaduan" className="text-gray-400 hover:text-white text-sm transition-colors">Pengaduan</a>
                <a href="/kebijakan-data" className="text-gray-400 hover:text-white text-sm transition-colors">Kebijakan Data</a>
                </div>
            </div>
            </div>
        </div>
        </footer>
    );
    };

    export default GovernmentFooter;
