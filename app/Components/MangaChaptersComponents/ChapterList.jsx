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
  LibraryBig,
  Earth,
  Library,
  ArrowUpDown,
  CheckCircle,
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
  console.log(manga)
  // States
  const [readingHistory, setReadingHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('descending');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [expandedVolumes, setExpandedVolumes] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});

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
      const matchesSearch = term === '' || chapterStr.includes(term) || titleStr.includes(term);
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
    const map = {};
    sortedChapters.forEach((ch) => {
      const vol = ch.volume ?? 'No Volume';
      const chap = ch.chapter ?? 'No Chapter';
      if (!map[vol]) map[vol] = [];
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
    const sortedVols = vols
      .filter((v) => v !== 'No Volume')
      .sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        return aNum - bNum;
      });
    if (vols.includes('No Volume')) sortedVols.push('No Volume');
    if (sortOrder === 'ascending') return sortedVols.reverse();
    return sortedVols;
  }, [chaptersByVolume, sortOrder]);

  // Reading history for current manga
  const readChapters = useMemo(() => {
    const currentMangaHistory = readingHistory.find((h) => h.manga?.id === manga.id);
    return currentMangaHistory ? currentMangaHistory.chapters : [];
  }, [readingHistory, manga.id]);

  useEffect(() => {
    const initialVolumes = {};
    uniqueVolumes.forEach((vol) => {
      initialVolumes[vol] = true;
    });
    setExpandedVolumes(initialVolumes);

    const initialChapters = {};
    uniqueVolumes.forEach((vol) => {
      const chapterGroups = chaptersByVolume[vol] || [];
      chapterGroups.forEach((group) => {
        initialChapters[group.chapter] = true;
      });
    });
    setExpandedChapters(initialChapters);
  }, [uniqueVolumes, chaptersByVolume]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSortOrder('descending');
  };

  // Toggle volume accordion
  const toggleVolume = (volume) => {
    setExpandedVolumes((prev) => ({
      ...prev,
      [volume]: !prev[volume],
    }));
  };

  // Toggle chapter accordion
  const toggleChapter = (chapter) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapter]: !prev[chapter],
    }));
  };

  return (
    <div className="flex flex-col w-full relative md:flex-row gap-6 text-white font-sans">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 z-10 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <input
                type="search"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-600/30 rounded px-8  py-2 text-white flex justify-center cursor-pointer focus:outline-none text-base"
                aria-label="Search chapters"
                spellCheck={false}
              />
            </div>

            <div className="relative">
              <Languages className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-600/30 rounded px-8 pt-1.5 pb-2.5 text-white flex justify-center cursor-pointer focus:outline-none text-base"
                aria-label="Filter by language"
              >
                <option value="all">All Languages</option>
                {availableLanguages.map((lang, index) => (
                  <option
                    key={index}
                    value={lang}
                    className="bg-black text-white "
                    style={{ backgroundColor: 'black', color: 'white' }}
                  >
                    {langFullNames[lang] || lang}
                    =                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-gray-600/30 rounded px-8 pt-1.5 pb-2.5 text-white flex justify-center cursor-pointer focus:outline-none text-base"
                aria-label="Sort order"
              >
                <option value="descending">Newest First</option>
                <option value="ascending">Oldest First</option>
              </select>
            </div>
            <button
              onClick={resetFilters}
              disabled={searchTerm === '' && selectedLanguage === 'all' && sortOrder === 'descending'}
              className={`px-3 py-2 rounded text-sm font-semibold transition ${searchTerm !== '' || selectedLanguage !== 'all' || sortOrder !== 'descending'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              aria-disabled={searchTerm === '' && selectedLanguage === 'all' && sortOrder === 'descending'}
            >
              Reset Filters
            </button>
          </div>

          <button
            onClick={() => setShowHistory((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition ${showHistory ? 'bg-yellow-400 text-gray-900 shadow' : 'bg-gray-800 text-white'
              }`}
            aria-pressed={showHistory}
            aria-label="Toggle reading history panel"
            type="button"
          >
            <History className="w-5 h-5" />
            History
            <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
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
                  .map((chapter, index) => (
                    <li key={index}>
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
                            <span>{langFullNames[chapter.translatedLanguage] || chapter.translatedLanguage}</span>
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
        <div style={{ scrollbarWidth: "none" }}
          className="space-y-4 max-h-[1200px] overflow-auto pb-12 sm:space-y-6">
          {/* Volumes and chapters */}
          {uniqueVolumes.map((volume, index) => {
            const chapterGroups = chaptersByVolume[volume] || [];
            const isVolumeExpanded = expandedVolumes[volume];

            return (
              <div key={index}>
                <button
                  onClick={() => toggleVolume(volume)}
                  className="w-full flex justify-between items-center py-4"
                  aria-expanded={isVolumeExpanded}
                  aria-label={`Toggle Volume ${volume}`}
                >
                  <h3 className="text-white text-lg font-semibold flex justify-start items-center gap-3"><LibraryBig className='w-5 h-6' />Volume {volume}</h3>
                  <div className="flex items-center gap-4 mr-32">
                    <span className="text-white text-lg">
                      Ch. {chapterGroups[0]?.chapter} - {chapterGroups[chapterGroups.length - 1]?.chapter}
                    </span>

                  </div>
                  <div className="flex items-center">
                    <span className="text-white text-lg mr-2">{chapterGroups.length}</span>
                    <ChevronDown
                      className={`w-6 h-6 text-white transition-transform ${isVolumeExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>
                {isVolumeExpanded && (
                  <div className="">
                    {chapterGroups.map((group, index) => {
                      const isChapterExpanded = expandedChapters[group.chapter];
                      return (
                        <div key={index} className="mb-4  bg-gray-500/5 backdrop-blur-3xl rounded">
                          <div className="w-full flex  justify-between items-center">
                            <button
                              onClick={() => toggleChapter(group.chapter)}
                              className="flex-1  text-left"
                              aria-expanded={isChapterExpanded}
                              aria-label={`Toggle Chapter ${group.chapter}`}
                            >
                              <div className="text-white  flex flex-row justify-between rounded-lg  font-semibold  mb-3">
                                <div className='bg-gray-600/10 rounded-lg pl-0 w-full flex flex-row justify-between items-center '>
                                  <div className=' w-14 h-full rounded-l-lg bg-gray-400/5 backdrop-blur-md flex justify-center items-center'> <Library className=' w-5 h-5 text-yellow-400 ' /></div>
                                  <span className=' flex flex-row justify-start items-center gap-2 py-3 '>Chapter {group.chapter}</span>
                                  <span className=' flex flex-row justify-start items-center gap-2 mr-3'><Earth className=' w-5 h-5 ' /> {group.chapters.length}</span>
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => toggleChapter(group.chapter)}
                              className="ml-5 px-4 py-3 -mt-2 h-full flex justify-center items-center bg-gray-600/20 rounded-lg"
                              aria-hidden="true"
                            >
                              <ChevronDown
                                className={`w-6 h-6  transition-transform ${isChapterExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>
                          {isChapterExpanded && (
                            <div className="flex flex-row h-fit">
                              <div className="ml-5 w-1   mb-[51px] bg-gray-700 rounded-3xl"> </div>
                              <div className="space-y-2 w-full pr-5 pl-4 pb-3">
                                {group.chapters.map((chapter, index) => {
                                  const isRead = readChapters.some((c) => c.id === chapter.id);
                                  return (
                                    <div
                                      key={index}
                                      className={`relative p-4 py-3 backdrop-blur-sm w-full rounded-lg  border border-white/30 cursor-pointer ${isRead ? ' bg-purple-900/20 ' : 'bg-black/20 '
                                        }`}
                                      onClick={() => handleChapterClick(chapter)}
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          handleChapterClick(chapter.id);
                                        }
                                      }}
                                    >
                                      {isRead &&<CheckCircle strokeWidth={3} className="absolute -left-1 -top-1 text-emerald-400 w-5 h-5 "/>}
                                      <div className="absolute -left-5 top-1/2 w-5 h-1 bg-gray-700"> </div>
                                      <div className="flex items-start justify-between">
                                        <div className=' flex flex-col justify-start'>
                                        <div className="flex items-start space-x-3">
                                          <MemoizedStableFlag code={chapter.translatedLanguage} className="w-6 h-6" />
                                          <div>
                                            <h4 className="text-white font-bold text-sm mb-2 truncate capitalize">{chapter.title}</h4>
                                          </div>
                                        </div>
                                        <div className="flex items-center ml-3 space-x-4 text-sm">
                                              <div className="flex items-center space-x-2">
                                                <Users className="w-4 h-4 text-white" />
                                                <span className="text-white">
                                                  {chapter.relationships.scanlationGroupIds ? 'Scanlations Group' : 'Unknown'}
                                                </span>
                                              </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start w-fit flex-row justify-start gap-4">
                                          <div className="flex items-start w-fit flex-col justify-start gap-4">
                                            <div className="flex items-center space-x-1">
                                              <Clock className="w-4 h-4 text-white" />
                                              <span className="text-white text-xs">
                                                {chapter.publishAt
                                                  ? new Date(chapter.publishAt).toLocaleDateString()
                                                  : 'Unknown Date'}
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                              <User className="w-4 h-4 text-white" />
                                              <span className="text-[#2ecc71] truncate max-w-xs text-sm">
                                                {Array.isArray(manga.creatorName) ? manga.creatorName?.[0]?.attributes.username : manga.creatorName || 'Unknown'}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-start w-fit flex-col justify-start gap-4">
                                            <div className="flex items-center space-x-1">
                                              <Layers className="w-4 h-4 text-white" />
                                              <span className="text-white text-sm">{chapter.pageCount}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                              <GitFork className="w-4 h-4 text-white" />
                                              <span className="text-white text-xs">V{chapter.version}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div >
  );
};

export default ChapterListWithFilters;