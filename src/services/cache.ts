/**
 * Cache Service dengan skala prioritas untuk optimasi performa
 * Menggunakan localStorage dengan TTL (Time To Live) yang berbeda
 */
import { sanitizeCacheKey } from '../utils/dataSanitization';

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  priority: CachePriority;
}

export enum CachePriority {
  // Data yang jarang berubah - cache lama
  STATIC = 'static',           // 24 jam - Logo, struktur organisasi, visi misi
  SEMI_STATIC = 'semi-static', // 6 jam - Info desa, kontak, fasilitas

  // Data yang berubah sedang - cache sedang
  MEDIUM = 'medium',           // 1 jam - Statistik penduduk, UMKM
  DYNAMIC = 'dynamic',         // 30 menit - APBDes, proyek, bantuan sosial

  // Data yang sering berubah - cache pendek
  FREQUENT = 'frequent',       // 10 menit - Berita, pengaduan
  REAL_TIME = 'real-time'      // 2 menit - Status surat, captcha
}

export class CacheService {
  private static instance: CacheService;
  private readonly CACHE_PREFIX = 'desa_cibatu_cache_';

  // TTL dalam milliseconds untuk setiap prioritas
  private readonly TTL_MAP: Record<CachePriority, number> = {
    [CachePriority.STATIC]: 24 * 60 * 60 * 1000,      // 24 jam
    [CachePriority.SEMI_STATIC]: 6 * 60 * 60 * 1000,  // 6 jam
    [CachePriority.MEDIUM]: 60 * 60 * 1000,           // 1 jam
    [CachePriority.DYNAMIC]: 30 * 60 * 1000,          // 30 menit
    [CachePriority.FREQUENT]: 10 * 60 * 1000,         // 10 menit
    [CachePriority.REAL_TIME]: 2 * 60 * 1000          // 2 menit
  };

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Menyimpan data ke cache dengan prioritas tertentu
   */
  public set<T>(key: string, data: T, priority: CachePriority): void {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: this.TTL_MAP[priority],
        priority
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));

      // Log untuk monitoring (bisa dihapus di production)
      console.log(`Cache SET: ${key} (${priority}, TTL: ${this.TTL_MAP[priority] / 1000}s)`);
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  /**
   * Mengambil data dari cache jika masih valid
   */
  public get<T>(key: string): T | null {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();
      const isExpired = (now - cacheItem.timestamp) > cacheItem.ttl;

      if (isExpired) {
        this.delete(key);
        return null;
      }

      // Log untuk monitoring
      const remainingTime = Math.round((cacheItem.ttl - (now - cacheItem.timestamp)) / 1000);
      console.log(`Cache HIT: ${key} (${cacheItem.priority}, remaining: ${remainingTime}s)`);

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      return null;
    }
  }

  /**
   * Menghapus item dari cache
   */
  public delete(key: string): void {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('Failed to delete cache:', error);
    }
  }

  /**
   * Menghapus semua cache
   */
  public clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Membersihkan cache yang sudah expired
   */
  public cleanup(): void {
    try {
      const keys = Object.keys(localStorage);
      let cleanedCount = 0;

      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              const cacheItem: CacheItem = JSON.parse(cached);
              const now = Date.now();
              const isExpired = (now - cacheItem.timestamp) > cacheItem.ttl;

              if (isExpired) {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            } catch (error) {
              // Invalid cache item, remove it
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        }
      });

      if (cleanedCount > 0) {
      }
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  }

  /**
   * Mendapatkan statistik cache
   */
  public getStats(): { total: number; byPriority: Record<CachePriority, number> } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));

      const stats = {
        total: cacheKeys.length,
        byPriority: {
          [CachePriority.STATIC]: 0,
          [CachePriority.SEMI_STATIC]: 0,
          [CachePriority.MEDIUM]: 0,
          [CachePriority.DYNAMIC]: 0,
          [CachePriority.FREQUENT]: 0,
          [CachePriority.REAL_TIME]: 0
        }
      };

      cacheKeys.forEach(key => {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const cacheItem: CacheItem = JSON.parse(cached);
            stats.byPriority[cacheItem.priority]++;
          } catch (error) {
            // Skip invalid items
          }
        }
      });

      return stats;
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return { total: 0, byPriority: {} as Record<CachePriority, number> };
    }
  }

  /**
   * Mendapatkan cache key berdasarkan endpoint dan parameter
   * Dengan sanitization untuk mencegah NIK/NKK tersimpan di cache key
   */
  public generateKey(endpoint: string, params?: Record<string, any>): string {
    let key = endpoint.replace(/[^a-zA-Z0-9]/g, '_');

    if (params) {
      const sortedParams = Object.keys(params)
        .sort()
        .map(k => `${k}_${params[k]}`)
        .join('_');
      key += `_${sortedParams}`;
    }

    // Sanitize cache key untuk mencegah data sensitif
    return sanitizeCacheKey(key);
  }

  /**
   * Membersihkan cache yang mengandung data sensitif
   */
  public clearSensitiveData(): void {
    try {
      const keys = Object.keys(localStorage);
      let clearedCount = 0;

      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              // Check if cache contains sensitive data
              const hasSensitiveData = cached.includes('nik') ||
                                     cached.includes('nkk') ||
                                     cached.includes('penduduk') ||
                                     /\d{16}/.test(cached) ||
                                     /\d{4,15}/.test(cached);

              if (hasSensitiveData) {
                localStorage.removeItem(key);
                clearedCount++;
                console.log(`[Cache] Cleared sensitive data: ${key}`);
              }
            } catch (error) {
              // Remove invalid cache items
              localStorage.removeItem(key);
              clearedCount++;
            }
          }
        }
      });

      if (clearedCount > 0) {
        console.log(`[Cache] Cleared ${clearedCount} items with sensitive data`);
      }
    } catch (error) {
      console.warn('Failed to clear sensitive data from cache:', error);
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Auto cleanup setiap 5 menit
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.cleanup();
  }, 5 * 60 * 1000);
}
