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

export interface AddressResponse {
  success: boolean;
  message: string;
  address: {
    id: number;
    city: string;
    zipCode: string;
    address: string;
    region: string;
  };
}

// Login
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login_check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
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
export async function getUserData(token: string) {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
}
