import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'float' | 'pulse';
  delay?: number;
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = ''
}) => {
  const animationClasses = {
    fadeInUp: 'animate-fadeInUp',
    slideInLeft: 'animate-slideInLeft',
    slideInRight: 'animate-slideInRight',
    float: 'animate-float',
    pulse: 'animate-pulse-slow'
  };

  return (
    <div 
      className={`${animationClasses[animation]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
