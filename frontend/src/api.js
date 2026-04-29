import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://expense-tracker-assignment-zl6h.onrender.com/api';;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseAPI = {
  getAll: (skip = 0, limit = 100) =>
    api.get('/expenses/', { params: { skip, limit } }),

  getById: (id) =>
    api.get(`/expenses/${id}`),

  create: (data) =>
    api.post('/expenses/', data),

  update: (id, data) =>
    api.put(`/expenses/${id}`, data),

  delete: (id) =>
    api.delete(`/expenses/${id}`),

  getByCategory: (category) =>
    api.get(`/expenses/category/${category}`),

  getCategorySummary: () =>
    api.get('/expenses/category/summary'),

  getMonthlySummary: (year, month) =>
    api.get(`/expenses/monthly/${year}/${month}`),
};

export default api;