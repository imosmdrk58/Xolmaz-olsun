// hooks/useMangaFetch.js
import { useQuery } from '@tanstack/react-query';
import { getFromStorage, saveToStorage } from '../util/MangaList/cache';

export const fetchMangaType = async (type, page) => {
  const cacheKey = `manga_${type}_${page}`;
  const cachedData = getFromStorage(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${type} page ${page}`);
    return cachedData;
  }

  console.log(`Fetching fresh data for ${type} page ${page}`);
  const response = await fetch(`/api/manga/${type}?page=${page}`);
  if (!response.ok) throw new Error(`Failed to fetch ${type} mangas`);

  const data = await response.json();
  saveToStorage(cacheKey, data);
  return data;
};

// hooks/useMangaFetch.js
export const useMangaFetch = (type, page) => {
  return useQuery({
    queryKey: ['manga', type, page],
    queryFn: () => fetchMangaType(type, page),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    suspense: false, // Disable Suspense
  });
};