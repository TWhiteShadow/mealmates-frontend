import L from 'leaflet';

export const createCustomIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #5E1969; width: 20px; height: 20px; border-radius: 50%;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export const createUserLocationIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'user-marker bg-purple-dark',
    html: `<div style="width: 12px; height: 12px; border-radius: 50%; border: 3px solid white;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

export const createClusterIcon = (cluster: any): L.DivIcon => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="cluster-marker">${count}</div>`,
    className: 'custom-cluster-marker',
    iconSize: L.point(40, 40)
  });
};