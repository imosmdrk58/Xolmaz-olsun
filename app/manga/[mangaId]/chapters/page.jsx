'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Temp from "../../../Components/ChaptersListComponents/Temp";
import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

export default function MangaChapters() {
  const { mangaId } = useParams();
  const router = useRouter();

  // Extract and parse the manga param once for stability
  const manga = useMemo(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const mangaParam = searchParams.get('manga');
      return mangaParam ? JSON.parse(mangaParam) : null;
    }
    return null;
  }, []);

  // Fetch chapters using TanStack Query
  const { data: chapters, isLoading, isError, error } = useQuery({
    queryKey: ['chapters', mangaId],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${mangaId}/chapters`);
      if (!res.ok) throw new Error('Failed to fetch chapters');
      const data = await res.json();
      return data.chapters.filter((chapter) => chapter.pageCount !== "Unknown")
        .sort((a, b) => {
          const chapterA = parseFloat(a.chapter);
          const chapterB = parseFloat(b.chapter);
          return isNaN(chapterA) ? 1 : isNaN(chapterB) ? -1 : chapterA - chapterB;
        });
    },
    staleTime: 60000,
  });

  const handleChapterClick = useCallback((id) => {
    router.push(`/chapter/${id}/read`);
  }, [router]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
          <p className="text-lg">Loading chapters...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{error instanceof Error ? error.message : 'An error occurred while fetching chapters.'}</p>
          <p className="text-sm text-gray-400">Please refresh or try again later.</p>
        </div>
      </div>
    );

  if (!chapters.length)
    return <div className="text-center text-lg bg-gray-900 w-full h-screen text-white">No chapters found for this manga.</div>;

  return (
    <div className="w-full min-h-screen bg-gray-900  text-white py-10 px-6 sm:px-12">
      <Temp manga={manga} handleChapterClick={handleChapterClick} />
      <div className="space-y-4 w-full">

        <div className=" p-4 border-t-[1px] mt-3 border-gray-500  bg-gray-900">
          <div className="heading mb-6">
            <div className="flex items-center justify-between gap-4 py-1   rounded-lg ">

              {/* "Watch Latest Chapters" Button */}
              <div className="flex  items-center gap-4 text-lg font-semibold bg-gray-800 bg-opacity-30 border shadow-[0_0_3px_rgba(0,0,0,1)] shadow-slate-400  border-gray-800 text-gray-200 p-3 rounded-md transition-all duration-200 ease-in-out cursor-pointer w-full">
                <Image src="/list.svg" alt="list" width={30} height={30} />
                <span className="text-white">Watch Latest Chapters</span>
              </div>

              {/* Chapter Info Section */}
              <div className="flex items-center justify-end text-md text-white gap-4 shadow-[0_0_3px_rgba(0,0,0,1)] shadow-slate-400  bg-gray-800 p-4 rounded-lg bg-opacity-30 border border-gray-800">
                <span>Shown</span>
                <span className="text-orange-500 text-md font-semibold">{chapters.length}</span>
                <span> / </span>
                <span className="text-orange-500 text-md font-semibold">{chapters.length}</span>
                <span> chapters</span>
              </div>
            </div>
          </div>



          <ul className="grid grid-cols-3 gap-2">
            {chapters.map((chapter) => (
              <li
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                className="p-3 border-2 border-gray-700 rounded-md cursor-pointer hover:bg-gray-800 hover:shadow-md transition-all duration-150 ease-in-out flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-16 h-12 relative rounded-md overflow-hidden shadow-sm">
                  <Image
                    src={chapter.url}
                    alt={`Cover for Chapter ${chapter.chapter}`}
                    fill
                    className="rounded-md object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-grow text-md">
                  <div className="font-semibold text-white">{`Chapter ${chapter.chapter} - ${chapter.title || 'Untitled'}`}</div>
                  <div className="text-xs text-gray-400">{`Pages: ${chapter.pageCount || 'Unknown'}`}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>


    </div>
  );
}
