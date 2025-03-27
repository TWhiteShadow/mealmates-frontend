import TuneIcon from '@mui/icons-material/Tune';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ChangeEvent, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  onFilterClick?: () => void;
  onLocationClick?: () => void;
}

interface Suggestion {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Rechercher ...',
  onSearch,
  onFilterClick,
  onLocationClick,
}) => {

  const [addressInput, setAddressInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1&countrycodes=fr`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions:", error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useRef(
    debounce((query: string) => {
      fetchAddressSuggestions(query);
    }, 300)
  ).current;

  const handleAddressInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressInput(value);
    
    if (value.length >= 3) {
      debouncedFetchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setAddressInput(suggestion.display_name);
    onSearch(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(addressInput);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="flex items-center relative">
      <div className="relative w-full">
        <input
          type="text"
          value={addressInput}
          onChange={handleAddressInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-10 w-full py-2 px-4 text-sm text-gray-700 border border-gray-400 bg-white rounded-xl outline-none placeholder:text-purple-dark"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-start">
                  <LocationOnOutlinedIcon 
                    sx={{ width: '16px', height: '16px' }} 
                    className="text-purple-dark mr-2 mt-1 flex-shrink-0"
                  />
                  <span>{suggestion.display_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
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