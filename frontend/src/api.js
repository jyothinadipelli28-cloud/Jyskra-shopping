import axios from 'axios';

const productionApiURL = 'https://jyskra-shopping-production.up.railway.app/api';
const defaultBaseURL = import.meta.env.DEV ? 'http://localhost:5000/api' : productionApiURL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      if (!url.includes('/auth/me')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
