'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function MangaChapters() {
  const { mangaId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/manga/${mangaId}/chapters`);
        if (!res.ok) throw new Error('Failed to fetch chapters');
        const data = await res.json();

        const uniqueChapters = data.chapters?.reduce((acc, chapter) => {
          if (!acc.find((c) => c.id === chapter.id)) {
            acc.push(chapter);
          }
          return acc;
        }, []);

        setChapters(uniqueChapters || []);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching chapters.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaId]);

  const memoizedChapters = useMemo(() => chapters, [chapters]);

  if (loading) return <div className="text-center text-lg text-white">Loading chapters...</div>;
  if (error) return <div className="text-center text-lg text-red-500">{error}</div>;
  if (!memoizedChapters.length) return <div className="text-center text-lg text-white">No chapters found for this manga.</div>;

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white py-10 px-6 sm:px-12">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-400">Chapters</h1>
      <ul className="grid grid-cols-2  gap-8">
        {memoizedChapters.map((chapter) => (
          <li
            key={chapter.id}
            onClick={() => router.push(`/chapter/${chapter.id}/read`)}
            className="p-6 border-2 border-gray-700 rounded-xl cursor-pointer hover:bg-gray-700 hover:shadow-2xl transition-all duration-300 ease-in-out flex items-center space-x-6 transform hover:scale-105"
          >
            <div className="flex-shrink-0 w-32 h-24 relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={chapter.url}
                alt={`Cover for Chapter ${chapter.chapter}`}
                fill
                className="rounded-md"
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
  );
}
