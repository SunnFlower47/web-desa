// API Service untuk komunikasi dengan backend Laravel via Proxy
import { cacheService, CachePriority } from './cache';

// Kita arahkan ke /api/proxy/v1 agar Signature ditambahkan di sisi Server (Aman)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://sistem-desa-cibatu.test/api/proxy/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
  grouped?: any;
}

class ApiService {
  private baseURL: string;
  private timeout: number;
  private csrfToken: string | null = null;
  private csrfTokenExpiry: number = 0;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000;
    this.loadCsrfToken();
  }

  private async loadCsrfToken(): Promise<void> {
    try {
      const stored = sessionStorage.getItem('csrf_token');
      const storedExpiry = sessionStorage.getItem('csrf_token_expiry');
      if (stored && storedExpiry && parseInt(storedExpiry) > Date.now()) {
        this.csrfToken = stored;
        this.csrfTokenExpiry = parseInt(storedExpiry);
        return;
      }
      await this.fetchCsrfToken();
    } catch (error) {
      console.warn('Failed to load CSRF token:', error);
    }
  }

  private async fetchCsrfToken(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/csrf-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin,
          'User-Agent': navigator.userAgent,
        },
      });
      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.csrf_token;
        this.csrfTokenExpiry = new Date(data.expires_at).getTime();
        sessionStorage.setItem('csrf_token', this.csrfToken || '');
        sessionStorage.setItem('csrf_token_expiry', this.csrfTokenExpiry.toString());
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }

  private async getCsrfToken(): Promise<string | null> {
    if (!this.csrfToken || Date.now() >= this.csrfTokenExpiry) {
      await this.fetchCsrfToken();
    }
    return this.csrfToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    
    let recaptchaV3Token = null;
    try {
      // @ts-ignore
      if (typeof window.grecaptcha !== 'undefined') {
        // @ts-ignore
        await new Promise<void>((resolve) => window.grecaptcha.ready(() => resolve()));
        const cleanAction = endpoint.split('?')[0].replace(/[^A-Za-z0-9_]/g, '_').substring(0, 50);
        // @ts-ignore
        recaptchaV3Token = await window.grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_V3_SITE_KEY, { 
          action: cleanAction 
        });
      }
    } catch (e) {
      console.warn('v3 token failed:', e);
    }

    let csrfToken = null;
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
      csrfToken = await this.getCsrfToken();
    }

    const headers: any = {
      'Accept': 'application/json',
      'Origin': window.location.origin,
      'User-Agent': navigator.userAgent,
      ...(recaptchaV3Token && { 'X-Recaptcha-V3-Token': recaptchaV3Token }),
      // @ts-ignore
      ...(options.captchaToken && { 'X-Recaptcha-Token': options.captchaToken }),
      ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions: RequestInit = {
      ...options,
      credentials: 'include',
      headers,
    };

    try {
      const response = await fetch(url, requestOptions);
      
      // Jika error (4xx atau 5xx)
      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch (e) {
          // Bukan JSON
        }

        const error: any = new Error(errorData?.message || `Terjadi kesalahan (Status: ${response.status})`);
        error.status = response.status;
        error.data = errorData; // Lampirkan data error lengkap (termasuk .errors)
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async cachedRequest<T>(
    endpoint: string,
    priority: CachePriority,
    options: RequestInit = {},
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const cacheKey = cacheService.generateKey(endpoint, params);
    const cachedData = cacheService.get<ApiResponse<T>>(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.request<T>(endpoint, options);
      cacheService.set(cacheKey, response, priority);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // --- Statistics ---
  async getStatistics(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/statistics', CachePriority.MEDIUM);
  }

  // --- News ---
  async getNews(params?: { search?: string; kategori?: string; page?: number; per_page?: number }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.kategori) queryParams.append('kategori', params.kategori);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    const endpoint = queryParams.toString() ? `/berita?${queryParams}` : '/berita';
    return this.cachedRequest(endpoint, CachePriority.FREQUENT, {}, params);
  }

  async getNewsDetail(slug: string): Promise<ApiResponse<any>> {
    return this.cachedRequest(`/berita/${slug}`, CachePriority.FREQUENT, {}, { slug });
  }

  async getNewsCombined(params?: any): Promise<ApiResponse<any>> {
    const qp = new URLSearchParams(params).toString();
    return this.request(qp ? `/berita-combined?${qp}` : '/berita-combined');
  }

  async getNewsCategories(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/berita-categories', CachePriority.SEMI_STATIC);
  }

  async getFeaturedNews(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/berita-featured', CachePriority.FREQUENT);
  }

  async getExternalNews(params?: any): Promise<ApiResponse<any>> {
    const qp = new URLSearchParams(params).toString();
    return this.request(qp ? `/berita-eksternal?${qp}` : '/berita-eksternal');
  }

  // --- Testimonials ---
  async getTestimonials(params?: any): Promise<ApiResponse<any>> {
    const qp = new URLSearchParams(params).toString();
    return this.cachedRequest(qp ? `/testimoni?${qp}` : '/testimoni', CachePriority.MEDIUM);
  }

  // --- UMKM & Fasilitas ---
  async getUMKM(params?: any): Promise<ApiResponse<any>> {
    const qp = new URLSearchParams(params).toString();
    return this.request(qp ? `/umkm?${qp}` : '/umkm');
  }

  async getFacilities(params?: any): Promise<ApiResponse<any>> {
    const qp = new URLSearchParams(params).toString();
    return this.cachedRequest(qp ? `/fasilitas-desa?${qp}` : '/fasilitas-desa', CachePriority.SEMI_STATIC);
  }

  // --- Desa Info & Struktur ---
  async getDesaInfo(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/desa-info', CachePriority.SEMI_STATIC);
  }

  async getStrukturDesa(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/struktur-desa', CachePriority.STATIC);
  }

  async getPerangkatDesa(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/perangkat-desa', CachePriority.STATIC);
  }

  async getKontakDesa(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/kontak-desa', CachePriority.SEMI_STATIC);
  }

  async getContactInfo(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/contact/info', CachePriority.SEMI_STATIC);
  }

  // --- Surat Pengajuan ---
  async getSuratTypes(): Promise<ApiResponse<any>> {
    return this.cachedRequest('/surat-types', CachePriority.SEMI_STATIC);
  }

  async searchPenduduk(data: { nik: string; tanggal_lahir: string }, options: any = {}): Promise<ApiResponse<any>> {
    return this.request('/search-penduduk', {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async getHistory(data: { nik: string; tanggal_lahir: string }, options: any = {}): Promise<ApiResponse<any>> {
    return this.request('/surat-pengajuan/history', {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async getSuratByNomor(nomor: string, options: any = {}): Promise<ApiResponse<any>> {
    return this.request(`/surat-pengajuan/status?nomor=${encodeURIComponent(nomor)}`, options);
  }

  // --- Bantuan Sosial & Transparansi ---
  async searchBantuanSosial(data: any, options: any = {}): Promise<ApiResponse<any>> {
    return this.request('/bantuan-sosial/check', {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async getApbdesData(tahun?: number): Promise<ApiResponse<any>> {
    const url = tahun ? `/apbdes?tahun=${tahun}` : '/apbdes';
    return this.cachedRequest(url, CachePriority.DYNAMIC, {}, { tahun });
  }

  async getProyekPembangunan(tahun?: number): Promise<ApiResponse<any>> {
    const url = tahun ? `/proyek-pembangunan?tahun=${tahun}` : '/proyek-pembangunan';
    return this.cachedRequest(url, CachePriority.DYNAMIC, {}, { tahun });
  }

  async getBantuanSosialTransparansi(tahun?: number): Promise<ApiResponse<any>> {
    const url = tahun ? `/bantuan-sosial-transparansi?tahun=${tahun}` : '/bantuan-sosial-transparansi';
    return this.cachedRequest(url, CachePriority.DYNAMIC, {}, { tahun });
  }

  // --- Form Submissions ---
  async submitSuratPengajuan(data: any, options: any = {}): Promise<ApiResponse<any>> {
    if (data instanceof FormData) {
      return this.request('/surat-pengajuan', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
        ...options
      });
    }
    return this.request('/surat-pengajuan', {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async submitPengaduan(data: any): Promise<ApiResponse<any>> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key !== 'foto' && data[key]) formData.append(key, data[key]);
    });
    if (data.foto) {
      for (let i = 0; i < data.foto.length; i++) formData.append('foto[]', data.foto[i]);
    }
    return this.request('/pengaduan/submit', { method: 'POST', body: formData });
  }

  async submitTestimoni(data: any): Promise<ApiResponse<any>> {
    return this.request('/testimoni', { method: 'POST', body: JSON.stringify(data) });
  }

  async submitContact(data: any): Promise<ApiResponse<any>> {
    return this.request('/contact/submit', { method: 'POST', body: JSON.stringify(data) });
  }

  // --- Other ---
  async getCaptcha(): Promise<ApiResponse<any>> {
    return this.request('/captcha');
  }

  // --- Cache Management ---
  getCacheStats(): { total: number; byPriority: Record<string, number> } {
    return cacheService.getStats();
  }

  invalidateCache(key: string): void {
    cacheService.delete(key);
  }

  clearAllCache(): void {
    cacheService.clear();
  }

  cleanupCache(): void {
    cacheService.cleanup();
  }

  clearCsrfToken(): void {
    this.csrfToken = null;
    this.csrfTokenExpiry = 0;
    sessionStorage.removeItem('csrf_token');
    sessionStorage.removeItem('csrf_token_expiry');
  }
}

export const api = new ApiService();
export default api;
