import { langFullNames } from '@/app/constants/Flags';
import React, { memo } from 'react';
import { ChevronUp, ChevronDown, Heart, Menu, BookOpen, File } from 'lucide-react';

function CollapsedSideBarStrip({
  isFavorite,
  toggleFavorite,
  mangaInfo,
  setIsCollapsed,
  CoverImage,
  hasPrevChapter,
  goToNextChapter,
  hasNextChapter,
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
  chapterDropdownOpen
}) {
  const ChapterQuickSelect = memo(() => (
    <div className="tracking-wider relative w-12" ref={dropdownRef}>
      <button
        onClick={() => setChapterDropdownOpen(prev => !prev)}
        className="tracking-wider w-12 h-12 rounded-lg bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group"
        aria-label="Select chapter"
        aria-expanded={chapterDropdownOpen}
      >
        <BookOpen className="w-4 md:w-5 h-4 md:h-5" />
        <span className="tracking-wider absolute -top-2 -right-2 bg-purple-600 text-[10px] md:text-xs text-white rounded-full w-4 md:w-5 h-4 md:h-5 flex items-center justify-center">{chapterInfo.chapter}</span>
        <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md -right-20 md:-right-24 top-1/2 -translate-y-1/2">Select Chapter</span>
      </button>

      {chapterDropdownOpen && (
        <div
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
          className="tracking-wider absolute left-14 p-2 md:p-3 pt-0 top-0 -mt-24 md:-mt-28 w-48 md:w-64 max-h-64 md:max-h-80 overflow-y-auto bg-gray-900/95 backdrop-blur-lg border border-purple-700/30 rounded-lg shadow-2xl z-50"
        >
          <div className="tracking-wider sticky top-0 w-full md:-top-3  bg-gray-900/95 p-2 border-b border-purple-700/30">
            <div className="tracking-wider w-full flex items-center gap-1.5 md:gap-2">
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tracking-wider flex-1 bg-gray-800/50 border border-purple-700/20 rounded-md px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-sm text-white focus:outline-none focus:border-purple-500"
                aria-label="Search chapters"
              />
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="tracking-wider p-0.5 md:p-1 rounded-md bg-gray-800/50 hover:bg-purple-900/30 text-gray-200"
                aria-label={`Sort chapters ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
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
                className={`w-full tracking-wider text-left px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm hover:bg-purple-900/30 ${chapter.id === chapterInfo.id ? 'bg-purple-900/50 text-white' : 'text-gray-200'}`}
                aria-label={`Go to chapter ${chapter.title}`}
              >
                <div className="tracking-wider font-medium">Chapter. {chapter.chapter} ({langFullNames[chapter.translatedLanguage]}) </div>
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
  ));

  return (
    <div className="tracking-wider relative left-0 top-0 h-[90vh] md:h-[91.7vh] z-40 flex justify-center items-center">
      <div className="tracking-wider h-full pt-12 md:pt-16 w-14 md:w-[70px] bg-gray-900/90 backdrop-blur-lg border-r border-purple-900/20 py-4 md:py-6 px-1.5 md:px-2 flex flex-col items-center justify-between shadow-[5px_0_15px_rgba(0,0,0,0.4)]">
        <div className="tracking-wider flex flex-col items-center h-full justify-around space-y-3 md:space-y-4">
          <div className="flex flex-col items-center space-y-1.5 md:space-y-2">
            <div className="tracking-wider w-12 h-12 rounded-lg mb-0.5 md:mb-1 relative group border-2 border-purple-700/20 shadow-md">
              <CoverImage
                src={mangaInfo.coverImageUrl}
                alt={mangaInfo.title}
                className="tracking-wider object-cover rounded-lg w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
              <div className="flex absolute -right-2 md:-right-3 -top-3 md:-top-4 flex-row text-[9px] md:text-[10px] truncate bg-purple-900/90 text-white p-0.5 md:p-1 px-1 md:px-1.5 rounded-full font-medium border border-purple-700/20 capitalize">{chapterInfo.translatedLanguage}</div>
              <div className="tracking-wider absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="tracking-wider  absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md -right-20 md:-right-24 top-1/2 line-clamp-1 -translate-y-1/2">{mangaInfo.title}</span>
            </div>

            <button
              onClick={() => setIsCollapsed(false)}
              className="tracking-wider w-12 h-12 rounded-lg bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group"
              aria-label="Expand sidebar"
            >
              <Menu className="w-4 md:w-5 h-4 md:h-5" />
              <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md -right-14 md:-right-16 top-1/2 -translate-y-1/2">Expand</span>
            </button>
          </div>
          <ChapterQuickSelect />

          <div className="tracking-wider flex flex-col items-center gap-1.5 md:gap-2">
            <div className="tracking-wider flex w-12 md:w-14 flex-col justify-between gap-1.5 md:gap-2">
              <button
                onClick={goToPrevChapter}
                disabled={!hasPrevChapter}
                className={`flex-1 tracking-wider py-1.5 md:py-2 h-10 md:h-12 rounded-lg flex flex-col items-center justify-center border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  hasPrevChapter
                    ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                    : 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Previous chapter"
                type="button"
              >
                <ChevronUp className="tracking-wider w-5 md:w-6 h-5 md:h-6 mb-0.5 md:mb-1" />
                <span className="tracking-wider text-[10px] md:text-xs select-none">Prev</span>
              </button>
              <div className="flex text-[10px] md:text-[11px] my-1 md:my-2 flex-row space-x-0.5 md:space-x-1 justify-center items-center">{chapterInfo.chapter} / {filteredChapters.length}</div>
              <button
                onClick={goToNextChapter}
                disabled={!hasNextChapter}
                className={`flex-1 tracking-wider py-1.5 md:py-2 h-10 md:h-12 rounded-lg flex flex-col items-center justify-center border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  hasNextChapter
                    ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                    : 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Next chapter"
                type="button"
              >
                <ChevronDown className="tracking-wider w-5 md:w-6 h-5 md:h-6 mb-0.5 md:mb-1" />
                <span className="tracking-wider text-[10px] md:text-xs select-none">Next</span>
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={toggleFavorite}
          className={`w-10 md:w-12 h-10 md:h-12 tracking-wider rounded-lg flex items-center justify-center transition-all duration-300 relative group ${
            isFavorite ? 'bg-red-900/30 text-red-400 border border-red-700/20' : 'bg-gray-800/50 text-gray-400 border border-gray-700/20 hover:bg-red-900/30 hover:text-red-400'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-5 md:w-6 h-5 md:h-6 ${isFavorite ? 'animate-pulse' : ''}`} />
          <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md -right-20 md:-right-24 top-1/2 -translate-y-1/2">{isFavorite ? 'Unfavorite' : 'Favorite'}</span>
        </button>
      </div>
    </div>
  );
}

export default CollapsedSideBarStrip;