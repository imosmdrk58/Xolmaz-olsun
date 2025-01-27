"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MangaCard from "../Components/MangaListComponents/MangaCard";
import AsideComponent from "../Components/MangaListComponents/AsideComponent";
import SliderComponent from "../Components/MangaListComponents/SliderComponent";

const MemoizedMangaCard = React.memo(MangaCard);
const MemoizedAsideComponent = React.memo(AsideComponent);
const MemoizedSliderComponent = React.memo(SliderComponent);

const fetchMangas = async ({ queryKey }) => {
  const [_, page] = queryKey;
  const [mangaResponse, favouriteMangaResponse, latestMangaResponse, randomMangaResponse] = await Promise.all([
    fetch(`/api/manga/rating?page=${page}`),
    fetch(`/api/manga/favourite?page=${page}`), // Fetch for favorite mangas
    fetch(`/api/manga/latest?page=${page}`),
    fetch(`/api/manga/random?page=${page}`),
  ]);

  if (!mangaResponse.ok || !favouriteMangaResponse.ok || !latestMangaResponse.ok || !randomMangaResponse.ok) {
    throw new Error("Failed to fetch mangas");
  }

  return {
    mangas: await mangaResponse.json(),
    favouriteMangas: await favouriteMangaResponse.json(), // Store favorite mangas
    latestMangas: await latestMangaResponse.json(),
    randomMangas: await randomMangaResponse.json(),
  };
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
  const [storedData, setStoredData] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const cachedData = localStorage.getItem("mangaData");
    const cacheTimestamp = localStorage.getItem("cacheTimestamp");

    if (cachedData && cacheTimestamp) {
      const isStale = Date.now() - parseInt(cacheTimestamp, 10) > 30 * 60 * 1000; // 30 minutes
      if (!isStale) {
        setStoredData(JSON.parse(cachedData));
      } else {
        localStorage.removeItem("mangaData");
        localStorage.removeItem("cacheTimestamp");
      }
    }
  }, []);

  const handleMangaClicked = (manga) => {
    router.push(`/manga/${manga.id}/chapters?manga=${encodeURIComponent(JSON.stringify(manga))}`);
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["mangas", page],
    queryFn: fetchMangas,
    enabled: !storedData, // Skip query if data is already loaded from localStorage
    keepPreviousData: true,
    staleTime: 30 * 60 * 1000,
    onSuccess: (fetchedData) => {
      localStorage.setItem("mangaData", JSON.stringify(fetchedData));
      localStorage.setItem("cacheTimestamp", Date.now().toString());
      setStoredData(fetchedData);
    },
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
    },
  });

  useEffect(() => {
    if (storedData) {
      processMutation.mutate(storedData);
    } else if (data) {
      processMutation.mutate(data);
    }
  }, [storedData, data]);

  if (isError) return <p>Error: {error.message}</p>;

  const loadMoreMangas = () => setPage((prevPage) => prevPage + 1);

  const processedMangas = queryClient.getQueryData(["processedMangas"]) || [];
  const processedFavouriteMangas = queryClient.getQueryData(["processedFavouriteMangas"]) || [];
  const processedLatestMangas = queryClient.getQueryData(["processedLatestMangas"]) || [];
  const processedRandomMangas = queryClient.getQueryData(["processedRandomMangas"]) || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {isLoading || !processedMangas || !processedLatestMangas.length > 0 || !processedLatestMangas.length > 0 ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="text-center">
            <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
            <p className="text-lg font-semibold">Loading Mangas...</p>
          </div>
        </div>
      ) : (
        <>
          <MemoizedSliderComponent processedRandomMangas={processedRandomMangas} />
          <div className="flex flex-row justify-between mt-7 items-start gap-3">
            <MemoizedMangaCard handleMangaClicked={handleMangaClicked} processedLatestMangas={processedLatestMangas} />
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
