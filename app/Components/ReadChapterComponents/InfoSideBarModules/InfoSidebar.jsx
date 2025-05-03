import React, { useState, useCallback, useEffect, memo, useRef, useMemo } from 'react';
import PageAndChapterNavigation from './PageAndChaptersNavigation';
import CollapsedSideBarStrip from './CollapsedSideBarStrip';
import { SvgIcon, ReadingIcon, MenuIcon, ArrowLeftIcon, BookIcon, ChevronDownIcon, CreatorsIcon, DescriptionIcon, HeartIcon, InfoIcon, LanguageIcon, LinkIcon, NextIcon, PageIcon, PrevIcon, TagIcon } from '../../SVGIcons';
import DifferentMetaDataChapter from './DifferentMetaDataChapter';
import Image from 'next/image';

// Memoize imported components
const MemoPageAndChapterNavigation = memo(PageAndChapterNavigation);
const MemoCollapsedSideBarStrip = memo(CollapsedSideBarStrip);
const MemoDifferentMetaDataChapter = memo(DifferentMetaDataChapter);

// Memoized CoverImage component
const CoverImage = memo(({ src, alt, className }) => (
  <Image height={300} width={300} src={src} alt={alt} className={className} loading="lazy" />
));
CoverImage.displayName = 'CoverImage';

// Memoized InfoSidebar component
const InfoSidebar = memo(({
  isCollapsed,
  pages,
  setIsCollapsed,
  mangaInfo,
  panels,
  setCurrentIndex,
  chapterInfo,
  currentIndex = 1,
  allChapters = [],
  onChapterChange,
}) => {
  const [isFavorite, setIsFavorite] = useState(() => localStorage.getItem(`favorite_${mangaInfo?.id}`) === 'true');
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeSection, setActiveSection] = useState('info');

  const dropdownRef = useRef(null);
  // console.log(allChapters)
  // Persist favorite state
  useEffect(() => {
    localStorage.setItem(`favorite_${mangaInfo?.id}`, isFavorite);
  }, [isFavorite, mangaInfo?.id]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setChapterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mangaInfo || !chapterInfo) return null;

  // Memoized current chapter index
  const currentChapterIndex = useMemo(() => 
    allChapters.findIndex(ch => ch.id === chapterInfo.id), 
    [allChapters, chapterInfo.id]
  );
  const hasPrevChapter = useMemo(() => currentChapterIndex > 0);
  const hasNextChapter = useMemo(() => currentChapterIndex < allChapters.length - 1);
console.log(hasNextChapter)
console.log(hasPrevChapter)
console.log(currentChapterIndex);
console.log(allChapters.length - 1);


  // Memoized event handlers
  const toggleFavorite = useCallback(() => setIsFavorite(prev => !prev), []);

  const setActiveSectionMemo = useCallback((section) => setActiveSection(section), []);

  // Memoized sorted chapters
  const sortedChapters = useMemo(() => 
    [...allChapters].sort((a, b) => {
      const aNum = parseFloat(a.chapter);
      const bNum = parseFloat(b.chapter);
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    }), [allChapters, sortOrder]
  );

  // Memoized filtered chapters
  const filteredChapters = useMemo(() => 
    searchQuery.trim()
      ? sortedChapters.filter(ch => ch.chapter.toLowerCase().includes(searchQuery.toLowerCase()))
      : sortedChapters, 
    [sortedChapters, searchQuery]
  );

  // Memoized chapter navigation handlers
  const goToChapter = useCallback((chapter) => {
    if (onChapterChange) {
      onChapterChange(chapter);
      setChapterDropdownOpen(false);
    }
  }, [onChapterChange]);

  const goToPrevChapter = useCallback(() => 
    hasPrevChapter && goToChapter(allChapters[currentChapterIndex - 1]), 
  [hasPrevChapter, currentChapterIndex, allChapters, goToChapter]
  );
  const goToNextChapter = useCallback(() => 
    hasNextChapter && goToChapter(allChapters[currentChapterIndex + 1]), 
  [hasNextChapter, currentChapterIndex, allChapters, goToChapter]
  );

  console.log(allChapters.length)
  console.log(currentChapterIndex)
  const goToFirstChapter = useCallback(() => 
    goToChapter(allChapters[allChapters.length - 1]), 
    [allChapters, goToChapter]
  );
  const goToLastChapter = useCallback(() => 
    goToChapter(allChapters[0]), 
    [allChapters, goToChapter]
  );

  // Memoized icon props to prevent re-renders
  const iconProps = useMemo(() => ({
    ReadingIcon,
    ChevronDownIcon,
    NextIcon,
    PageIcon,
    PrevIcon,
    SvgIcon,
    HeartIcon,
    MenuIcon,
    BookIcon,
    InfoIcon,
    TagIcon,
    LinkIcon,
    DescriptionIcon,
    CreatorsIcon,
    LanguageIcon,
    ArrowLeftIcon
  }), []);

  // Memoized cover image props
  const coverImageProps = useMemo(() => ({
    src: mangaInfo.coverImageUrl,
    alt: mangaInfo.title,
    className: 'object-cover w-full h-full'
  }), [mangaInfo.coverImageUrl, mangaInfo.title]);

  if (isCollapsed) {
    return (
      <MemoCollapsedSideBarStrip
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        mangaInfo={mangaInfo}
        setIsCollapsed={setIsCollapsed}
        CoverImage={CoverImage}
        pages={pages}
        setCurrentIndex={setCurrentIndex}
        panels={panels}
        chapterDropdownOpen={chapterDropdownOpen}
        chapterInfo={chapterInfo}
        currentIndex={currentIndex}
        dropdownRef={dropdownRef}
        filteredChapters={filteredChapters}
        goToChapter={goToChapter}
        goToFirstChapter={goToFirstChapter}
        goToLastChapter={goToLastChapter}
        goToNextChapter={goToNextChapter}
        goToPrevChapter={goToPrevChapter}
        hasNextChapter={hasNextChapter}
        hasPrevChapter={hasPrevChapter}
        searchQuery={searchQuery}
        setChapterDropdownOpen={setChapterDropdownOpen}
        setSearchQuery={setSearchQuery}
        setSortOrder={setSortOrder}
        sortOrder={sortOrder}
        {...iconProps}
      />
    );
  }

  return (
    <div className="tracking-wider relative left-0 top-0 h-[91.7vh] z-40 flex items-center">
      <div className="tracking-wider h-[87.7vh] mt-4 w-[340px] bg-gray-900/95 backdrop-blur-lg rounded-r-2xl px-5 pt-3 pb-2 flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] border-r border-purple-500/20">
        <div className="tracking-wider absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-700/10 blur-2xl -z-10"></div>
        <div className="tracking-wider absolute bottom-0 left-0 w-32 h-32 rounded-full bg-yellow-500/10 blur-2xl -z-10"></div>

        <div className="tracking-wider flex items-center justify-between mb-2">
          <div className="tracking-wider flex items-center">
            <button
              onClick={() => setIsCollapsed(true)}
              className="tracking-wider w-9 h-9 rounded-lg bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 transition-all duration-300 group"
              aria-label="Collapse sidebar"
            >
              <ArrowLeftIcon className="tracking-wider w-4 h-4" />
              <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-xs py-1 px-2 rounded-md left-12 top-7">Collapse</span>
            </button>
            <h1 className="tracking-wider ml-8 text-base font-bold  uppercase bg-gradient-to-r from-purple-300 to-yellow-200 bg-clip-text text-transparent">
              Manga Explorer
            </h1>
          </div>
          <button
            onClick={toggleFavorite}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group ${isFavorite ? 'bg-red-900/30 text-red-400 border border-red-700/20' : 'bg-gray-800/50 text-gray-400 border border-gray-700/20 hover:bg-red-900/30 hover:text-red-400'}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon filled={isFavorite} className={`w-5 h-5 ${isFavorite ? 'animate-pulse' : ''}`} />
            <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-xs py-1 px-2 rounded-md right-12 top-7">{isFavorite ? 'Unfavorite' : 'Favorite'}</span>
          </button>
        </div>

        <div className="tracking-wider bg-gray-800/50 rounded-xl border border-purple-700/20 mb-2">
          <div className="tracking-wider flex p-3 items-center">
            <div className="tracking-wider w-16 h-24 rounded-lg overflow-hidden border-2 border-purple-700/20 shadow-md">
              <CoverImage {...coverImageProps} />
            </div>
            <div className="tracking-wider ml-3 flex-1">
              <h2 className="tracking-wider text-base font-bold text-white line-clamp-1">{mangaInfo.title}</h2>
              <div className="tracking-wider flex items-center mt-1.5 gap-1.5 flex-wrap">
                <span className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${mangaInfo.status === 'ongoing' ? 'bg-green-900/30 text-green-400 border border-green-700/20' : mangaInfo.status === 'completed' ? 'bg-blue-900/30 text-blue-400 border border-blue-700/20' :mangaInfo.status === 'hiatus' ? 'bg-gray-800/50 text-orange-400 border border-orange-700/20':mangaInfo.status === 'cancelled'?"bg-gray-800/50 text-red-400 border border-red-700/20" :'bg-gray-800/50 text-gray-400 border border-gray-700/20'}`}>
                  {mangaInfo.status.toUpperCase()}
                </span>
                <span className="tracking-wider px-1.5 py-0.5 text-xs bg-purple-900/30 text-purple-400 rounded-md font-medium border border-purple-700/20">{mangaInfo.year}</span>
                <span className="tracking-wider px-1.5 py-0.5 text-xs bg-yellow-900/20 text-yellow-300 rounded-md font-medium border capitalize border-yellow-700/20">{mangaInfo.contentRating}</span>
              </div>
            </div>
          </div>
          <MemoPageAndChapterNavigation
            pages={pages}
            setCurrentIndex={setCurrentIndex}
            panels={panels}
            chapterDropdownOpen={chapterDropdownOpen}
            chapterInfo={chapterInfo}
            currentIndex={currentIndex}
            dropdownRef={dropdownRef}
            filteredChapters={filteredChapters}
            goToChapter={goToChapter}
            goToFirstChapter={goToFirstChapter}
            goToLastChapter={goToLastChapter}
            goToNextChapter={goToNextChapter}
            goToPrevChapter={goToPrevChapter}
            hasNextChapter={hasNextChapter}
            hasPrevChapter={hasPrevChapter}
            searchQuery={searchQuery}
            setChapterDropdownOpen={setChapterDropdownOpen}
            setSearchQuery={setSearchQuery}
            setSortOrder={setSortOrder}
            sortOrder={sortOrder}
            {...iconProps}
          />
        </div>

        <MemoDifferentMetaDataChapter
          activeSection={activeSection}
          setActiveSection={setActiveSectionMemo}
          mangaInfo={mangaInfo}
          allChapters={allChapters}
          {...iconProps}
        />
      </div>
    </div>
  );
});
InfoSidebar.displayName = 'InfoSidebar';

export default InfoSidebar;