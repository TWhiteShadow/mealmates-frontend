import { useState, useCallback } from 'react';
import Browse from '@/components/Browse/Browse';
import SearchBar from '@/components/Browse/SearchBar';
import "../assets/browse-map.css";
import RadiusControl from '@/components/Browse/map/RadiusControl';
import SearchFilter, { AdvancedFilterState } from '@/components/Browse/filters/SearchFilter';
import { Address } from '@/api/User';

function BrowsePage() {
  const [search, setSearch] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showRadiusFilter, setShowRadiusFilter] = useState<boolean>(false);
  const [filters, setFilters] = useState<AdvancedFilterState>({
    productTypes: [],
    dietaryPreferences: [],
    expirationDate: '',
    distance: 1000,
    price: {
      min: 0,
      max: 50
    },
    minSellerRating: 0
  });

  const handleSearch = useCallback((value: Address) => {
    setSearch(value.address);
  }, []);

  const handleFilterClick = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleLocationClick = useCallback(() => {
    setShowRadiusFilter(prev => !prev);
  }, []);

  const handleApplyFilters = useCallback((newFilters: AdvancedFilterState) => {
    setFilters(newFilters);
  }, []);

  const setSearchRadius = useCallback((value: number) => {
    setFilters(prev => ({ ...prev, distance: value }));
  }, []);

  const getActiveFiltersCount = useCallback((): number => {
    let count = 0;

    if (filters.productTypes.length > 0) {
      count++;
    }
    if (filters.dietaryPreferences.length > 0) {
      count++;
    }
    if (filters.expirationDate) {
      count++;
    }
    if (filters.price.min > 0 || filters.price.max < 50) {
      count++;
    }
    if (filters.minSellerRating > 0) {
      count++;
    }

    return count;
  }, [filters]);

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="h-screen relative bg-gray-100 overflow-hidden">
      <div className='fixed top-0 left-0 w-full z-10'>
        <div className='max-w-md mx-auto pt-12 pb-6 px-4 xs:px-9 rounded-b-[20px] bg-purple-dark/10 backdrop-blur-lg'>
          <SearchBar
            onSearch={handleSearch}
            onFilterClick={handleFilterClick}
            onLocationClick={handleLocationClick}
          />
          {activeFiltersCount > 0 && (
            <div className="mt-2 flex justify-center">
              <div className="bg-purple-dark/10 text-purple-dark rounded-full text-xs px-3 py-1">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {showRadiusFilter && (
          <div className="max-w-md mx-auto">
            <RadiusControl
              searchRadius={filters.distance}
              setSearchRadius={setSearchRadius}
              showRadiusFilter={showRadiusFilter}
            />
          </div>
        )}
      </div>

      <SearchFilter
        showFilters={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />

      <Browse
        searchValue={search}
        radius={filters.distance}
        filters={filters}
      />
    </div>
  );
}

export default BrowsePage;
