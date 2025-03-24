import TuneIcon from '@mui/icons-material/Tune';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

interface SearchBarProps {
  placeholder?: string;
  onFilterClick?: () => void;
  onLocationClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Rechercher ...',
  onFilterClick,
  onLocationClick,
}) => {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder={placeholder}
        className="min-h-10 w-full py-2 px-4 text-sm text-gray-700 border border-gray-400 bg-white rounded-xl outline-none placeholder:text-purple-dark"
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