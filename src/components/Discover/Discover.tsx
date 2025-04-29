import { useState, useEffect, useMemo } from 'react';
import { useNearbyProducts } from '@/api/User';
import { PriceRange, Product } from '@/api/Product';
import { useNavigate } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { locationAtom, updateLocationAtom, isLoadingLocationAtom } from '@/atoms/location';
import DiscoverFilters from './DiscoverFilters';
import DiscoverCard from './DiscoverCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const Discover = () => {
  const location = useAtomValue(locationAtom);
  const updateLocation = useSetAtom(updateLocationAtom);
  const isLoadingLocation = useAtomValue(isLoadingLocationAtom);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState(PriceRange.ALL);

  const { data: nearbyProducts, error: queryError, isLoading: queryLoading } = useNearbyProducts(
    location.latitude,
    location.longitude,
    5000
  );

  useEffect(() => {
    // If location hasn't been updated in the last hour, update it
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    if (location.lastUpdated < oneHourAgo) {
      updateLocation();
    }
  }, [location.lastUpdated, updateLocation]);

  useEffect(() => {
    if (nearbyProducts) {
      setProducts(nearbyProducts);
    }
    if (queryError) {
      setError('Unable to fetch products. Please try again later.');
    }
  }, [nearbyProducts, queryError]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleFilterChange = (type: string, value: string | string[]) => {
    if (type === 'priceRange' && typeof value === 'string') {
      setPriceRange(value as PriceRange);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    switch (priceRange) {
      case PriceRange.UNDER_5: {
        const [min, max] = PriceRange.UNDER_5.split('-').map(Number);
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
        break;
      }
      case PriceRange.BETWEEN_5_10: {
        const [min, max] = PriceRange.BETWEEN_5_10.split('-').map(Number);
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
        break;
      }
      case PriceRange.OVER_10: {
        const [min, _] = PriceRange.OVER_10.split('-').map(Number);
        filtered = filtered.filter(product => product.price >= min);
        break;
      }
      default:
        break;
    }

    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.sellerRating || 0) - (a.sellerRating || 0));
        break;
      case 'expiry':
        filtered.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        break;
      case 'recommended':
      default:
        // For recommended, we'll combine rating and expiry date for a score
        filtered.sort((a, b) => {
          const scoreA = (a.sellerRating || 0) * 2 - (new Date(a.expiryDate).getTime() / (1000 * 60 * 60 * 24));
          const scoreB = (b.sellerRating || 0) * 2 - (new Date(b.expiryDate).getTime() / (1000 * 60 * 60 * 24));
          return scoreB - scoreA;
        });
        break;
    }

    return filtered;
  }, [products, sortBy, priceRange]);

  if (isLoadingLocation || queryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <DiscoverFilters
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />

      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="py-4">
            {filteredAndSortedProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-4 flex basis-[80%] sm:basis-[45%] md:basis-[30%] lg:basis-[23%]">
                <DiscoverCard
                  product={product}
                  onClick={handleProductClick}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No products available with the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default Discover;
