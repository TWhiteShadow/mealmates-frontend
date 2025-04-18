import { Product } from './Product';
// @ts-expect-error (TS 7016) - Cannot find module '@/assets/fakeProducts'
import { products as fakeProducts } from '@/assets/fakeProducts.js';
import axios from './Axios';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1';

export interface AuthResponse {
  token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: string;
  provider: string;
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

export type Address = {
  id: number;
  city: string;
  zipCode: string;
  address: string;
  region: string;
};

export type Allergen = {
  id: number;
  name: string;
};

export interface AddressResponse {
  success: boolean;
  message: string;
  address: Address[];
}

export type UserData = {
  id: number;
  email: string;
  roles: string[];
  last_name: string;
  first_name: string;
  address: Address[];
  allergen: Allergen[];
  isVerified: boolean;
};

// export function getLocalToken(): string | null {
//   return sessionStorage.getItem('oAuth_access_token') ||
// }

// Login
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await axios.post(`/login_check`, { email, password });

    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Invalid credentials');
  }
}

// Refresh Token
export async function refreshToken(
  refresh_token: string,
  provider: string
): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token, provider }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

// Register User
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

// Verify Email
export async function verifyEmail(
  id: string,
  token: string,
  expires: string,
  signature: string
) {
  const response = await fetch(
    `${API_BASE_URL}/verify-email?id=${id}&token=${token}&expires=${expires}&signature=${signature}`
  );

  if (!response.ok) {
    throw new Error('Invalid or expired token');
  }

  return response.json();
}

// Resend Verification Email
export async function resendVerificationEmail(email: string) {
  const response = await fetch(`${API_BASE_URL}/resend-verification-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('User not found');
  }

  return response.json();
}

// Add User Address
export async function addUserAddress(
  token: string,
  address: string,
  zipCode: string,
  city: string,
  region: string
): Promise<AddressResponse> {
  const response = await fetch(`${API_BASE_URL}/user/address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ address, zipCode, city, region }),
  });

  if (!response.ok) {
    throw new Error('Invalid address data');
  }

  return response.json();
}

// Get User Data (Assuming there's an endpoint like /api/v1/user)

export async function getUserData() {
  const response = await axios.get(`${API_BASE_URL}/user`, {
    withCredentials: true, // Ensures cookies (including httpOnly JWT tokens) are sent with the request
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

// _ veux dire que c'est une variable qu'on va utiliser plus tard (pour TypeScript)
export async function getProductsArroundMe(
  _lat: number,
  _lng: number,
  _radius: number,
  _filters?: {
    productTypes?: string[];
    expirationDate?: string;
    minPrice?: number;
    maxPrice?: number;
    minSellerRating?: number;
    dietaryPreferences?: string[];
  }
): Promise<Product[]> {
  // let url = `${API_BASE_URL}/products/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;

  // // Ajout des filtres optionnels
  // if (filters) {
  //   if (filters.productTypes && filters.productTypes.length > 0) {
  //     url += `&types=${filters.productTypes.join(',')}`;
  //   }

  //   if (filters.expirationDate) {
  //     url += `&expirationDate=${filters.expirationDate}`;
  //   }

  //   if (filters.minPrice !== undefined) {
  //     url += `&minPrice=${filters.minPrice}`;
  //   }

  //   if (filters.maxPrice !== undefined) {
  //     url += `&maxPrice=${filters.maxPrice}`;
  //   }

  //   if (filters.minSellerRating !== undefined && filters.minSellerRating > 0) {
  //     url += `&minSellerRating=${filters.minSellerRating}`;
  //   }

  //   if (filters.dietaryPreferences && filters.dietaryPreferences.length > 0) {
  //     url += `&dietaryPreferences=${filters.dietaryPreferences.join(',')}`;
  //   }
  // }

  // const response = await fetch(url);

  // if (!response.ok) {
  //   throw new Error('Failed to fetch nearby products');
  // }

  // return response.json();

  return fakeProducts;
}
