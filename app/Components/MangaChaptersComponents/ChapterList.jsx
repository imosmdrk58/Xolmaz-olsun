import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  Eye,
  ChevronDown,
  Search,
  RotateCcw,
  ArrowUpDown,
  Filter,
  History,
  CheckCircle,
  Languages,
  BookOpen,
} from 'lucide-react';
import { langFullNames } from '../../constants/Flags';
import { useManga } from '../../providers/MangaContext';

const StableFlag = lazy(() => import('../StableFlag'));

const FlagFallback = () => (
  <div className="w-6 h-6 rounded-full bg-gray-700 animate-pulse" />
);

const ChapterList = ({ chapters, handleChapterClick, manga }) => {
  const { getAllFromReadHistory } = useManga();
  const [readingHistory, setReadingHistory] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showHistory, setShowHistory] = useState(true);

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
    readingHistory.some((item) => item.chapterId === chapterId);

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
  console.log(readChapters)
  const progressPercentage = totalChapters ? (readChapters.length / totalChapters) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans flex flex-col px-4 sm:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-800 to-purple-900 shadow-md flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-gray-100" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 text-gray-900 font-semibold flex items-center justify-center text-xs animate-pulse">
              {totalChapters}
            </span>
          </div>
          <div className='w-full'>
            <h1
              className="text-2xl font-semibold text-white max-w-lg truncate"
              title={manga?.title || 'Chapter Vault'}
            >
              {manga?.title || 'Chapter Vault'}
            </h1>
            {/* <p className="text-gray-400 text-sm mt-0.5">
              {processedChapters.length} of {totalChapters} chapters available
            </p> */}
            <div className="mt-4 flex flex-row gap-3 justify-center items-center w-full">
              <label htmlFor="progress-bar" className="sr-only">
                Reading Progress
              </label>
              <div className="w-2/3 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  id="progress-bar"
                  role="progressbar"
                  aria-valuenow={Math.round(progressPercentage)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  className="bg-purple-600 h-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 ">
                {readChapters?.length} of {totalChapters} chapters read ({Math.round(progressPercentage)}%)
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${showHistory
                ? 'bg-yellow-400 text-gray-900 shadow-sm'
                : 'bg-purple-800 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            aria-pressed={showHistory}
            aria-label="Toggle reading history panel"
          >
            <History className="w-4 h-4" />
            History
          </button>
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${hasActiveFilters
                ? 'bg-yellow-600 text-gray-900 hover:bg-yellow-700 shadow-sm'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            aria-disabled={!hasActiveFilters}
            aria-label="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <section className="p-4 bg-gray-850 rounded-lg border border-purple-700/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
          <input
            type="search"
            placeholder="Search chapters by number or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 rounded-md py-2.5 pl-10 pr-4 text-yellow-400 placeholder-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition text-sm"
            aria-label="Search chapters"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-end text-sm">
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
            }
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-purple-800 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label={`Sort chapters ${sortOrder === 'desc' ? 'ascending' : 'descending'
              }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>

          <div className="relative">
            <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gray-800 rounded-md py-2.5 pl-10 pr-6 text-yellow-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition appearance-none text-sm"
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
      </section>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* Reading History */}
        {showHistory && (
          <aside className="md:w-80 bg-gray-850 rounded-lg border border-purple-700/30 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800">
            <h2 className="text-yellow-400 font-semibold text-lg mb-4 select-none flex items-center gap-2">
              <History className="w-5 h-5" />
              Reading History
            </h2>
            {readingHistory.length === 0 ? (
              <p className="text-purple-600 italic text-sm">No reading history yet.</p>
            ) : (
              <ul className="space-y-3 relative w-full h-fit">
                {readChapters.map((chapter) => {
                  return (
                    <li
                      key={chapter.id}
                      className="flex items-center gap-3 cursor-pointer rounded-md p-2 bg-gray-800/70 hover:bg-yellow-400/20 transition text-sm"
                    onClick={()=>{}}
                      tabIndex={0}
                      aria-label={`Go to chapter ${chapter.chapter} - ${chapter.title || ''}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center font-semibold text-yellow-400 text-base select-none shadow-sm">
                        {chapter.chapter}
                      </div>
                      <div className="flex flex-col truncate">
                        <span
                          className="text-white truncate"
                          title={chapter.title || `Chapter ${chapter.chapter}`}
                        >
                          {chapter.title || `Chapter ${chapter.chapter}`}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        )}

        {/* Chapters List */}
        <section className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800">
          {processedChapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-purple-600 select-none py-20">
              <Search className="w-16 h-16 mb-4 animate-pulse" />
              <p className="text-xl font-semibold mb-1">No chapters found</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-4">
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
                    id={`chapter-${group.chapter}`}
                    className={`relative rounded-lg border border-purple-700/30 bg-gray-850/90 backdrop-blur-sm shadow-sm transition-transform duration-200 ${isActive ? 'scale-[1.02] shadow-yellow-400/40 border-yellow-400 z-10' : ''
                      }`}
                  >
                    {/* Header */}
                    <header
                      className="flex items-center justify-between cursor-pointer p-4 select-none"
                      onClick={() => toggleChapter(group.chapter)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleChapter(group.chapter);
                        }
                      }}
                      aria-expanded={isActive}
                      aria-controls={`translations-panel-${group.chapter}`}
                    >
                      <div className="flex items-center gap-6">
                        {/* Chapter Number */}
                        <div
                          className={`flex items-center justify-center w-14 h-14 rounded-lg font-semibold text-lg transition-colors duration-300 select-none ${hasReadTranslations
                              ? 'bg-yellow-400 text-gray-900 shadow-sm'
                              : 'bg-purple-800 text-yellow-400 shadow-sm'
                            }`}
                          aria-label={`Chapter ${group.chapter}`}
                        >
                          {group.chapter}
                          {hasReadTranslations && (
                            <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 bg-gray-900 rounded-full" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col max-w-xl">
                          <h3
                            className={`text-white font-semibold text-base truncate ${hasReadTranslations ? 'text-yellow-400' : ''
                              }`}
                            title={`Chapter ${group.chapter}`}
                          >
                            {`Chapter ${group.chapter}`}
                            {group.translations[0]?.title
                              ? `: ${group.translations[0].title}`
                              : ''}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Languages className="w-4 h-4" />
                              <span>
                                {group.translations.length}{' '}
                                {group.translations.length === 1
                                  ? 'version'
                                  : 'versions'}
                              </span>
                            </div>
                            {hasReadTranslations && lastReadTranslation && (
                              <div className="flex items-center gap-1 text-yellow-400">
                                <Eye className="w-4 h-4" />
                                <span>
                                  Read {getRelativeTime(getLastReadTime(lastReadTranslation.id))}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${isActive
                            ? 'bg-yellow-400 text-gray-900 shadow-sm'
                            : 'bg-purple-800 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900'
                          }`}
                        aria-hidden="true"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                    </header>

                    {/* Translations Panel */}
                    {isActive && (
                      <div
                        id={`translations-panel-${group.chapter}`}
                        className="border-t border-yellow-400/30 bg-gray-900/90 backdrop-blur-sm rounded-b-lg"
                      >
                        <div className="p-4 space-y-4">
                          {group.translations.map((translation) => {
                            const isRead = isChapterRead(translation.id);
                            const lastReadAt = getLastReadTime(translation.id);

                            return (
                              <button
                                key={translation.id}
                                onClick={() => handleChapterClick(translation, manga)}
                                className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isRead
                                    ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20'
                                    : 'bg-gray-800 border-gray-700 text-white hover:bg-purple-900'
                                  }`}
                                type="button"
                                aria-label={`Read chapter ${translation.chapter} in ${langFullNames[translation.translatedLanguage] ||
                                  translation.translatedLanguage
                                  }`}
                              >
                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                                  <Suspense fallback={<FlagFallback />}>
                                    <StableFlag
                                      code={translation.translatedLanguage}
                                      className="w-full h-full"
                                    />
                                  </Suspense>
                                </div>
                                <div className="flex flex-col text-left truncate">
                                  <span className="font-semibold truncate text-sm">
                                    {langFullNames[translation.translatedLanguage] ||
                                      translation.translatedLanguage}
                                  </span>
                                  <div className="flex items-center gap-3 text-xs text-gray-400 truncate">
                                    <span>{translation.pageCount || '?'} pages</span>
                                    <span>•</span>
                                    <span>{getRelativeTime(translation.publishAt)}</span>
                                    {isRead && lastReadAt && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-yellow-400">
                                          <CheckCircle className="w-4 h-4" />
                                          Read {getRelativeTime(lastReadAt)}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <Eye className="w-5 h-5 flex-shrink-0" />
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
  );
};

export default ChapterList;