import api from './axios';

export const getCountries = () => api.get('/countries');
export const getCurrencies = () => api.get('/currencies');
