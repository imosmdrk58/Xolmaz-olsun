'use client';

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import AboutManga from '../Components/ChaptersListComponents/AboutManga';
import ChapterList from '../Components/ChaptersListComponents/ChapterList';

const MemoizedAboutManga = React.memo(AboutManga);
const MemoizedChapterList = React.memo(ChapterList);

export default function MangaChapters() {
  const { mangaId } = useParams(); // Fix: Match route param name
  const navigate = useNavigate();
  const location = useLocation();
  const manga = location.state?.manga || null;
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);
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
  }, [mangaId, manga]);

  const handleChapterClick = useCallback((id) => {
    navigate(`/manga/${mangaId}/chapter/${id.id}/read`, { state: { chapterInfo: id,mangaInfo:manga,artist_author_info:extraInfo } });
  }, [navigate, mangaId]);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-[#070920] backdrop-blur-md text-white">
        <div className="text-center">
          <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
          <p className="text-lg">Loading chapters...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-[#070920] backdrop-blur-md text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{error}</p>
          <p className="text-sm text-gray-400">Please refresh or try again later.</p>
        </div>
      </div>
    );

  if (!chapters.length)
    return <div className="text-center flex justify-center items-center font-bold text-red-500 text-lg bg-[#070920] backdrop-blur-md w-full h-[88vh]">No chapters found for this manga.</div>;
console.log(extraInfo)
  return (
    <div className="w-full min-h-screen bg-[#070920] backdrop-blur-md text-white py-10 px-6 sm:px-12">
      <MemoizedAboutManga last={chapters[chapters.length-1]} setExtraInfo={setExtraInfo} manga={manga} handleChapterClick={handleChapterClick} />
      <MemoizedChapterList manga={manga} chapters={chapters} handleChapterClick={handleChapterClick} />
    </div>
  );
}
