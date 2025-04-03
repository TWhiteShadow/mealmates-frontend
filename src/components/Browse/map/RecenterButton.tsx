import { LatLngExpression } from 'leaflet';
import React from 'react';
import { useCallback } from "react";
import { useMap } from "react-leaflet";

type RecenterButtonProps = {
  userLocation: LatLngExpression | null;
};

export const RecenterButton: React.FC<RecenterButtonProps> = ({ userLocation }) => {
  const map = useMap();
  
  const handleRecenter = useCallback(() => {
    if (userLocation) {
      map.flyTo(userLocation, 18);
    }
  }, [map, userLocation]);
  
  return (
    <button 
      onClick={handleRecenter}
      className="absolute z-1000 bottom-40 right-4 bg-white p-2 rounded-md shadow-md hover:bg-gray-100 focus:outline-none"
      title="Recentrer la carte"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
};
