import { AdvancedFilterState } from '@/components/Browse/filters/SearchFilter';
import api from './Axios';
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const queryKey: QueryKey = ['savedSearches'];

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

export const useSavedSearches = () => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getSavedSearches(),
  })
}

export const getSavedSearches = async (): Promise<SavedSearch[]> => {
  const response = await api.get('/saved-searches');
  return response.data;
};

export function useSaveSearchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedSearch: SavedSearch) => saveSearch(savedSearch),
    mutationKey: queryKey,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  })
}

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
