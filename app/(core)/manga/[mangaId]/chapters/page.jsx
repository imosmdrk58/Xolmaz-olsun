'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState, Suspense, lazy, useMemo } from 'react';
import LoadingSpinner from '../../../../Components/LoadingSpinner';
import { useManga } from '../../../../providers/MangaContext';

// Lazy load components
const AboutManga = React.memo(
  lazy(() => import('../../../../Components/ChaptersListComponents/AboutManga'))
);
const ChapterList = React.memo(
  lazy(() => import('../../../../Components/ChaptersListComponents/ChapterList'))
);

const getAvailableStorage = async () => {
  try {
    const testKey = '__test__';
    const testValue = 'x';
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    if (navigator.storage?.estimate) {
      const { quota, usage } = await navigator.storage.estimate();
      return quota - usage;
    }
    return 5 * 1024 * 1024; // fallback 5MB
  } catch {
    return 0;
  }
};

export default function MangaChapters() {
  const { mangaId } = useParams();
  const router = useRouter();
  const { selectedManga, setChapterListForManga,addToReadHistory } = useManga();

  // Use selectedManga only if it matches mangaId, else null
  const manga = useMemo(() => (selectedManga && selectedManga.id === mangaId ? selectedManga : null), []);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!manga) {
      setError('No manga data found.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        const cachedChapters = localStorage.getItem(`chapters-${mangaId}`);
        if (cachedChapters) {
          if (isMounted) setChapters(JSON.parse(cachedChapters));
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/manga/${mangaId}/chapters`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`Failed to fetch chapters: ${res.statusText}`);

        const data = await res.json();

        const sortedChapters = data.chapters
          .filter((chapter) => chapter.pageCount !== 'Unknown')
          .sort((a, b) => {
            const chapterA = parseFloat(a.chapter);
            const chapterB = parseFloat(b.chapter);
            if (isNaN(chapterA)) return 1;
            if (isNaN(chapterB)) return -1;
            return chapterA - chapterB;
          });

        const availableStorage = await getAvailableStorage();
        const chaptersSize = new Blob([JSON.stringify(sortedChapters)]).size;

        if (availableStorage > chaptersSize) {
          try {
            localStorage.setItem(`chapters-${mangaId}`, JSON.stringify(sortedChapters));
          } catch (storageError) {
            console.warn(`Failed to cache chapters for ${mangaId}:`, storageError.message);
          }
        } else {
          console.warn(`Storage quota too low for chapters-${mangaId}. Skipping cache.`);
        }

        if (isMounted) setChapters(sortedChapters);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred while fetching chapters');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChapters();

    return () => {
      isMounted = false;
    };
  }, [manga, mangaId]);

  const handleChapterClick = useCallback(
    (chapter) => {
      console.log('handleChapterClick - mangaId:', mangaId, 'chapters:', chapters);
      setChapterListForManga(mangaId, chapters);
      addToReadHistory(manga,chapter,chapters)
      router.push(`/manga/${mangaId}/chapter/${chapter.id}/read`);
    },
    [mangaId, router, chapters] // Added chapters to dependencies
  );

  console.log('Current chapters state:', chapters);

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

  if (!chapters.length && !loading) {
    return (
      <div className="text-center flex justify-center items-center font-bold text-red-500 text-lg bg-[#070920] backdrop-blur-md w-full h-[88vh]">
        No chapters found for this manga.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-hidden bg-transparent text-white py-10 px-2 sm:px-12">
      <Suspense fallback={<LoadingSpinner text="Loading Manga Info..." />}>
        <AboutManga last={chapters[chapters.length - 1]} manga={manga} handleChapterClick={handleChapterClick} />
        {loading ? (
          <LoadingSpinner className=' relative bg-transparent md:inset-y-7 md:inset-x-28' text="Loading chapters..." />
        ) : (
          <ChapterList manga={manga} chapters={chapters} handleChapterClick={handleChapterClick} />
        )}
      </Suspense>
    </div>
  );
}
