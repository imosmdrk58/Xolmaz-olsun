"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Flag from "react-world-flags";

const langToCountry = { ja: "JP", ms: "MY", ko: "KR", en: "US", zh: "CN" };

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
      <div className="w-full aspect-[2/3] overflow-hidden">
        <img
          src={manga.coverImageUrl}
          alt={manga.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center mb-1">
          <Flag
            code={langToCountry[manga.originalLanguage] || "UN"}
            className="w-3 h-3 mr-1"
          />
          <span className="text-purple-600 text-xs">
            {langToCountry[manga.originalLanguage]}
          </span>
        </div>
        <h4 className="text-white text-sm font-medium truncate">
          {manga.title}
        </h4>
      </div>
      
      {index === activeIndex && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      )}
    </div>
  );
});

MangaThumbnail.displayName = "MangaThumbnail";

const CinematicMangaShowcase = ({ processedRandomMangas, handleMangaClicked }) => {
  const [mangas, setMangas] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
      className="relative w-full h-[89vh] overflow-hidden bg-black"
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
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          
          {/* Content Container */}
          <div className="relative h-full z-20 flex items-center">
            <div className="w-full max-w-2xl px-8 md:px-16 py-12">
              {/* Language Tag */}
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-purple-600/30 bg-black/30 backdrop-blur-sm">
                <Flag
                  code={langToCountry[activeManga?.originalLanguage] || "UN"}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-purple-600 text-xs uppercase tracking-widest">
                  {langToCountry[activeManga?.originalLanguage] || "Unknown"}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight transition-all duration-500">
                <span className="block relative">
                  <span className="relative z-10">{activeManga?.title.length > 40
                  ? `${activeManga?.title.slice(0, 40)}...`
                  : activeManga?.title}</span>
                  <span className="absolute -bottom-3 left-0 h-3 w-24 bg-purple-600/50 z-0"></span>
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-gray-300 mb-8 max-w-xl transition-all duration-500">
                {activeManga?.description.length > 180
                  ? `${activeManga?.description.slice(0, 180)}...`
                  : activeManga?.description}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleMangaClicked(activeManga)}
                  className="px-6 py-3 bg-purple-600 text-black font-medium rounded-sm hover:bg-purple-300 transition-colors"
                >
                  Read Now
                </button>
                <button className="px-6 py-3 bg-transparent border border-purple-600/50 text-purple-600 font-medium rounded-sm hover:bg-purple-600/10 transition-colors">
                  Add to Collection
                </button>
              </div>
            </div>
          </div>
          
          {/* Cover Image - simplified with standard transition */}
          <div
            className="absolute right-8 top-1/2 transform -translate-y-1/2 w-56 h-80 md:w-64 md:h-96 z-30 hidden md:block transition-all duration-500"
            style={{
              boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={activeManga?.coverImageUrl}
              alt={activeManga?.title}
              className="w-full h-full object-cover rounded-sm"
            />
            
            {/* Cover light effect - static positioning */}
            <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-white to-transparent opacity-20" />
          </div>
        </div>
        
        {/* Right Panel - Navigation & Thumbnails */}
        <div className="relative w-full md:w-1/3 h-full bg-black/80 backdrop-blur-sm flex flex-col">
          {/* Navigation Controls */}
          <div className="h-24 border-b py-3 border-white/10 flex items-center justify-between px-8">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 text-white/70 hover:text-purple-600 transition-colors group"
            >
              <span className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-full group-hover:border-purple-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Thumbnails Grid */}
          <div className="flex-grow p-6  overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
        }}
          >
            <h3 className="text-white/50 uppercase text-xs tracking-widest mb-6">Discover More</h3>
            
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
          
          {/* Footer Info */}
        <div className="h-5 flex items-center justify-between px-8">
</div>
          {/* <div className="h-16 border-t border-white/10 flex items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
                <img src="/logo.svg" />
              </div>
              <span className="text-white/70 text-sm">AI Manga Reader</span>
            </div>
            
            <div className="flex gap-3">
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-600 hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-600 hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </button>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Navigation Side Indicators - simplified */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40 hidden md:block">
        <button
          onClick={handlePrev}
          className="w-12 h-12 mb-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-purple-600 hover:text-black hover:border-purple-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
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

export default React.memo(CinematicMangaShowcase);