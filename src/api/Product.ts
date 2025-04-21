const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1';

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
  pickupOptions: string[];
  pickupDetails: string;

  seller?: {
    id: number;
    first_name: string|null;
    last_name: string|null;
  };
  images?: string[];
  originalPrice?: number;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getProductsUndetailed(): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/undetailed`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}