import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  getAuthUrl: () => api.get('/auth/auth-url'),
  getCurrentUser: () => api.get('/auth/me')
};

export const forms = {
  getBases: () => api.get('/forms/bases'),
  getTables: (baseId) => api.get(`/forms/bases/${baseId}/tables`),
  getFields: (baseId, tableId) => api.get(`/forms/bases/${baseId}/tables/${tableId}/fields`),
  create: (data) => api.post('/forms', data),
  getAll: () => api.get('/forms'),
  getById: (formId) => api.get(`/forms/${formId}`),
  delete: (formId) => api.delete(`/forms/${formId}`)
};

export const responses = {
  submit: (formId, data) => api.post(`/responses/${formId}`, data),
  getByForm: (formId) => api.get(`/responses/${formId}`),
  getById: (responseId) => api.get(`/responses/detail/${responseId}`)
};

export default api;