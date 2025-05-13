/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo, lazy } from "react";
import { useNavigate } from "react-router-dom";
import TopFavouriteMangas from "../constants/TopFavouriteMangas";
import { MoveRight } from "lucide-react";
const LandingContent = React.memo(
  lazy(() => import('../Components/HomeComponents/LandingContent'))
);
// Storage helpers (memoized outside component)
const getFromStorage = (key) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return { data };
      }
    }
    return null;
  } catch (err) {
    console.warn(`Invalid cached data for ${key}:`, err);
    return null;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (err) {
    console.warn(`Failed to save to storage for ${key}:`, err);
  }
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [topSearches, setTopSearches] = useState(TopFavouriteMangas);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

// Process manga data (memoized outside component)
const processMangaData = useCallback(async (mangaList, type) => {
  if (!mangaList || mangaList.length === 0) return [];

  const page = 1; // Fixed page for topManga
  const cacheKey = `processed_${type}_${page}`;
  const cachedData = getFromStorage(cacheKey);
  if (cachedData?.data) return cachedData.data;

  // Batch fetch ratings
  const mangaIds = mangaList.map((manga) => manga.id);
  let ratings;
  const ratingsCacheKey = `manga_ratings_batch_${mangaIds.join("_")}`;
  const cachedRatings = getFromStorage(ratingsCacheKey);

  if (cachedRatings?.data) {
    ratings = cachedRatings.data;
  } else {
    try {
      const response = await fetch(
        "https://api.mangadex.org/statistics/manga?" +
          mangaIds.map((id) => `manga[]=${id}`).join("&")
      );
      if (response.ok) {
        const ratingData = await response.json();
        ratings = ratingData.statistics || {};
        saveToStorage(ratingsCacheKey, ratings);
      }
    } catch (err) {
      console.error("Error fetching batch ratings:", err);
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
      const coverImageUrl = coverArt
        ? `https://mangadex.org/covers/${id}/${coverArt}.256.jpg`
        : null;
      const authorName = grouped.author?.[0]?.attributes?.name || "N/A";
      const artistName = grouped.artist?.[0]?.attributes?.name || "N/A";
      const creatorName = grouped.creator?.[0]?.attributes?.name || "N/A";
      const rating = ratings[id] || {};

      const groupedTags = tags?.reduce((acc, tag) => {
        const group = tag.attributes?.group || "Unknown Group";
        const tagName = tag.attributes?.name?.en || "Unknown Tag";
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
        title: title?.en || Object?.values(altTitles?.[0] || {})[0] || "Untitled",
        description: description?.en || "No description available.",
        altTitle: Object.values(altTitles?.[0] || { none: "N/A" })[0] || "N/A",
        contentRating: contentRating || "N/A",
        status: status || "Unknown",
        altTitles: altTitles || [],
        year: year || "N/A",
        updatedAt: updatedAt ? new Date(updatedAt) : "N/A",
        tags: groupedTagsArray,
        flatTags: tags?.map((tag) => tag.attributes?.name?.en || "Unknown Tag") || [],
        coverImageUrl,
        authorName,
        artistName,
        rating,
        links,
        creatorName,
        MangaStoryType: publicationDemographic || "N/A",
        availableTranslatedLanguages: availableTranslatedLanguages || [],
        latestUploadedChapter,
        originalLanguage,
        type,
      };
    })
  );
  saveToStorage(cacheKey, result);
  return result;
},[]);

  // Debounce function memoized
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction( ...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Scroll handler memoized
  const handleScroll = useMemo(
    () =>
      debounce(() => {
        setIsVisible(window.scrollY <= 500);
      }, 50),
    [debounce]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch TopManga list on mount
  useEffect(() => {
    const fetchTopMangaList = async () => {
      try {
        const cached = getFromStorage("topMangaList");
        if (cached?.data) {
          setTopSearches(cached.data);
          return;
        }

        const listResponse = await fetch(
          "https://api.mangadex.org/user/0dd9b63a-f561-4632-b739-84397cb60ca7/list?limit=10"
        );
        if (!listResponse.ok) throw new Error(`Failed to fetch lists: ${listResponse.status}`);

        const listData = await listResponse.json();
        if (listData.result !== "ok" || !Array.isArray(listData.data))
          throw new Error("Invalid list response");

        const topMangaList = listData.data.find(
          (list) => list.id === "864f1275-0048-4ffd-b6ee-bde52f3bc80b"
        );
        if (!topMangaList) throw new Error("TopManga list not found");

        const mangaIds = topMangaList.relationships
          .filter((rel) => rel.type === "manga" && rel.id)
          .map((rel) => rel.id);

        if (mangaIds.length === 0) throw new Error("No manga IDs found");

        const mangaResponse = await fetch(
          `https://api.mangadex.org/manga?${mangaIds
            .map((id) => `ids[]=${id}`)
            .join("&")}&includes[]=cover_art&includes[]=author&includes[]=artist`
        );
        if (!mangaResponse.ok)
          throw new Error(`Failed to fetch manga details: ${mangaResponse.status}`);

        const mangaData = await mangaResponse.json();
        if (mangaData.result !== "ok" || !Array.isArray(mangaData.data))
          throw new Error("Invalid manga response");

        const processedManga = await processMangaData(mangaData.data.slice(0, 10), "topManga");

        if (processedManga.length > 0) {
          setTopSearches(processedManga);
          saveToStorage("topMangaList", processedManga);
        } else {
          throw new Error("No valid manga found");
        }
      } catch (err) {
        setError("Failed to load TopManga list. Showing default titles.");
        console.error(err);
        setTopSearches(TopFavouriteMangas);
        saveToStorage("topMangaList", TopFavouriteMangas);
      }
    };

    fetchTopMangaList();
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
    },
    [searchQuery]
  );

  const handleMangaClicked = useCallback(
    async (manga) => {
      try {
        navigate(`/manga/${manga.id}/chapters`, { state: { manga } });
      } catch (err) {
        setError(`Failed to load ${manga.title}. Please try another title.`);
        console.error(err);
      }
    },
    [navigate]
  );

  // Memoize rendered manga list to avoid re-renders
  const renderedTopSearches = useMemo(() => {
    return topSearches.map((manga, index) => (
      <button
        key={manga.id || index}
        onClick={() => handleMangaClicked(manga)}
        className="bg-gray-800 text-sm rounded-md px-3 py-2 m-1 hover:bg-opacity-45 hover:bg-purple-800 transition duration-200"
      >
        {manga.title.length > 35 ? manga.title.slice(0, 35) + "..." : manga.title}
      </button>
    ));
  }, [topSearches, handleMangaClicked]);

  return (
    <div
      style={{
        lineHeight: "1.5",
        WebkitTextSizeAdjust: "100%",
        fontFamily: "system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        MozOsxFontSmoothing: "grayscale",
        touchAction: "manipulation",
        backgroundImage:
          "radial-gradient(#2d2d2d 2px, transparent 0), radial-gradient(#373636 2px, transparent 0)",
        backgroundPosition: "0 0, 25px 25px",
        backgroundSize: "50px 50px",
      }}
      className="bg-gray-900 text-gray-100 min-h-screen"
    >
      <div
        className={`w-full  ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity flex justify-center items-center h-screen duration-300 bg-gradient-to-b from-purple-900/30 to-gray-900 pt-8 pb-12`}
      >
        <div className="container mt-52 md:mt-0 mx-auto px-4 py-6">
          {/* Logo */}
         <LOGO/>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search manga..."
                className="w-full px-4 py-4 bg-gray-800 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                className="absolute right-2 top-2 brightness-200 bg-purple-600 hover:bg-purple-700 transition duration-200 rounded-lg px-4 py-2"
              >
                Search
              </button>
            </form>
          </div>

          {/* Top Searches */}
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-600 text-white px-4 py-2 mb-4 rounded-md text-center">{error}</div>
            )}
            <div className="flex flex-wrap items-center justify-center">
              <span className="text-gray-400 mr-2 mb-2">Top search:</span>
              {renderedTopSearches}
            </div>
          </div>

          {/* Go To Homepage Button */}
         <GOTOHomeButton/>
        </div>
      </div>

      <LandingContent />
    </div>
  );
};

export default React.memo(Home);


const GOTOHomeButton = React.memo( ()=>( <div className="mt-16 flex justify-center">
  <Link
    href="/manga-list"
    style={{ background: "linear-gradient(#3b235a, #24143f)" }}
    className="relative brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 group"
  >
    <span
      style={{ background: "linear-gradient(#3b235a, #24143f)" }}
      className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out brightness-150 group-hover:h-full"
    ></span>
    <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
      <MoveRight className=" w-5 h-5 -mt-0.5"/>
    </span>
    <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
    <MoveRight className=" w-5 h-5 -mt-0.5 group-hover:-mt-0"/>
    </span>
    <span className="relative w-full transform -translate-y-1 group-hover:-translate-y-0  text-left transition-colors duration-200 ease-in-out group-hover:text-white">
      Go To Homepage
    </span>
  </Link>
</div>))

const LOGO = React.memo(()=>(
  <div className="flex justify-center mb-10">
  <Link href="/" className="inline-block">
    <Image
      src="/logo.svg"
      width={260}
      height={260}
      alt="AI_Manga_Reader"
      className="h-40 w-auto"
      priority
    />
  </Link>
</div>
))