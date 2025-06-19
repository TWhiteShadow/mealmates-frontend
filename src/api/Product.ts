import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './Axios';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  dynamicPrice?: number | null;
  position: number[];
  type: string;
  expiryDate: string;
  quantity: number;
  dietaryTags: string[];
  sellerRating: number;
  soldAt: Date | null;
  isRecurring: boolean;
  pickupDetails: string;
  food_preferences?: Array<{ id: number; name: string }>;
  allergens?: Array<{ id: number; name: string }>;

  seller: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  };
  buyer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  } | null;
  images?: Array<{
    id: number;
    name: string;
  }>;
  distance?: number;
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
      queryClient.invalidateQueries({ queryKey: ['nearbyProducts'] });
    },
  });
}

export async function getNearbyProducts(
  lat: number,
  lng: number,
  radius: number,
  filters?: {
    productTypes?: string[];
    expirationDate?: string;
    minPrice?: number;
    maxPrice?: number;
    // minSellerRating?: number;
    dietaryPreferences?: string[];
  }
): Promise<Product[]> {
  let url = `/products/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;

  // Add optional filters
  if (filters) {
    if (filters.productTypes?.length) {
      url += `&types=${filters.productTypes.join(',')}`;
    }
    if (filters.expirationDate) {
      url += `&expirationDate=${filters.expirationDate}`;
    }
    if (filters.minPrice !== undefined) {
      url += `&minPrice=${filters.minPrice}`;
    }
    if (filters.maxPrice !== undefined) {
      url += `&maxPrice=${filters.maxPrice}`;
    }
    // if (filters.minSellerRating !== undefined && filters.minSellerRating > 0) {
    //   url += `&minSellerRating=${filters.minSellerRating}`;
    // }
    if (filters.dietaryPreferences?.length) {
      url += `&dietaryPreferences=${filters.dietaryPreferences.join(',')}`;
    }
  }

  const response = await api.get(url, {
    withCredentials: false,
  });
  return response.data;
}

export function useNearbyProducts(
  lat: number,
  lng: number,
  radius: number,
  filters?: {
    productTypes?: string[];
    expirationDate?: string;
    minPrice?: number;
    maxPrice?: number;
    // minSellerRating?: number;
    dietaryPreferences?: string[];
  }
) {
  return useQuery({
    queryKey: ['nearbyProducts', lat, lng, radius, filters],
    queryFn: () => getNearbyProducts(lat, lng, radius, filters),
  });
}

export async function donateProduct(productId: number): Promise<any> {
  const response = await api.patch(`/products/${productId}/donate`);
  return response.data;
}

export function useDonateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => donateProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nearbyProducts'] });
    },
  });
}

export async function getAllUserProducts(): Promise<Product[]> {
  const response = await api.get('/products/my-offers?status=all');
  return response.data;
}

export function useAllUserProducts() {
  return useQuery({
    queryKey: ['allUserProducts'],
    queryFn: () => getAllUserProducts(),
  });
}

export async function getUserBoughtProducts(): Promise<Product[]> {
  const response = await api.get('/products/bought-offers');
  return response.data;
}

export function useUserBoughtProducts() {
  return useQuery({
    queryKey: ['userBoughtProducts'],
    queryFn: () => getUserBoughtProducts(),
  });
}
