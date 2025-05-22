
import React from 'react';
import { cn } from '@/lib/utils';

interface HotelLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'gradient';
}

const HotelLogo: React.FC<HotelLogoProps> = ({ 
  size = 'md',
  variant = 'dark'
}) => {
  // Double the text size by adjusting the size classes
  const sizeClasses = {
    sm: 'text-xl', // was text-lg
    md: 'text-4xl', // was text-2xl
    lg: 'text-6xl'  // was text-4xl
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-primary',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500'
  };

  // Scale the SVG icon to match the larger text
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7", // was h-5 w-5
    lg: "h-9 w-9"  // was h-6 w-6
  };

  return (
    <div className="flex items-center">
      <div className={cn(
        "font-display font-semibold tracking-tight", 
        sizeClasses[size], 
        colorClasses[variant]
      )}>
        <span className="flex items-center gap-2">
          <svg 
            className={iconSizes[size]}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              className={variant === 'gradient' ? "fill-blue-600" : variant === 'light' ? "fill-white" : "fill-primary"}
            />
            <path 
              d="M2 17L12 22L22 17" 
              className={variant === 'gradient' ? "stroke-cyan-500" : variant === 'light' ? "stroke-white" : "stroke-primary"} 
              strokeWidth="2"
            />
            <path 
              d="M2 12L12 17L22 12" 
              className={variant === 'gradient' ? "stroke-blue-500" : variant === 'light' ? "stroke-white" : "stroke-primary"} 
              strokeWidth="2"
            />
          </svg>
          <span>Yotta!</span>
        </span>
      </div>
    </div>
  );
};

export default HotelLogo;
