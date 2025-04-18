import React, { memo, useCallback, useMemo } from 'react';
import { langFullNames } from '@/app/constants/Flags';

const PageNavigation = memo(({ currentIndex, chapterInfo, goToPrevPage, goToNextPage, PrevIcon, NextIcon }) => (
  <div className="flex items-center gap-1.5" role="navigation" aria-label="Page navigation">
    <button
      className={`p-1.5 rounded-md ${currentIndex >= 1 ? 'bg-purple-900/30 hover:bg-purple-800/40 text-white' : 'bg-gray-800/30 text-gray-500 cursor-not-allowed'}`}
      onClick={goToPrevPage}
      disabled={currentIndex < 1}
      aria-label="Previous page"
    >
      <PrevIcon />
    </button>
    <div className="bg-gray-800/50 text-gray-200 px-2.5 py-1 rounded-md text-xs font-medium border border-purple-700/20">
      {currentIndex + 1} / {chapterInfo.pageCount}
    </div>
    <button
      className={`p-1.5 rounded-md ${currentIndex < chapterInfo.pageCount ? 'bg-purple-900/30 hover:bg-purple-800/40 text-white' : 'bg-gray-800/30 text-gray-500 cursor-not-allowed'}`}
      onClick={goToNextPage}
      disabled={currentIndex >= chapterInfo.pageCount}
      aria-label="Next page"
    >
      <NextIcon />
    </button>
  </div>
));
PageNavigation.displayName = 'PageNavigation';

const PageAndChaptersNavigation = memo(({
  PageIcon,
  ReadingIcon,
  setCurrentIndex,
  panels,
  pages,
  hasPrevChapter,
  PrevIcon,
  goToNextChapter,
  hasNextChapter,
  NextIcon,
  currentIndex,
  sortOrder,
  goToPrevChapter,
  SvgIcon,
  ChevronDownIcon,
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
  chapterDropdownOpen
}) => {
  // Memoized page navigation handlers
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

  // Memoized dropdown toggle
  const toggleDropdown = useCallback(() => 
    setChapterDropdownOpen(prev => !prev), 
    [setChapterDropdownOpen]
  );

  return (
    <div className="bg-gray-900/50 border-t border-purple-700/20 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-xs text-purple-300 font-medium">
          <ReadingIcon />
          <span className="ml-2">CHAPTER {chapterInfo.chapter}</span>
        </div>
        <PageNavigation
          currentIndex={currentIndex}
          chapterInfo={chapterInfo}
          goToPrevPage={goToPrevPage}
          goToNextPage={goToNextPage}
          PrevIcon={PrevIcon}
          NextIcon={NextIcon}
        />
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between bg-gray-800/50 border border-purple-700/20 rounded-lg px-3 py-2 text-white hover:bg-purple-900/30 transition-colors duration-300"
          aria-label="Select chapter"
          aria-expanded={chapterDropdownOpen}
        >
          <span className="font-medium truncate">Chapter {chapterInfo.chapter}</span>
          <ChevronDownIcon />
        </button>
        
        {chapterDropdownOpen && (
          <div
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
            className="absolute p-3 pt-0 top-full left-0 w-full mt-1 max-h-56 overflow-y-auto bg-gray-900/95 backdrop-blur-lg border border-purple-700/30 rounded-lg shadow-2xl z-50"
          >
            <div className="sticky pt-5 top-0 bg-gray-900/95 p-2 border-b border-purple-700/30">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-800/50 border border-purple-700/20 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
                  aria-label="Search chapters"
                />
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-1 rounded-md bg-gray-800/50 hover:bg-purple-900/30 text-gray-200"
                  aria-label={`Sort chapters ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  <SvgIcon className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </SvgIcon>
                </button>
              </div>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={goToFirstChapter}
                  className="flex-1 py-1 text-xs bg-purple-900/30 hover:bg-purple-800/40 text-white rounded-md"
                  aria-label="Go to first chapter"
                >
                  First
                </button>
                <button
                  onClick={goToLastChapter}
                  className="flex-1 py-1 text-xs bg-purple-900/30 hover:bg-purple-800/40 text-white rounded-md"
                  aria-label="Go to last chapter"
                >
                  Last
                </button>
              </div>
            </div>
            <div className="py-1">
              {filteredChapters.map((chapter) => (
                <button
                  key={chapter.chapter}
                  onClick={() => goToChapter(chapter)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-purple-900/30 ${chapter.id === chapterInfo.id ? 'bg-purple-900/50 text-white' : 'text-gray-200'}`}
                  aria-label={`Go to chapter ${chapter.chapter}`}
                >
                  <div className="font-medium">Chapter. {chapter.chapter} ({langFullNames[chapter.translatedLanguage]})</div>
                  <div className="text-xs text-gray-400 flex items-center mt-0.5">
                    <PageIcon />
                    <span className="ml-1">{chapter.pageCount} pages</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={goToPrevChapter}
          disabled={!hasPrevChapter}
          className={`flex items-center justify-center py-2 rounded-lg ${hasPrevChapter ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40' : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'}`}
          aria-label="Previous chapter"
        >
          <PrevIcon />
          <span className="ml-1 text-sm">Previous</span>
        </button>
        <button
          onClick={goToNextChapter}
          disabled={!hasNextChapter}
          className={`flex items-center justify-center py-2 rounded-lg ${hasNextChapter ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40' : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'}`}
          aria-label="Next chapter"
        >
          <span className="mr-1 text-sm">Next</span>
          <NextIcon />
        </button>
      </div>
      <div className="mt-3">
        <div className="text-xs text-gray-400 mb-1">Reading Progress</div>
        <div className="w-full bg-gray-800/50 rounded-full h-1.5">
          <div
            className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex+1) / chapterInfo.pageCount) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});
PageAndChaptersNavigation.displayName = 'PageAndChaptersNavigation';

export default PageAndChaptersNavigation;