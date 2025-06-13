import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  Eye,
  Users,
  User,
  Clock,
  Star,
  Book,
  History,
  ChevronDown,
  Search,
  Languages,
  X,
  Layers,
  GitFork,
} from 'lucide-react';
import { langFullNames } from '../../constants/Flags';
import { useManga } from '../../providers/MangaContext';

const StableFlag = lazy(() => import('../StableFlag'));

const FlagFallback = () => (
  <div className="w-5 h-5 rounded-full bg-gray-700 animate-pulse" />
);

const MemoizedStableFlag = React.memo(({ code, className }) => (
  <Suspense fallback={<FlagFallback />}>
    <StableFlag code={code} className={className} />
  </Suspense>
));


const ChapterListWithFilters = ({ chapters, manga, handleChapterClick }) => {
  const { getAllFromReadHistory } = useManga();

  // States
  const [readingHistory, setReadingHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('descending');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showHistory, setShowHistory] = useState(false);

  // Load reading history once
  useEffect(() => {
    const history = getAllFromReadHistory();
    setReadingHistory(history);
  }, [getAllFromReadHistory]);

  // Available languages from chapters
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    chapters.forEach((ch) => {
      if (ch.translatedLanguage) langs.add(ch.translatedLanguage);
    });
    return Array.from(langs).sort();
  }, [chapters]);

  // Filter chapters by language and search term
  const filteredChapters = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return chapters.filter((ch) => {
      const matchesLang = selectedLanguage === 'all' || ch.translatedLanguage === selectedLanguage;

      const chapterStr = ch.chapter ? ch.chapter.toLowerCase() : '';
      const titleStr = ch.title ? ch.title.toLowerCase() : '';

      const matchesSearch =
        term === '' ||
        chapterStr.includes(term) ||
        titleStr.includes(term);

      return matchesLang && matchesSearch;
    });
  }, [chapters, selectedLanguage, searchTerm]);

  // Sort chapters by chapter number (handle non-numeric gracefully)
  const sortedChapters = useMemo(() => {
    return [...filteredChapters].sort((a, b) => {
      const aNum = parseFloat(a.chapter ?? '');
      const bNum = parseFloat(b.chapter ?? '');

      if (isNaN(aNum) && isNaN(bNum)) return 0;
      if (isNaN(aNum)) return 1;
      if (isNaN(bNum)) return -1;

      return sortOrder === 'descending' ? bNum - aNum : aNum - bNum;
    });
  }, [filteredChapters, sortOrder]);

  // Group chapters by volume (use volume string or 'No Volume')
  const chaptersByVolume = useMemo(() => {
    const map = {}
    sortedChapters.forEach((ch) => {
      const vol = ch.volume ?? 'No Volume';
      const chap = ch.chapter ?? 'No Chapter';

      if (!map[vol]) map[vol] = [];

      // Check if chapter group already exists for this chapter number
      const existingGroup = map[vol].find((group) => group.chapter === chap);

      if (existingGroup) {
        existingGroup.chapters.push(ch);
      } else {
        map[vol].push({
          chapter: chap,
          volume: ch.volume,
          chapters: [ch],
        });
      }
    });

    // Sort chapters inside each volume by chapter number (numeric if possible)
    Object.keys(map).forEach((vol) => {
      map[vol].sort((a, b) => {
        const aNum = parseFloat(a.chapter);
        const bNum = parseFloat(b.chapter);
        if (isNaN(aNum) || isNaN(bNum)) return a.chapter.localeCompare(b.chapter);
        return aNum - bNum;
      });
    });

    return map;
  }, [sortedChapters]);

  // Unique volumes sorted (put 'No Volume' last)
  const uniqueVolumes = useMemo(() => {
    const vols = Object.keys(chaptersByVolume);

    // Sort volumes numerically, with 'No Volume' last
    const sortedVols = vols.filter((v) => v !== 'No Volume').sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return aNum - bNum;
    });

    // Add 'No Volume' at the end if exists
    if (vols.includes('No Volume')) {
      sortedVols.push('No Volume');
    }

    // Reverse order if sortOrder is ascending (oldest first)
    if (sortOrder === 'ascending') {
      return sortedVols.reverse();
    }

    // Otherwise (descending), return as is (Volume 1 first)
    return sortedVols;
  }, [chaptersByVolume, sortOrder]);

  // Reading history for current manga
  const readChapters = useMemo(() => {
    const currentMangaHistory = readingHistory.find((h) => h.manga?.id === manga.id);
    return currentMangaHistory ? currentMangaHistory.chapters : [];
  }, [readingHistory, manga.id]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSortOrder('descending');
  };

  console.log(uniqueVolumes);
  console.log(chaptersByVolume);


  return (
    <div className="flex flex-col md:flex-row gap-6 text-white font-sans">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <input
                type="search"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 rounded px-8 py-2 text-white placeholder-gray-500 focus:outline-none text-sm"
                aria-label="Search chapters"
                spellCheck={false}
              />
            </div>

            <div className="relative">
              <Languages className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-800 rounded px-8 py-2 text-white cursor-pointer focus:outline-none text-sm"
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

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-800 rounded px-4 py-2 text-white cursor-pointer focus:outline-none text-sm"
              aria-label="Sort order"
            >
              <option value="descending">Newest First</option>
              <option value="ascending">Oldest First</option>
            </select>

            <button
              onClick={resetFilters}
              disabled={
                searchTerm === '' &&
                selectedLanguage === 'all' &&
                sortOrder === 'descending'
              }
              className={`px-3 py-2 rounded text-sm font-semibold transition ${searchTerm !== '' ||
                selectedLanguage !== 'all' ||
                sortOrder !== 'descending'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              aria-disabled={
                searchTerm === '' &&
                selectedLanguage === 'all' &&
                sortOrder === 'descending'
              }
            >
              Reset Filters
            </button>
          </div>

          <button
            onClick={() => setShowHistory((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition ${showHistory
              ? 'bg-yellow-400 text-gray-900 shadow'
              : 'bg-gray-800 text-white'
              }`}
            aria-pressed={showHistory}
            aria-label="Toggle reading history panel"
            type="button"
          >
            <History className="w-5 h-5" />
            History
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''
                }`}
            />
          </button>
        </div>

        {/* Reading History Panel */}
        {showHistory && (
          <aside
            className="hidden md:block w-full bg-gray-850 rounded-xl backdrop-blur-md bg-white/5 p-4 overflow-y-auto max-h-[600px]"
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
              <div className="text-center py-8 text-gray-400">
                No reading history yet. Start reading to track your progress.
              </div>
            ) : (
              <ul className="space-y-2">
                {readChapters
                  .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
                  .map((chapter) => (
                    <li key={chapter.id}>
                      <button
                        onClick={() => handleChapterClick(chapter.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition text-left"
                        aria-label={`Continue reading chapter ${chapter.chapter}`}
                        type="button"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-white text-lg shadow-sm flex-shrink-0">
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

        {/* Volumes and chapters */}
        {uniqueVolumes.map((volume) => {
          const chapterGroups = chaptersByVolume[volume] || [];

          return (
           <div key={volume}>
              <div className="flex justify-between items-center py-4">
                <h3 className="text-white text-lg font-semibold">Volume {volume}</h3>
                <span className="text-white text-lg">
                  Ch. {chapterGroups[0].chapter} -{chapterGroups[chapterGroups.length-1].chapter}
                </span>
                <div className="flex items-center">
                  <span className="text-white text-lg mr-1">{chapterGroups.length}</span>
                  <ChevronDown className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className=''>
                {chapterGroups.map((group) => (
                  <div key={group.chapter} className="mb-4 bg-white/5 backdrop-blur-md rounded ">
                    <div className=' w-full flex justify-between items-center'>
                    <h4 className="text-yellow-400 p-3 font-semibold mb-2">
                      Chapter {group.chapter}
                    </h4>
                    <button className=' mr-5'><ChevronDown className='w-6 h-6'/></button>
                    </div>
                    <div className='flex flex-row overflow-clip h-fit'>
                      <div className=" ml-5 mb-[53px] bg-gray-700 rounded-3xl ">&nbsp;</div>
                    <div className="space-y-2 w-full pr-5 pl-4 pb-5">
                      {group.chapters.map((chapter) => {
                        // Find if chapter is read
                        const isRead = readChapters.some((c) => c.id === chapter.id);
                        return (
                          <div
                            key={chapter.id}
                            className={`rounded relative p-4 w-full bg-black/5 border border-white/30 cursor-pointer ${isRead ? 'ring-2 ring-yellow-400' : ''
                              }`}
                            onClick={() => handleChapterClick(chapter.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleChapterClick(chapter.id);
                              }
                            }}
                          >
                             <div className="absolute -left-5 top-1/2 w-5 h-2 bg-gray-700  ">&nbsp;</div>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <MemoizedStableFlag
                                  code={chapter.translatedLanguage}
                                  className="w-8 h-8"
                                />
                                <div>
                                  <h4 className="text-white font-bold text-sm mb-2 truncate">
                                    {chapter.title}
                                  </h4>
                                  <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4 text-white" />
                                      <span className="text-white">{chapter.relationships.scanlationGroupIds ? "Scanlations Group" : "Unknown"}</span>
                                    </div>
                                    {/* <div className="flex items-center space-x-2">
                                      <User className="w-4 h-4 text-white" />
                                      <span className="text-[#2ecc71] truncate max-w-xs">
                                        {manga.creatorName?.[0]?.attributes.username || 'Unknown'}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4 text-white" />
                                      <span className="text-white">
                                        {chapter.publishAt
                                          ? new Date(chapter.publishAt).toLocaleDateString()
                                          : 'Unknown Date'}
                                      </span>
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start w-fit flex-row justify-start  gap-4">
                                <div className="flex items-start w-fit flex-col justify-start  gap-4">
                                                                <div className="flex items-center space-x-1">
                                   <Clock className="w-4 h-4 text-white" />
                                      <span className="text-white text-xs">
                                        {chapter.publishAt
                                          ? new Date(chapter.publishAt).toLocaleDateString()
                                          : 'Unknown Date'}
                                      </span>
                                </div>
                                <div className="flex items-center space-x-1 ">
                                  <User className="w-4 h-4 text-white" />
                                      <span className="text-[#2ecc71] truncate max-w-xs text-sm">
                                        {manga.creatorName?.[0]?.attributes.username || 'Unknown'}
                                      </span>
                                </div>

                              </div>
                              <div className="flex items-start w-fit flex-col justify-start  gap-4">
                                <div className="flex items-center space-x-1 ">
                                  <Layers className="w-4 h-4 text-white" />
                                  <span className="text-white text-sm">{chapter.pageCount}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GitFork className="w-4 h-4 text-white" />
                                  <span className="text-white text-xs">{chapter.version}</span>
                                </div>
                              </div>
                              </div>
                            </div>
                          </div>

                        )
                      })}
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterListWithFilters;