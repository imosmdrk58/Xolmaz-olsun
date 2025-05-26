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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useManga } from '../../../components/providers/MangaContext'; // NEW: Import useManga
import LoadingSpinner from '../../Components/LoadingSpinner';
import MangaCardPagination from "../../Components/MangaListComponents/MangaCardPagination";
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

const CACHE_DURATION = 120 * 60 * 60  // 1 hour

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
  const cachedData = getFromStorage(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`/api/manga/${type}?page=${page}`);
  if (!response.ok) throw new Error(`Failed to fetch ${type} mangas`);

  const data = await response.json();
  saveToStorage(cacheKey, data);
  return data;
};

const fetchAllMangaTypes = async ({ queryKey }) => {
  const [_, page] = queryKey;

  try {
    const [rating, favourite, latest, random] = await Promise.all([
      fetchMangaType('rating', page),
      fetchMangaType('favourite', page),
      fetchMangaType('latest', page),
      fetchMangaType('random', page),
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

export default function MangaList() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDataProcessed, setIsDataProcessed] = useState(false);
  const showcaseRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const { setSelectedManga } = useManga(); // NEW: Destructure setSelectedManga

  // Check if screen width is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['mangas', page],
    queryFn: fetchAllMangaTypes,
    staleTime: CACHE_DURATION,
    cacheTime: CACHE_DURATION * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    onError: (error) => {
      console.error('Error in manga query:', error);
    },
  });

  const processMutation = useMutation({
    mutationFn: async (data) => {
      const { mangas, favouriteMangas, latestMangas, randomMangas } = data || {};
      if (!mangas || !favouriteMangas || !latestMangas || !randomMangas) return {};

      const cacheKeys = {
        mangas: `processedmanga_rating_${page}`,
        favourite: `processedmanga_favourite_${page}`,
        latest: `processedmanga_latest_${page}`,
        random: `processedmanga_random_${page}`,
      };

      const [processedMangas, processedFavouriteMangas, processedLatestMangas, processedRandomMangas] =
        await Promise.all([
          getFromStorage(cacheKeys.mangas) || mangas.data || [],
          getFromStorage(cacheKeys.favourite) || favouriteMangas.data || [],
          getFromStorage(cacheKeys.latest) || latestMangas.data || [],
          getFromStorage(cacheKeys.random) || randomMangas.data || [],
        ]);

      return { processedMangas, processedFavouriteMangas, processedLatestMangas, processedRandomMangas };
    },
    onSuccess: ({
      processedMangas,
      processedFavouriteMangas,
      processedLatestMangas,
      processedRandomMangas,
    }) => {
      if (processedMangas) queryClient.setQueryData(['processedMangas'], processedMangas);
      if (processedFavouriteMangas)
        queryClient.setQueryData(['processedFavouriteMangas'], processedFavouriteMangas);
      if (processedLatestMangas)
        queryClient.setQueryData(['processedLatestMangas'], processedLatestMangas);
      if (processedRandomMangas)
        queryClient.setQueryData(['processedRandomMangas'], processedRandomMangas);

      // Cache each type separately with page number
      saveToStorage(`processedmanga_rating_${page}`, processedMangas);
      saveToStorage(`processedmanga_favourite_${page}`, processedFavouriteMangas);
      saveToStorage(`processedmanga_latest_${page}`, processedLatestMangas);
      saveToStorage(`processedmanga_random_${page}`, processedRandomMangas);

      setIsDataProcessed(true);
    },
    onError: (error) => {
      console.error('Error processing manga data:', error);
    },
  });

  useEffect(() => {
    if (data && !isDataProcessed) {
      processMutation.mutate(data);
    }
  }, [data, isDataProcessed]);

  const handleMangaClicked = useCallback((manga) => {
    setSelectedManga(manga); // NEW: Set the clicked manga in context
    router.push(`/manga/${manga.id}/chapters`);
  }, [router, setSelectedManga]);

  const loadMoreMangas = useCallback(() => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      setIsDataProcessed(false); // Reset processing state for new fetch
      return newPage;
    });
  }, [page]);

  const processedMangas = useMemo(() => queryClient.getQueryData(['processedMangas']) || []);
  const processedFavouriteMangas = useMemo(
    () => queryClient.getQueryData(['processedFavouriteMangas']) || []
  );
  const processedLatestMangas = useMemo(
    () => queryClient.getQueryData(['processedLatestMangas']) || []
  );
  const processedRandomMangas = useMemo(
    () => queryClient.getQueryData(['processedRandomMangas']) || []
  );

  const isLoadingState = isLoading || !isDataProcessed || processedLatestMangas.length === 0;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
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

  console.log(processedLatestMangas)
  return (
    <div ref={showcaseRef} className="min-h-screen w-full text-white">
      {isLoadingState ? (
        <LoadingSpinner text="Loading Mangas..." />
      ) : (
        <>
          <Suspense fallback={<LoadingSpinner text="Loading Mangas..." />}>
            <div className="w-full shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black h-fit">
              <SliderComponent handleMangaClicked={handleMangaClicked} processedRandomMangas={processedRandomMangas} />
            </div>

            <div className="flex flex-col-reverse md:flex-row mt-6 md:mt-10 bg-gradient-to-t from-transparent via-black/30 to-black/10">
              <div className={`md:w-[70%] `}>
                <MangaCard
                  handleMangaClicked={handleMangaClicked}
                  processedLatestMangas={currentMangas}
                  loadMoreMangas={loadMoreMangas}
                  totalPages={totalPages}
                  currentPage={currentPage}
                />
              </div>

              <div className={`md:w-[30%] `}>
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
        </>
      )}
    </div>
  );
}