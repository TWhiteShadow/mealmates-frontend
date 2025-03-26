import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { getProductsArroundMe } from '@/api/User';
import { Product } from '@/api/Product';

import { createCustomIcon, createUserLocationIcon, createClusterIcon } from './map/CustomMarker';
import LocationButton from './map/LocationButton';
import SetViewOnLocation from './map/SetViewOnLocation';
import { geocodeAddress } from '@/utils/geoUtils';

interface BrowseProps {
  searchValue: string;
  radius: number;
}

const Browse: React.FC<BrowseProps> = ({ searchValue, radius }) => {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  console.log(radius);
  const searchRadius = radius ? radius : 1000; // 1000m

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError(`Impossible d'obtenir votre position: ${error.message}`);
          setIsLoading(false);
          setUserLocation([48.8566, 2.3522]); // Paris
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
        const products = await getProductsArroundMe(userLocation[0], userLocation[1], searchRadius);
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
  }, [userLocation, searchRadius]);

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError(`Impossible d'obtenir votre position: ${error.message}`);
          setIsLoading(false);
        }
      );
    }
  };

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
            scrollWheelZoom={false}
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
              icon={createUserLocationIcon()}
            >
              <Popup>Votre position</Popup>
            </Marker>

            <MarkerClusterGroup
              iconCreateFunction={createClusterIcon}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom={true}
              disableClusteringAtZoom={16}
              maxClusterRadius={60}
            >
              {products.map(offer => (
                <Marker 
                  key={offer.id} 
                  position={offer.position}
                  icon={createCustomIcon()}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-purple-dark">{offer.name}</h3>
                      <p>{offer.description}</p>
                      <p className="font-bold mt-1">{offer.price}€</p>
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
    </div>
  );
};

export default Browse;