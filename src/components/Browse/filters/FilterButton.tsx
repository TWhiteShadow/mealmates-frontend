import React, { ReactNode } from 'react';

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  selected, 
  onClick, 
  icon,
  className = ""
}) => {
  return (
    <button
      className={`py-3 px-4 border border-gray-300 rounded-lg ${
        selected ? 'bg-purple-dark/10 text-purple-dark border-purple-dark' : ''
      } ${icon ? 'flex flex-col items-center' : 'text-center'} ${className}`}
      onClick={onClick}
    >
      {icon && <div className="mb-1">{icon}</div>}
      <span className={icon ? "text-sm mt-1" : ""}>{label}</span>
    </button>
  );
};

export default FilterButton;