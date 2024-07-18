import axios from 'axios';
import { apiLimiter } from '@/utils/rateLimiter';
import { getCachedData, setCachedData } from './cache';

const API_KEY = 'CG-YAT6Xo52tQ3uFMoytsczBi1u';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  params: { x_cg_demo_api_key: API_KEY }
});

export const fetchWithCache = async (endpoint, params = {}, ttl = 60000) => {
  const cacheKey = `${endpoint}${JSON.stringify(params)}`;
  const cachedData = getCachedData(cacheKey);

  if (cachedData) return cachedData;

  await apiLimiter.getToken();

  const response = await api.get(endpoint, { params });
  setCachedData(cacheKey, response.data, ttl);

  return response.data;
};