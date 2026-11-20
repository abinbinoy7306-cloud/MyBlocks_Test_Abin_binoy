import api from './axios';

export const getTenants = (params) => api.get('/tenants', { params });
export const getTenant = (id) => api.get(`/tenants/${id}`);
export const createTenant = (data) => api.post('/tenants', data);
export const updateTenant = (id, data) => api.put(`/tenants/${id}`, data);
export const deleteTenant = (id) => api.delete(`/tenants/${id}`);
export const getTenantUsers = (id, params) => api.get(`/tenants/${id}/users`, { params });
export const getTenantStats = (id) => api.get(`/tenants/${id}/stats`);
export const getTenantSettings = (id) => api.get(`/tenants/${id}/settings`);
export const updateTenantSettings = (id, data) => api.put(`/tenants/${id}/settings`, data);
