'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ReadChapter() {
  const { chapterId } = useParams();
  const [pages, setPages] = useState([]);
  const [layout, setLayout] = useState('vertical');

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch(`/api/manga/chapter/${chapterId}/pages`);
        const data = await response.json();
        setPages(data.images || []);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };
    fetchPages();
  }, [chapterId]);

  // Memoize the pages to avoid re-rendering
  const memoizedPages = useMemo(() => pages, [pages]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Read Chapter</h1>
      <div className="mb-4">
        <label className="mr-2">Select Layout:</label>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </div>
      <div
        className={`${
          layout === 'vertical' ? 'flex flex-col space-y-4' : 'flex space-x-4 overflow-x-scroll'
        }`}
      >
        {memoizedPages.map((page, index) => (
          <Image
            key={index}
            src={page}
            alt={`Page ${index + 1}`}
            width={400}
            height={600}
            className="w-full max-w-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2} // Prioritize loading for the first two images
            loading={index >= 2 ? 'lazy' : undefined} // Lazy load after the first two images
          />
        ))}
      </div>
    </div>
  );
}
