import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook untuk scroll ke atas setiap kali route berubah
 */
export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll ke atas dengan smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
};

export default useScrollToTop;

