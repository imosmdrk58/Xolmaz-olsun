import React, { memo, useCallback } from 'react';
import {
  File,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { langFullNames } from '@/app/constants/Flags';

const PageNavigation = memo(({ currentIndex, chapterInfo, goToPrevPage, goToNextPage }) => (
  <div
    className="tracking-wider flex items-center gap-1 md:gap-1.5"
    role="navigation"
    aria-label="Page navigation"
  >
    <button
      className={`p-1 md:p-1.5 tracking-wider rounded-md ${
        currentIndex >= 1
          ? 'bg-purple-900/30 hover:bg-purple-800/40 text-white'
          : 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
      }`}
      onClick={goToPrevPage}
      disabled={currentIndex < 1}
      aria-label="Previous page"
    >
      <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
    </button>
    <div className="tracking-wider bg-gray-800/50 text-gray-200 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium border border-purple-700/20">
      {currentIndex + 1} / {chapterInfo.pageCount}
    </div>
    <button
      className={`p-1 md:p-1.5 tracking-wider rounded-md ${
        currentIndex < chapterInfo.pageCount
          ? 'bg-purple-900/30 hover:bg-purple-800/40 text-white'
          : 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
      }`}
      onClick={goToNextPage}
      disabled={currentIndex >= chapterInfo.pageCount}
      aria-label="Next page"
    >
      <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
    </button>
  </div>
));
PageNavigation.displayName = 'PageNavigation';

const PageAndChapterNavigation = memo(
  ({
    setCurrentIndex,
    panels,
    pages,
    hasPrevChapter,
    goToNextChapter,
    hasNextChapter,
    currentIndex,
    sortOrder,
    goToPrevChapter,
    goToChapter,
    filteredChapters,
    goToLastChapter,
    goToFirstChapter,
    setSortOrder,
    setSearchQuery,
    searchQuery,
    chapterInfo,
    dropdownRef,
    setChapterDropdownOpen,
    chapterDropdownOpen,
  }) => {
    const goToPrevPage = useCallback(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? Math.max(0, pages.length - panels) : prevIndex - panels
      );
    }, [setCurrentIndex, panels, pages.length]);

    const goToNextPage = useCallback(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + panels >= pages.length ? 0 : prevIndex + panels
      );
    }, [setCurrentIndex, panels, pages.length]);

    const toggleDropdown = useCallback(
      () => setChapterDropdownOpen((prev) => !prev),
      [setChapterDropdownOpen]
    );

    return (
      <div className="tracking-wider bg-gray-900/50 border-t border-purple-700/20 p-2 md:p-3">
        <div className="tracking-wider flex items-center justify-between mb-1.5 md:mb-2">
          <div className="tracking-wider flex items-center text-[10px] md:text-xs text-purple-300 font-medium">
            <File className="w-4 md:w-5 h-4 md:h-5" />
            <span className="tracking-wider ml-1 md:ml-2">{chapterInfo.title.slice(0, 12)}...</span>
          </div>
          <PageNavigation
            currentIndex={currentIndex}
            chapterInfo={chapterInfo}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
          />
        </div>
        <div className="tracking-wider relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="tracking-wider w-full flex items-center justify-between bg-gray-800/50 border border-purple-700/20 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-white hover:bg-purple-900/30 transition-colors duration-300"
            aria-label="Select chapter"
            aria-expanded={chapterDropdownOpen}
          >
            <span className="tracking-wider font-medium truncate text-[10px] md:text-sm">
              Chapter {chapterInfo.chapter}
            </span>
            <ChevronDown className="w-4 md:w-5 h-4 md:h-5" />
          </button>

          {chapterDropdownOpen && (
            <div
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
              }}
              className="tracking-wider absolute p-2 md:p-3 pt-0 top-full left-0 w-full mt-0.5 md:mt-1 max-h-48 md:max-h-56 overflow-y-auto bg-gray-900/95 backdrop-blur-lg border border-purple-700/30 rounded-lg shadow-2xl z-50"
            >
              <div className="tracking-wider sticky pt-4 md:pt-5 top-0 bg-gray-900/95 p-1.5 md:p-2 border-b border-purple-700/30">
                <div className="tracking-wider flex items-center gap-1.5 md:gap-2">
                  <input
                    type="text"
                    placeholder="Search chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="tracking-wider flex-1 bg-gray-800/50 border border-purple-700/20 rounded-md px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-sm text-white focus:outline-none focus:border-purple-500"
                    aria-label="Search chapters"
                  />
                  <button
                    onClick={() =>
                      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                    }
                    className="tracking-wider p-0.5 md:p-1 rounded-md bg-gray-800/50 hover:bg-purple-900/30 text-gray-200"
                    aria-label={`Sort chapters ${
                      sortOrder === 'asc' ? 'descending' : 'ascending'
                    }`}
                  >
                    <ChevronDown
                      className={`w-3 md:w-4 h-3 md:h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                <div className="tracking-wider flex gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                  <button
                    onClick={goToFirstChapter}
                    className="tracking-wider flex-1 py-0.5 md:py-1 text-[10px] md:text-xs bg-purple-900/30 hover:bg-purple-800/40 text-white rounded-md"
                    aria-label="Go to first chapter"
                  >
                    First
                  </button>
                  <button
                    onClick={goToLastChapter}
                    className="tracking-wider flex-1 py-0.5 md:py-1 text-[10px] md:text-xs bg-purple-900/30 hover:bg-purple-800/40 text-white rounded-md"
                    aria-label="Go to last chapter"
                  >
                    Last
                  </button>
                </div>
              </div>
              <div className="tracking-wider py-0.5 md:py-1">
                {filteredChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(chapter)}
                    className={`w-full tracking-wider text-left px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm hover:bg-purple-900/30 ${
                      chapter.id === chapterInfo.id
                        ? 'bg-purple-900/50 text-white'
                        : 'text-gray-200'
                    }`}
                    aria-label={`Go to chapter ${chapter.chapter}`}
                  >
                    <div className="tracking-wider font-medium">
                      Chapter. {chapter.chapter} ({langFullNames[chapter.translatedLanguage]})
                    </div>
                    <div className="tracking-wider text-[9px] md:text-xs text-gray-400 flex items-center mt-0.5">
                      <File className="w-3 md:w-4 h-3 md:h-4" />
                      <span className="tracking-wider ml-0.5 md:ml-1">{chapter.pageCount} pages</span>
                      <span className="tracking-wider mx-0.5 md:mx-1">•</span>
                      <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="tracking-wider mt-2 md:mt-3 grid grid-cols-2 gap-1.5 md:gap-2">
          <button
            onClick={goToPrevChapter}
            disabled={!hasPrevChapter}
            className={`flex tracking-wider gap-2 md:gap-3 items-center justify-center py-1.5 md:py-2 rounded-lg ${
              hasPrevChapter
                ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40'
                : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'
            }`}
            aria-label="Previous chapter"
          >
            <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
            <span className="tracking-wider ml-0.5 md:ml-1 text-[10px] md:text-sm">Previous</span>
          </button>
          <button
            onClick={goToNextChapter}
            disabled={!hasNextChapter}
            className={`flex items-center gap-2 md:gap-3 justify-center py-1.5 md:py-2 rounded-lg ${
              hasNextChapter
                ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40'
                : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'
            }`}
            aria-label="Next chapter"
          >
            <span className="tracking-wider mr-0.5 md:mr-1 text-[10px] md:text-sm">Next</span>
            <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>
        <div className="tracking-wider mt-2 md:mt-3">
          <div className="tracking-wider text-[10px] md:text-xs text-gray-400 mb-0.5 md:mb-1">Reading Progress</div>
          <div className="tracking-wider w-full bg-gray-800/50 rounded-full h-1 md:h-1.5">
            <div
              className="tracking-wider bg-purple-600 h-1 md:h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / chapterInfo.pageCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
);
PageAndChapterNavigation.displayName = 'PageAndChapterNavigation';

export default PageAndChapterNavigation;