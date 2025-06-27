// api.js
import axios from 'axios';
import { locationRef, navigationRef } from '../utils/navigateRef';
import { refreshToken } from './User';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.success === true && response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.data) {
      if (error.response.status === 401) {
        const message =
          error.response.data.message === 'Bad credentials.'
            ? 'Identifiants incorrects.'
            : error.response.data.message;
        toast.error(message);
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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/token/refresh')
    ) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        if (navigationRef.navigate) {
          const redirectURI = locationRef.location;
          navigationRef.navigate(`/app/login?redirectURI=${redirectURI}`);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
