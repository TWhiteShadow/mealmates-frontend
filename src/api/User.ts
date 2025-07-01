import api from './Axios';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  fullname?: string;
}

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
  id?: number | null;
  city: string;
  zipCode: string;
  address: string;
  region: string;
  longitude: number | null;
  latitude: number | null;
};

export type Allergen = {
  id: number;
  name: string;
};

export interface AddressResponse {
  success: boolean;
  message: string;
  address: Address[];
  averageRating: number | null;
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
  averageRating: number | null;
};

export type UserDataResponse = {
  success: boolean;
  message: string;
  user: UserData;
};

export type UserStatsResponse = {
  totalEarnings: number;
  completedTransactions: number;
  boughtTransactions: number;
  averageRating: number | null;
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
  const response = await api.post(`/login_check`, { email, password });
  return response.data;
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const response = await api.post(`/token/refresh`);
  return response.data;
}

// Register User
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<RegisterResponse> {
  const response = await api.post(
    `/register`,
    { email, password, firstName, lastName },
    {
      withCredentials: false,
    }
  );
  return response.data;
}

// Verify Email
export async function verifyEmail(
  id: string,
  token: string,
  expires: string,
  signature: string
) {
  const response = await api.get(
    `/verify-email?id=${id}&token=${token}&expires=${expires}&signature=${signature}`,
    {
      withCredentials: false,
    }
  );

  return response.data;
}

// Resend Verification Email
export async function resendVerificationEmail(email: string) {
  const response = await api.post(`/resend-verification-email`, { email });
  return response.data;
}

// Add User Address
export async function addUserAddress(
  address: string,
  zipCode: string,
  city: string,
  region: string
): Promise<AddressResponse> {
  const response = await api.post(`/user/address`, {
    address,
    zipCode,
    city,
    region,
  });
  return response.data;
}

// Delete address
export async function deleteUserAddress(addressId: number): Promise<UserData> {
  const response = await api.delete(`/user/address/${addressId}`);
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
  const response = await api.get(`/user`);
  return response.data;
}

// Update User Data with axios
export async function updateUserDataWithAxios(
  userData: UserData
): Promise<UserDataResponse> {
  const response = await api.put(`/user/update`, userData);
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

export interface LoggedResponse {
  success: boolean;
}

// check if user is logged
export async function userLogged(): Promise<LoggedResponse> {
  const response = await api.get(`/user/logged`);
  return response.data;
}

export const getUserStats = async (): Promise<UserStatsResponse> => {
  const response = await api.get('/user/stats');
  return response.data;
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: getUserStats,
  });
};
