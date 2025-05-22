import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ArrowBigLeftDash, ArrowBigRightDash, RectangleHorizontal, Columns, MoreHorizontal } from 'lucide-react';
import LayoutSelector from "./LayoutSelector";
import QualitySelector from "./QualitySelector";
import PageLoadingSelector from "./PageLoadingSelector";

const BottomSettings = ({
  setLayout,
  setCurrentIndex,
  layout,
  isCollapsed,
  currentIndex,
  panels,
  pages,
  setPanels,
  allAtOnce,
  setAllAtOnce,
  setQuality,
  quality
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreButtonRef = useRef(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      panels === 2 ? prevIndex === 0 || prevIndex === 1 : prevIndex === 0 ? Math.max(0, pages.length - panels) : prevIndex - panels
    );
  }, [setCurrentIndex, panels, pages]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + panels >= pages.length ? 0 : prevIndex + panels
    );
  }, [setCurrentIndex, panels, pages]);

  const toggleMoreDropdown = useCallback(() => {
    setIsMoreOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    setIsMoreOpen(false)
  },[layout,quality])

  return (
    layout === "horizontal" ? (
      <div className="relative w-full bg-[#070920] bottom-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-md shadow-xl border-t border-blue-950 md:flex-row flex-col gap-4 md:gap-0">
        <div className="flex w-full items-center justify-center md:justify-between space-x-4 flex-row">
          <div className="flex items-center space-x-0 md:space-x-2">
            {/* Desktop view: Show LayoutSelector and QualitySelector directly */}
            <div className="hidden md:flex items-center space-x-2">
              <LayoutSelector layout={layout} setLayout={setLayout} />
              <QualitySelector quality={quality} setQuality={setQuality} />
            </div>
            {/* Mobile view: Show More button */}
            <div className="md:hidden relative" ref={moreButtonRef}>
              <button
                type="button"
                onClick={toggleMoreDropdown}
                aria-expanded={isMoreOpen}
                aria-haspopup="listbox"
                className={`flex items-center justify-between w-fit p-3 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 shadow-md focus:outline-none transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] ${isMoreOpen
                  ? 'shadow-[0_0_15px_rgba(139,92,246,0.6)] bg-opacity-90'
                  : 'hover:bg-opacity-95'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <MoreHorizontal
                    className="w-4 h-4 border border-white text-white rounded-md bg-violet-500/20 p-0.5"
                    aria-hidden="true"
                  />
                </span>
              </button>
              {isMoreOpen && (
                <div className="absolute z-20 w-36 rounded-lg bg-gradient-to-b from-[#1a1a2e] to-[#141426] border border-violet-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-visible bottom-[50px] left-0 p-2 flex flex-col gap-2">
                  <LayoutSelector layout={layout} setLayout={setLayout} />
                  <QualitySelector quality={quality} setQuality={setQuality} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={handlePrev}
              className="flex items-center tracking-wider justify-center w-fit gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)] hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]"
            >
              <ArrowBigLeftDash className="w-5 sm:w-7 h-5 sm:h-7 text-white font-extrabold fill-white" />Prev
            </button>

            <span className="text-xs sm:text-sm text-gray-300">
              {currentIndex + 1}
              {panels === 2 && "-" + Math.min(currentIndex + panels, pages.length)} / {pages.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center tracking-wider justify-center w-fit gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)] hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]"
            >
              Next
              <ArrowBigRightDash className="w-5 sm:w-7 h-5 sm:h-7 text-white font-extrabold fill-white" />
            </button>
          </div>

          <div className="relative hidden md:grid grid-cols-2 bg-[#1a1a2e] rounded-full py-2 px-1.5 sm:px-2 shadow-lg shadow-black/50 select-none">
            <div
              className={`absolute top-1 bottom-1 w-12 sm:w-14 rounded-full bg-purple-400/30 border-2 border-purple-400 shadow-purple-500 transition-transform duration-300 ease-in-out ${panels === 1 ? "translate-x-1.5 sm:translate-x-2" : "translate-x-[3.25rem] sm:translate-x-16"}`}
            />
            <button
              onClick={() => setPanels(1)}
              className={`relative col-span-1 z-10 flex items-center justify-center w-12 sm:w-14 h-8 sm:h-10 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-colors duration-300 ${panels === 1 ? "text-black" : "text-white hover:text-orange-400"}`}
              aria-pressed={panels === 1}
              aria-label="Single Panel"
            >
              <RectangleHorizontal className="w-4 sm:w-5 h-4 sm:h-5 text-white rotate-90" />
            </button>
            <button
              onClick={() => setPanels(2)}
              className={`relative z-10 col-span-1 flex items-center justify-center w-12 sm:w-14 h-8 sm:h-10 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-colors duration-300 ${panels === 2 ? "text-black" : "text-white hover:text-orange-400"}`}
              aria-pressed={panels === 2}
              aria-label="Double Panel"
            >
              <Columns className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className={`${isCollapsed ? "w-[95.2%]" : "w-[77.7%]"} h-20 sm:h-24 fixed bottom-0 bg-[#070920] flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-md shadow-xl border-t border-blue-950 flex-col sm:flex-row gap-4 sm:gap-0`}>
        <div className="flex w-full items-center justify-start md:justify-around space-x-2 flex-row gap-12 sm:gap-0">
          <div className="hidden md:flex items-center space-x-2">
            <LayoutSelector layout={layout} setLayout={setLayout} />
            <QualitySelector quality={quality} setQuality={setQuality} />
          </div>
          <div className="md:hidden relative" ref={moreButtonRef}>
            <button
              type="button"
              onClick={toggleMoreDropdown}
              aria-expanded={isMoreOpen}
              aria-haspopup="listbox"
              className={`flex items-center justify-between w-fit p-3 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 shadow-md focus:outline-none transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] ${isMoreOpen
                ? 'shadow-[0_0_15px_rgba(139,92,246,0.6)] bg-opacity-90'
                : 'hover:bg-opacity-95'
                }`}
            >
              <span className="flex items-center gap-2">
                <MoreHorizontal
                  className="w-4 h-4 border border-white text-white rounded-md bg-violet-500/20 p-0.5"
                  aria-hidden="true"
                />
              </span>
            </button>
            {isMoreOpen && (
              <div className="absolute z-20 w-36 rounded-lg bg-gradient-to-b from-[#1a1a2e] to-[#141426] border border-violet-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-visible bottom-[50px] left-0 p-2 flex flex-col gap-2">
                <LayoutSelector layout={layout} setLayout={setLayout} />
                <QualitySelector quality={quality} setQuality={setQuality} />
              </div>
            )}
          </div>
          <PageLoadingSelector allAtOnce={allAtOnce} setAllAtOnce={setAllAtOnce} />
        </div>
      </div>
    )
  );
}

export default BottomSettings;