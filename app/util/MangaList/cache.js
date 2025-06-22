
// utils/cache.js
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      // console.log(`No data for ${key}`);
      return null;
    }

    const { data, timestamp } = JSON.parse(item);
    if (!data || !timestamp || isNaN(timestamp)) {
      console.warn(`Invalid data or timestamp for ${key}`);
      localStorage.removeItem(key);
      return null;
    }

    const age = Date.now() - timestamp;
    if (age > CACHE_DURATION) {
      // console.log(`Cache expired for ${key}, age: ${age}ms`);
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return null;
  }
};

export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    // console.log(`Saving to localStorage: key=${key}`, cacheEntry);
    localStorage.setItem(key, JSON.stringify(cacheEntry));
    // console.log(`Saved ${key}`);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};