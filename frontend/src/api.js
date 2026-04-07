import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jyskra-shopping-production.up.railway.app/api',
  withCredentials: true,
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