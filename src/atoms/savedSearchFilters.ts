import { atom } from 'jotai';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { AdvancedFilterState } from '@/components/Browse/filters/SearchFilter';
import api from '@/api/Axios';

// Types
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

// Atome pour stocker la liste des recherches sauvegardées
export const savedSearchesQueryAtom = atomWithQuery((_) => ({
  queryKey: ['savedSearches'],
  queryFn: async (): Promise<SavedSearch[]> => {
    const response = await api.get('/saved-searches');
    return response.data;
  },
}));

// Atome pour la recherche active/courante
export const currentSearchAtom = atom<SavedSearch | null>(null);

// Atome pour la mutation de sauvegarde
export const saveSearchMutationAtom = atomWithMutation((_) => ({
  mutationKey: ['saveSearch'],
  mutationFn: async (search: SavedSearch): Promise<SavedSearchResponse> => {
    const response = await api.post('/saved-searches', search);
    return response.data;
  },
}));

export const deleteSearchMutationAtom = atomWithMutation((_) => ({
  mutationKey: ['deleteSearch'],
  mutationFn: async (id: number): Promise<void> => {
    await api.delete(`/saved-searches/${id}`);
  },
}));

// Fonctions utilitaires
export const getSavedSearch = async (id: number): Promise<SavedSearch> => {
  try {
    const response = await api.get(`/saved-searches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error loading saved search:', error);
    throw error;
  }
};
