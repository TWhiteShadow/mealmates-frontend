import { NavigateFunction } from 'react-router';

type NavigationRefProps = {
  navigate: NavigateFunction | null;
};

type LocationRefProps = {
  location: string | null;
};

// navigationRef.js
export const navigationRef: NavigationRefProps = { navigate: null };
export const locationRef: LocationRefProps = { location: null };
