import { useState, useMemo, lazy, Suspense } from 'react';
import { Eye, ChevronDown, ChevronRight, List } from 'lucide-react';
import { langFullNames } from '../../constants/Flags';

// Use Suspense for lazy loaded components
const StableFlag = lazy(() => import('../StableFlag'));

// Fallback component for StableFlag
const FlagFallback = () => (
  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 animate-pulse"></div>
);

const ChapterList = ({ chapters, handleChapterClick, manga }) => {
  const [activeChapter, setActiveChapter] = useState(null);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Process chapters - using useMemo for performance
  const groupedChapters = useMemo(() => {
    const grouped = {};

    chapters.forEach((chapter) => {
      const chapterNum = chapter.chapter;
      if (!grouped[chapterNum]) {
        grouped[chapterNum] = {
          chapter: chapterNum,
          translations: [],
        };
      }

      grouped[chapterNum].translations.push({
        id: chapter.id,
        chapter: chapterNum,
        title: chapter.title,
        pageCount: chapter.pageCount,
        translatedLanguage: chapter.translatedLanguage,
        publishAt: chapter.publishAt,
        readableAt: chapter.readableAt,
        externalUrl: chapter.externalUrl,
        url: chapter.url,
      });
    });

    return Object.values(grouped).sort(
      (a, b) => parseFloat(b.chapter) - parseFloat(a.chapter)
    );
  }, [chapters]);

  const toggleChapter = (chapterNum) => {
    setActiveChapter(activeChapter === chapterNum ? null : chapterNum);
  };

  // Get relative time for better UX
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

  return (
    <div className="w-full">
      <div className="rounded-xl p-0 sm:p-4 md:p-6">
        {/* Header Section - Mobile Responsive */}
        <div className="mb-3 sm:mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 rounded-lg p-2 sm:pl-6 shadow-lg border border-purple-500/10 bg-gray-800/50">
            {/* Latest Chapters Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <List
                  className="size-6 sm:size-10 text-purple-500 drop-shadow-md transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight bg-clip-text bg-gradient-to-r from-purple-500 to-yellow-500">
                Chapter Vault
              </h1>
            </div>

            {/* Chapter Stats - Mobile Friendly */}
            <div className="flex items-center w-full sm:w-auto justify-around sm:justify-normal gap-4 sm:gap-6 bg-gray-800/50 rounded-md px-3 sm:px-5 py-2 sm:py-3 shadow-md border border-gray-700/30">
              <div className="text-center">
                <span className="block text-xs sm:text-sm text-gray-400 font-medium">
                  Available
                </span>
                <span className="text-lg sm:text-xl font-semibold text-white">
                  {groupedChapters.length}
                </span>
              </div>
              <div className="w-px h-6 sm:h-8 bg-purple-500/50"></div>
              <div className="text-center">
                <span className="block text-xs sm:text-sm text-gray-400 font-medium">
                  Total
                </span>
                <span className="text-lg sm:text-xl font-semibold text-yellow-500">
                  {groupedChapters.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Grid - Responsive for all devices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {groupedChapters.map((groupedChapter) => (
            <div key={groupedChapter.chapter} className="w-full cursor-pointer">
              <div
                className={`${
                  activeChapter === groupedChapter.chapter
                    ? "sm:absolute sm:w-[90%] md:w-[45%] z-40 bg-gray-900"
                    : "relative bg-gray-800/50"
                } rounded-lg p-1 px-2 sm:px-3 border border-gray-700 transition-all duration-200 hover:border-purple-500 hover:bg-gray-750 overflow-hidden`}
              >
                {/* Chapter Header - Mobile Optimized */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => toggleChapter(groupedChapter.chapter)}
                >
                  <div
                    className={`absolute top-0 left-0 my-2 sm:my-2 rounded-full h-[85%] w-1 ${
                      activeChapter === groupedChapter.chapter
                        ? "bg-purple-400"
                        : "bg-gray-700"
                    }`}
                  ></div>

                  <div className="ml-1 p-2 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold ${
                          activeChapter === groupedChapter.chapter
                            ? "bg-purple-900 text-white"
                            : "bg-[#0c0221] text-gray-200"
                        }`}
                      >
                        {groupedChapter.chapter}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-xl font-bold text-white">
                          Chapter {groupedChapter.chapter}
                        </h3>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <span className="text-gray-400">
                            {groupedChapter.translations.length} Translation{groupedChapter.translations.length !== 1 ? 's' : ''}
                          </span>
                          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                          <span className="text-yellow-400">Read Now</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Language flag preview - Hide on very small screens */}
                      <div className="hidden sm:flex items-center">
                        {groupedChapter.translations.slice(0, 3).map((translation, idx) => (
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
                        {groupedChapter.translations.length > 3 && (
                          <span className="text-xs text-gray-400 ml-2">
                            +{groupedChapter.translations.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Expand/collapse indicator */}
                      <div
                        className={`flex items-center p-1 justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                          activeChapter === groupedChapter.chapter
                            ? "bg-purple-900"
                            : "bg-gray-700"
                        }`}
                      >
                        {activeChapter === groupedChapter.chapter ? (
                          <ChevronDown size={14} className="sm:size-16 text-white" />
                        ) : (
                          <ChevronRight size={14} className="sm:size-16 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Translations Panel - Mobile Responsive */}
                {activeChapter === groupedChapter.chapter && (
                  <div
                    className="border-t border-gray-800 p-2 sm:p-4 rounded-lg"
                    style={{ background: "rgba(18, 18, 18, 0.2)" }}
                  >
                    <div className="flex flex-col w-full gap-2 sm:gap-3">
                      {groupedChapter.translations.map((translation) => (
                        <div
                          key={translation.id}
                          onClick={() => handleChapterClick(translation, manga)}
                          className="flex items-center justify-between rounded-lg p-2 sm:p-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 cursor-pointer transition-all duration-200 hover:border-purple-500"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            {translation.translatedLanguage && (
                              <div className="rounded-lg bg-black bg-opacity-30 p-1">
                                <Suspense fallback={<FlagFallback />}>
                                  <StableFlag
                                    code={translation.translatedLanguage}
                                    className="h-6 w-6 sm:h-8 sm:w-8 rounded shadow"
                                  />
                                </Suspense>
                              </div>
                            )}

                            <div>
                              <div className="text-white font-semibold text-xs sm:text-base">
                                {langFullNames[translation.translatedLanguage] ||
                                  translation.translatedLanguage}
                              </div>
                              <div className="flex items-center text-xs gap-1 sm:gap-2">
                                <span className="text-gray-400 text-[10px] sm:text-xs">
                                  {translation.pageCount
                                    ? `${translation.pageCount} pages`
                                    : "Pages unknown"}
                                </span>

                                {translation.publishAt && (
                                  <>
                                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                                    <span className="text-yellow-500 text-[10px] sm:text-xs">
                                      {getRelativeTime(translation.publishAt)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-[10px] sm:text-xs bg-gray-900 bg-opacity-40 text-gray-200 px-1 sm:px-2 py-1 rounded">
                              {translation.translatedLanguage.toUpperCase()}
                            </span>

                            <div className="w-6 h-6 p-2 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gray-900/50 transform hover:scale-110 transition-transform">
                              <Eye size={14} className="sm:size-16 text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hover Indicator */}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 bg-purple-900 transform scale-x-0 hover:scale-x-100 transition-transform duration-200 origin-left"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterList;