'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function MangaChapters() {
  const { mangaId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Check cache first
        const cachedChapters = localStorage.getItem(`chapters_${mangaId}`);
        if (cachedChapters) {
          setChapters(JSON.parse(cachedChapters));
          setLoading(false);
          return;
        }

        // Fetch chapters if not in cache
        const res = await fetch(`/api/manga/${mangaId}/chapters`);
        const data = await res.json();
        setChapters(data.chapters || []);

        // Cache the result
        localStorage.setItem(`chapters_${mangaId}`, JSON.stringify(data.chapters || []));
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaId]);

  const memoizedChapters = useMemo(() => chapters, [chapters]);

  console.log(chapters)
  if (loading) return <div>Loading chapters...</div>;

  if (!memoizedChapters.length) return <div>No chapters found for this manga.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chapters</h1>
      <ul className="space-y-4">
        {memoizedChapters.map((chapter) => (
          <li
            key={chapter.id}
            onClick={() => router.push(`/chapter/${chapter.id}/read`)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-200"
          >
            Chapter {chapter.chapter} {chapter.title} Total Page Count {chapter.pageCount} pages
          </li>
        ))}
      </ul>
    </div>
  );
}
