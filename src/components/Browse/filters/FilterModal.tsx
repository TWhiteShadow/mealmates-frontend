import React, { ReactNode, useEffect, useState } from 'react';
import Close from '@mui/icons-material/Close';
import SaveSearchButton from './SaveSearchButton';
import { userLogged } from '@/api/User';
import { Button } from '@/components/ui/button';

interface FilterModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  onApply: () => void;
  onReset: () => void;
  onSaveSearch: () => void;
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
      <div className="max-w-md mx-auto px-4 py-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500">
            <Close />
          </button>
        </div>

        {children}

        <div className="flex justify-between mt-12">
          <Button
            variant="ghost"
            onClick={onReset}
            className="text-purple-dark rounded-full h-10 hover:text-purple-dark"
          >
            {resetLabel}
          </Button>
          <div className='flex items-center gap-2'>
            {canSaveSearch && <SaveSearchButton onSaveSearch={onSaveSearch} />}
            <Button
              onClick={onApply}
              className="rounded-full h-10"
            >
              {applyLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
