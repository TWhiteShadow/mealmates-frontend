import { atom } from 'jotai';

export const sellFormDataAtom = atom<{
  name: string;
  description: string;
  quantity: number;
  price: number;
  expiryDate: string;
  isRecurring: boolean;
  allergens: number[];
  food_preferences: number[];
  images: {
    name: string;
    mimeType: string;
    data: string;
  }[];
  address?: number;
}>({
  name: '',
  description: '',
  quantity: 1,
  price: 0,
  expiryDate: '',
  isRecurring: false,
  allergens: [],
  food_preferences: [],
  images: [],
  address: undefined,
});
