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

const whitelistURLs = ['/user/logged', '/login_check'];

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
      toastsOnErrors &&
      error.response?.status === 401 &&
      error.response?.data?.message
    ) {
      const message =
        error.response.data.message === 'Bad credentials.'
          ? 'Identifiants incorrects.'
          : error.response.data.message;
      toast.error(message);
    }

    if (toastsOnErrors && error.response?.data?.success === false) {
      const errors = error.response?.data?.errors;
      // eslint-disable-next-line
      Object.entries(errors).forEach(([_, value]) => {
        if (typeof value === 'string') {
          toast.error(value);
        } else if (Array.isArray(value)) {
          value.forEach((errorMessage: string) => {
            toast.error(errorMessage);
          });
        }
      });
    }

    // For whitelisted URLs, immediately reject without any redirects
    if (
      isWhitelisted &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      return;
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
        if (!isWhitelisted && navigationRef.navigate) {
          const redirectURI = locationRef.location;
          navigationRef.navigate(`/app/login?redirectURI=${redirectURI}`);
        }
        return Promise.reject(refreshError);
      }
    }

    // Only redirect for final auth failures on non-whitelisted URLs
    if (
      !isWhitelisted &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      if (navigationRef.navigate) {
        navigationRef.navigate('/app/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
