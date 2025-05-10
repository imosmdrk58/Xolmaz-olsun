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
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../Components/LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MangaCardPagination from "../Components/MangaListComponents/MangaCardPagination";
// Lazy load components with React.lazy
import MangaCard from '../Components/MangaListComponents/MangaCard';
// const MangaCard = React.memo(
//   lazy(() => import('../Components/MangaListComponents/MangaCard'))
// );
const AsideComponent = React.memo(
  lazy(() => import('../Components/MangaListComponents/AsideComponent'))
);
const SliderComponent = React.memo(
  lazy(() => import('../Components/MangaListComponents/SliderComponent'))
);

const CACHE_DURATION = 120 * 60 * 1000; // 1 hour

// Helper functions outside component
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDataProcessed, setIsDataProcessed] = useState(false);
  const showcaseRef = useRef(null);

  const processMangaData = async (mangaList, type) => {
    if (!mangaList || mangaList.length === 0) return [];

    const cacheKey = `processed_${type}_${page}`;
    const cachedData = getFromStorage(cacheKey);
    if (cachedData?.data) return cachedData.data;

    // Batch fetch ratings
    const mangaIds = mangaList.map((manga) => manga.id);
    let ratings = {};
    const ratingsCacheKey = `manga_ratings_batch_${mangaIds.join('_')}`;
    const cachedRatings = getFromStorage(ratingsCacheKey);

    if (cachedRatings?.data) {
      ratings = cachedRatings.data;
    } else {
      try {
        const response = await fetch(
          'https://api.mangadex.org/statistics/manga?' +
          mangaIds.map((id) => `manga[]=${id}`).join('&')
        );
        if (response.ok) {
          const ratingData = await response.json();
          ratings = ratingData.statistics || {};
          saveToStorage(ratingsCacheKey, ratings);
        }
      } catch (err) {
        console.error('Error fetching batch ratings:', err);
      }
    }

    const result = await Promise.all(
      mangaList.map(async (manga) => {
        const { id, attributes, relationships, type } = manga;

        const {
          title,
          links,
          availableTranslatedLanguages,
          latestUploadedChapter,
          originalLanguage,
          description,
          altTitles,
          contentRating,
          publicationDemographic,
          status,
          year,
          updatedAt,
          tags,
        } = attributes;

        const grouped = relationships.reduce((acc, rel) => {
          if (!acc[rel.type]) acc[rel.type] = [];
          acc[rel.type].push(rel);
          return acc;
        }, {});

        const coverArt = grouped.cover_art?.[0]?.attributes?.fileName;
        const coverImageUrl = `https://mangadex.org/covers/${id}/${coverArt}.256.jpg`;
        const authorName = grouped.author;
        const artistName = grouped.artist;
        const creatorName = grouped.creator ?? 'N/A';
        const rating = ratings[id] || {};

        const groupedTags = tags?.reduce((acc, tag) => {
          const group = tag.attributes?.group || 'Unknown Group';
          const tagName = tag.attributes?.name?.en || 'Unknown Tag';
          if (!acc[group]) acc[group] = [];
          acc[group].push(tagName);
          return acc;
        }, {});

        const groupedTagsArray = Object.keys(groupedTags || {}).map((group) => ({
          group,
          tags: groupedTags[group],
        }));

        return {
          id,
          title: title?.en || Object?.values(altTitles?.[0] || {})[0] || 'Untitled',
          description: description?.en || 'No description available.',
          altTitle: Object.values(altTitles?.[0] || { none: 'N/A' })[0] || 'N/A',
          contentRating: contentRating || 'N/A',
          status: status || 'Unknown',
          altTitles: altTitles || [],
          year: year || 'N/A',
          updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
          tags: groupedTagsArray,
          flatTags: tags?.map((tag) => tag.attributes?.name?.en || 'Unknown Tag') || [],
          coverImageUrl,
          authorName,
          artistName,
          rating,
          links,
          creatorName,
          MangaStoryType: publicationDemographic,
          availableTranslatedLanguages: availableTranslatedLanguages || [],
          latestUploadedChapter,
          originalLanguage,
          type,
        };
      })
    );
    saveToStorage(cacheKey, result);
    return result;
  };

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
          getFromStorage(cacheKeys.mangas) || processMangaData(mangas.data || [], 'rating'),
          getFromStorage(cacheKeys.favourite) || processMangaData(favouriteMangas.data || [], 'favourite'),
          getFromStorage(cacheKeys.latest) || processMangaData(latestMangas.data || [], 'latest'),
          getFromStorage(cacheKeys.random) || processMangaData(randomMangas.data || [], 'random'),
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
    navigate(`/manga/${manga.id}/chapters`, { state: { manga } });
  }, []);

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
  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(processedLatestMangas.length / ITEMS_PER_PAGE);

  const currentMangas = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedLatestMangas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedLatestMangas, currentPage]);

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, [totalPages]);

  console.log(processedFavouriteMangas)
  return (
    <div ref={showcaseRef} className="min-h-screen w-full text-white">
      {isLoadingState ? (
        <LoadingSpinner text="Loading Mangas..." />
      ) : (
        <>
          <Suspense fallback={<LoadingSpinner text="Loading Mangas..." />}>
            <div className="w-full shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black  h-fit">
              <SliderComponent handleMangaClicked={handleMangaClicked} processedRandomMangas={processedRandomMangas} />
            </div>

            <div className="flex mt-10 bg-gradient-to-t from-transparent via-black/30 to-black/10 flex-row justify-between items-start">
              <MangaCard
                handleMangaClicked={handleMangaClicked}
                processedLatestMangas={currentMangas}
                loadMoreMangas={loadMoreMangas}
                totalPages={totalPages}
                currentPage={currentPage}
              />

              <AsideComponent
                handleMangaClicked={handleMangaClicked}
                processedMangas={processedMangas}
                processedLatestMangas={processedLatestMangas}
                processedFavouriteMangas={processedFavouriteMangas}
              />
            </div>
            {/* Pagination Controls */}
            <MangaCardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              loadMoreMangas={loadMoreMangas}
              onLoadMore={loadMoreMangas}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
