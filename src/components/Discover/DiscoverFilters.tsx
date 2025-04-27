import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PriceRange } from '@/api/Product';

export interface DiscoverFiltersProps {
    onSortChange: (value: string) => void;
    onFilterChange: (type: string, value: string | string[]) => void;
}

const DiscoverFilters = ({ onSortChange, onFilterChange }: DiscoverFiltersProps) => {
    const [activeSort, setActiveSort] = useState('recommended');
    const [activePriceRange, setActivePriceRange] = useState<PriceRange>(PriceRange.ALL);

    const handleSortChange = (value: string) => {
        setActiveSort(value);
        onSortChange(value);
    };

    const handlePriceChange = (value: PriceRange) => {
        setActivePriceRange(value);
        onFilterChange('priceRange', value);
    };

    return (
        <div className="mb-6 space-y-4 px-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex-1">
                    <h3 className="text-sm font-medium mb-2 text-gray-700">Sort by</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={activeSort === 'recommended' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSortChange('recommended')}
                        >
                            Recommended
                        </Button>
                        <Button
                            variant={activeSort === 'price' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSortChange('price')}
                        >
                            Price: Low to High
                        </Button>
                        <Button
                            variant={activeSort === 'rating' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSortChange('rating')}
                        >
                            Rating
                        </Button>
                        <Button
                            variant={activeSort === 'expiry' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSortChange('expiry')}
                        >
                            Expiring Soon
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700">Price Range</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={activePriceRange === PriceRange.ALL ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePriceChange(PriceRange.ALL)}
                        >
                            All
                        </Button>
                        <Button
                            variant={activePriceRange === PriceRange.UNDER_5 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePriceChange(PriceRange.UNDER_5)}
                        >
                            Under 5€
                        </Button>
                        <Button
                            variant={activePriceRange === PriceRange.BETWEEN_5_10 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePriceChange(PriceRange.BETWEEN_5_10)}
                        >
                            5€ - 10€
                        </Button>
                        <Button
                            variant={activePriceRange === PriceRange.OVER_10 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePriceChange(PriceRange.OVER_10)}
                        >
                            Over 10€
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverFilters;