import React, { useState } from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import SpaIcon from '@mui/icons-material/Spa';
import KitchenIcon from '@mui/icons-material/Kitchen';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import EggIcon from '@mui/icons-material/Egg';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import FilterModal from './filters/FilterModal';
import FilterSection from './filters/FilterSection';
import FilterButton from './filters/FilterButton';
import IconFilterButton from './filters/IconFilterButton';

export interface AdvancedFilterState {
  productTypes: string[];
  dietaryPreferences: string[];
  expirationDate: string;
  distance: number;
  price: {
    min: number;
    max: number;
  };
  minSellerRating: number;
  pickupOptions: string[];
}

interface SearchFilterProps {
  showFilters: boolean;
  onClose?: () => void;
  initialFilters?: AdvancedFilterState;
  onApplyFilters?: (filters: AdvancedFilterState) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  showFilters,
  onClose = () => {},
  initialFilters,
  onApplyFilters = () => {}
}) => {
  const [filters, setFilters] = useState<AdvancedFilterState>(
    initialFilters || {
      productTypes: [],
      dietaryPreferences: [],
      expirationDate: '',
      distance: 1000, // Par défaut 1km
      price: {
        min: 0,
        max: 50
      },
      minSellerRating: 0,
      pickupOptions: []
    }
  );

  const updateFilter = (key: keyof AdvancedFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Mettre à jour un filtre de prix
  const updatePriceFilter = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: value
      }
    }));
  };

  const toggleProductType = (type: string) => {
    setFilters(prev => {
      const types = [...prev.productTypes];
      if (types.includes(type)) {
        return { ...prev, productTypes: types.filter(t => t !== type) };
      } else {
        return { ...prev, productTypes: [...types, type] };
      }
    });
  };

  const toggleDietaryPreference = (pref: string) => {
    setFilters(prev => {
      const prefs = [...prev.dietaryPreferences];
      if (prefs.includes(pref)) {
        return { ...prev, dietaryPreferences: prefs.filter(p => p !== pref) };
      } else {
        return { ...prev, dietaryPreferences: [...prefs, pref] };
      }
    });
  };

  const togglePickupOption = (option: string) => {
    setFilters(prev => {
      const options = [...prev.pickupOptions];
      if (options.includes(option)) {
        return { ...prev, pickupOptions: options.filter(o => o !== option) };
      } else {
        return { ...prev, pickupOptions: [...options, option] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      productTypes: [],
      dietaryPreferences: [],
      expirationDate: '',
      distance: 1000,
      price: {
        min: 0,
        max: 50
      },
      minSellerRating: 0,
      pickupOptions: []
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const formatPrice = (value: number) => {
    return `${value}€`;
  };

  return (
    <FilterModal
      title="Filtres avancés"
      isOpen={showFilters}
      onClose={onClose}
      onApply={applyFilters}
      onReset={resetFilters}
    >
      <FilterSection title="Type de produits">
        <div className="grid grid-cols-4 gap-3">
          <IconFilterButton
            label="Fruits"
            selected={filters.productTypes.includes('fruits')}
            onClick={() => toggleProductType('fruits')}
            icon={<SpaIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
          <IconFilterButton
            label="Légumes"
            selected={filters.productTypes.includes('vegetables')}
            onClick={() => toggleProductType('vegetables')}
            icon={<SpaIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
          <IconFilterButton
            label="Plats"
            selected={filters.productTypes.includes('meals')}
            onClick={() => toggleProductType('meals')}
            icon={<RestaurantIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
          <IconFilterButton
            label="Pain"
            selected={filters.productTypes.includes('bakery')}
            onClick={() => toggleProductType('bakery')}
            icon={<BakeryDiningIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
          <IconFilterButton
            label="Épicerie"
            selected={filters.productTypes.includes('grocery')}
            onClick={() => toggleProductType('grocery')}
            icon={<LocalGroceryStoreIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
          <IconFilterButton
            label="Produits laitiers"
            selected={filters.productTypes.includes('dairy')}
            onClick={() => toggleProductType('dairy')}
            icon={<EggIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
          <IconFilterButton
            label="Surgelés"
            selected={filters.productTypes.includes('frozen')}
            onClick={() => toggleProductType('frozen')}
            icon={<KitchenIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
          <IconFilterButton
            label="Traiteur"
            selected={filters.productTypes.includes('catering')}
            onClick={() => toggleProductType('catering')}
            icon={<RoomServiceIcon sx={{ fontSize: 24, margin: 0 }} />}
          />
        </div>
      </FilterSection>

      <FilterSection title="Date de péremption">
        <div className="grid grid-cols-3 gap-3">
          <FilterButton
            label="Aujourd'hui"
            selected={filters.expirationDate === 'today'}
            onClick={() => updateFilter('expirationDate', filters.expirationDate === 'today' ? '' : 'today')}
            icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          />
          <FilterButton
            label="Demain"
            selected={filters.expirationDate === 'tomorrow'}
            onClick={() => updateFilter('expirationDate', filters.expirationDate === 'tomorrow' ? '' : 'tomorrow')}
            icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          />
          <FilterButton
            label="Cette semaine"
            selected={filters.expirationDate === 'week'}
            onClick={() => updateFilter('expirationDate', filters.expirationDate === 'week' ? '' : 'week')}
            icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          />
        </div>
      </FilterSection>

      <FilterSection title={`Distance maximale: ${filters.distance / 1000} km`}>
        <div className="px-2">
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={filters.distance}
            onChange={(e) => updateFilter('distance', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>500m</span>
            <span>10km</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Régime alimentaire">
        <div className="grid grid-cols-2 gap-3">
          <FilterButton
            label="Végétarien"
            selected={filters.dietaryPreferences.includes('vegetarian')}
            onClick={() => toggleDietaryPreference('vegetarian')}
          />
          <FilterButton
            label="Vegan"
            selected={filters.dietaryPreferences.includes('vegan')}
            onClick={() => toggleDietaryPreference('vegan')}
          />
          <FilterButton
            label="Sans gluten"
            selected={filters.dietaryPreferences.includes('gluten-free')}
            onClick={() => toggleDietaryPreference('gluten-free')}
          />
          <FilterButton
            label="Sans lactose"
            selected={filters.dietaryPreferences.includes('lactose-free')}
            onClick={() => toggleDietaryPreference('lactose-free')}
          />
        </div>
      </FilterSection>

      <FilterSection title={`Prix: ${formatPrice(filters.price.min)} - ${formatPrice(filters.price.max)}`}>
        <div className="px-2">
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={filters.price.min}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= filters.price.max) {
                  updatePriceFilter('min', value);
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {formatPrice(filters.price.min)}</span>
            </div>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={filters.price.max}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= filters.price.min) {
                  updatePriceFilter('max', value);
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Max: {formatPrice(filters.price.max)}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title={`Note minimum du vendeur: ${filters.minSellerRating > 0 ? filters.minSellerRating + '⭐' : 'Aucune'}`}>
        <div className="flex justify-between items-center px-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minSellerRating}
            onChange={(e) => updateFilter('minSellerRating', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
          <span>Aucune</span>
          <div className="flex items-center">
            <span>5</span>
            <StarIcon sx={{ fontSize: 14, color: '#FFD700', marginLeft: 0.5 }} />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Conditions de retrait">
        <div className="grid grid-cols-2 gap-3">
          <FilterButton
            label="Sur place"
            selected={filters.pickupOptions.includes('on-site')}
            onClick={() => togglePickupOption('on-site')}
          />
          <FilterButton
            label="À emporter"
            selected={filters.pickupOptions.includes('takeaway')}
            onClick={() => togglePickupOption('takeaway')}
          />
          <FilterButton
            label="Livraison possible"
            selected={filters.pickupOptions.includes('delivery')}
            onClick={() => togglePickupOption('delivery')}
          />
          <FilterButton
            label="Aujourd'hui uniquement"
            selected={filters.pickupOptions.includes('today-only')}
            onClick={() => togglePickupOption('today-only')}
          />
        </div>
      </FilterSection>
    </FilterModal>
  );
};

export default SearchFilter;