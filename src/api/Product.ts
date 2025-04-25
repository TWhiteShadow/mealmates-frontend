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
