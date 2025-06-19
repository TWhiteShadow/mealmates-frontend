import { atom } from 'jotai';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { AdvancedFilterState } from '@/components/Browse/filters/SearchFilter';
import api from '@/api/Axios';
import { userLogged } from '@/api/User';

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
export const savedSearchesQueryAtom = atomWithQuery(() => ({
  queryKey: ['savedSearches'],
  queryFn: async (): Promise<SavedSearch[]> => {
    try {
      const logged = await userLogged();
      if (!logged?.success) {
        return [];
      }

      const response = await api.get('/saved-searches');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      return [];
    }
  },
}));

// Atome pour la recherche active/courante
export const currentSearchAtom = atom<SavedSearch | null>(null);

// Atome pour la mutation de sauvegarde
export const saveSearchMutationAtom = atomWithMutation(() => ({
  mutationKey: ['saveSearch'],
  mutationFn: async (search: SavedSearch): Promise<SavedSearchResponse> => {
    try {
      const logged = await userLogged();
      if (!logged?.success) {
        throw new Error('User not logged in');
      }

      const response = await api.post('/saved-searches', search);
      return response.data;
    } catch (error) {
      console.error('Error saving search:', error);
      throw error;
    }
  },
}));

export const deleteSearchMutationAtom = atomWithMutation(() => ({
  mutationKey: ['deleteSearch'],
  mutationFn: async (id: number): Promise<void> => {
    try {
      const logged = await userLogged();
      if (!logged?.success) {
        throw new Error('User not logged in');
      }

      await api.delete(`/saved-searches/${id}`);
    } catch (error) {
      console.error('Error deleting saved search:', error);
      throw error;
    }
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
