import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  Eye,
  ChevronDown,
  Search,
  RotateCcw,
  ArrowUpDown,
  History,
  CheckCircle,
  Languages,
  BookOpen,
  BarChart2,
  Clock,
  Flag,
  Bookmark,
  List,
  X,
  Filter,
  Grid2X2,
  ScrollText,
} from 'lucide-react';
import { langFullNames } from '../../constants/Flags';
import { useManga } from '../../providers/MangaContext';
import ChapterListSkeleton from '../Skeletons/MangaChapters/ChapterListSkeleton';

const StableFlag = lazy(() => import('../StableFlag'));

const FlagFallback = () => (
  <div className="w-6 h-6 rounded-full bg-gray-700 animate-pulse" />
);

const MemoizedStableFlag = React.memo(({ code, className }) => (
  <Suspense fallback={<FlagFallback />}>
    <StableFlag code={code} className={className} />
  </Suspense>
));
const ChapterList = ({ chapters, handleChapterClick, manga }) => {
  const { getAllFromReadHistory } = useManga();
  const [readingHistory, setReadingHistory] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showHistory, setShowHistory] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const history = getAllFromReadHistory();
    setReadingHistory(history);
  }, [getAllFromReadHistory]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(dateString);
  };

  const availableLanguages = useMemo(() => {
    const langs = new Set();
    chapters.forEach((ch) => {
      if (ch.translatedLanguage) langs.add(ch.translatedLanguage);
    });
    return Array.from(langs).sort();
  }, [chapters]);

  const isChapterRead = (chapterId) =>
    readingHistory.some((item) => item.chapters.some((i) => i.id === chapterId));

  const getLastReadTime = (chapterId) => {
    const item = readingHistory.find((i) => i.chapterId === chapterId);
    return item ? item.lastReadAt : null;
  };

  const processedChapters = useMemo(() => {
    const grouped = {};

    const filtered = chapters.filter((ch) =>
      selectedLanguage === 'all' ? true : ch.translatedLanguage === selectedLanguage
    );

    filtered.forEach((ch) => {
      if (!grouped[ch.chapter]) {
        grouped[ch.chapter] = { chapter: ch.chapter, translations: [] };
      }
      grouped[ch.chapter].translations.push(ch);
    });

    let result = Object.values(grouped);

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (grp) =>
          grp.chapter.toString().includes(lower) ||
          grp.translations.some((t) =>
            t.title?.toLowerCase().includes(lower)
          )
      );
    }

    result.sort((a, b) => {
      const aNum = parseFloat(a.chapter);
      const bNum = parseFloat(b.chapter);
      return sortOrder === 'desc' ? bNum - aNum : aNum - bNum;
    });

    return result;
  }, [chapters, selectedLanguage, searchTerm, sortOrder]);

  const totalChapters = useMemo(() => {
    const unique = new Set(chapters.map((ch) => ch.chapter));
    return unique.size;
  }, [chapters]);

  const hasActiveFilters =
    searchTerm.trim() !== '' || selectedLanguage !== 'all' || sortOrder !== 'desc';

  const toggleChapter = (chapterNum) => {
    setActiveChapter((prev) => (prev === chapterNum ? null : chapterNum));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSortOrder('desc');
    setActiveChapter(null);
  };

  const readChapters = useMemo(() => {
    const currentMangaHistory = readingHistory.find((h) => h.manga.id === manga.id);
    return currentMangaHistory ? currentMangaHistory.chapters : [];
  }, [readingHistory, manga.id]);

  const progressPercentage = totalChapters
    ? (readChapters.length / totalChapters) * 100
    : 0;

  // Get the last 3 read chapters for the compact history view
  const recentReadChapters = useMemo(() => {
    return [...readChapters]
      .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
      .slice(0, 3);
  }, [readChapters]);

  if (!chapters.length > 0 || !manga) {
    return <ChapterListSkeleton />;
  }

  return (
    <Suspense fallback={<ChapterListSkeleton />}>
      <div className="min-h-fit md:mt-5 flex gap-3 pl-0   md:flex-row-reverse text-gray-100 font-sans py-6 w-full">
        <div className="w-full flex flex-col">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br bg-white/20 shadow-lg flex items-center justify-center flex-shrink-0">
                <ScrollText className="w-5 h-5 md:w-7 md:h-7 " />
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400/70 text-white font-semibold flex items-center justify-center text-xs shadow-md"
                  aria-label={`${totalChapters} total chapters`}
                >
                  {totalChapters}
                </span>
              </div>
              <div className="max-w-sm md:max-w-3xl min-w-0 flex flex-col">
                <h1
                  className="text-base md:text-3xl font-extrabold text-wrap line-clamp-1  text-white truncate"
                  title={manga?.title || 'Chapter Vault'}
                >
                  {manga?.title || 'Chapter Vault'}
                </h1>
                <div className="w-full flex flex-row justify-start items-center gap-3 mt-1 min-w-0">
                  <p className="text-gray-400 text-[10px] md:text-xs font-medium truncate">
                    {readChapters.length} / {totalChapters} chapters read (
                    {Math.round(progressPercentage)}%)
                  </p>
                  <div
                    className="relative flex-1 h-2 rounded-full bg-gray-800 shadow-inner"
                    aria-label="Reading progress"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progressPercentage)}
                    tabIndex={0}
                    title={`${Math.round(progressPercentage)}% chapters read`}
                  >
                    <div
                      className="h-2 rounded-full bg-gray-300 transition-all duration-500 ease-in-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:flex gap-4 flex-wrap hidden justify-center flex-shrink-0">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className={`flex  items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-base transition-colors focus:outline-none ${showHistory
                  ? 'backdrop-blur-md bg-white/5 border  border-white/20 text-white shadow-lg'
                  : 'bg-black/5 border border-white/20 text-white '
                  }`}
                aria-pressed={showHistory}
                aria-label="Toggle reading history panel"
                type="button"
              >
                <History className="w-6 h-6" />
                History
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`md:flex items-center hidden justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors focus:outline-none ${showGrid
                  ? 'bg-black/5 border border-white/20 text-white'
                  : ' backdrop-blur-md bg-white/5 border  border-white/20 text-white shadow-lg'
                  }`}
                aria-pressed={showGrid}
                aria-label="Toggle grid or list view"
                type="button"
              >
                {showGrid ? (
                  <Grid2X2 className="w-5 h-5" />
                ) : (
                  <List className="w-5 h-5" />
                )}
              </button>
            </div>
          </header>

          {/* Mobile History Toggle */}
          {readChapters.length > 0 && (
            <div className="sm:hidden ">
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                className={`w-full flex items-center justify-between p-2 bg-gray-850 rounded-lg ${showHistory ? "rounded-b-none" : "mb-3"} border border-gray-700  transition`}
                aria-expanded={showHistory}
                aria-label="Toggle recent chapters"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium text-sm">Recently Read</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''
                    }`}
                />
              </button>
            </div>
          )}
          {/* Mobile Recent Chapters Dropdown */}
          {showHistory && (
            <div className="sm:hidden backdrop-blur-md bg-white/5 relative mb-3 bg-gray-850 rounded-lg rounded-t-none border border-t-0 border-gray-700 overflow-hidden">
              <ul className="divide-y divide-gray-700 overflow-y-auto max-h-[110px]">
                {recentReadChapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      onClick={() => handleChapterClick(chapter, manga)}
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-800 transition text-left"
                      aria-label={`Continue reading chapter ${chapter.chapter}`}
                      type="button"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        {chapter.chapter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-xs truncate">
                          {chapter.title || `Chapter ${chapter.chapter}`}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <span>{getRelativeTime(chapter.lastReadAt)}</span>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-yellow-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!showFilters && (
            <div className="sm:hidden mb-3">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="w-full flex items-center justify-between p-2 bg-gray-850 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                aria-expanded={showFilters}
                aria-label="Toggle recent chapters"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium text-sm">Show Filters</span>
                </div>
              </button>
            </div>
          )}

          {/* Mobile Filter Options*/}
          {showFilters && (
            <section className="p-1.5 backdrop-blur-md bg-white/5 relative px-3.5 sm:hidden pb-4 mb-1.5 bg-gray-850 w-full rounded-xl border border-gray-700 shadow-lg">
              <div className="relative"></div>
              <button onClick={() => setShowFilters((prev) => !prev)} className='absolute bg-white/20 rounded-full p-1 -top-1 -right-2'><X className='w-3 h-3' /></button>
              <div className="grid grid-cols-1 gap-1.5">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold text-white flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-yellow-400" />
                    Filters
                  </h2>
                  <button
                    onClick={resetFilters}
                    disabled={!hasActiveFilters}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-lg font-semibold text-xs transition-colors focus:outline-none ${hasActiveFilters
                      ? 'bg-rose-600/60 text-white border-red-500 hover:bg-rose-700/60 shadow-lg'
                      : 'bg-gray-700 border-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    aria-disabled={!hasActiveFilters}
                    aria-label="Reset filters"
                    type="button"
                  >
                    Reset
                  </button>
                </div>
                <div className="flex flex-row gap-2.5">
                  <div className="space-y-1.5 w-1/2">
                    <label
                      htmlFor="search-input"
                      className="block text-xs font-medium text-gray-300"
                    >
                      Search Chapters
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-yellow-400" />
                      <input
                        id="search-input"
                        type="search"
                        placeholder="Chapter number or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 rounded-lg py-1.5 pl-9 pr-3 text-white placeholder-gray-500 focus:outline-none  transition text-xs"
                        aria-label="Search chapters"
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 w-1/2">
                    <label
                      htmlFor="language-select"
                      className="block text-xs font-medium text-gray-300"
                    >
                      Language
                    </label>
                    <div className="relative">
                      <Languages className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-yellow-400" />
                      <select
                        id="language-select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full bg-gray-800 rounded-lg py-1.5 pl-9 pr-7 text-white cursor-pointer focus:outline-none  transition appearance-none text-xs"
                        aria-label="Filter by language"
                      >
                        <option value="all">All Languages</option>
                        {availableLanguages.map((lang) => (
                          <option key={lang} value={lang}>
                            {langFullNames[lang] || lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Sort Order
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${sortOrder === 'desc'
                        ? 'bg-yellow-400 text-gray-900 shadow-sm'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      aria-pressed={sortOrder === 'desc'}
                      aria-label="Sort newest first"
                      type="button"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      Newest
                    </button>
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${sortOrder === 'asc'
                        ? 'bg-yellow-400 text-gray-900 shadow-sm'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      aria-pressed={sortOrder === 'asc'}
                      aria-label="Sort oldest first"
                      type="button"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      Oldest
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )
          }
          <div className="flex flex-col md:flex-row gap-6 flex-1 h-fit overflow-hidden">
            {/* Chapters List */}
            <section className="w-full">
              {processedChapters.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 px-4">
                  <Search className="w-12 h-12 mb-4 text-purple-500" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No chapters found
                  </h3>
                  <p className="text-gray-400 max-w-md">
                    {hasActiveFilters
                      ? 'Try adjusting your filters or search terms.'
                      : 'There are currently no chapters available for this manga.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition"
                      aria-label="Reset filters"
                      type="button"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
                  }}
                  className={`gap-x-2.5 ${showGrid ? 'grid grid-cols-2' : 'flex flex-col gap-2 md:gap-3'} max-h-[280px]  md:max-h-[480px] overflow-y-scroll md:pr-2`}
                >
                  {processedChapters.map((group) => {
                    const hasReadTranslations = group.translations.some((t) =>
                      isChapterRead(t.id)
                    );
                    const lastReadTranslation = group.translations.find((t) =>
                      isChapterRead(t.id)
                    );
                    const isActive = activeChapter === group.chapter;

                    return (
                      <article
                        key={group.chapter}
                        className={`relative h-fit  col-span-1 rounded-xl border border-gray-700 overflow-visible ${isActive
                            ? 'border border-purple-400/50 rounded-b-none bg-black/20 ring-yellow-400 shadow-lg'
                            : 'hover:border-gray-600 backdrop-blur-md bg-white/5'
                          }`}
                      >
                        <button
                          className={`w-full flex items-center justify-between ${showGrid ? 'p-5 sm:p-6' : 'p-2 sm:p-4'
                            } text-left`}
                          onClick={() => toggleChapter(group.chapter)}
                          aria-expanded={isActive}
                          aria-controls={`chapter-${group.chapter}-content`}
                          type="button"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div
                              className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-base sm:text-lg transition-colors flex-shrink-0 ${hasReadTranslations
                                  ? 'bg-purple-400 text-gray-900 shadow-md'
                                  : 'bg-gray-800 text-white'
                                }`}
                            >
                              {group.chapter}
                              {hasReadTranslations && (
                                <CheckCircle className="absolute -top-1.5 -right-1.5 w-4 sm:w-5 h-4 sm:h-5 p-0.5 bg-gray-900 rounded-full text-emerald-400 border border-gray-700" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-semibold text-white truncate text-sm sm:text-base">
                                {group.translations[0]?.title
                                  ? `Chapter ${group.chapter}: ${group.translations[0].title}`
                                  : `Chapter ${group.chapter}`}
                              </h3>
                              <div className="flex items-center gap-2.5 sm:gap-3 text-[0.7rem] sm:text-xs text-gray-400 mt-1 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <List className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                                  {group.translations.length} version
                                  {group.translations.length !== 1 && 's'}
                                </span>
                                {hasReadTranslations && lastReadTranslation && (
                                  <span className="flex items-center gap-1 text-yellow-400">
                                    <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                                    Read{' '}
                                    {getRelativeTime(
                                      getLastReadTime(lastReadTranslation.id)
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className=' flex items-center flex-row gap-3'>
                            <div className="hidden sm:flex items-center">
                              {group.translations.slice(0, 3).map((translation, idx) => (
                                <div key={idx} className="-ml-1 first:ml-0">
                                  {translation.translatedLanguage && (
                                    <div className="ring-2 ring-gray-800 rounded-full">
                                      <Suspense fallback={<FlagFallback />}>
                                        <StableFlag
                                          code={translation.translatedLanguage}
                                          className="h-6 w-6 rounded-full"
                                        />
                                      </Suspense>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {group.translations.length > 3 && (
                                <span className="text-xs text-gray-400 ml-2">
                                  +{group.translations.length - 3}
                                </span>
                              )}
                            </div>
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition ${isActive
                                ? 'bg-white/80 text-gray-900'
                                : 'bg-gray-800 text-gray-400'
                                }`}
                            >
                              <ChevronDown
                                className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform ${isActive ? 'rotate-180' : ''
                                  }`}
                              />
                            </div>
                          </div>
                        </button>

                        {isActive && (
                          <div
                            id={`chapter-${group.chapter}-content`}
                            className="absolute left-0 right-0 top-full -ml-[0.5px] w-[100.2%] z-10 bg-black/20 backdrop-blur-3xl rounded-b-xl border border-purple-400/50 border-t-0"
                          >
                            <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2">
                              {group.translations.map((translation) => {
                                const isRead = isChapterRead(translation.id);
                                const lastReadAt = getLastReadTime(translation.id);

                                return (
                                  <button
                                    key={translation.id}
                                    onClick={() =>
                                      handleChapterClick(translation, manga)
                                    }
                                    className={`w-full flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg transition ${isRead ? 'bg-purple-800/40' : 'bg-gray-900 '
                                      }`}
                                    aria-label={`Read ${langFullNames[
                                      translation.translatedLanguage
                                      ] || translation.translatedLanguage
                                      } version`}
                                    type="button"
                                  >
                                    <div className="flex-shrink-0">
                                      <Suspense fallback={<FlagFallback />}>
                                        <StableFlag
                                          code={translation.translatedLanguage}
                                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg"
                                        />
                                      </Suspense>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium flex justify-start text-white text-xs sm:text-sm truncate">
                                        {langFullNames[
                                          translation.translatedLanguage
                                        ] || translation.translatedLanguage}
                                      </div>
                                      <div className="flex items-center gap-2.5 sm:gap-3 text-[0.7rem] sm:text-xs text-gray-400 mt-1 flex-wrap">
                                        <span>{translation.pageCount || '?'} pages</span>
                                        <span>•</span>
                                        <span>{getRelativeTime(translation.publishAt)}</span>
                                        {isRead && lastReadAt && (
                                          <>
                                            <span>•</span>
                                            <span className="text-yellow-400 truncate">
                                              Last read {getRelativeTime(lastReadAt)}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

              )}
            </section>
          </div>
        </div>

        <div className="hidden md:flex flex-col w-full max-w-[320px] ml-3">
          {/* Filters Panel */}
          <section className="p-4 pb-6 mb-2 backdrop-blur-md bg-white/5 bg-gray-850 w-full rounded-xl border border-gray-700 shadow-lg">
            <div className="relative"></div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-yellow-400" />
                  Filters
                </h2>
                <button
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-semibold text-xs transition-colors focus:outline-none ${hasActiveFilters
                    ? 'bg-rose-600/60 text-white border-red-500 hover:bg-rose-700/60 shadow-lg'
                    : 'bg-gray-700 border-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  aria-disabled={!hasActiveFilters}
                  aria-label="Reset filters"
                  type="button"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="search-input"
                  className="block text-sm font-medium text-gray-300"
                >
                  Search Chapters
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <input
                    id="search-input"
                    type="search"
                    placeholder="Chapter number or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none  transition text-sm"
                    aria-label="Search chapters"
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="language-select"
                  className="block text-sm font-medium text-gray-300"
                >
                  Language
                </label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <select
                    id="language-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-8 text-white cursor-pointer focus:outline-none  transition appearance-none text-sm"
                    aria-label="Filter by language"
                  >
                    <option value="all">All Languages</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {langFullNames[lang] || lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Sort Order
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder('desc')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${sortOrder === 'desc'
                      ? 'bg-yellow-400 text-gray-900 shadow-sm'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    aria-pressed={sortOrder === 'desc'}
                    aria-label="Sort newest first"
                    type="button"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Newest
                  </button>
                  <button
                    onClick={() => setSortOrder('asc')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${sortOrder === 'asc'
                      ? 'bg-yellow-400 text-gray-900 shadow-sm'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    aria-pressed={sortOrder === 'asc'}
                    aria-label="Sort oldest first"
                    type="button"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Oldest
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Reading History - Desktop */}
          {showHistory && (
            <aside
              className="hidden backdrop-blur-md bg-white/5 md:block mb-2 w-full bg-gray-850 rounded-xl border border-gray-700 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800"
              aria-label="Reading history"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-yellow-400" />
                  Reading History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition"
                  aria-label="Hide history"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {readChapters.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-500">No reading history yet</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Start reading to track your progress
                  </p>
                </div>
              ) : (
                <ul
                  style={{
                    scrollbarWidth: 'none',
                    scrollbarColor:
                      'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
                  }}
                  className="space-y-2 max-h-[140px] overflow-y-auto"
                >
                  {readChapters
                    .sort(
                      (a, b) =>
                        new Date(b.lastReadAt) - new Date(a.lastReadAt)
                    )
                    .map((chapter) => (
                      <li key={chapter.id}>
                        <button
                          onClick={() => handleChapterClick(chapter, manga)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition text-left"
                          aria-label={`Continue reading chapter ${chapter.chapter}`}
                          type="button"
                        >
                          <div className="w-12 h-12 rounded-lg  bg-gray-800  flex items-center justify-center font-bold text-white text-lg shadow-sm flex-shrink-0">
                            {chapter.chapter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">
                              {chapter.title || `Chapter ${chapter.chapter}`}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                              <MemoizedStableFlag
                                code={chapter.translatedLanguage}
                                className="w-4 h-4 rounded-full"
                              />
                              <span>
                                {langFullNames[chapter.translatedLanguage] ||
                                  chapter.translatedLanguage}
                              </span>
                            </div>
                          </div>
                          <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </aside>
          )}

        </div>
      </div>
    </Suspense>
  );
};

export default ChapterList;