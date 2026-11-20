import api from './axios';

export const getAllHelpTexts = () => api.get('/help-texts');
export const getHelpText = (sectionKey) => api.get(`/help-texts/${sectionKey}`);
export const updateHelpText = (sectionKey, data) => api.put(`/help-texts/${sectionKey}`, data);
