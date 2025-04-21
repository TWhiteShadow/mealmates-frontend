import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { getProductsArroundMe } from '@/api/User';
import { Product } from '@/api/Product';

import { createCustomIcon, createUserLocationIcon, createClusterIcon } from './map/CustomMarker';
import LocationButton from './map/LocationButton';
import SetViewOnLocation from './map/SetViewOnLocation';
import { geocodeAddress } from '@/utils/geoUtils';
import { AdvancedFilterState } from './SearchFilter';
import { RecenterButton } from './map/RecenterButton';

interface BrowseProps {
  searchValue: string;
  radius: number;
  filters?: AdvancedFilterState;
}

const Browse: React.FC<BrowseProps> = ({ 
  searchValue, 
  radius, 
  filters = {
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
  } 
}) => {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(5);
  
  const searchRadius = useMemo(() => filters.distance || radius || 1000, [filters.distance, radius]);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoading(false);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError(`Impossible d'obtenir votre position: ${error.message}`);
          setIsLoading(false);
          setUserLocation([48.8566, 2.3522]);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("La géolocalisation n'est pas prise en charge par votre navigateur");
      setIsLoading(false);
      setUserLocation([48.8566, 2.3522]);
    }
  }, []);

  useEffect(() => {
    const searchAddress = async () => {
      if (searchValue && searchValue.trim()) {
        setIsLoading(true);
        try {
          const coordinates = await geocodeAddress(searchValue);
          setUserLocation(coordinates);
        } catch (error) {
          setLocationError(`Impossible de trouver cette adresse: ${(error as Error).message}`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    searchAddress();
  }, [searchValue]);

  useEffect(() => {
    const fetchProductsArroundMe = async () => {
      if (!userLocation || !Array.isArray(userLocation) || userLocation.length !== 2) {
        return;
      }

      setIsLoading(true);
      try {
        const serverFilters = {
          productTypes: filters.productTypes,
          minPrice: filters.price.min,
          maxPrice: filters.price.max,
          minSellerRating: filters.minSellerRating > 0 ? filters.minSellerRating : undefined,
          dietaryPreferences: filters.dietaryPreferences
        };

        const products = await getProductsArroundMe(
          userLocation[0], 
          userLocation[1], 
          searchRadius,
          serverFilters
        );
        
        setProducts(products);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setIsLoading(false);
      }
    };

    if (userLocation) {
      fetchProductsArroundMe();
    }
  }, [userLocation, searchRadius, filters.productTypes, filters.price.min, filters.price.max, 
      filters.minSellerRating, filters.dietaryPreferences]);

  const filteredProducts = useMemo(() => {
    if (!products.length) {
      return [];
    }

    return products.filter(product => {
      if (filters.expirationDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        const expiryDate = new Date(product.expiryDate);
        
        if (filters.expirationDate === 'today' && expiryDate.toDateString() !== today.toDateString()) {
          return false;
        }
        if (filters.expirationDate === 'tomorrow' && expiryDate.toDateString() !== tomorrow.toDateString()) {
          return false;
        }
        if (filters.expirationDate === 'week' && expiryDate > endOfWeek) {
          return false;
        }
      }

      if (filters.pickupOptions.length > 0 && 
          !filters.pickupOptions.some(option => product.pickupOptions?.includes(option))) {
        return false;
      }

      return true;
    });
  }, [products, filters.expirationDate, filters.pickupOptions]);

  const handleLocationRequest = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoading(false);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError(`Impossible d'obtenir votre position: ${error.message}`);
          setIsLoading(false);
        }
      );
    }
  }, []);

  const displayedProducts = useMemo(() => {
    const filtersActive = filters.expirationDate || 
                          filters.pickupOptions.length > 0 || 
                          filters.productTypes.length > 0 ||
                          filters.dietaryPreferences.length > 0 ||
                          filters.minSellerRating > 0 ||
                          filters.price.min > 0 ||
                          filters.price.max < 50;
                          
    return filtersActive ? filteredProducts : products;
  }, [products, filteredProducts, filters]);


  const ZoomLevelCatcher = () => {
    const mapEvents = useMapEvents({
      zoomend: () => {
          setZoomLevel(mapEvents.getZoom());
      },
    });

    return null;
  }



  return (
    <div className="m-auto max-w-md w-full h-full relative margin-auto z-0">
      <div className="w-full h-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
          </div>
        ) : userLocation ? (
          <MapContainer 
            center={userLocation}
            zoom={13} 
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Circle 
              center={userLocation}
              radius={searchRadius}
              pathOptions={{ fillColor: '#5E1969', fillOpacity: 0.1, color: '#5E1969', weight: 1 }}
            />

            <Marker 
              position={userLocation}
              icon={createUserLocationIcon(zoomLevel)}
            >
              <Popup>Votre position</Popup>
            </Marker>

            <RecenterButton userLocation={userLocation} />
            <ZoomLevelCatcher />

            <MarkerClusterGroup
              iconCreateFunction={createClusterIcon}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom={true}
              disableClusteringAtZoom={16}
              maxClusterRadius={60}
            >
              {displayedProducts.map(offer => (
                <Marker 
                  key={offer.id} 
                  position={offer.position as [number, number]}
                  icon={createCustomIcon()}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-purple-dark">{offer.name}</h3>
                      <p>{offer.description}</p>
                      <div className="mt-2">
                        <div className="flex justify-between">
                          <span>Prix:</span>
                          <span className="font-bold">{offer.price}€</span>
                        </div>
                        {offer.quantity && (
                          <div className="flex justify-between">
                            <span>Quantité:</span>
                            <span>{offer.quantity}</span>
                          </div>
                        )}
                        {offer.seller && (
                          <div className="flex justify-between">
                            <span>Vendeur:</span>
                            <span>{offer.seller.first_name} {offer.seller.last_name}</span>
                          </div>
                        )}
                        {offer.sellerRating && (
                          <div className="flex justify-between">
                            <span>Note:</span>
                            <span>{offer.sellerRating.toFixed(2)}/5 ⭐</span>
                          </div>
                        )}
                        {offer.pickupDetails && (
                          <div className="mt-1 text-sm text-gray-600">
                            <p>{offer.pickupDetails}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
            
            <SetViewOnLocation coords={userLocation} />
            <ZoomControl position="topright" />
          </MapContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-red-500 text-center p-4">{locationError || "Impossible de charger la carte"}</p>
          </div>
        )}
      </div>

      <LocationButton onLocationRequest={handleLocationRequest} />

      {displayedProducts.length > 0 && displayedProducts.length !== products.length && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center">
          <div className="bg-purple-dark text-white px-4 py-2 rounded-full text-sm font-medium">
            {displayedProducts.length} résultat{displayedProducts.length > 1 ? 's' : ''} trouvé{displayedProducts.length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
