import axios from 'axios';

// Create a pre-configured Axios client.
// In development, this uses mock handlers and fallbacks.
// When Spring Boot backend is running, set VITE_API_BASE_URL to e.g. http://localhost:8080/api
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tripwise_auth_token') || localStorage.getItem('traveldirect_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful fallback notes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.info('TripWise API (Backend disconnected, running in mock simulation mode):', error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
