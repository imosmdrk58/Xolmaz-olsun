'use client';
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  Suspense,
  lazy,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useManga } from '../../providers/MangaContext';
import LoadingSpinner from '../../Components/LoadingSpinner';
import MangaCardPagination from "../../Components/MangaListComponents/MangaCardPagination";
import MangaReadHistory from '../../Components/MangaListComponents/MangaReadHistory';

// Lazy load components with React.lazy
const MangaCard = React.memo(
  lazy(() => import('../../Components/MangaListComponents/MangaCard'))
);
const AsideComponent = React.memo(
  lazy(() => import('../../Components/MangaListComponents/AsideComponent'))
);
const SliderComponent = React.memo(
  lazy(() => import('../../Components/MangaListComponents/SliderComponent'))
);

// Fixed: 1 hour = 60 * 60 * 1000 milliseconds
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);

    if (!item || !timestamp) return null;
    if (Date.now() - parseInt(timestamp) > CACHE_DURATION) {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_timestamp`);
      return null;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const fetchMangaType = async (type, page) => {
  const cacheKey = `manga_${type}_${page}`;
  
  // Check localStorage first
  const cachedData = getFromStorage(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${type} page ${page}`);
    return cachedData;
  }

  console.log(`Fetching fresh data for ${type} page ${page}`);
  const response = await fetch(`/api/manga/${type}?page=${page}`);
  if (!response.ok) throw new Error(`Failed to fetch ${type} mangas`);

  const data = await response.json();
  
  // Save to localStorage after successful fetch
  saveToStorage(cacheKey, data);
  return data;
};

const fetchAllMangaTypes = async ({ queryKey }) => {
  const [_, page] = queryKey;

  try {
    // Check if we have all data in localStorage first
    const cacheKeys = {
      rating: `manga_rating_${page}`,
      favourite: `manga_favourite_${page}`,
      latest: `manga_latest_${page}`,
      random: `manga_random_${page}`,
    };

    const cachedRating = getFromStorage(cacheKeys.rating);
    const cachedFavourite = getFromStorage(cacheKeys.favourite);
    const cachedLatest = getFromStorage(cacheKeys.latest);
    const cachedRandom = getFromStorage(cacheKeys.random);

    // If all data is cached, return it
    if (cachedRating && cachedFavourite && cachedLatest && cachedRandom) {
      console.log(`All data found in cache for page ${page}`);
      return {
        mangas: cachedRating,
        favouriteMangas: cachedFavourite,
        latestMangas: cachedLatest,
        randomMangas: cachedRandom,
      };
    }

    // Otherwise, fetch only the missing data
    const [rating, favourite, latest, random] = await Promise.all([
      cachedRating || fetchMangaType('rating', page),
      cachedFavourite || fetchMangaType('favourite', page),
      cachedLatest || fetchMangaType('latest', page),
      cachedRandom || fetchMangaType('random', page),
    ]);

    const result = {
      mangas: rating,
      favouriteMangas: favourite,
      latestMangas: latest,
      randomMangas: random,
    };

    return result;
  } catch (error) {
    console.error('Error fetching manga data:', error);
    throw error;
  }
};

const MangaList=()=> {
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const showcaseRef = useRef(null);
  const { setSelectedManga } = useManga();

  // Check if screen width is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['mangas', page],
    queryFn: fetchAllMangaTypes,
    staleTime: CACHE_DURATION, // Data is fresh for 1 hour
    gcTime: CACHE_DURATION * 2, // Keep in cache for 2 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    enabled: true, // Always enabled, but localStorage check prevents unnecessary fetches
  });

  const handleMangaClicked = useCallback((manga) => {
    setSelectedManga(manga);
    router.push(`/manga/${manga.id}/chapters`);
  }, [router, setSelectedManga]);

  const loadMoreMangas = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
    setCurrentPage(1); // Reset to first page when loading more data
  }, []);

  // Extract processed data directly from the query result
  const processedData = useMemo(() => {
    if (!data) return {
      processedMangas: [],
      processedFavouriteMangas: [],
      processedLatestMangas: [],
      processedRandomMangas: []
    };

    return {
      processedMangas: data.mangas?.data || [],
      processedFavouriteMangas: data.favouriteMangas?.data || [],
      processedLatestMangas: data.latestMangas?.data || [],
      processedRandomMangas: data.randomMangas?.data || []
    };
  }, [data]);

  const { processedMangas, processedFavouriteMangas, processedLatestMangas, processedRandomMangas } = processedData;

  // Pagination logic
  const ITEMS_PER_PAGE = isMobile ? 8 : 12;
  const totalPages = Math.ceil(processedLatestMangas.length / ITEMS_PER_PAGE);

  const currentMangas = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedLatestMangas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedLatestMangas, currentPage, ITEMS_PER_PAGE]);

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, [totalPages]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (isLoading || processedLatestMangas.length === 0) {
    return <LoadingSpinner text="Loading Mangas..." />;
  }

  return (
    <div ref={showcaseRef} className="min-h-screen w-full text-white">
      <Suspense fallback={<LoadingSpinner text="Loading Mangas..." />}>
        <div className="w-full shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black h-fit">
          <SliderComponent 
            handleMangaClicked={handleMangaClicked} 
            processedRandomMangas={processedRandomMangas} 
          />
        </div>

        <div className="flex flex-col-reverse md:flex-row mt-6 md:mt-10 bg-gradient-to-t from-transparent via-black/30 to-black/10">
          <div className="md:w-[70%]">
            <MangaCard
              handleMangaClicked={handleMangaClicked}
              processedLatestMangas={currentMangas}
              loadMoreMangas={loadMoreMangas}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>

          <div className="md:w-[30%]">
            <MangaReadHistory/>
            <AsideComponent
              handleMangaClicked={handleMangaClicked}
              processedMangas={processedMangas}
              processedLatestMangas={processedLatestMangas}
              processedFavouriteMangas={processedFavouriteMangas}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="w-full flex justify-center mb-8">
          <MangaCardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            loadMoreMangas={loadMoreMangas}
            onLoadMore={loadMoreMangas}
            isMobile={isMobile}
          />
        </div>
      </Suspense>
    </div>
  );
}
export default MangaList