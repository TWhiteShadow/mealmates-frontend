import React, { ReactNode } from 'react';

interface IconFilterButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
}

const IconFilterButton: React.FC<IconFilterButtonProps> = ({ 
  label, 
  selected, 
  onClick, 
  icon
}) => {
  return (
    <button
      className={`py-2 px-3 border border-gray-300 rounded-lg text-center flex flex-col items-center ${
        selected ? 'bg-purple-dark/10 text-purple-dark border-purple-dark' : ''
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm mt-1">{label}</span>
    </button>
  );
};

export default IconFilterButton;