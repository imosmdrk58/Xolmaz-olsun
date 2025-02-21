'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Image from 'next/image';

export default function ReadChapter() {
  const { mangaId, chapterId } = useParams();
  const location = useLocation();
  const { chapterInfo, mangaInfo, extraInfo } = location.state || {};
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 rounded-full mb-4" />
          <p className="text-lg">Loading chapter pages...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <p className="text-lg text-red-500">Error fetching chapter pages. Please try again.</p>
      </div>
    );
  }

  if (!pages || !pages.length) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
        <p className="text-lg">No pages available for this chapter.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-between items-center h-[87vh] bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
        }}
        className={`${isCollapsed ? "w-fit h-fit flex justify-center items-center absolute top-1/2 left-4" : "w-80 h-[90vh] py-6 px-5"}  bg-gray-800 shadow-2xl rounded-xl  flex flex-col overflow-y-auto border border-gray-700 transition-all duration-300 ${isCollapsed ? 'h-16' : 'h-[90vh]'}`}
      >
        <div className=' flex flex-row justify-start gap-4 items-center'>
          <span
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`relative cursor-pointer flex justify-center items-center w-fit p-4 rounded-xl overflow-hidden
                    brightness-150 shadow-[0_0_10px_rgba(0,0,0,1)] shadow-purple-500
                              before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                            `}
            style={{ background: "linear-gradient(#3b235a, #24143f)" }}
          >
            <Image
              src={`/list.svg`}
              alt={"toggle"}
              width={32}
              height={32}
              className="w-7 h-7"
            />
          </span>
          {!isCollapsed && (
            <div className=" text-sm font-bold text-purple-200 tracking-widest uppercase  ">
              <h1 className=" border-b-4 border-purple-900  w-fit pb-2"> Manga / Manhwa / Manhua Overview</h1>
            </div>
          )}
        </div>


        {/* Manga Info Header */}
        {!isCollapsed && (
          <>
            {/* Cover Image and Title */}
            <div className="flex flex-col  mt-7 items-center mb-4">
              <img
                src={mangaInfo.coverImageUrl}
                alt={`${mangaInfo.title} cover`}
                className="w-32 h-auto  shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
              />
              <h3 className="text-xl font-semibold text-white mt-2 text-center">
                {mangaInfo.title}
              </h3>
            </div>

            {/* Key Details */}
            <div className="gap-2 flex flex-col mb-2">
              <p className="text-sm -ml-1 text-gray-300 flex items-center gap-2">
                <Image width={24} height={24} className='h-auto' src='/status.svg' alt="status" />
                <span className="font-semibold text-purple-400">Status:</span>
                <span className="text-gray-200">{mangaInfo.status}</span>
              </p>

              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Image width={20} height={20} src='/content.svg' alt="content" />
                <span className="font-semibold text-purple-400">Content Rating:</span>{" "}
                <span className="text-gray-200">{mangaInfo.contentRating}</span>
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Image width={20} height={20} src='/clock.svg' alt="clock" />
                <span className="font-semibold text-purple-400">Year:</span>{" "}
                <span className="text-gray-200">{mangaInfo.year}</span>
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Image width={20} height={20} src='/views.svg' alt="views" />
                <span className="font-semibold text-purple-400">Current:</span>{" "}
                <span className="text-gray-200">
                  {chapterInfo.title} (Pages: {chapterInfo.pageCount})
                </span>
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Image width={20} height={20} src='/globe.svg' alt="globe" />
                <span className="font-semibold text-purple-400">Translated Language:</span>{" "}
                <span className="text-gray-200">{chapterInfo.translatedLanguage}</span>
              </p>
            </div>
            {/* Tags */}
            <div className="mb-4">
              <h4 className="font-semibold w-full flex flex-row gap-2 text-purple-400 mb-2"><Image width={20} height={20} src='/category.svg' alt="category" />Tags:</h4>
              <div className="flex flex-wrap gap-1">
                {mangaInfo.flatTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`relative text-sm cursor-pointer flex justify-center items-center w-fit py-2 px-3 overflow-hidden brightness-150
                                    before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                                  `}
                    style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Description */}
            <p className="text-sm text-gray-300 flex items-start gap-2 mb-2">
              <Image width={20} height={20} src='/list.svg' alt="desc" />
              <span className="font-semibold text-purple-400">Description :               <span className="text-gray-200">{mangaInfo.description}</span></span>{" "}
            </p>
            <div className=' flex flex-row gap-4'>
              {/* Authors */}
              <div className="mb-4 flex justify-center w-full flex-col items-center">
                <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2"> <Image width={20} height={20} src='/author.svg' alt="author" />Authors:</h4>
                <p className="text-sm text-gray-300">
                  {extraInfo?.authorName || "N/A"}
                </p>
              </div>
              {/* Artists */}
              <div className="mb-4 flex justify-center flex-col w-full items-center">
                <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2">
                  <Image width={20} height={20} src='/author.svg' alt="author" />Artists:</h4>
                <p className="text-sm text-gray-300">
                  {extraInfo?.artistName || "N/A"}
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2"><Image width={20} height={20} src='/source.svg' alt="source" />Links:</h4>
              <ul className=" flex flex-row flex-wrap gap-2">
                {Object.entries(mangaInfo.links).map(([key, value]) => (
                  <li key={key}>
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative text-xs cursor-pointer rounded-full flex justify-center items-center w-fit p-3 overflow-hidden brightness-150
                        before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                      `}
                      style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                    >
                      {key.toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>




      {/* Main Content */}
      <div
  style={{
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
  }}
  className="flex flex-col h-[91.2vh] flex-1 mt-3 overflow-y-scroll"
>
  <div
    className={`flex flex-1 ${layout === "horizontal"
      ? "flex-row space-x-4 overflow-hidden justify-center"
      : "flex-col space-y-4 justify-center"
      } items-center mt-2 my-1`}
  >
    {panels === 2 && pages.slice(currentIndex, currentIndex + panels).length === 2 ? (
      <div className="relative max-w-full max-h-full gap-2 flex justify-center items-center">
        {/* Loading spinner for double page mode */}
        {(!imageCache.includes(pages[currentIndex]) || !imageCache.includes(pages[currentIndex + 1])) && (
          <div className="absolute w-full h-[80vh] flex justify-center items-center bg-black/20 rounded-lg shadow-lg">
            <div className="flex justify-center items-center w-full h-screen">
              <div className="text-center flex flex-col justify-center items-center">
                <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
                <span className="ml-2 text-indigo-400 font-medium">Loading...</span>
              </div>
            </div>
          </div>
        )}
        {pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
          <Image
            key={imageKey + index} // Unique key for each image
            src={page}
            alt={`Page ${currentIndex + index + 1}`}
            height={1680}
            width={1680}
            className={`object-contain w-auto h-[75vh] rounded-lg shadow-xl transition-all ${(panels==1 &&(imageCache.includes(pages[currentIndex])))||(panels==2 &&(imageCache.includes(pages[currentIndex]) && imageCache.includes(pages[currentIndex + 1]))) ? "block" : "hidden"}`}
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            onLoadingComplete={() => handleImageLoad(page)}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
          />
        ))}
      </div>
    ) : (
      pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
        <div key={index} className="relative max-w-full max-h-full flex justify-center items-center">
          <Image
            key={imageKey}
            src={page}
            alt={`Page ${currentIndex + index + 1}`}
            height={1680}
            width={1680}
            className={`object-contain w-auto h-[75vh] rounded-lg shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"}`}
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            onLoadingComplete={() => handleImageLoad(page)}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
          />

          {/* Loading spinner for single page mode */}
          {!imageCache.includes(page) && (
            <div className="absolute w-full h-[80vh] flex justify-center items-center bg-black/50 rounded-lg shadow-lg">
              <div className="flex justify-center items-center w-full h-screen">
                <div className="text-center flex flex-col justify-center items-center">
                  <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
                  <span className="ml-2 text-indigo-400 font-medium">Loading...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))
    )}
  </div>

  <div className="relative bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gray-900 shadow-xl rounded-tl-lg rounded-tr-lg border-t border-gray-700">
    <div className="flex w-full items-center justify-between space-x-4">
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-400">Layout:</label>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          className="p-3 py-5 bg-gray-800 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={() => handlePrev()}
          className={`relative gap-4 text-sm cursor-pointer brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-5 rounded-xl overflow-hidden
            before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100`}
          style={{
            background: "linear-gradient(#3b235a, #24143f)",
          }}
        >
          <Image className="brightness-200" src="/previous.svg" alt="prev" width={20} height={20} />Prev
        </button>

        <span className="text-sm text-gray-300">
          {currentIndex + 1}
          {panels === 2 && "-" + Math.min(currentIndex + panels, pages.length)} / {pages.length}
        </span>

        <button
          onClick={() => handleNext()}
          className={`relative gap-4 text-sm cursor-pointer brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-5 rounded-xl overflow-hidden
            before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100`}
          style={{
            background: "linear-gradient(#3b235a, #24143f)",
          }}
        >
          Next
          <Image className="brightness-200" src="/next.svg" alt="next" width={20} height={20} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4">
            {/* Single Panel Button */}
            <button
              onClick={() => setPanels(1)}
              className={`p-2 text-white rounded-md bg-white shadow-md focus:outline-none ${panels === 1
                ? 'border-b-4 border-orange-500 bg-opacity-20 transition-all duration-300'
                : 'hover:border-b-4 hover:border-orange-400 bg-opacity-10'
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
