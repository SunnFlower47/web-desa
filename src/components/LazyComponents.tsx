import React, { Suspense, lazy } from 'react';

// Lazy load components untuk mengurangi TBT (Total Blocking Time)
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyProfilDesa = lazy(() => import('../pages/ProfilDesa'));
export const LazyDataDesa = lazy(() => import('../pages/DataDesa'));
export const LazyLayananSurat = lazy(() => import('../pages/LayananSurat'));
export const LazyPengajuanSurat = lazy(() => import('../pages/PengajuanSurat'));
export const LazyStatusSurat = lazy(() => import('../pages/StatusSurat'));
export const LazyBantuanSosial = lazy(() => import('../pages/BantuanSosial'));
export const LazyBerita = lazy(() => import('../pages/Berita'));
export const LazyTransparansi = lazy(() => import('../pages/Transparansi'));
export const LazyPengaduan = lazy(() => import('../pages/Pengaduan'));
export const LazyTestimoni = lazy(() => import('../pages/Testimoni'));
export const LazyTentangDesa = lazy(() => import('../pages/TentangDesa'));
export const LazyPetaDesa = lazy(() => import('../pages/PetaDesa'));

// Loading component untuk Suspense - Optimized untuk TBT
export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

// HOC untuk lazy loading dengan error boundary - TBT Optimized
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

// Preload function untuk critical routes - Non-blocking
export const preloadCriticalRoutes = () => {
  // Use requestIdleCallback untuk non-blocking preload
  const runWhenIdle = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 0);
    }
  };

  // Preload home page immediately
  runWhenIdle(() => {
    import('../pages/Home');
  });

  // Preload other critical pages after a delay
  runWhenIdle(() => {
    setTimeout(() => {
      import('../pages/ProfilDesa');
      import('../pages/LayananSurat');
    }, 1000);
  });
};

// Intersection Observer untuk lazy loading images - TBT Optimized
export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
};

// Optimized Image component dengan lazy loading
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
}> = ({ src, alt, className = '', placeholder, priority = false }) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const isIntersecting = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px',
  });

  React.useEffect(() => {
    if (priority || isIntersecting) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [src, priority, isIntersecting]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
