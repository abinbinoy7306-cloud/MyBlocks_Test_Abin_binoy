import api from './axios';

export const getUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deactivateUser = (id) => api.put(`/users/${id}`, { is_active: false });
export const activateUser = (id) => api.put(`/users/${id}`, { is_active: true });
export const resetUserPassword = (id, data) => api.put(`/users/${id}/reset-password`, data);
export const updateProfile = (data) => api.put('/users/profile', data);
