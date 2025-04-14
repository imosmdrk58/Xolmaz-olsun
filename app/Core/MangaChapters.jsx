'use client';

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import AboutManga from '../Components/ChaptersListComponents/AboutManga';
import ChapterList from '../Components/ChaptersListComponents/ChapterList';
import LoadingSpinner from '../Components/LoadingSpinner';

const MemoizedAboutManga = React.memo(AboutManga);
const MemoizedChapterList = React.memo(ChapterList);

// Utility to check storage availability
const getAvailableStorage = () => {
  try {
    const testKey = '__test__';
    const testValue = 'x';
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    // Estimate available space (rough heuristic)
    return navigator.storage?.estimate ? navigator.storage.estimate().then(({ quota, usage }) => quota - usage) : 5 * 1024 * 1024; // Assume 5MB if API unavailable
  } catch {
    return 0;
  }
};


export default function MangaChapters() {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const manga = location.state?.manga || null;
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!manga) {
      setError('No manga data found.');
      setLoading(false);
      return;
    }

    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cached chapters
        const cachedChapters = localStorage.getItem(`chapters-${mangaId}`);
        if (cachedChapters) {
          setChapters(JSON.parse(cachedChapters));
          setLoading(false);
          return;
        }

        // Fetch chapters from API
        const res = await fetch(`/api/manga/${mangaId}/chapters`, {
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) throw new Error(`Failed to fetch chapters: ${res.statusText}`);

        const data = await res.json();
        const sortedChapters = data.chapters
          .filter((chapter) => chapter.pageCount !== 'Unknown')
          .sort((a, b) => {
            const chapterA = parseFloat(a.chapter);
            const chapterB = parseFloat(b.chapter);
            return isNaN(chapterA) ? 1 : isNaN(chapterB) ? -1 : chapterA - chapterB;
          });


        // Check storage availability before saving
        const availableStorage = await getAvailableStorage();
        const chaptersSize = new Blob([JSON.stringify(sortedChapters)]).size;
        if (availableStorage > chaptersSize) {
          try {
            localStorage.setItem(`chapters-${mangaId}`, JSON.stringify(sortedChapters));
          } catch (storageError) {
            console.warn(`Failed to cache chapters for ${mangaId}:`, storageError.message);
            // Proceed without caching
          }
        } else {
          console.warn(`Storage quota too low for chapters-${mangaId}. Skipping cache.`);
        }

        setChapters(sortedChapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching chapters');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaId, manga]);

  const handleChapterClick = useCallback(
    (id) => {
      navigate(`/manga/${mangaId}/chapter/${id.id}/read`, {
        state: { chapterInfo: id, mangaInfo: manga},
      });
    },
    [navigate, mangaId]
  );

  if (loading) {
    return <LoadingSpinner text="Loading chapters..." />;
  }

  console.log(chapters)
  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-[#070920] backdrop-blur-md text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{error}</p>
          <p className="text-sm text-gray-400">Please refresh or try again later.</p>
        </div>
      </div>
    );
  }

  if (!chapters.length) {
    return (
      <div className="text-center flex justify-center items-center font-bold text-red-500 text-lg bg-[#070920] backdrop-blur-md w-full h-[88vh]">
        No chapters found for this manga.
      </div>
    );
  }
console.log(chapters)
  return (
    <div className="w-full min-h-screen bg-transparent text-white py-10 px-6 sm:px-12">
      <MemoizedAboutManga
        last={chapters[chapters.length - 1]}
        manga={manga}
        handleChapterClick={handleChapterClick}
      />
      <MemoizedChapterList
        manga={manga}
        chapters={chapters}
        handleChapterClick={handleChapterClick}
      />
    </div>
  );
}