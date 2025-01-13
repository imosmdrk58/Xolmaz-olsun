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
console.log(chapters)
  const memoizedChapters = useMemo(() => chapters, [chapters]);

  if (loading) return <div className="text-center text-lg">Loading chapters...</div>;
  if (error) return <div className="text-center text-lg text-red-500">{error}</div>;
  if (!memoizedChapters.length) return <div className="text-center text-lg">No chapters found for this manga.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Chapters</h1>
      <ul className="space-y-4">
        {memoizedChapters.map((chapter) => (
          <li
            key={chapter.id}
            onClick={() => router.push(`/chapter/${chapter.id}/read`)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 flex items-center space-x-4"
          >
            <div className="flex-shrink-0 w-24 h-32 relative">
              <Image
                src={chapter.url}
                alt={`Cover for Chapter ${chapter.chapter}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                loading="lazy"
              />
            </div>
            <div className="flex-grow">
              <div className="text-lg font-semibold text-gray-900">
                Chapter {chapter.chapter} - {chapter.title || 'Untitled'}
              </div>
              <div className="text-sm text-gray-500">Total Pages: {chapter.pageCount || 'Unknown'}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
