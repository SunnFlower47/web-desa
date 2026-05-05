import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapPin, Building2, School, Hospital, ShoppingCart, Users, Navigation } from 'lucide-react';
import SEO from '../components/SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface Facility {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  description: string;
  icon: React.ReactNode;
  color: string;
}

const PetaDesa: React.FC = () => {
  useScrollToTop();

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapType, setMapType] = useState<'osm' | 'satellite'>('osm');
  const [mapId] = useState(() => `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const mapRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const facilities: Facility[] = useMemo(() => [
    {
      id: 'kantor-kepala-desa',
      name: 'Kantor Kepala Desa Cibatu',
      type: 'Pemerintahan',
      coordinates: [-6.500228357750611, 107.53415174613022],
      description: 'Kantor pemerintahan desa yang melayani administrasi kependudukan dan keperluan administrasi lainnya.',
      icon: <Building2 className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'puskesmas',
      name: 'UTPD Puskesmas Cibatu Purwakarta',
      type: 'Kesehatan',
      coordinates: [-6.500277659624578, 107.53441259095574],
      description: 'Pusat kesehatan masyarakat yang melayani kesehatan warga Desa Cibatu dan sekitarnya.',
      icon: <Hospital className="w-5 h-5" />,
      color: 'bg-red-500'
    },
    {
      id: 'lapangan-sepakbola',
      name: 'Lapangan Sepakbola Cibatu',
      type: 'Olahraga',
      coordinates: [-6.500747709720885, 107.53463620933206],
      description: 'Lapangan olahraga untuk kegiatan sepakbola dan aktivitas olahraga lainnya.',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'kantor-kecamatan',
      name: 'Kantor Kecamatan Cibatu',
      type: 'Pemerintahan',
      coordinates: [-6.501592673156434, 107.53451211194638],
      description: 'Kantor pemerintahan tingkat kecamatan yang mengatur wilayah Kecamatan Cibatu.',
      icon: <Building2 className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'sma-negeri',
      name: 'SMA Negeri 1 Cibatu',
      type: 'Pendidikan',
      coordinates: [-6.502013341104894, 107.53371277878611],
      description: 'Sekolah menengah atas negeri yang memberikan pendidikan formal tingkat SMA.',
      icon: <School className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'masjid',
      name: 'Masjid Besar Al-Ikhlas',
      type: 'Keagamaan',
      coordinates: [-6.500196488184269, 107.53382592639795],
      description: 'Tempat ibadah umat Islam yang menjadi pusat kegiatan keagamaan di Desa Cibatu.',
      icon: <Building2 className="w-5 h-5" />,
      color: 'bg-yellow-500'
    },
    {
      id: 'pasar',
      name: 'Pasar Salasa Desa Cibatu',
      type: 'Ekonomi',
      coordinates: [-6.500145717748311, 107.53521289718616],
      description: 'Pasar tradisional yang menjadi pusat perekonomian dan perdagangan di Desa Cibatu.',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-orange-500'
    }
  ], []);

  const changeMapType = useCallback((type: 'osm' | 'satellite') => {
    if (!mapRef.current || !tileLayerRef.current) return;

    // Remove current tile layer
    mapRef.current.removeLayer(tileLayerRef.current);

    // Add new tile layer based on type
    const L = (window as any).L;
    if (type === 'satellite') {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
        maxZoom: 19
      });
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      });
    }

    tileLayerRef.current.addTo(mapRef.current);
    setMapType(type);
  }, []);

  const initializeMap = useCallback(() => {
    if (typeof window === 'undefined' || !(window as any).L) return;
    const L = (window as any).L;

    const mapElement = document.getElementById(mapId);
    if (!mapElement) return;

    // Cleanup instance lama
    if (mapRef.current) {
      try {
        mapRef.current.off();
        mapRef.current.remove();
      } catch (e) {
        console.warn('Error cleaning old map:', e);
      }
      mapRef.current = null;
    }

    if ((mapElement as any)._leaflet_id) {
      delete (mapElement as any)._leaflet_id;
    }

    const map = L.map(mapId, {
      preferCanvas: true,
      zoomControl: true,
      attributionControl: true,
      renderer: L.canvas()
    });

    mapRef.current = map;

    // Tile Layer
    tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Set initial view
    map.setView([-6.5005, 107.5342], 15);

    // Tambahkan marker fasilitas
    facilities.forEach((f) => {
      const marker = L.marker(f.coordinates).addTo(map);
      marker.bindPopup(`
        <div class="p-2">
          <div class="flex items-center mb-2">
            <div class="${f.color} text-white p-1 rounded mr-2">
              ${f.icon ? `<span>${(f.icon as any).props.children ?? ''}</span>` : ''}
            </div>
            <h3 class="font-semibold text-gray-800">${f.name}</h3>
          </div>
          <p class="text-sm text-gray-600 mb-2">${f.type}</p>
          <p class="text-xs text-gray-500">${f.description}</p>
        </div>
      `);
      marker.on('click', () => setSelectedFacility(f));
    });

    // Load GeoJSON Boundary
    fetch('/cibatu_boundary.geojson')
      .then(response => {
        if (!response.ok) throw new Error('GeoJSON file not found');
        return response.json();
      })
      .then(data => {
        const geoJsonLayer = L.geoJSON(data, {
          style: {
            color: '#16a34a',
            weight: 3,
            opacity: 0.8,
            fillColor: '#22c55a',
            fillOpacity: 0.1
          }
        }).addTo(map);

        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      })
      .catch(error => {
        console.warn('GeoJSON boundary not available:', error.message);
      });

    // Set map as loaded
    setMapLoaded(true);
    setTimeout(() => map.invalidateSize(), 300);
  }, [mapId, facilities]);

  useEffect(() => {
    // Reset loading state
    setMapLoaded(false);

    const loadLeaflet = () => {
      if (typeof window === 'undefined') return;

      if ((window as any).L) {
        initializeMap();
        return;
      }

      // Load CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!document.querySelector('script[src*="leaflet.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          console.log('Leaflet loaded, initializing map...');
          setTimeout(() => initializeMap(), 100);
        };
        script.onerror = () => {
          console.error('Failed to load Leaflet');
          setMapLoaded(false);
        };
        document.head.appendChild(script);
      } else {
        // Script already exists
        setTimeout(() => initializeMap(), 100);
      }
    };

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapLoaded(false);
    };
  }, [initializeMap]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Pemerintahan': return <Building2 className="w-4 h-4" />;
      case 'Kesehatan': return <Hospital className="w-4 h-4" />;
      case 'Pendidikan': return <School className="w-4 h-4" />;
      case 'Keagamaan': return <Building2 className="w-4 h-4" />;
      case 'Ekonomi': return <ShoppingCart className="w-4 h-4" />;
      case 'Olahraga': return <Users className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Peta Desa Cibatu" description="Peta interaktif Desa Cibatu" />

      <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Peta Interaktif Desa Cibatu</h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
            Jelajahi fasilitas dan lokasi penting di Desa Cibatu melalui peta interaktif
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 md:p-3 rounded-xl mr-3 md:mr-4">
                    <MapPin className="w-5 h-5 md:w-7 md:h-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900">Peta Interaktif Desa Cibatu</h2>
                    <p className="text-xs md:text-sm text-gray-500">Klik marker untuk informasi detail</p>
                  </div>
                </div>

                {/* Map Type Toggle - Mobile Responsive */}
                <div className="flex justify-center md:justify-end">
                  <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
                    <button
                      onClick={() => changeMapType('osm')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        mapType === 'osm'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="hidden sm:inline">Peta</span>
                      <span className="sm:hidden">🗺️</span>
                    </button>
                    <button
                      onClick={() => changeMapType('satellite')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        mapType === 'satellite'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="hidden sm:inline">Satelit</span>
                      <span className="sm:hidden">🛰️</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative z-0">
                <div
                  id={mapId}
                  className="w-full h-96 md:h-[500px] rounded-2xl border border-gray-200 relative z-0"
                  style={{ minHeight: '400px' }}
                >
                  {!mapLoaded && (
                    <div className="flex items-center justify-center h-full bg-gray-100 rounded-2xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat peta...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 md:p-3 rounded-xl mr-3 md:mr-4">
                  <Building2 className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">Daftar Fasilitas</h2>
                  <p className="text-xs md:text-sm text-gray-500">Klik untuk melihat detail</p>
                </div>
              </div>

              <div className="space-y-3">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    onClick={() => setSelectedFacility(facility)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedFacility?.id === facility.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`${facility.color} text-white p-2 rounded-lg mr-3 flex-shrink-0`}>
                        {getTypeIcon(facility.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                          {facility.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-2">{facility.type}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{facility.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedFacility && (
          <div className="mt-8 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start">
              <div className={`${selectedFacility.color} text-white p-3 rounded-xl mb-4 sm:mb-0 sm:mr-4 flex-shrink-0`}>
                {selectedFacility.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{selectedFacility.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedFacility.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Navigation className="w-4 h-4 mr-2" />
                  <span className="break-all">Koordinat: {selectedFacility.coordinates[0]}, {selectedFacility.coordinates[1]}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetaDesa;
