// components/SearchBar.tsx
import TuneIcon from '@mui/icons-material/Tune';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddressInput from '@/components/AddressInput'
import { Address } from '@/api/User';

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
  return (
    <div className="flex items-center relative">
      <AddressInput placeholder={placeholder} onSelect={onSearch} className='absolute' />

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
