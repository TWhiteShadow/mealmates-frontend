import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const SetViewOnLocation = ({ coords }: { coords: LatLngExpression }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  
  return null;
};

// custom marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #5E1969; width: 20px; height: 20px; border-radius: 50%;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Données factices pour les offres MealMates (points violets)
const dummyOffers: { id: number, position: [number, number], name: string, description: string, price: string }[] = [
  { id: 1, position: [48.8566, 2.3522], name: "Boulangerie du Coin", description: "Panier surprise", price: "3,99€" },
  { id: 2, position: [48.8606, 2.3376], name: "Restaurant La Belle Assiette", description: "Plat du jour", price: "5,50€" },
  { id: 3, position: [48.8744, 2.3526], name: "Supermarché Express", description: "Fruits et légumes", price: "4,25€" },
  { id: 4, position: [48.8651, 2.3781], name: "Épicerie Bio", description: "Produits laitiers", price: "2,99€" },
  { id: 5, position: [48.8607, 2.3397], name: "Traiteur Délices", description: "Assortiment de tapas", price: "6,99€" },
  { id: 6, position: [48.8738, 2.3749], name: "Market Fresh", description: "Panier repas", price: "4,50€" },
  { id: 7, position: [48.8719, 2.3316], name: "Pâtisserie des Gourmands", description: "Viennoiseries", price: "3,75€" },
  { id: 8, position: [48.8676, 2.3462], name: "L'Épicier du Quartier", description: "Sandwich et boisson", price: "4,99€" },
  { id: 9, position: [48.8697, 2.3548], name: "La Petite Cantine", description: "Menu complet", price: "7,50€" },
  { id: 10, position: [48.8637, 2.3410], name: "Café des Amis", description: "Encas et café", price: "3,25€" },
  { id: 11, position: [48.8582, 2.3439], name: "La Fromagerie", description: "Assortiment de fromages", price: "5,75€" },
  { id: 12, position: [48.8702, 2.3456], name: "Pasta & Co", description: "Plat de pâtes", price: "4,80€" }
];

const Discover = () => {
  const [userLocation, setUserLocation] = useState<LatLngExpression|null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string|null>(null);

  useEffect(() => {
    // Demander la géolocalisation de l'utilisateur
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
          setUserLocation([48.8566, 2.3522]); // Paname
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("La géolocalisation n'est pas prise en charge par votre navigateur");
      setIsLoading(false);
      setUserLocation([48.8566, 2.3522]);// Paname
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const customIcon = createCustomIcon();

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
              radius={1000}
              pathOptions={{ fillColor: '#5E1969', fillOpacity: 0.1, color: '#5E1969', weight: 1 }}
            />

            <Marker 
              position={userLocation}
              icon={L.divIcon({
                className: 'user-marker bg-purple-dark',
                html: `<div style="width: 12px; height: 12px; border-radius: 50%; border: 3px solid white;"></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9]
              })}
            >
              <Popup>Votre position</Popup>
            </Marker>

            {dummyOffers.map(offer => (
              <Marker 
                key={offer.id} 
                position={offer.position}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-purple-dark">{offer.name}</h3>
                    <p>{offer.description}</p>
                    <p className="font-bold mt-1">{offer.price}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <SetViewOnLocation coords={userLocation} />
            <ZoomControl position="topright" />
          </MapContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-red-500 text-center p-4">{locationError || "Impossible de charger la carte"}</p>
          </div>
        )}
      </div>

      <div className='location-btn--container w-full'>
        <button className="fixed z-10 bottom-20 inset-x-0 max-w-md sm:m-auto mx-4 bg-purple-dark text-white py-4 px-6 rounded-lg shadow-lg flex items-center justify-center">
          <SendOutlinedIcon sx={{ fontSize: '1.5rem' }} className='mr-4'/>
          <span className="text-lg font-medium">Où te trouves-tu ?</span>
        </button>
      </div>
    </div>
  );
};

export default Discover;
