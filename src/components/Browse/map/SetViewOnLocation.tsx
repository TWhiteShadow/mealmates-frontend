import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useAtomValue } from 'jotai';
import { mapViewStateAtom } from '@/atoms/location';

interface SetViewOnLocationProps {
  coords: LatLngExpression;
}

const SetViewOnLocation: React.FC<SetViewOnLocationProps> = ({ coords }) => {
  const map = useMap();
  const mapViewState = useAtomValue(mapViewStateAtom);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // On first mount, restore the saved view state
    if (isFirstMount.current) {
      map.setView(mapViewState.center, mapViewState.zoom);
      isFirstMount.current = false;
    }
  }, [map, mapViewState]);

  useEffect(() => {
    // Only update view when coords change and it's not the initial mount
    if (!isFirstMount.current) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);

  return null;
};

export default SetViewOnLocation;