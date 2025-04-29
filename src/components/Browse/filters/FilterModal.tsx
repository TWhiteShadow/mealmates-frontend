import React, { ReactNode, useEffect, useState } from 'react';
import Close from '@mui/icons-material/Close';
import SaveSearchButton from './SaveSearchButton';
import { userLogged } from '@/api/User';

interface FilterModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  onApply: () => void;
  onReset: () => void;
  onSaveSearch: (name: string) => void;
  resetLabel?: string;
  applyLabel?: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  title, 
  isOpen, 
  onClose, 
  children,
  onApply,
  onReset,
  onSaveSearch,
  resetLabel = "Tout effacer",
  applyLabel = "Appliquer"
}) => {
  const [canSaveSearch, setCanSaveSearch] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
        const logged = await userLogged();
        setCanSaveSearch(logged?.success && logged?.success === true);
    };
    
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500">
            <Close />
          </button>
        </div>

        {children}

        <div className="flex justify-between mt-12">
          <button
            onClick={onReset}
            className="px-4 py-3 text-purple-dark font-medium"
          >
            {resetLabel}
          </button>
          <div>
            {canSaveSearch && <SaveSearchButton onSaveSearch={onSaveSearch} />}
            <button
              onClick={onApply}
              className="px-6 py-3 bg-purple-dark text-white font-medium rounded-full min-w-[170px]"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
