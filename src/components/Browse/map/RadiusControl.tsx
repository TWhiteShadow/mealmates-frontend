import React, { ChangeEvent, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { cn } from '@/lib/utils';

interface RadiusControlProps {
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  showRadiusFilter: boolean;
}

const RadiusControl: React.FC<RadiusControlProps> = ({
  searchRadius,
  setSearchRadius,
  showRadiusFilter
}) => {

  const [showRadiusSlider, setShowRadiusSlider] = useState<boolean>(false);


  const handleRadiusChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSearchRadius(value);
  };


  const toggleRadiusSlider = () => {
    setShowRadiusSlider(!showRadiusSlider);
  };

  return (
    <div className={cn("bg-white rounded-b-lg shadow-md overflow-hidden", !showRadiusFilter ? 'hidden' : '')}>
      <button
        onClick={toggleRadiusSlider}
        className="w-full flex items-center justify-between px-4 py-3 bg-white text-purple-dark font-medium"
      >
        <div className="flex items-center">
          <LocationOnIcon className="mr-2" fontSize="small" />
          <span>Rayon de recherche: {searchRadius / 1000} km</span>
        </div>
        <ExpandMoreIcon className={`transform transition-transform ${showRadiusSlider ? 'rotate-180' : ''}`} />
      </button>

      {showRadiusSlider && (
        <div className="px-4 py-3 bg-gray-50">
          <input
            type="range"
            min="500"
            max="40000"
            step="500"
            value={searchRadius}
            onChange={handleRadiusChange}
            className="w-full accent-purple-dark cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5 km</span>
            <span>40 km</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadiusControl;
