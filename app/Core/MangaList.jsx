"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MangaCard from "../Components/MangaListComponents/MangaCard";
import AsideComponent from "../Components/MangaListComponents/AsideComponent";
import SliderComponent from "../Components/MangaListComponents/SliderComponent";
const MemoizedMangaCard = React.memo(MangaCard);
const MemoizedAsideComponent = React.memo(AsideComponent);
const MemoizedSliderComponent = React.memo(SliderComponent);

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper functions for localStorage
const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);

    if (!item || !timestamp) return null;
    // Check if data is stale
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

// Fetch functions for each manga type
const fetchMangaType = async (type, page) => {
  const cachedData = getFromStorage(`manga_${type}_${page}`);
  if (cachedData) return cachedData;

  const response = await fetch(`/api/manga/${type}?page=${page}`);
  if (!response.ok) throw new Error(`Failed to fetch ${type} mangas`);

  const data = await response.json();
  saveToStorage(`manga_${type}_${page}`, data);
  return data;
};

const fetchAllMangaTypes = async ({ queryKey }) => {
  const [_, page] = queryKey;

  try {
    const [rating, favourite, latest, random] = await Promise.all([
      fetchMangaType('rating', page),
      fetchMangaType('favourite', page),
      fetchMangaType('latest', page),
      fetchMangaType('random', page)
    ]);
    console.log(latest)
    return {
      mangas: rating,
      favouriteMangas: favourite,
      latestMangas: latest,
      randomMangas: random
    };
  } catch (error) {
    console.error('Error fetching manga data:', error);
    throw error;
  }
};

const processMangaData = async (mangaList) => {
  return await Promise.all(
    mangaList.map(async (manga) => {
      const {
        id,
        attributes: {
          title,
          links,
          availableTranslatedLanguages,
          latestUploadedChapter,
          originalLanguage,
          description,
          altTitles,
          contentRating,
          status,
          year,
          updatedAt,
          tags,
        },
        relationships,
      } = manga;

      const grouped = relationships.reduce((acc, rel) => {
        if (!acc[rel.type]) acc[rel.type] = [];
        acc[rel.type].push(rel);
        return acc;
      }, {});

      const coverArt = grouped.cover_art?.[0]?.attributes?.fileName;
      const coverImageUrl = `https://mangadex.org/covers/${id}/${coverArt}.256.jpg`;
      const authorName = grouped.author;
      const artistName = grouped.artist;
      const creatorName = grouped.creator ?? "N/A";
      const MangaStoryType = grouped.manga ?? "N/A";
      let rating = 0;
      try {
        const ratingResponse = await fetch(`https://api.mangadex.org/statistics/manga/${id}`);
        if (ratingResponse.ok) {
          const ratingData = await ratingResponse.json();
          rating = ratingData.statistics[id] || 0;
        }
      } catch (err) {
        console.error(`Error fetching rating for manga ID ${id}:`, err);
      }

      const groupedTags = tags?.reduce((acc, tag) => {
        const group = tag.attributes?.group || 'Unknown Group';
        const tagName = tag.attributes?.name?.en || 'Unknown Tag';
        if (!acc[group]) acc[group] = [];
        acc[group].push(tagName);
        return acc;
      }, {});

      const groupedTagsArray = Object.keys(groupedTags).map((group) => ({
        group,
        tags: groupedTags[group],
      }));

      return {
        id,
        title: title?.en || Object?.values(altTitles[0])[0] || 'Untitled',
        description: description?.en || 'No description available for this manga.',
        altTitle: Object.values(altTitles[0] ?? { none: "N/A" })[0] || 'N/A',
        contentRating: contentRating || 'N/A',
        status: status || 'Unknown',
        year: year || 'N/A',
        updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
        tags: groupedTagsArray,
        flatTags: tags.map((tag) => tag.attributes?.name?.en || 'Unknown Tag'),
        coverImageUrl,
        authorName,
        artistName,
        rating,
        links,
        creatorName,
        MangaStoryType,
        availableTranslatedLanguages,
        latestUploadedChapter,
        originalLanguage,
      };
    })
  );
};

export default function MangaList() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDataProcessed, setIsDataProcessed] = useState(false);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["mangas", page],
    queryFn: fetchAllMangaTypes,
    staleTime: CACHE_DURATION,
    cacheTime: CACHE_DURATION,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    onError: (error) => {
      console.error('Error in manga query:', error);
    }
  });

  const processMutation = useMutation({
    mutationFn: (data) => {
      const { mangas, favouriteMangas, latestMangas, randomMangas } = data;
      return Promise.all([
        processMangaData(mangas.data || []),
        processMangaData(favouriteMangas.data || []),
        processMangaData(latestMangas.data || []),
        processMangaData(randomMangas.data || []),
      ]);
    },
    onSuccess: ([processedMangas, processedFavouriteMangas, processedLatestMangas, processedRandomMangas]) => {
      queryClient.setQueryData(["processedMangas"], processedMangas);
      queryClient.setQueryData(["processedFavouriteMangas"], processedFavouriteMangas);
      queryClient.setQueryData(["processedLatestMangas"], processedLatestMangas);
      queryClient.setQueryData(["processedRandomMangas"], processedRandomMangas);
      setIsDataProcessed(true);
    },
    onError: (error) => {
      console.error('Error processing manga data:', error);
    }
  });

  useEffect(() => {
    if (data && !isDataProcessed) {
      processMutation.mutate(data);
    }
  }, [data, isDataProcessed]);

  const handleMangaClicked = (manga) => {
    navigate(`/manga/${manga.id}/chapters`, { state: { manga } });
  };

  const loadMoreMangas = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Get processed data from query client
  const processedMangas = queryClient.getQueryData(["processedMangas"]) || [];
  const processedFavouriteMangas = queryClient.getQueryData(["processedFavouriteMangas"]) || [];
  const processedLatestMangas = queryClient.getQueryData(["processedLatestMangas"]) || [];
  const processedRandomMangas = queryClient.getQueryData(["processedRandomMangas"]) || [];

  // Show loading state if data is not ready
  const isLoadingState = isLoading || !isDataProcessed || !processedLatestMangas.length;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 pt-1 to-gray-900 text-white">
      {isLoadingState ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="text-center">
            <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
            <p className="text-lg font-semibold">Loading Mangas...</p>
          </div>
        </div>
      ) : (
        <>
          <div className=" w-full h-fit">
            <MemoizedSliderComponent handleMangaClicked={handleMangaClicked} processedRandomMangas={processedRandomMangas} />
          </div>

          <div className="flex flex-row justify-between  items-start">
            <MemoizedMangaCard
              handleMangaClicked={handleMangaClicked}
              processedLatestMangas={processedLatestMangas}
            />
            <MemoizedAsideComponent
              handleMangaClicked={handleMangaClicked}
              processedMangas={processedMangas}
              processedLatestMangas={processedLatestMangas}
              processedFavouriteMangas={processedFavouriteMangas}
            />
          </div>
          <div className="text-center mt-10">
            <button
              onClick={loadMoreMangas}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Load More
            </button>
          </div>
        </>
      )}
    </div>
  );
}