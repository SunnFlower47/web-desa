/**
 * Data Sanitization Utility untuk React.js
 * Mencegah NIK/NKK dan data sensitif tersimpan di cache, localStorage, atau log
 */

/**
 * Sanitize string untuk menghilangkan NIK/NKK
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return input;

  return input
    .replace(/\d{16}/g, 'NIK***') // Mask NIK 16 digit
    .replace(/\d{16,}/g, 'NIK***') // Mask NIK lebih dari 16 digit
    .replace(/\b\d{10,15}\b/g, 'NIK***') // Mask kemungkinan NIK dengan format berbeda
    .replace(/\b\d{4,9}\b/g, 'NIK***'); // Mask kemungkinan NKK atau NIK pendek
}

/**
 * Sanitize cache key untuk mencegah NIK/NKK tersimpan di cache key
 */
export function sanitizeCacheKey(key: string): string {
  if (!key || typeof key !== 'string') return key;

  return key
    .replace(/nik[=:]\d+/gi, 'nik=***')
    .replace(/nkk[=:]\d+/gi, 'nkk=***')
    .replace(/search[=:][^&]*\d{4,}[^&]*/gi, 'search=***')
    .replace(/\d{16}/g, 'NIK***')
    .replace(/\d{4,15}/g, 'NIK***');
}

/**
 * Sanitize object untuk menghilangkan data sensitif
 */
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();

      // Skip atau mask field yang sensitif
      if (lowerKey.includes('nik') || lowerKey.includes('nkk')) {
        sanitized[key] = '***';
      } else if (lowerKey.includes('password') || lowerKey.includes('token')) {
        sanitized[key] = '***';
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitize data untuk logging (console.log, dll)
 */
export function sanitizeForLogging(data: any): any {
  return sanitizeObject(data);
}

/**
 * Clear sensitive data dari localStorage
 */
export function clearSensitiveDataFromStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    const sensitiveKeys = keys.filter(key =>
      key.toLowerCase().includes('nik') ||
      key.toLowerCase().includes('nkk') ||
      key.toLowerCase().includes('penduduk') ||
      key.toLowerCase().includes('sensitive')
    );

    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Cleared sensitive data from localStorage: ${key}`);
    });

    // Clear cache yang mungkin mengandung data sensitif
    const cacheKeys = keys.filter(key => key.startsWith('desa_cibatu_'));
    cacheKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached && (cached.includes('nik') || cached.includes('nkk'))) {
          localStorage.removeItem(key);
          console.log(`Cleared sensitive cache: ${key}`);
        }
      } catch (error) {
        console.warn(`Error checking cache ${key}:`, error);
      }
    });
  } catch (error) {
    console.warn('Error clearing sensitive data:', error);
  }
}

/**
 * Validate input untuk mencegah NIK/NKK di input form
 */
export function validateInput(input: string): { isValid: boolean; sanitized: string } {
  const hasNIK = /\d{16}/.test(input);
  const hasNKK = /\b\d{4,9}\b/.test(input);

  return {
    isValid: !hasNIK && !hasNKK,
    sanitized: sanitizeString(input)
  };
}

/**
 * Sanitize URL parameters
 */
export function sanitizeUrlParams(url: string): string {
  return url
    .replace(/nik=\d+/gi, 'nik=***')
    .replace(/nkk=\d+/gi, 'nkk=***')
    .replace(/search=[^&]*\d{4,}[^&]*/gi, 'search=***');
}

/**
 * Sanitize error messages untuk mencegah data sensitif di error log
 */
export function sanitizeErrorMessage(error: any): any {
  if (typeof error === 'string') {
    return sanitizeString(error);
  }

  if (error && typeof error === 'object') {
    return {
      ...error,
      message: error.message ? sanitizeString(error.message) : error.message,
      stack: error.stack ? sanitizeString(error.stack) : error.stack,
      data: error.data ? sanitizeObject(error.data) : error.data
    };
  }

  return error;
}
