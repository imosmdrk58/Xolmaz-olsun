'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ReadChapter() {
  const { chapterId } = useParams();
  const [layout, setLayout] = useState('horizontal');
  const [panels, setPanels] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageCache, setImageCache] = useState([]);
  const [imageKey, setImageKey] = useState(0); // Key to force image re-fetch

  const { data: pages, isLoading, isError } = useQuery({
    queryKey: ['chapterPages', chapterId],
    queryFn: async () => {
      const cachedPages = localStorage.getItem(`chapter_${chapterId}`);
      if (cachedPages) return JSON.parse(cachedPages);

      const response = await fetch(`/api/manga/chapter/${chapterId}/pages`);
      if (!response.ok) throw new Error('Failed to fetch chapter pages.');
      const data = await response.json();
      if (data.images) {
        localStorage.setItem(`chapter_${chapterId}`, JSON.stringify(data.images));
        return data.images;
      }
      throw new Error('No pages found.');
    },
    retry: 2,
  });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, pages.length - panels) : prevIndex - panels
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + panels >= pages.length ? 0 : prevIndex + panels
    );
  };

  const handleImageLoad = (url) => {
    setImageCache((prevCache) => [...prevCache, url]);
  };

  const handleImageError = () => {
    setImageKey((prevKey) => prevKey + 1); // Change key to force re-fetch
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 rounded-full mb-4" />
          <p className="text-lg">Loading chapter pages...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <p className="text-lg text-red-500">Error fetching chapter pages. Please try again.</p>
      </div>
    );

  if (!pages || !pages.length)
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <p className="text-lg">No pages available for this chapter.</p>
      </div>
    );

  return (
    <div className=" flex flex-row h-[91.3vh] bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 h-full bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col">
        <h2 className="text-2xl  font-semibold text-indigo-400 mb-3">Chapter Info</h2>
        <hr className='mb-3'/>
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Chapter ID:</span> {chapterId.slice(0, 30)}
          </p>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <div
          className={`flex flex-1 ${layout === 'horizontal' ? 'flex-row space-x-4 overflow-hidden' : 'flex-col space-y-4'
            } justify-center items-start mt-2`}
        >
          {pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
            <div key={index} className="relative max-w-full max-h-full">
              <Image
                key={imageKey} // Force image re-fetch on error
                src={page}
                alt={`Page ${currentIndex + index + 1}`}
                height={1680}
                width={1680}
                className="object-contain w-fit h-[80vh] rounded-lg shadow-lg"
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
                onLoadingComplete={() => handleImageLoad(page)}
                onError={handleImageError} // Trigger re-fetch on error
                placeholder="blur"
                blurDataURL="/path-to-your-placeholder-image" // Optional, use a blur image for placeholders
              />

              {/* Loading spinner for the image */}
              {!imageCache.includes(page) && (
                <div className="absolute inset-0 flex justify-center items-center w-[25.5rem] rounded-lg bg-black ">
                  <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 rounded-full" />&nbsp; Loading...
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gray-900 shadow-xl rounded-tl-lg rounded-tr-lg border-t border-gray-700">
          <div className="flex  w-full items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Layout:</label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={handlePrev}
                className=" text-white py-2 flex flex-row justify-center items-center gap-4 bg-sky-700 bg-opacity-60 border-2 border-sky-700 px-4 rounded-md hover:bg-sky-500 transition-all duration-200"
              >
                <Image
                  src={"/previous.svg"}
                  alt={`prev`}
                  height={1680}
                  width={1680}
                  className="object-contain brightness-200 w-fit h-5 rounded-lg shadow-lg"
                /> Prev
              </button>
              <span className="text-sm text-gray-300">
                {currentIndex + 1}
                {panels === 2 && "-" + Math.min(currentIndex + panels, pages.length)} / {pages.length}
              </span>
              <button
                onClick={handleNext}
                className=" text-white py-2 flex flex-row justify-center items-center gap-4 bg-sky-700 bg-opacity-60 border-2 border-sky-700 px-4 rounded-md hover:bg-sky-500 transition-all duration-200"
              >
                Next
                <Image
                  src={"/next.svg"}
                  alt={`next`}
                  height={1680}
                  width={1680}
                  className="object-contain brightness-200 w-fit h-5 rounded-lg shadow-lg"
                />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-4">
                  {/* Single Panel Button */}
                  <button
                    onClick={() => setPanels(1)}
                    className={`p-2 text-white  rounded-md bg-white shadow-md focus:outline-none  ${panels === 1
                      ? 'border-b-4 border-orange-500  bg-opacity-20 transition-all duration-300'
                      : 'hover:border-b-4 hover:border-orange-400  bg-opacity-10'
                      }`}
                  >
                    <img src="/single.svg" alt="Single Panel" className="w-6 h-6 brightness-200 " />
                  </button>

                  {/* Double Panel Button */}
                  <button
                    onClick={() => setPanels(2)}
                    className={`p-2 text-white rounded-md bg-white shadow-md focus:outline-none ${panels === 2
                      ? 'border-b-4 border-orange-500 bg-opacity-20 transition-all duration-300'
                      : 'hover:border-b-4 hover:border-orange-400 bg-opacity-10'
                      }`}
                  >
                    <img src="/double.svg" alt="Double Panel" className="w-6 h-6 brightness-200 " />
                  </button>
                </div>

              </div>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
