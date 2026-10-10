import axios from 'axios';

// Create a pre-configured Axios client.
// Connects to Spring Boot backend running at http://localhost:8080/api
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

// Response interceptor with error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('TripWise API Request error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service Functions matching Spring Boot Backend endpoints
export const DestinationApi = {
  getAll: () => apiClient.get('/destinations'),
  getById: (id) => apiClient.get(`/destinations/${id}`),
  searchByName: (name) => apiClient.get(`/destinations/search?name=${encodeURIComponent(name)}`),
  create: (data) => apiClient.post('/destinations', data),
  update: (id, data) => apiClient.put(`/destinations/${id}`, data),
  delete: (id) => apiClient.delete(`/destinations/${id}`),
};

export const TravelServiceApi = {
  getAll: () => apiClient.get('/services'),
  getById: (id) => apiClient.get(`/services/${id}`),
  getByDestination: (destId) => apiClient.get(`/services/destination/${destId}`),
  getByCategory: (category) => apiClient.get(`/services/category/${category}`),
  create: (data) => apiClient.post('/services', data),
  update: (id, data) => apiClient.put(`/services/${id}`, data),
  delete: (id) => apiClient.delete(`/services/${id}`),
};

export const TripApi = {
  create: (tripData) => apiClient.post('/trips', tripData),
  getAll: () => apiClient.get('/trips'),
  getById: (id) => apiClient.get(`/trips/${id}`),
  update: (id, tripData) => apiClient.put(`/trips/${id}`, tripData),
  delete: (id) => apiClient.delete(`/trips/${id}`),
  // Trip items
  addItem: (tripId, itemData) => apiClient.post(`/trips/${tripId}/items`, itemData),
  getItems: (tripId) => apiClient.get(`/trips/${tripId}/items`),
  removeItem: (tripId, itemId) => apiClient.delete(`/trips/${tripId}/items/${itemId}`),
  // Budget
  getBudget: (tripId) => apiClient.get(`/trips/${tripId}/budget`),
};

export const PackageCompareApi = {
  compare: (compareRequest) => apiClient.post('/packages/compare', compareRequest),
};

export default apiClient;
