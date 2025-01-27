'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import AboutManga from '../../../Components/ChaptersListComponents/AboutManga';
import ChapterList from '../../../Components/ChaptersListComponents/ChapterList';

const MemoizedAboutManga = React.memo(AboutManga);
const MemoizedChapterList = React.memo(ChapterList);

export default function MangaChapters() {
  const { mangaId } = useParams();
  const router = useRouter();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manga, setManga] = useState(null); // Use state to store the manga object

  // Fetch manga object from query params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const mangaParam = searchParams.get('manga');
    if (mangaParam) {
      setManga(JSON.parse(mangaParam)); // Update manga state
    }
  }, [window.location.search]); // Re-run when the URL changes

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        const cachedChapters = localStorage.getItem(`chapters-${mangaId}`);
        if (cachedChapters) {
          setChapters(JSON.parse(cachedChapters));
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/manga/${mangaId}/chapters`);
        if (!res.ok) throw new Error('Failed to fetch chapters');

        const data = await res.json();
        const sortedChapters = data.chapters
          .filter((chapter) => chapter.pageCount !== 'Unknown')
          .sort((a, b) => {
            const chapterA = parseFloat(a.chapter);
            const chapterB = parseFloat(b.chapter);
            return isNaN(chapterA) ? 1 : isNaN(chapterB) ? -1 : chapterA - chapterB;
          });

        localStorage.setItem(`chapters-${mangaId}`, JSON.stringify(sortedChapters));
        setChapters(sortedChapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaId]);

  const handleChapterClick = useCallback((id) => {
    router.push(`/chapter/${id}/read`);
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
          <p className="text-lg">Loading chapters...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{error}</p>
          <p className="text-sm text-gray-400">Please refresh or try again later.</p>
        </div>
      </div>
    );

  if (!chapters.length)
    return <div className="text-center text-lg bg-gray-900 w-full h-screen text-white">No chapters found for this manga.</div>;

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white py-10 px-6 sm:px-12">
      <MemoizedAboutManga manga={manga} handleChapterClick={handleChapterClick} />
      <MemoizedChapterList chapters={chapters} handleChapterClick={handleChapterClick} />
    </div>
  );
}
