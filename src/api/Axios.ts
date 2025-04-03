// api.js
import axios from 'axios';
import { locationRef, navigationRef } from '../utils/navigateRef';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${baseURL}/api/v1/token/refresh`);
        return api(originalRequest);
      } catch (refreshError) {
        if (navigationRef.navigate) {
          const redirectURI = locationRef.location;
          navigationRef.navigate(`/app/login?redirectURI=${redirectURI}`);
        }
        return Promise.reject(refreshError);
      }
    }

    if (navigationRef.navigate) {
      navigationRef.navigate('/app/login');
    }

    return Promise.reject(error);
  }
);

export default api;
