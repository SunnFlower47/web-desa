import React from "react";
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSemiStaticData } from '../hooks/useApiCache';
import { api } from '../services/api';

const GovernmentHeader: React.FC = () => {
  // Menggunakan cache SEMI_STATIC untuk data info desa (6 jam cache)
  const { data: desaInfo, loading } = useSemiStaticData(
    () => api.getDesaInfo()
  );

  if (loading) {
    return (
      <div className="bg-green-800 text-white py-3 px-4 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-5 bg-green-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-800 text-white py-2 px-2 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-green-200" />
              <span className="text-sm">
                {desaInfo?.desa?.alamat_lengkap || 'Jl. Cibatu Km. 15, Desa Cibatu, Kec. Cibatu, Kab. Purwakarta'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-green-200" />
              <span className="text-sm">{desaInfo?.desa?.telepon || '+62 838-7982-7147'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-green-200" />
              <span className="text-sm">{desaInfo?.desa?.email || 'desacibatu.2001@gmail.com'}</span>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Running Text */}
        <div className="lg:hidden h-7 flex items-center overflow-hidden relative">
          <div className="animate-scroll whitespace-nowrap text-sm flex items-center" style={{ animationDelay: '0.5s' }}>
            {/* First set */}
            <span className="mr-12">
              <MapPin className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.alamat_lengkap || 'Jl. Cibatu Km. 15, Desa Cibatu, Kec. Cibatu, Kab. Purwakarta'}, {desaInfo?.desa?.kode_pos || '41151'}
            </span>
            <span className="mr-12">
              <Phone className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.telepon || '0+62 838-7982-7147'}
            </span>
            <span className="mr-12">
              <Mail className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.email || 'desacibatu.2001@gmail.com'}
            </span>
            {/* Second set untuk seamless loop */}
            <span className="mr-12">
              <MapPin className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.alamat_lengkap || 'Jl. Cibatu Km. 15, Desa Cibatu, Kec. Cibatu, Kab. Purwakarta'}, {desaInfo?.desa?.kode_pos || '41151'}
            </span>
            <span className="mr-12">
              <Phone className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.telepon || '0+62 838-7982-7147'}
            </span>
            <span className="mr-12">
              <Mail className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.email || 'desacibatu.2001@gmail.com'}
            </span>
            {/* Third set untuk extra smooth loop */}
            <span className="mr-12">
              <MapPin className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.alamat_lengkap || 'Jl. Cibatu Km. 15, Desa Cibatu, Kec. Cibatu, Kab. Purwakarta'}, {desaInfo?.desa?.kode_pos || '41151'}
            </span>
            <span className="mr-12">
              <Phone className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.telepon || '0+62 838-7982-7147'}
            </span>
            <span className="mr-12">
              <Mail className="w-3 h-3 mr-1 text-green-200 inline" />
              {desaInfo?.desa?.email || 'desacibatu.2001@gmail.com'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentHeader;
