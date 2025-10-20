import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from '../utils/networkTest';

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await SecureStore.deleteItemAsync('authToken');
        
      } catch (storageError) {
        console.error('Error removing auth token:', storageError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;