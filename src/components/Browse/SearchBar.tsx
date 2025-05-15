import TuneIcon from '@mui/icons-material/Tune';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddressInput from '@/components/AddressInput'
import { Address } from '@/api/User';
import { SavedSearch } from '@/api/SavedSearch';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentSearchAtom, savedSearchesQueryAtom } from '@/atoms/savedSearchFilters';
import { useEffect, useState } from 'react';
import { userLogged } from '@/api/User';
import { AtomWithQueryResult } from 'jotai-tanstack-query';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: Address) => void;
  onFilterClick?: () => void;
  onLocationClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Rechercher ...',
  onSearch,
  onFilterClick,
  onLocationClick,
}) => {
  const [savedSearchesQuery, setSavedSearchesQuery] = useAtom<AtomWithQueryResult<SavedSearch[], Error>|null>(savedSearchesQueryAtom);
  const setCurrentSearch = useSetAtom(currentSearchAtom);

  useEffect(() => {
    const fetchUserData = async () => {
      const logged = await userLogged();
      if (!logged?.success) {
        setSavedSearchesQuery(null);
      }
    };

    fetchUserData();
  }, []);

  const savedSearches = savedSearchesQuery ? savedSearchesQuery.data : [];

  const handleSavedSearchSelected = (savedSearch: SavedSearch) => {
    setCurrentSearch(savedSearch);
  };

  return (
    <div className="flex items-center relative">
      <AddressInput
        placeholder={placeholder}
        onSelect={onSearch}
        className="absolute"
        savedSearches={savedSearches}
        savedSearchSelected={handleSavedSearchSelected}
      />

      <button
        onClick={onFilterClick}
        className="min-h-10 min-w-10 ml-2 text-purple-dark border border-gray-400 bg-white rounded-xl hover:bg-gray-100 focus:outline-none"
      >
        <TuneIcon sx={{ width: '20px', height: '20px' }} />
      </button>
      <button
        onClick={onLocationClick}
        className="min-h-10 min-w-10 ml-2 text-purple-dark border border-gray-400 bg-white rounded-xl hover:bg-gray-100 focus:outline-none"
      >
        <LocationOnOutlinedIcon sx={{ width: '20px', height: '20px' }} />
      </button>
    </div>
  );
};

export default SearchBar;
