import { useQuery } from '@tanstack/react-query';
import api from './Axios';

export interface Allergen {
  id: number;
  name: string;
}

export interface AllergenResponse {
  success: boolean;
  message?: string;
  allergens: Allergen[];
}

/**
 * Fetches all available allergens from the API
 * @returns Promise with allergens data
 */
export async function getAllergens(): Promise<Allergen[]> {
  const response = await api.get('/allergens');
  return response.data;
}

/**
 * React Query hook to fetch and cache allergens
 */
export function useAllergens() {
  return useQuery({
    queryKey: ['allergens'],
    queryFn: getAllergens,
  });
}

/**
 * Fetches a specific allergen by ID
 * @param id The allergen ID
 * @returns Promise with allergen data
 */
export async function getAllergen(id: number): Promise<Allergen> {
  const response = await api.get(`/allergens/${id}`);
  return response.data;
}

/**
 * React Query hook to fetch and cache a single allergen
 * @param id The allergen ID
 */
export function useAllergen(id: number) {
  return useQuery({
    queryKey: ['allergen', id],
    queryFn: () => getAllergen(id),
    enabled: !!id, // Only run the query if an ID is provided
  });
}
