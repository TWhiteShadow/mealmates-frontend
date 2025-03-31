import React, { ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  children, 
  className = ""
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
};

export default FilterSection;
