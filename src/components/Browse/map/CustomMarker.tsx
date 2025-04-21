import L from 'leaflet';

export const createCustomIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #5E1969; width: 20px; height: 20px; border-radius: 50%;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export const createUserLocationIcon = (zoomLevel: number): L.DivIcon => {
  const baseSize = 16;
  const sizeFactor = Math.max(1, (20 - zoomLevel) / 10);
  const width = baseSize * sizeFactor;
  const border = 3;

  return L.divIcon({
    className: 'user-marker !z-1000',
    html: `<div style="width: ${width}px; height: ${width}px; border-radius: 50%; border: ${border}px solid white; " class="bg-purple-dark"></div>`,
    iconSize: [width + border, width + border],
    iconAnchor: [(width + border)/2, (width + border)/2]
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