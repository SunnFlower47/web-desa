import React, { useEffect, useRef } from 'react';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
    description?: string;
    icon?: string;
  }>;
  className?: string;
  height?: string;
}

const Map: React.FC<MapProps> = ({
  center = [-6.5001403, 107.5342964], // Desa Cibatu coordinates
  zoom = 13,
  markers = [],
  className = '',
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import untuk Leaflet
    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Fix untuk default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map
          const map = L.map(mapRef.current).setView(center, zoom);
          mapInstanceRef.current = map;

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add markers
          markers.forEach(marker => {
            const markerInstance = L.marker(marker.position).addTo(map);

            if (marker.title || marker.description) {
              markerInstance.bindPopup(`
                <div class="p-2">
                  <h3 class="font-semibold text-gray-900">${marker.title}</h3>
                  ${marker.description ? `<p class="text-sm text-gray-600 mt-1">${marker.description}</p>` : ''}
                </div>
              `);
            }
          });
        }
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full rounded-lg shadow-lg"
        style={{ height }}
      />

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Memuat peta...</p>
        </div>
      </div>
    </div>
  );
};

export default Map;
