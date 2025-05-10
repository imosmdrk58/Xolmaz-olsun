import React, { useState, useMemo, lazy } from 'react';
import { Clock, Eye, ChevronDown, ChevronRight, List } from 'lucide-react';
import StableFlag from '../StableFlag';
import { langFullNames } from '../../constants/Flags';

const MemoStableFlag = React.memo(lazy(() => import('../StableFlag')));

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
      <div className="rounded-xl p-6">
        {/* Header Section */}
        <div className="mb-5">
          <div className="flex flex-col bg-gray-800/50 md:flex-row justify-between items-center gap-6 rounded-lg p-2 pl-6 shadow-lg border border-purple-500/10">
            {/* Latest Chapters Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <List
                  size={36}
                  className="text-purple-500 drop-shadow-md transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight bg-clip-text bg-gradient-to-r from-purple-500 to-yellow-500">
                Chapter Vault
              </h1>
            </div>

            {/* Chapter Stats */}
            <div className="flex items-center gap-6 bg-gray-800/50 rounded-md px-5 py-3 shadow-md border border-gray-700/30">
              <div className="text-center">
                <span className="block text-sm text-gray-400 font-medium">
                  Available
                </span>
                <span className="text-xl font-semibold text-white">
                  {groupedChapters.length}
                </span>
              </div>
              <div className="w-px h-8 bg-purple-500/50"></div>
              <div className="text-center">
                <span className="block text-sm text-gray-400 font-medium">
                  Total
                </span>
                <span className="text-xl font-semibold text-yellow-500">
                  {groupedChapters.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
          {groupedChapters.map((groupedChapter) => (
            <div key={groupedChapter.chapter} className="groupedChapter w-full cursor-pointer">
              <div
                className={`${
                  activeChapter === groupedChapter.chapter
                    ? "absolute w-[45%] z-40 bg-gray-900"
                    : "relative bg-gray-800/50"
                } rounded-lg p-1 px-3 border border-gray-700 transition-all duration-200 hover:border-purple-500 hover:bg-gray-750 overflow-hidden`}
              >
                {/* Chapter Header */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => toggleChapter(groupedChapter.chapter)}
                >
                  <div
                    className={`absolute top-0 left-0 my-2 rounded-full h-[85%] w-1 ${
                      activeChapter === groupedChapter.chapter
                        ? "bg-purple-400"
                        : "bg-gray-700"
                    }`}
                  ></div>

                  <div className="ml-1 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${
                          activeChapter === groupedChapter.chapter
                            ? "bg-purple-900 text-white"
                            : "bg-[#0c0221] text-gray-200"
                        }`}
                      >
                        {groupedChapter.chapter}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Chapter {groupedChapter.chapter}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">
                            {groupedChapter.translations.length} Translations
                          </span>
                          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                          <span className="text-yellow-400">Read Now</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Language flag preview */}
                      <div className="hidden md:flex items-center">
                        {groupedChapter.translations.slice(0, 3).map((translation, idx) => (
                          <div key={idx} className="-ml-1 first:ml-0">
                            {translation.translatedLanguage && (
                              <div className="ring-2 ring-gray-800 rounded-full">
                                <StableFlag
                                  code={translation.translatedLanguage}
                                  className="h-6 w-6 rounded-full"
                                />
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
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          activeChapter === groupedChapter.chapter
                            ? "bg-purple-900"
                            : "bg-gray-700"
                        }`}
                      >
                        {activeChapter === groupedChapter.chapter ? (
                          <ChevronDown size={16} className="text-white" />
                        ) : (
                          <ChevronRight size={16} className="text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Translations Panel */}
                {activeChapter === groupedChapter.chapter && (
                  <div
                    className="border-t border-gray-800 p-4 rounded-lg"
                    style={{ background: "rgba(18, 18, 18, 0.2)" }}
                  >
                    <div className="flex flex-col w-full gap-3">
                      {groupedChapter.translations.map((translation) => (
                        <div
                          key={translation.id}
                          onClick={() => handleChapterClick(translation, manga)}
                          className="groupedChapter flex items-center justify-between rounded-lg p-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 cursor-pointer transition-all duration-200 hover:border-purple-500"
                        >
                          <div className="flex items-center gap-3">
                            {translation.translatedLanguage && (
                              <div className="rounded-lg bg-black bg-opacity-30 p-1">
                                <StableFlag
                                  code={translation.translatedLanguage}
                                  className="h-8 w-8 rounded shadow"
                                />
                              </div>
                            )}

                            <div>
                              <div className="text-white font-semibold">
                                {langFullNames[translation.translatedLanguage] ||
                                  translation.translatedLanguage}
                              </div>
                              <div className="flex items-center text-xs gap-2">
                                <span className="text-gray-400">
                                  {translation.pageCount
                                    ? `${translation.pageCount} pages`
                                    : "Pages unknown"}
                                </span>

                                {translation.publishAt && (
                                  <>
                                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                                    <span className="text-yellow-500">
                                      {getRelativeTime(translation.publishAt)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-900 bg-opacity-40 text-gray-200 px-2 py-1 rounded">
                              {translation.translatedLanguage.toUpperCase()}
                            </span>

                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900/50 transform groupedChapter-hover:scale-110 transition-transform">
                              <Eye size={16} className="text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hover Indicator */}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 bg-purple-900 transform scale-x-0 groupedChapter-hover:scale-x-100 transition-transform duration-200 origin-left"
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
