
import React from 'react';
import { Flame } from 'lucide-react';

interface PulsingFlameProps {
  isActive: boolean;
}

export const PulsingFlame = ({ isActive }: PulsingFlameProps) => {
  return (
    <div className={`w-32 h-32 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="transform transition-all duration-300">
        <Flame 
          className="text-blue-300 transition-all" 
          size={isActive ? 80 : 60} 
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
};
