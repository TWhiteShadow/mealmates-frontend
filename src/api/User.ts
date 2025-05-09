import { Product } from './Product';
import axios from './Axios';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
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
  longitude: number;
  latitude: number;
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

export type UserDataResponse = {
  success: boolean;
  message: string;
  user: UserData;
};

export interface ApiErrorResponse {
  errors?: Record<string, string>;
}

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

export async function refreshToken(): Promise<RefreshTokenResponse> {
  try {
    const response = await axios.post(`/token/refresh`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Invalid credentials');
  }
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

// Delete address
export async function deleteUserAddress(addressId: number): Promise<UserData> {
  const response = await axios.delete(
    `${API_BASE_URL}/user/address/${addressId}`
  );
  return response.data.user;
}

// Hook for address deletion
export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => deleteUserAddress(addressId),
    mutationKey: ['userData'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export async function getUserData(): Promise<UserData> {
  const response = await axios.get(`${API_BASE_URL}/user`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
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
    minSellerRating?: number;
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
    if (filters.minSellerRating !== undefined && filters.minSellerRating > 0) {
      url += `&minSellerRating=${filters.minSellerRating}`;
    }
    if (filters.dietaryPreferences?.length) {
      url += `&dietaryPreferences=${filters.dietaryPreferences.join(',')}`;
    }
  }

  const response = await axios.get(url);
  return response.data;
}

// Hook for nearby products
export function useNearbyProducts(
  lat: number,
  lng: number,
  radius: number,
  filters?: {
    productTypes?: string[];
    expirationDate?: string;
    minPrice?: number;
    maxPrice?: number;
    minSellerRating?: number;
    dietaryPreferences?: string[];
  }
) {
  return useQuery({
    queryKey: ['nearbyProducts', lat, lng, radius, filters],
    queryFn: () => getNearbyProducts(lat, lng, radius, filters),
  });
}

// Update User Data with axios
export async function updateUserDataWithAxios(
  userData: UserData
): Promise<UserDataResponse> {
  const response = await axios.put(`${API_BASE_URL}/user/update`, userData);
  return response.data;
}

const queryKey: QueryKey = ['userData'];

// Tanstack Query Wrapper
export function useUpdateUserDataMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserData) => updateUserDataWithAxios(userData),
    mutationKey: ['userData'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });
}

// Get User Data
export function useUserData() {
  return useQuery({
    queryKey: ['userData'],
    queryFn: () => getUserData(),
  });
}
