import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'image' | 'avatar' | 'button' | 'table';
  lines?: number;
  width?: string;
  height?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'text',
  lines = 1,
  width,
  height
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4';
      case 'card':
        return 'h-48';
      case 'image':
        return 'h-32 w-full';
      case 'avatar':
        return 'h-12 w-12 rounded-full';
      case 'button':
        return 'h-10 w-24';
      case 'table':
        return 'h-8 w-full';
      default:
        return 'h-4';
    }
  };

  const getWidth = () => {
    if (width) return width;
    switch (variant) {
      case 'text':
        return 'w-full';
      case 'card':
        return 'w-full';
      case 'image':
        return 'w-full';
      case 'avatar':
        return 'w-12';
      case 'button':
        return 'w-24';
      case 'table':
        return 'w-full';
      default:
        return 'w-full';
    }
  };

  const getHeight = () => {
    if (height) return height;
    return getVariantClasses();
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${getHeight()} ${className}`}>
        <div className="p-4 space-y-3">
          <div className={`${baseClasses} h-4 w-3/4`}></div>
          <div className={`${baseClasses} h-4 w-1/2`}></div>
          <div className={`${baseClasses} h-4 w-5/6`}></div>
        </div>
      </div>
    );
  }

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getHeight()} ${getWidth()} ${className}`}
            style={{
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getHeight()} ${getWidth()} ${className}`}
    />
  );
};

// Skeleton components untuk komponen spesifik
export const NewsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <SkeletonLoader variant="image" className="w-full h-48" />
    <div className="p-6 space-y-3">
      <SkeletonLoader variant="text" className="h-6 w-3/4" />
      <SkeletonLoader lines={3} />
      <SkeletonLoader variant="button" className="h-8 w-32" />
    </div>
  </div>
);

export const TestimonialSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader variant="avatar" />
      <div className="space-y-2">
        <SkeletonLoader variant="text" className="h-4 w-24" />
        <SkeletonLoader variant="text" className="h-3 w-16" />
      </div>
    </div>
    <SkeletonLoader lines={3} />
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-2 sm:py-5 sm:px-3 border border-white/30 text-center">
    <SkeletonLoader variant="avatar" className="h-12 w-12 mx-auto mb-2" />
    <SkeletonLoader variant="text" className="h-6 w-16 mx-auto mb-1" />
    <SkeletonLoader variant="text" className="h-4 w-12 mx-auto" />
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <SkeletonLoader variant="table" className="h-8 w-1/4" />
        <SkeletonLoader variant="table" className="h-8 w-1/3" />
        <SkeletonLoader variant="table" className="h-8 w-1/4" />
        <SkeletonLoader variant="table" className="h-8 w-1/6" />
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
