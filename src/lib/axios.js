// lib/axios.js
import axios from 'axios';
import { getCachedData, setCachedData } from './cache';

const api = axios.create();

api.interceptors.request.use(async (config) => {
  const cachedResponse = getCachedData(config.url);
  if (cachedResponse) {
    return Promise.resolve({
      ...cachedResponse,
      config,
      request: {},
    });
  }
  return config;
});

api.interceptors.response.use((response) => {
  setCachedData(response.config.url, response);
  return response;
});

export default api;
