import axios from 'axios';

const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL not set');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

api.interceptors.response.use(
  response => response,
  error => {
    // console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;