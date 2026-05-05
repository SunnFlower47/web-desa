/**
 * Custom Hook untuk menggunakan API dengan cache
 * Memudahkan penggunaan cache di komponen React
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { CachePriority } from '../services/cache';

interface UseApiCacheOptions<T> {
  priority: CachePriority;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  refetchOnMount?: boolean;
}

interface UseApiCacheResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>; // Alias untuk refetch
  invalidateCache: () => void;
}

/**
 * Hook untuk menggunakan API dengan cache
 */
export function useApiCache<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options: UseApiCacheOptions<T>
): UseApiCacheResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiCall();
      if (response.success) {
        setData(response.data);
        options.onSuccess?.(response.data);
      } else {
        throw new Error('API call failed');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
      options.onError?.(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCall, options.enabled, options.onSuccess, options.onError]);

  const invalidateCache = useCallback(() => {
    // Generate cache key dari API call
    const cacheKey = apiCall.toString();
    api.invalidateCache(cacheKey);
  }, [apiCall]);

  useEffect(() => {
    // Hanya fetch data sekali saat component mount
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [fetchData]); // Include fetchData dependency untuk ESLint

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    refresh: fetchData, // Alias untuk refetch
    invalidateCache
  };
}

/**
 * Hook khusus untuk data statis (logo, struktur organisasi, dll)
 */
export function useStaticData<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options?: Partial<UseApiCacheOptions<T>>
) {
  return useApiCache(apiCall, {
    priority: CachePriority.STATIC,
    enabled: true,
    refetchOnMount: false,
    ...options
  });
}

/**
 * Hook khusus untuk data semi-statis (info desa, kontak, dll)
 */
export function useSemiStaticData<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options?: Partial<UseApiCacheOptions<T>>
) {
  return useApiCache(apiCall, {
    priority: CachePriority.SEMI_STATIC,
    enabled: true,
    refetchOnMount: false,
    ...options
  });
}

/**
 * Hook khusus untuk data medium (statistik penduduk, UMKM)
 */
export function useMediumData<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options?: Partial<UseApiCacheOptions<T>>
) {
  return useApiCache(apiCall, {
    priority: CachePriority.MEDIUM,
    enabled: true,
    refetchOnMount: true,
    ...options
  });
}

/**
 * Hook khusus untuk data dinamis (APBDes, proyek, bantuan sosial)
 */
export function useDynamicData<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options?: Partial<UseApiCacheOptions<T>>
) {
  return useApiCache(apiCall, {
    priority: CachePriority.DYNAMIC,
    enabled: true,
    refetchOnMount: true,
    ...options
  });
}

/**
 * Hook khusus untuk data yang sering berubah (berita, pengaduan)
 */
export function useFrequentData<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options?: Partial<UseApiCacheOptions<T>>
) {
  return useApiCache(apiCall, {
    priority: CachePriority.FREQUENT,
    enabled: true,
    refetchOnMount: true,
    ...options
  });
}

/**
 * Hook khusus untuk data real-time (status surat, captcha)
 */
export function useRealTimeData<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options?: Partial<UseApiCacheOptions<T>>
) {
  return useApiCache(apiCall, {
    priority: CachePriority.REAL_TIME,
    enabled: true,
    refetchOnMount: true,
    ...options
  });
}

/**
 * Hook khusus untuk data statistik yang sering berubah (jumlah penduduk, KK, RT)
 */
export function useStatisticsData<T = any>(
  apiCall: () => Promise<{ success: boolean; data: T }>,
  options?: Partial<UseApiCacheOptions<T>>
) {
  return useApiCache(apiCall, {
    priority: CachePriority.FREQUENT,
    enabled: true,
    refetchOnMount: true,
    ...options
  });
}

/**
 * Hook untuk mendapatkan statistik cache
 */
export function useCacheStats() {
  const [stats, setStats] = useState(api.getCacheStats());

  const refreshStats = useCallback(() => {
    setStats(api.getCacheStats());
  }, []);

  const clearAllCache = useCallback(() => {
    api.clearAllCache();
    refreshStats();
  }, [refreshStats]);

  const cleanupCache = useCallback(() => {
    api.cleanupCache();
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    refreshStats,
    clearAllCache,
    cleanupCache
  };
}
