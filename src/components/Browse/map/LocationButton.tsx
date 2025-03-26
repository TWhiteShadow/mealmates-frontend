import React from 'react';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

interface LocationButtonProps {
  onLocationRequest: () => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onLocationRequest }) => {
  return (
    <div className='location-btn--container w-full'>
      <button 
        onClick={onLocationRequest}
        className="fixed z-10 bottom-20 inset-x-0 max-w-md sm:m-auto mx-4 bg-purple-dark text-white py-4 px-6 rounded-lg shadow-lg flex items-center justify-center"
      >
        <SendOutlinedIcon sx={{ fontSize: '1.5rem' }} className='mr-4'/>
        <span className="text-lg font-medium">Où te trouves-tu ?</span>
      </button>
    </div>
  );
};

export default LocationButton;
