// api.js
import axios from 'axios';
import { locationRef, navigationRef } from '../utils/navigateRef';
import { refreshToken } from './User';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const toastsOnErrors = true;

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});

const whitelistURLs = ['/user/logged'];

api.interceptors.response.use(
  (response) => {
    if (response.data?.success === true && response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    const requestURL = originalRequest.url.replace(originalRequest.baseURL, '');
    const isWhitelisted = whitelistURLs.some((url) =>
      requestURL.startsWith(url)
    );

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
        if (isWhitelisted) {
          return Promise.resolve(error.response);
        }

        if (navigationRef.navigate) {
          const redirectURI = locationRef.location;
          navigationRef.navigate(`/app/login?redirectURI=${redirectURI}`);
          toast.warning('Vous devez être connecté pour accéder à cette page.');
        }
        return Promise.reject(refreshError);
      }
    }

    // 2) only redirect for final auth failures
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (isWhitelisted) {
        return Promise.resolve(error.response);
      }
      if (navigationRef.navigate) {
        navigationRef.navigate('/app/login');
      }
    }

    if (toastsOnErrors && error.response?.data?.success === false) {
      const errors = error.response?.data?.errors;
      Object.entries(errors).forEach(([value]) => {
        toast.error(value as string);
      });
    }
    return Promise.reject(error);
  }
);

export default api;
