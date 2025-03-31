export const geocodeAddress = async (address: string): Promise<[number, number]> => {
  try {
    // https://nominatim.openstreetmap.org/ui/search 
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    const data = await response.json();
    
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
      throw new Error("Adresse non trouvée");
    }
  } catch (error) {
    console.error("Erreur de géocodage:", error);
    throw error;
  }
};