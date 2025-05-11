import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface AddressSearchBarProps {
  addressInput: string;
  setAddressInput: (address: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const AddressSearchBar: React.FC<AddressSearchBarProps> = ({
  addressInput,
  setAddressInput,
  onSearch,
  isSearching
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleAddressInput = (e: ChangeEvent<HTMLInputElement>) => {
    setAddressInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Rechercher une adresse..."
        value={addressInput}
        onChange={handleAddressInput}
        onKeyDown={handleKeyDown}
        className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-dark"
      />
      <button
        onClick={onSearch}
        className="absolute right-3 p-1 bg-purple-dark text-white rounded-full"
        disabled={isSearching}
      >
        {isSearching ? (
          <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        ) : (
          <SearchIcon fontSize="small" />
        )}
      </button>
    </div>
  );
};

export default AddressSearchBar;
