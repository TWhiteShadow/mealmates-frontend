import { atom } from 'jotai';

export interface LocationState {
  latitude: number;
  longitude: number;
  lastUpdated: number;
}

export interface MapViewState {
  zoom: number;
  center: [number, number];
}

export const locationAtom = atom<LocationState>({
  latitude: 48.8566,
  longitude: 2.3522,
  lastUpdated: 0,
});

export const isLoadingLocationAtom = atom<boolean>(false);

export const updateLocationAtom = atom(null, (get, set) => {
  set(isLoadingLocationAtom, true);
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        set(locationAtom, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          lastUpdated: Date.now(),
        });
        set(isLoadingLocationAtom, false);
      },
      () => {
        set(isLoadingLocationAtom, false);
      }
    );
  }
});

export const mapViewStateAtom = atom<MapViewState>({
  zoom: 13,
  center: [48.8566, 2.3522],
});
