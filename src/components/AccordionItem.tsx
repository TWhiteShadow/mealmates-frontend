import { useState } from "react";

interface AccordionItemProps {
  title: string;
  required?: boolean|null;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const AccordionItem = ({ title, required=false, children, icon } : AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border border-purple-200 rounded-lg overflow-hidden shadow-md">
      <button
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-purple-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon && (
            <span className="mr-3 text-purple-semi-dark">
              {icon}
            </span>
          )}
            <span className="font-medium text-gray-800">
            {title}
            {required && <span className="text-red-600 font-bold ml-1 mb-1">*</span>}
            </span>
        </div>
        <svg 
          className={`w-5 h-5 text-purple-semi-dark transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white border-t border-purple-100">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
