import { AdvancedFilterState } from '@/components/Browse/filters/SearchFilter';
import api from './Axios';

export interface SavedSearch {
  id?: number;
  latitude?: number;
  longitude?: number;
  filters: AdvancedFilterState;
}

type SavedSearchResponse = {
  success: boolean;
  message: string;
  savedSearches: SavedSearch[];
};

export const getSavedSearches = async (): Promise<SavedSearch[]> => {
  try {
    const response = await api.get('/saved-searches');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    throw error;
  }
};

export const saveSearch = async (search: SavedSearch): Promise<SavedSearchResponse> => {
  const response = await api.post('/saved-searches', search);
  return response.data;
};

export const deleteSavedSearch = async (id: number): Promise<void> => {
  await api.delete(`/saved-searches/${id}`);
};

export const getSavedSearch = async (id: number): Promise<SavedSearch> => {
  try {
    const response = await api.get(`/saved-searches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error loading saved search:', error);
    throw error;
  }
};
