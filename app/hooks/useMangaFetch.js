// hooks/useMangaFetch.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../util/MangaList/cache';

export const fetchMangaType = async (type, page) => {
  const cacheKey = `manga_${type}_${page}`;
  const cachedData = getFromStorage(cacheKey);
  if (cachedData) {
    // console.log(`Cache hit for ${type} page ${page}`);
    return cachedData;
  }

  // console.log(`Fetching fresh data for ${type} page ${page}`);
  const response = await fetch(`/api/manga/${type}?page=${page}`);
  if (!response.ok) {
    console.error(`Fetch failed for ${type} page ${page}: ${response.status}`);
    throw new Error(`Failed to fetch ${type} mangas`);
  }

  const data = await response.json();
  saveToStorage(cacheKey, data);
  return data;
};

export const useMangaFetch = (type, page) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['manga', type, page],
    queryFn: () => fetchMangaType(type, page),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    suspense: false,
  });

  useEffect(() => {
    const cachedData = getFromStorage(`manga_${type}_${page}`);
    if (!cachedData) {
      queryClient.invalidateQueries(['manga', type, page]);
    }
  }, [type, page, queryClient]);

  return query;
};
