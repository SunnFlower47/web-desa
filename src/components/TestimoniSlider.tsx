import React, { useState, useEffect } from 'react';

interface Testimoni {
  id: number;
  nama: string;
  komentar: string;
  rating: number;
  avatar?: string;
}

interface TestimoniSliderProps {
  testimonials: Testimoni[];
}

const TestimoniSlider: React.FC<TestimoniSliderProps> = ({ testimonials }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Belum ada testimoni tersedia</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Slider Container */}
      <div
        className="overflow-hidden rounded-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {testimonials.map((testimoni, index) => (
            <div key={testimoni.id} className="w-full flex-shrink-0 px-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mx-auto max-w-md">
                {/* Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimoni.avatar ? (
                      <img
                        src={testimoni.avatar}
                        alt={testimoni.nama || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      (testimoni.nama && testimoni.nama.charAt(0).toUpperCase()) || 'U'
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimoni.nama || 'Anonim'}</h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(testimoni.rating)}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative">
                  <i className="fas fa-quote-left text-green-500 text-2xl absolute -top-2 -left-2"></i>
                  <p className="text-gray-700 italic leading-relaxed pl-6">
                    "{testimoni.komentar || 'Tidak ada komentar tersedia'}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors z-10"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors z-10"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-green-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Pause Indicator */}
      {testimonials.length > 1 && (
        <div className="text-center mt-4">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span>{isPaused ? 'Dijeda' : 'Otomatis'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimoniSlider;
