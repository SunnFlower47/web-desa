import React from 'react';

interface QuickAccessCardProps {
  icon: string;
  title: string;
  description: string;
  link: string;
  bgColor: string;
  iconColor: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  icon,
  title,
  description,
  link,
  bgColor,
  iconColor
}) => {
  return (
    <a
      href={link}
      className={`block ${bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}
    >
      <div className="text-center">
        <div className={`w-16 h-16 ${iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <i className={`${icon} text-2xl text-white`}></i>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 text-sm">{description}</p>
      </div>
    </a>
  );
};

export default QuickAccessCard;
