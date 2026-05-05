# Sistem Cache Frontend - Desa Cibatu

## Overview
Sistem cache yang komprehensif untuk mengoptimalkan performa aplikasi web desa dengan skala prioritas yang berbeda untuk setiap jenis data.

## Cache Priorities

### 1. STATIC (24 jam)
**Data yang jarang berubah**
- Logo desa
- Struktur organisasi
- Visi & misi
- Perangkat desa
- RT/RW

**TTL**: 24 jam
**Penggunaan**: `useStaticData()` hook

### 2. SEMI_STATIC (6 jam)
**Data yang berubah sesekali**
- Info desa (nama, alamat, deskripsi)
- Kontak desa
- Fasilitas desa
- Kategori berita
- BUMDes

**TTL**: 6 jam
**Penggunaan**: `useSemiStaticData()` hook

### 3. MEDIUM (1 jam)
**Data yang berubah sedang**
- Statistik penduduk
- Data UMKM
- Testimoni

**TTL**: 1 jam
**Penggunaan**: `useMediumData()` hook

### 4. DYNAMIC (30 menit)
**Data yang berubah cukup sering**
- APBDes
- Proyek pembangunan
- Bantuan sosial transparansi

**TTL**: 30 menit
**Penggunaan**: `useDynamicData()` hook

### 5. FREQUENT (10 menit)
**Data yang sering berubah**
- Berita desa
- Berita eksternal
- Featured news

**TTL**: 10 menit
**Penggunaan**: `useFrequentData()` hook

### 6. REAL_TIME (2 menit)
**Data yang berubah sangat sering**
- Status surat
- CAPTCHA
- Data real-time lainnya

**TTL**: 2 menit
**Penggunaan**: `useRealTimeData()` hook

## Penggunaan

### Basic Usage
```typescript
import { useSemiStaticData } from '../hooks/useApiCache';
import { api } from '../services/api';

const MyComponent = () => {
  const { data, loading, error, refetch } = useSemiStaticData(
    () => api.getDesaInfo()
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{data?.nama_desa}</div>;
};
```

### Advanced Usage
```typescript
import { useApiCache, CachePriority } from '../hooks/useApiCache';

const MyComponent = () => {
  const { data, loading, error, refetch, invalidateCache } = useApiCache(
    () => api.getStatistics(),
    {
      priority: CachePriority.MEDIUM,
      enabled: true,
      onSuccess: (data) => console.log('Data loaded:', data),
      onError: (error) => console.error('Error:', error),
      refetchOnMount: true
    }
  );

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <button onClick={invalidateCache}>Clear Cache</button>
    </div>
  );
};
```

## Cache Management

### Manual Cache Control
```typescript
import { api } from '../services/api';

// Get cache statistics
const stats = api.getCacheStats();

// Invalidate specific cache
api.invalidateCache('desa-info');

// Clear all cache
api.clearAllCache();

// Cleanup expired cache
api.cleanupCache();
```

### Cache Statistics (Development Mode)
Komponen `CacheStats` akan menampilkan statistik cache di development mode:
- Total items cached
- Items per priority
- Manual cache control buttons

## API Methods dengan Cache

### Cached Methods
Semua method GET sudah menggunakan cache dengan prioritas yang sesuai:

```typescript
// Static data (24h cache)
api.getStrukturDesa()
api.getPerangkatDesa()
api.getRTRW()

// Semi-static data (6h cache)
api.getDesaInfo()
api.getContactInfo()
api.getKontakDesa()
api.getFacilities()
api.getNewsCategories()
api.getBUMDes()

// Medium data (1h cache)
api.getStatistics()
api.getUMKM()
api.getTestimonials()

// Dynamic data (30m cache)
api.getTransparansiData()
api.getApbdesData()
api.getProyekPembangunan()
api.getBantuanSosialTransparansi()

// Frequent data (10m cache)
api.getNews()
api.getNewsDetail()
api.getNewsCombined()
api.getNewsEksternal()
api.getFeaturedNews()

// Real-time data (2m cache)
api.getCaptcha()
```

### Non-Cached Methods
Method POST, PUT, DELETE tidak menggunakan cache:
```typescript
api.submitSuratPengajuan()
api.submitContact()
api.submitPengaduan()
api.searchBantuanSosial()
```

## Performance Benefits

### Before Cache
- Setiap request ke API
- Loading time tinggi
- Server overload dengan ribuan request

### After Cache
- Request hanya saat cache expired
- Loading time minimal
- Server load berkurang drastis
- Better user experience

## Monitoring

### Development Mode
- Cache statistics widget
- Real-time cache monitoring
- Manual cache control

### Production Mode
- Automatic cache cleanup
- Error handling
- Fallback to API jika cache gagal

## Best Practices

1. **Gunakan hook yang sesuai** dengan jenis data
2. **Jangan cache data sensitif** atau personal
3. **Monitor cache hit ratio** untuk optimasi
4. **Cleanup cache secara berkala** untuk menghemat storage
5. **Gunakan refetch** untuk data yang perlu update manual

## Troubleshooting

### Cache tidak bekerja
- Pastikan localStorage tersedia
- Check browser console untuk error
- Verify API response format

### Data tidak update
- Check TTL cache
- Manual invalidate cache
- Force refetch dengan `refetch()`

### Performance issues
- Monitor cache statistics
- Adjust TTL jika perlu
- Cleanup expired cache
