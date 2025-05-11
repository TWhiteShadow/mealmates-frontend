import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './Axios';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  position: number[];
  type: string;
  expiryDate: string;
  quantity: string;
  dietaryTags: string[];
  sellerRating: number;
  isSoldOut: boolean;
  pickupDetails: string;
  food_preferences?: Array<{ id: number; name: string }>;
  allergens?: Array<{ id: number; name: string }>;

  seller?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  };
  images?: { name: string }[];
  originalPrice?: number;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
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
}

export enum PriceRange {
  ALL = 'all',
  UNDER_5 = '0-5',
  BETWEEN_5_10 = '5-10',
  OVER_10 = '10-',
}

export async function getProduct(id: number): Promise<Product> {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });
}

export async function addProduct(productData: ProductFormData): Promise<any> {
  const response = await api.post('/products/add', productData);
  return response.data;
}

export function useAddProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductFormData) => addProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch relevant queries after successful product addition
      queryClient.invalidateQueries({ queryKey: ['nearbyProducts'] });
    },
  });
}
