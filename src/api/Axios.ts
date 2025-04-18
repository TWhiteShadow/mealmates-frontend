// api.js
import axios from 'axios';
import { locationRef, navigationRef } from '../utils/navigateRef';
import { refreshToken } from './User';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  async (error: any) => {
    const originalRequest = error.config;

    // 1) if 401, try refresh & retry once
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

    // 2) only redirect for final auth failures
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      if (navigationRef.navigate) {
        navigationRef.navigate('/app/login');
      }
    }

    // 3) for all other statuses (400, 404, etc), just pass the error along
    return Promise.reject(error);
  }
);


export default api;
