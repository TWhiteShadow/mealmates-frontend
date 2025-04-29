import axios from 'axios';
import { AdvancedFilterState } from '@/components/Browse/filters/SearchFilter';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

export interface SavedSearch {
  id?: number;
  name: string;
  latitude?: number;
  longitude?: number;
  filters: AdvancedFilterState;
}

export const getSavedSearches = async (): Promise<SavedSearch[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/saved-searches`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    throw error;
  }
};

export const saveSearch = async (search: SavedSearch): Promise<SavedSearch> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/saved-searches`, search, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};

export const deleteSavedSearch = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/v1/saved-searches/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    throw error;
  }
};

export const getSavedSearch = async (id: number): Promise<SavedSearch> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/saved-searches/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error loading saved search:', error);
    throw error;
  }
};
