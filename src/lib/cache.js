const cache = {};
const DEFAULT_EXPIRATION = 15 * 60 * 1000;

export const getCachedData = (key) => {
  const cached = cache[key];
  if (!cached) {
    return null;
  }
  if (Date.now() > cached.expiry) {
    delete cache[key];
    return null;
  }
  return cached.data;
};

export const setCachedData = (key, data, maxAge = DEFAULT_EXPIRATION) => {
  cache[key] = {
    data,
    expiry: Date.now() + maxAge,
  };
};
