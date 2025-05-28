import { useEffect } from 'react';
import { useNearbyProducts } from '@/api/Product';
import { useNavigate } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { locationAtom, updateLocationAtom, isLoadingLocationAtom } from '@/atoms/location';
import DiscoverCard from './DiscoverCard';
import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-expect-error swiper is installed correctly
import 'swiper/css';

const swiperOptions = {
  className: "!py-2",
  modules: [],
  spaceBetween: 20,
  slidesPerView: 'auto' as const,
  slidesOffsetBefore: 20,
  slidesOffsetAfter: 20,
  breakpoints: {
    320: { slidesPerView: 1.2 },
    640: { slidesPerView: 2.2 },
    768: { slidesPerView: 2.8 },
    1024: { slidesPerView: 3.5 },
    1280: { slidesPerView: 4.3 },
  }
};

const Discover = () => {
  const location = useAtomValue(locationAtom);
  const updateLocation = useSetAtom(updateLocationAtom);
  const isLoadingLocation = useAtomValue(isLoadingLocationAtom);
  const navigate = useNavigate();

  const { data: todayProducts, error: todayError, isLoading: todayLoading } = useNearbyProducts(
    location.latitude,
    location.longitude,
    5000,
    { expirationDate: 'today' }
  );

  const { data: weekProducts, error: weekError, isLoading: weekLoading } = useNearbyProducts(
    location.latitude,
    location.longitude,
    5000,
    { expirationDate: 'week' }
  );

  const { data: weekVeganProducts, error: weekVeganError, isLoading: weekVeganLoading } = useNearbyProducts(
    location.latitude,
    location.longitude,
    5000,
    { expirationDate: 'week', dietaryPreferences: ['Vegan'] }
  );

  useEffect(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    if (location.lastUpdated < oneHourAgo) {
      updateLocation();
    }
  }, [location.lastUpdated, updateLocation]);

  const handleProductClick = (productId: number) => {
    navigate(`/app/product/${productId}`);
  };

  if (isLoadingLocation || todayLoading || weekLoading || weekVeganLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
      </div>
    );
  }

  if (todayError || weekError || weekVeganError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Unable to fetch products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 pb-[calc(56px+2rem)]">
      <div className="space-y-8">

        {weekProducts && weekProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 px-5">Que-ce qu'on sauve cette semaine ?</h2>
            <div className="relative">
              <Swiper {...swiperOptions}>
                {weekProducts.map((product) => (
                  <SwiperSlide key={product.id} style={{ width: 'auto', height: 'auto' }}>
                    <DiscoverCard
                      product={product}
                      onClick={handleProductClick}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {todayProducts && todayProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 px-5">Dernière Chance !</h2>
            <div className="relative">
              <Swiper {...swiperOptions}>
                {todayProducts.map((product) => (
                  <SwiperSlide key={product.id} style={{ width: 'auto', height: 'auto' }}>
                    <DiscoverCard
                      product={product}
                      onClick={handleProductClick}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}



        {weekVeganProducts && weekVeganProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 px-5">Ce soir on mange Vegan !</h2>
            <div className="relative">
              <Swiper {...swiperOptions}>
                {weekVeganProducts.map((product) => (
                  <SwiperSlide key={product.id} style={{ width: 'auto', height: 'auto' }}>
                    <DiscoverCard
                      product={product}
                      onClick={handleProductClick}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {(!todayProducts || todayProducts.length === 0) && (!weekProducts || weekProducts.length === 0) && (!weekVeganProducts || weekVeganProducts.length === 0) && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products available nearby.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
