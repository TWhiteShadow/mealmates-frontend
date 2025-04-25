import { useState, useEffect, useMemo } from 'react';
import { getNearbyProducts } from '@/api/User';
import { Product } from '@/api/Product';
import { useNavigate } from 'react-router';
import DiscoverFilters from './DiscoverFilters';
import DiscoverCard from './DiscoverCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const Discover = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const defaultLat = 48.8566;
        const defaultLng = 2.3522;
        let lat = defaultLat;
        let lng = defaultLng;

        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }

        const fetchedProducts = await getNearbyProducts(lat, lng, 5000);
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Unable to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleFilterChange = (type: string, value: string | string[]) => {
    if (type === 'priceRange') {
      setPriceRange(value as string);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (priceRange) {
          case 'under5':
            return price < 5;
          case '5to10':
            return price >= 5 && price <= 10;
          case 'over10':
            return price > 10;
          default:
            return true;
        }
      });
    }

    // Apply sorting
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

  if (isLoading) {
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
