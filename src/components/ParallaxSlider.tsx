import React, { useState, useEffect, useRef } from "react";

interface SlideData {
  id: number;
  image: string;
  badge: string;
  badgeIcon: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  stats: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  cards: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface ParallaxSliderProps {
  slides: SlideData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

const ParallaxSlider: React.FC<ParallaxSliderProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const sliderRef = useRef<HTMLDivElement>(null);

  // Preload all unique images for better LCP
  useEffect(() => {
    const preloadImages = async () => {
      // Get unique images only
      const uniqueImages = Array.from(new Set(slides.map(slide => slide.image)));

      const imagePromises = uniqueImages.map((imageUrl) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded(prev => {
              const newSet = new Set(prev);
              newSet.add(imageUrl);
              console.log(`Image loaded: ${imageUrl}, Total loaded: ${newSet.size}/${uniqueImages.length}`);
              return newSet;
            });
            resolve(imageUrl);
          };
          img.onerror = reject;
          img.src = imageUrl;
        });
      });

      try {
        await Promise.all(imagePromises);
        console.log('All ParallaxSlider images preloaded');
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    preloadImages();
  }, [slides]);

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length, isPaused]);

  // Mouse tracking effect with throttling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (sliderRef.current) {
          const rect = sliderRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setMousePosition({ x, y });
        }
      }, 16); // ~60fps throttling
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('mousemove', handleMouseMove);
      return () => {
        slider.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  if (!slides.length) return null;

  const currentSlideData = slides[currentSlide];
  const uniqueImagesCount = Array.from(new Set(slides.map(slide => slide.image))).length;

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div
      ref={sliderRef}
      className="relative hero-section min-h-[100vh] sm:h-[90vh] lg:h-screen overflow-hidden pt-[3rem] sm:pt-[4rem] lg:pt-[5rem]"
    >
      {/* Loading indicator for images */}
      {imagesLoaded.size < uniqueImagesCount && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          Loading images... {imagesLoaded.size}/{uniqueImagesCount}
        </div>
      )}
      {/* Background with subtle parallax effect - LCP Optimized */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${currentSlideData.image})`,
          transform: `translate3d(${mousePosition.x * -0.005}px, ${mousePosition.y * -0.005}px, 0)`,
          backgroundPosition: `${50 + mousePosition.x * 0.02}% ${50 + mousePosition.y * 0.02}%`,
          willChange: 'transform, background-position',
          contentVisibility: 'auto',
          containIntrinsicSize: '1920px 1080px'
        }}
      >
        {/* Enhanced gradient overlays for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30"></div>
      </div>

      {/* Subtle parallax overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.05) 0%, transparent 60%)`
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-start lg:items-center h-full">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start pt-8 sm:pt-4 lg:pt-0 pb-16 sm:pb-8">
            {/* LEFT SIDE */}
            <div
              className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-5 md:space-y-6"
              style={{
                transform: `translate(${mousePosition.x * 0.002}px, ${mousePosition.y * 0.002}px)`,
                animationDelay: '0.2s'
              }}
            >
              {/* Logo + Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-start gap-3">
                <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-green-400 rounded-2xl p-2 bg-white/10 backdrop-blur-sm shadow-lg transition-all duration-500">
                    <img
                        src="/logo desa cibatu.png"
                        alt="Logo Desa Cibatu"
                        className="w-full h-full object-contain"
                        loading="lazy"
                    />
                    </div>

                </div>
                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-white mb-1">
                    Desa Cibatu
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300 mb-2">
                    Kec. Cibatu, Kab. Purwakarta
                  </p>
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-400/20 backdrop-blur-sm text-green-300 text-xs font-medium border border-green-400/30">
                    <i className="fas fa-award mr-1"></i>
                    Desa Digital Terdepan 2025
                  </div>
                </div>
              </div>

               {/* Title */}
               <div className="text-left animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
               <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                {currentSlideData.title}
                </h2>

                <p className="text-green-400 text-base sm:text-lg md:text-xl font-semibold mt-1">
                {currentSlideData.subtitle}
                </p>

               </div>

               {/* Description */}
               <p
                className="text-gray-200 text-xs sm:text-sm md:text-base max-w-md leading-relaxed text-left animate-fadeInUp mt-1"
                style={{ animationDelay: '0.6s' }}
                >
                {currentSlideData.description}
                </p>


              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-sm animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
                {currentSlideData.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className={`font-bold text-lg sm:text-xl md:text-2xl ${stat.color} drop-shadow-md`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="w-full flex justify-start animate-fadeInUp" style={{ animationDelay: '1s' }}>
              <a
                href={currentSlideData.buttonLink}
                className="group inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm sm:text-base md:text-lg transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105"
              >
                {currentSlideData.buttonText}
                <svg
                  className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
              </div>
            </div>

             {/* RIGHT SIDE */}
             <div
               className="hidden sm:flex flex-col space-y-4 md:space-y-5 mt-6 lg:mt-12 animate-fadeInUp"
               style={{
                 transform: `translate(${mousePosition.x * -0.002}px, ${mousePosition.y * -0.002}px)`,
                 animationDelay: '1.2s'
               }}
             >
              {currentSlideData.cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i
                        className={`${card.icon} text-white text-lg md:text-xl`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-lg font-semibold text-white mb-1">
                        {card.title}
                      </h3>
                      <p className="text-gray-200 text-xs md:text-sm leading-snug">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              goToPrevious();
            }}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm hover:scale-110 z-20"
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left text-lg"></i>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              goToNext();
            }}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm hover:scale-110 z-20"
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right text-lg"></i>
          </button>
        </>
      )}

      {/* Dots and Controls */}
      {showDots && (
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3">
          {/* Pause/Play Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsPaused(!isPaused);
            }}
            className="hidden sm:flex w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm hover:scale-110"
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? (
              <i className="fas fa-play text-sm"></i>
            ) : (
              <i className="fas fa-pause text-sm"></i>
            )}
          </button>

          {/* Dots */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  goToSlide(index);
                }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-green-500 scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParallaxSlider;
