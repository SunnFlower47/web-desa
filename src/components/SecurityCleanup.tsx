import { useEffect } from 'react';
import { clearSensitiveDataFromStorage } from '../utils/dataSanitization';
import { cacheService } from '../services/cache';

/**
 * Security Cleanup Component untuk React.js
 * Membersihkan data sensitif saat aplikasi start
 */
const SecurityCleanup: React.FC = () => {
  useEffect(() => {
    // Clear sensitive data saat aplikasi start
    const cleanup = () => {
      try {
        // Clear sensitive data dari localStorage
        clearSensitiveDataFromStorage();

        // Clear sensitive data dari cache
        cacheService.clearSensitiveData();

        console.log('[Security] Sensitive data cleanup completed');
      } catch (error) {
        console.warn('[Security] Error during cleanup:', error);
      }
    };

    // Run cleanup saat component mount
    cleanup();

    // Run cleanup setiap 30 menit
    const interval = setInterval(cleanup, 30 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Component tidak render apa-apa
  return null;
};

export default SecurityCleanup;
