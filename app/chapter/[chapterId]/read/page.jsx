'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ReadChapter() {
  const { chapterId } = useParams();
  const [pages, setPages] = useState([]);
  const [layout, setLayout] = useState('vertical');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/manga/chapter/${chapterId}/pages`);
        const data = await response.json();
        if (data.images) {
          setPages(data.images);
        } else {
          setError('No pages found for this chapter.');
        }
      } catch (error) {
        setError('Error fetching pages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [chapterId]);

  const memoizedPages = useMemo(() => pages, [pages]);

  if (loading) return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
        <p className="text-lg">Loading chapter pages...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-lg text-red-500">{error}</p>
        <p className="text-sm text-gray-400">Please refresh or try again later.</p>
      </div>
    </div>
  );

  if (!memoizedPages.length) return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-lg">No pages available for this chapter.</p>
        <p className="text-sm text-gray-400">Please refresh or check back later.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6 sm:px-12">
      <h1 className="text-3xl font-extrabold text-indigo-400 mb-6 text-center">Read Chapter {chapterId}</h1>
      <div className="mb-4 text-center">
        <label className="mr-2 text-lg">Select Layout:</label>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          className="p-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg"
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </div>

      <div
        className={`${
          layout === 'vertical'
            ? 'flex flex-col space-y-6'
            : 'flex space-x-6 overflow-x-scroll pb-4'
        }`}
      >
        {memoizedPages.map((page, index) => (
          <div key={index} className="w-full max-w-lg mx-auto">
            <Image
              src={page}
              alt={`Page ${index + 1}`}
              width={600}
              height={900}
              className="rounded-xl shadow-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 2}
              loading={index >= 2 ? 'lazy' : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
