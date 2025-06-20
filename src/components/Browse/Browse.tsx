import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Address } from '@/api/User';
import { Product, useNearbyProducts } from '@/api/Product';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { locationAtom, updateLocationAtom, isLoadingLocationAtom, mapViewStateAtom } from '@/atoms/location';

import { createCustomIcon, createUserLocationIcon, createClusterIcon } from './map/CustomMarker';
import LocationButton from './map/LocationButton';
import SetViewOnLocation from './map/SetViewOnLocation';
import { AdvancedFilterState } from './filters/SearchFilter';
import { RecenterButton } from './map/RecenterButton';

interface BrowseProps {
  searchValue: Address | null;
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
    // minSellerRating: 0,
  }
}) => {
  const [location, setLocation] = useAtom(locationAtom);
  const updateLocation = useSetAtom(updateLocationAtom);
  const isLoadingLocation = useAtomValue(isLoadingLocationAtom);
  const [mapViewState, setMapViewState] = useAtom(mapViewStateAtom);
  const [products, setProducts] = useState<Product[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(mapViewState.zoom);

  const searchRadius = useMemo(() => filters.distance || radius || 1000, [filters.distance, radius]);

  const serverFilters = useMemo(() => ({
    productTypes: filters.productTypes,
    minPrice: filters.price.min,
    maxPrice: filters.price.max,
    // minSellerRating: filters.minSellerRating > 0 ? filters.minSellerRating : undefined,
    dietaryPreferences: filters.dietaryPreferences
  }), [filters.productTypes, filters.price.min, filters.price.max, filters.dietaryPreferences]);

  const currentLocation: LatLngExpression = useMemo(() => {
    return [location.latitude, location.longitude];
  }, [location]);

  const { data: nearbyProducts, error: queryError, isLoading: queryLoading } = useNearbyProducts(
    location.latitude,
    location.longitude,
    searchRadius,
    serverFilters
  );

  useEffect(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    if (location.lastUpdated < oneHourAgo) {
      updateLocation();
    }
  }, [location.lastUpdated, updateLocation]);

  useEffect(() => {
    const searchAddress = async () => {
      if (searchValue) {
        try {
          setLocation({
            latitude: searchValue.latitude!,
            longitude: searchValue.longitude!,
            lastUpdated: Date.now()
          });
        } catch (error) {
          setLocationError(`Impossible de trouver cette adresse: ${(error as Error).message}`);
        }
      }
    };

    searchAddress();
  }, [searchValue, setLocation]);

  useEffect(() => {
    if (nearbyProducts) {
      setProducts(nearbyProducts);
    }
    if (queryError) {
      console.error("Failed to fetch products:", queryError);
    }
  }, [nearbyProducts, queryError]);

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

      return true;
    });
  }, [products, filters.expirationDate]);

  const handleLocationRequest = useCallback(() => {
    updateLocation();
  }, [updateLocation]);

  const displayedProducts = useMemo(() => {
    const filtersActive = filters.expirationDate ||
      filters.productTypes.length > 0 ||
      filters.dietaryPreferences.length > 0 ||
      // filters.minSellerRating > 0 ||
      filters.price.min > 0 ||
      filters.price.max < 50;

    return filtersActive ? filteredProducts : products;
  }, [products, filteredProducts, filters]);

  const ZoomLevelCatcher = () => {
    const mapEvents = useMapEvents({
      zoomend: () => {
        const newZoom = mapEvents.getZoom();
        setZoomLevel(newZoom);
        const center = mapEvents.getCenter();
        setMapViewState({
          zoom: newZoom,
          center: [center.lat, center.lng]
        });
      },
      moveend: () => {
        const center = mapEvents.getCenter();
        setMapViewState(prev => ({
          ...prev,
          center: [center.lat, center.lng]
        }));
      }
    });
    return null;
  }

  return (
    <div className="m-auto w-full h-full relative margin-auto z-0">
      <div className="w-full h-full relative">
        {isLoadingLocation || queryLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
          </div>
        ) : locationError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-red-500 text-center p-4">{locationError}</p>
          </div>
        ) : (
          <MapContainer
            center={mapViewState.center}
            zoom={mapViewState.zoom}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Circle
              center={currentLocation}
              radius={searchRadius}
              pathOptions={{ fillColor: '#5E1969', fillOpacity: 0.1, color: '#5E1969', weight: 1 }}
            />

            <Marker
              position={currentLocation}
              icon={createUserLocationIcon(zoomLevel)}
            >
              <Popup>Votre position</Popup>
            </Marker>

            <RecenterButton userLocation={currentLocation} />
            <ZoomLevelCatcher />

            <MarkerClusterGroup
              key={JSON.stringify(displayedProducts.map(product => product.id))}
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

            <SetViewOnLocation coords={currentLocation} />
            <ZoomControl position="topright" />
          </MapContainer>
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
