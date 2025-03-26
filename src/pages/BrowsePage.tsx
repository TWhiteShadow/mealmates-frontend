import Browse from '@/components/Browse/Browse';
import SearchBar from '@/components/Browse/SearchBar';
import Navbar from '@/components/ui/Navbar';
import "../assets/browse-map.css";
import { useState } from 'react';
import RadiusControl from '@/components/Browse/map/RadiusControl';

function BrowsePage() {
  const [search, setSearch] = useState<string>('');
  // const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchRadius, setSearchRadius] = useState<number>(1000); // 1000m 
  const [showRadiusFilter, setShowRadiusFilter] = useState<boolean>(false);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleFilterClick = () => {
    setShowRadiusFilter(!showRadiusFilter);
  };

  const handleLocationClick = () => {
    const address = prompt("Entrez une adresse pour recentrer la carte:");
    if (address) {
      handleSearch(address);
    }
  };

  return (
    <div className="h-screen relative bg-gray-100 overflow-hidden">
      <div className='fixed top-0 left-0 w-full z-100'>
        <div className='max-w-md mx-auto pt-12 pb-6 px-4 xs:px-9 rounded-b-[20px] bg-purple-dark/10 backdrop-blur-lg'>
        <SearchBar 
            onSearch={handleSearch} 
            onFilterClick={handleFilterClick}
            onLocationClick={handleLocationClick}
          />
        </div>
        <div className="absolute top-0 pt-24 left-0 right-0 z-10 max-w-md mx-auto">
          <RadiusControl 
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
            showRadiusFilter={showRadiusFilter}
          />
        </div>
      </div>
      <Browse searchValue={search} radius={searchRadius} />
      
      <Navbar />
    </div>
  );
}

export default BrowsePage;
