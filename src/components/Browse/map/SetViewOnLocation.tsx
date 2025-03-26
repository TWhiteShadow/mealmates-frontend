import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface SetViewOnLocationProps {
  coords: LatLngExpression;
}

const SetViewOnLocation: React.FC<SetViewOnLocationProps> = ({ coords }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  
  return null;
};

export default SetViewOnLocation;