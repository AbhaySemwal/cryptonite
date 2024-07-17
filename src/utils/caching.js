const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cache = new Map();

export const getCachedData = (key) => {
  const cachedItem = cache.get(key);
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
    return cachedItem.data;
  }
  return null;
};

export const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};