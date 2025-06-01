
"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, lazy } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import lucide icons
const StableFlag = React.memo(lazy(() => import('../StableFlag')));
import Image from "next/image";

// Memoized thumbnail component to reduce unnecessary renders
const MangaThumbnail = React.memo(({
  manga,
  index,
  activeIndex,
  handleThumbnailClick
}) => {
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300
        ${index === activeIndex ? 'ring-2 ring-purple-600' : 'opacity-70 hover:opacity-100'}
      `}
      onClick={() => handleThumbnailClick(index)}
    >
      <div className="w-full  overflow-hidden">
        <Image width={300} height={300}
          src={manga.coverImageUrl}
          alt={manga.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center mb-1">
          <StableFlag code={manga.originalLanguage || "UN"} />
          <span className="text-purple-600 text-xs">
            {manga.originalLanguage}
          </span>
        </div>
        <h4 className="text-white text-sm font-medium truncate">
          {manga.title}
        </h4>
      </div>

      {index === activeIndex && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      )}
    </div>
  );
});

MangaThumbnail.displayName = "MangaThumbnail";

const SliderComponent = ({ processedRandomMangas, handleMangaClicked }) => {
  const [mangas, setMangas] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const showcaseRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const autoplayDuration = 8000; // 8 seconds

  // Cache the current manga to reduce calculations
  const activeManga = useMemo(() =>
    mangas.length > 0 ? mangas[activeIndex] : null,
    [mangas, activeIndex]
  );

  // Initialize mangas once
  useEffect(() => {
    if (processedRandomMangas?.length > 0) {
      setMangas(processedRandomMangas.slice(0, 8));
    }
  }, [processedRandomMangas]);

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Memoize navigation handlers to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    clearTimeout(timerRef.current);
    resetProgress();

    setActiveIndex((prev) => (prev + 1) % mangas.length);

    setTimeout(() => {
      setIsTransitioning(false);
      // Start a new timer for the next slide immediately after transition completes
      startTimer();
    }, 500);
  }, [isTransitioning, mangas.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    clearTimeout(timerRef.current);
    resetProgress();

    setActiveIndex((prev) => (prev - 1 + mangas.length) % mangas.length);

    setTimeout(() => {
      setIsTransitioning(false);
      // Start a new timer for the next slide immediately after transition completes
      startTimer();
    }, 500);
  }, [isTransitioning, mangas.length]);

  const handleThumbnailClick = useCallback((index) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    clearTimeout(timerRef.current);
    resetProgress();

    setActiveIndex(index);

    setTimeout(() => {
      setIsTransitioning(false);
      // Start a new timer for the next slide immediately after transition completes
      startTimer();
    }, 500);
  }, [isTransitioning, activeIndex]);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - go to next
      handleNext();
    } else if (touchEnd - touchStart > 75) {
      // Swipe right - go to previous
      handlePrev();
    }
  };

  // Separate the progress animation into its own function
  const startProgressAnimation = useCallback(() => {
    if (!progressRef.current) return;

    // Reset first
    progressRef.current.style.transition = "none";
    progressRef.current.style.width = "0%";

    // Force reflow to ensure the transition gets applied
    void progressRef.current.offsetWidth;

    // Apply transition
    progressRef.current.style.transition = `width ${autoplayDuration}ms linear`;
    progressRef.current.style.width = "100%";
  }, []);

  // Start timer for auto-advancement
  const startTimer = useCallback(() => {
    startProgressAnimation();

    // Clear any existing timeout first
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set a new timeout for advancing to the next slide
    timerRef.current = setTimeout(() => {
      handleNext();
    }, autoplayDuration);
  }, [handleNext, startProgressAnimation]);

  // Properly start the auto-play timer whenever the active index changes
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, startTimer]);

  const resetProgress = useCallback(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transition = "none";
    progressRef.current.style.width = "0%";
  }, []);

  if (mangas.length === 0 || !activeManga) return null;

  return (
    <div
      ref={showcaseRef}
      className="relative w-full min-h-[59vh] sm:h-[60vh] border-b-[16px] border-black/10 overflow-hidden bg-black/60"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background noise texture - simplified with static positioning */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23noiseFilter%29%27%2F%3E%3C%2Fsvg%3E')]" />

      {/* Progress Timeline */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div
          ref={progressRef}
          className="h-full bg-purple-600"
        />
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Panel - Feature Display */}
        <div className="relative w-full md:w-2/3 h-full overflow-hidden">
          {/* Background Image - static with opacity */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 transition-opacity duration-500"
            style={{
              backgroundImage: `url(${activeManga?.coverImageUrl})`,
            }}
          />

          {/* Overlay Gradient - enhanced for mobile to make content more readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 sm:to-transparent z-10" />

          {/* Mobile Navigation Controls + Indicators - Only visible on mobile and in a single line */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-40 md:hidden">
            <div className="flex space-x-3 items-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
              <button
                onClick={handlePrev}
                className="w-8 h-8 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white mr-2"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Dot indicators in the middle */}
              <div className="flex space-x-2 items-center">
                {mangas.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer ${index === activeIndex ? "bg-purple-600 w-3" : "bg-white/40"
                      } transition-all duration-300`}
                    onClick={() => handleThumbnailClick(index)}
                  ></div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-8 h-8 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white ml-2"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Content Container with CoverImage repositioned */}
          <div className="relative h-full z-20 flex items-center justify-between">
            {/* Left Side - Title and Description */}
            <div className="w-[75%] md:w-4/5 px-6 md:px-16 md:pl-24 pt-12 pb-32 sm:py-12">
              {/* Language Tag */}
              <div className="inline-flex items-center px-3 py-1 mb-4 md:mb-6 rounded-full border border-purple-600/30 bg-black/30 backdrop-blur-sm">
                <StableFlag code={activeManga?.originalLanguage || "UN"} />
                <span className="text-purple-600 text-xs uppercase tracking-widest">
                  {activeManga?.originalLanguage || "Unknown"}
                </span>
              </div>

              {/* Title - Smaller text size on mobile */}
              <h1 className="text-xl relative z-50  sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white leading-tight transition-all duration-500">
                <span className="block relative">
                  <span className="relative line-clamp-1 md:line-clamp-none z-10">{activeManga?.title.length > 40
                    ? `${activeManga?.title.slice(0, 40)}...`
                    : activeManga?.title}</span>
                  <span className="absolute -bottom-2 md:-bottom-3 left-0 h-2 md:h-3 w-16 md:w-24 bg-purple-600/50 z-0"></span>
                </span>

              </h1>

              {/* Description - Smaller text on mobile */}
              <p className="text-[11px] relative z-50 line-clamp-3 sm:text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-xl md:max-w-2xl transition-all duration-500">
                {activeManga?.description.length > 180
                  ? `${activeManga?.description.slice(0, 140)}...`
                  : activeManga?.description}
              </p>

              {/* Action Buttons - Smaller on mobile */}
              <div className="flex flex-wrap relative z-50 gap-3 md:gap-4">
                <button
                  onClick={() => handleMangaClicked(activeManga)}
                  className="px-3 md:px-6 py-2 md:py-3 bg-purple-600 text-black text-[11px] sm:text-sm md:text-base font-medium rounded-sm hover:bg-purple-300 transition-colors"
                >
                  Read Now
                </button>
                <button className="px-3 md:px-6 py-2 md:py-3 bg-transparent border border-purple-600/50 text-purple-600 text-[11px] sm:text-sm md:text-base font-medium rounded-sm hover:bg-purple-600/10 transition-colors">
                  Add to Collection
                </button>
              </div>
            </div>
            {/* Mobile Cover Image - positioned above the content */}
            <div
              className="absolute  top-[70px] right-3 w-24 h-44   md:hidden z-30 transition-all duration-500"
              style={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)",
              }}
            >
              <Image width={300} height={300}
                src={activeManga?.coverImageUrl}
                alt={activeManga?.title}
                className="w-full  object-cover h-full absolute"
              />
              <div
                className="absolute z-50 inset-0 bg-gradient-to-r [box-shadow:inset_0_0_20px_10px_rgba(20,20,20,1)]"
              />            </div>
            {/* Right Side - Cover Image */}
            <div className="hidden md:block md:w-2/5 h-full relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 right-16 w-56 h-80 z-30 transition-all duration-500"
                style={{
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)",
                }}
              >
                <Image width={300} height={300}
                  src={activeManga?.coverImageUrl}
                  alt={activeManga?.title}
                  className="w-full h-full object-cover rounded-sm"
                />

                {/* Cover light effect */}
                <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-white to-transparent opacity-20" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel - Navigation & Thumbnails - Hidden on mobile */}
        <div className="relative w-full md:w-1/3 h-full bg-black/80 backdrop-blur-sm hidden md:flex flex-col">
          {/* Navigation Controls */}
          <div className="h-24 border-b py-3 border-white/10 flex items-center justify-between px-8">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 text-white/70 hover:text-purple-600 transition-colors group"
            >
              <span className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-full group-hover:border-purple-600 transition-colors">
                <ChevronLeft size={18} />
              </span>
              <span className="hidden sm:block uppercase text-xs tracking-widest">Previous</span>
            </button>

            <div className="text-center">
              <span className="block text-white/50 text-sm">{activeIndex + 1} / {mangas.length}</span>
              <span className="block text-white/30 text-xs">Swipe to navigate</span>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 text-white/70 hover:text-purple-600 transition-colors group"
            >
              <span className="hidden sm:block uppercase text-xs tracking-widest">Next</span>
              <span className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-full group-hover:border-purple-600 transition-colors">
                <ChevronRight size={18} />
              </span>
            </button>
          </div>

          {/* Thumbnails Grid */}
          <div className="flex-grow p-6 pt-3 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
            }}
          >
            <h3 className="text-white/50 uppercase text-xs tracking-widest mb-3">Discover More</h3>

            <div className="grid grid-cols-2 gap-4">
              {mangas.map((manga, index) => (
                <MangaThumbnail
                  key={manga.id}
                  manga={manga}
                  index={index}
                  activeIndex={activeIndex}
                  handleThumbnailClick={handleThumbnailClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Side Indicators - Only visible on desktop */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40 hidden md:block">
        <button
          onClick={handlePrev}
          className="w-12 h-12 mb-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-purple-600 hover:text-black hover:border-purple-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="relative w-1 h-40 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 bg-purple-600 transition-all duration-300"
            style={{ height: `${(activeIndex / (mangas.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SliderComponent);