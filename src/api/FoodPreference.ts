import { useQuery } from '@tanstack/react-query';
import api from './Axios';

export interface FoodPreference {
  id: number;
  name: string;
}

export interface FoodPreferenceResponse {
  success: boolean;
  message?: string;
  food_preferences: FoodPreference[];
}

/**
 * Fetches all available food preferences from the API
 * @returns Promise with food preferences data
 */
export async function getFoodPreferences(): Promise<FoodPreference[]> {
  const response = await api.get('/food-preferences');
  return response.data;
}

/**
 * React Query hook to fetch and cache food preferences
 */
export function useFoodPreferences() {
  return useQuery({
    queryKey: ['foodPreferences'],
    queryFn: getFoodPreferences,
  });
}

/**
 * Fetches a specific food preference by ID
 * @param id The food preference ID
 * @returns Promise with food preference data
 */
export async function getFoodPreference(id: number): Promise<FoodPreference> {
  const response = await api.get(`/food-preferences/${id}`);
  return response.data;
}

/**
 * React Query hook to fetch and cache a single food preference
 * @param id The food preference ID
 */
export function useFoodPreference(id: number) {
  return useQuery({
    queryKey: ['foodPreference', id],
    queryFn: () => getFoodPreference(id),
    enabled: !!id, // Only run the query if an ID is provided
  });
}
