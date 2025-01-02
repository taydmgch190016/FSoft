import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '',
});

httpClient.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${sessionStorage.getItem('accessToken')}`;
  return config;
});

httpClient.interceptors.response.use(
  (data) => {
    return data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
