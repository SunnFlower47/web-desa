import React from 'react';

interface TestimonialProps {
  id: number;
  name: string;
  message: string;
  rating: number;
  avatar?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  name,
  message,
  rating,
  avatar
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      ></i>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <i className="fas fa-user text-green-600"></i>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <div className="flex items-center">
            {renderStars(rating)}
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">
        "{message}"
      </p>
    </div>
  );
};

export default Testimonial;
