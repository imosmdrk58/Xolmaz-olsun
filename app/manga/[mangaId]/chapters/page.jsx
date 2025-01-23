'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Temp from "../../../Components/ChaptersListComponents/Temp";
import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

export default function MangaChapters() {
  const { mangaId } = useParams();
  const router = useRouter();

  // Extract the manga param once, and keep it stable
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const manga = useMemo(() => {
    const mangaParam = searchParams.get('manga');
    return mangaParam ? JSON.parse(mangaParam) : null;
  }, [searchParams]);

  // Fetch chapters using useQuery with stable keys
  const { data: chapters, isLoading, isError, error } = useQuery({
    queryKey: ['chapters', mangaId], // Ensure the queryKey is an array
    queryFn: async () => {
      const res = await fetch(`/api/manga/${mangaId}/chapters`);
      if (!res.ok) throw new Error('Failed to fetch chapters');
      const data = await res.json();
  
      return data.chapters
        .filter((chapter) => chapter.pageCount !== "Unknown")
        .sort((a, b) => {
          const chapterA = parseFloat(a.chapter);
          const chapterB = parseFloat(b.chapter);
          if (isNaN(chapterA)) return 1;
          if (isNaN(chapterB)) return -1;
          return chapterA - chapterB;
        });
    },
    staleTime: 60000, // Cache the result for 1 minute
  });
  

  // Stable event handler
  const handleChapterClick = useCallback((id) => {
    router.push(`/chapter/${id}/read`);
  }, [router]);

  // Loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
          <p className="text-lg">Loading chapters...</p>
        </div>
      </div>
    );

  // Error state
  if (isError)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{error instanceof Error ? error.message : 'An error occurred while fetching chapters.'}</p>
          <p className="text-sm text-gray-400">Please refresh or try again later.</p>
        </div>
      </div>
    );

  // Empty state
  if (!chapters?.length)
    return <div className="text-center text-lg bg-gray-900 w-full h-screen text-white">No chapters found for this manga.</div>;

  // Render content
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white py-10 px-6 sm:px-12">
      <Temp manga={manga} handleChapterClick={handleChapterClick} />
      <div className="space-y-5">
        <h2 className="flex items-center gap-4 text-2xl font-semibold text-web-title mb-8">
          <Image src="/list.svg" alt="list" width={38} height={38} />
          <span>Watch Latest Chapters</span>
        </h2>

        <div className="rounded-xl border border-muted-foreground p-6 shadow-lg bg-gray-900">
          <div className="heading border-b border-muted-foreground text-muted-foreground">
            <div className="flex items-center gap-4 text-2xl font-semibold text-web-title mb-3 pl-3">List of Chapters</div>
          </div>

          <ul className="flex mt-3 flex-col gap-2 py-1 text-sm">
            {chapters.map((chapter) => (
              <li
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                className="p-2 border-2 border-gray-700 rounded-xl cursor-pointer hover:bg-gray-700 hover:shadow-2xl transition-all duration-300 ease-in-out flex items-center space-x-6 transform hover:scale-105"
              >
                <div className="flex-shrink-0 w-20 h-16 relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={chapter.url}
                    alt={`Cover for Chapter ${chapter.chapter}`}
                    fill
                    className="rounded-md object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-grow">
                  <div className="text-xl font-semibold text-white mb-3">
                    Chapter {chapter.chapter} - {chapter.title || 'Untitled'}
                  </div>
                  <div className="text-sm text-gray-400">Total Pages: {chapter.pageCount || 'Unknown'}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="mb-0 ml-auto py-4 text-muted-foreground text-sm">
            <span>Shown </span>
            <span className="text-foreground">{chapters.length}</span>
            <span> / </span>
            <span className="text-foreground">{chapters.length}</span>
            <span> chapters</span>
          </p>
        </div>
      </div>
    </div>
  );
}
