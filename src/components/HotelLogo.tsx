
import React from 'react';

interface HotelLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const HotelLogo: React.FC<HotelLogoProps> = ({ 
  size = 'md',
  variant = 'dark'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-primary'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`font-display ${sizeClasses[size]} ${colorClasses[variant]}`}>
        <span>Yotta!</span>
      </div>
    </div>
  );
};

export default HotelLogo;
