// api.js
import axios, { AxiosRequestConfig } from 'axios';
import { locationRef, navigationRef } from '../utils/navigateRef';
import { refreshToken } from './User';
import { toast } from 'sonner';

// Extend AxiosRequestConfig to include our custom _retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  async (response) => {
    if (response.data?.success === true && response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    // Check if this is not a token refresh request and if we got a 401 or 403
    if (
      !error.config.url?.includes('/token/refresh') &&
      (status === 401 || status === 403)
    ) {
      const config = error.config as CustomAxiosRequestConfig;
      if (!config._retry) {
        config._retry = true;
        try {
          await refreshToken();
          // Retry the original request with the new token
          return await api(config);
        } catch (refreshError) {
          if (navigationRef.navigate) {
            const redirectURI = locationRef.location;
            navigationRef.navigate(`/app/login?redirectURI=${redirectURI}`);
          }
          return Promise.reject(refreshError);
        }
      }
    }

    if (error.response?.data) {
      if (error.response.status === 401) {
        const message =
          error.response.data.message === 'Bad credentials.'
            ? 'Identifiants incorrects.'
            : error.response.data.message;
        if (
          message != 'Missing JWT Refresh Token' &&
          message != 'Missing JWT Access Token' &&
          message != 'JWT Token not found'
        ) {
          toast.error(message);
        }
      }

      if (error.response.data.success === false) {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        }

        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((value) => {
            if (typeof value === 'string') {
              toast.error(value);
            } else if (Array.isArray(value)) {
              value.forEach((errorMessage: string) => {
                toast.error(errorMessage);
              });
            }
          });
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
