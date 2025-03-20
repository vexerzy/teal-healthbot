
import React from 'react';
import { Flame } from 'lucide-react';

interface PulsingFlameProps {
  isActive: boolean;
  className?: string;
}

export const PulsingFlame = ({ isActive, className = "" }: PulsingFlameProps) => {
  return (
    <div className={`w-24 h-24 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'} ${className}`}>
      <div className="transform transition-all duration-300">
        <Flame 
          className="text-blue-300 transition-all" 
          size={isActive ? 60 : 40} 
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
};
