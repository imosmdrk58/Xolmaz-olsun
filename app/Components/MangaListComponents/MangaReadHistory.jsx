import React, { useState, useEffect, useCallback } from 'react';
import { useManga } from '../../providers/MangaContext';
import { History, BookOpen, ChevronDown, ChevronUp, Clock, PlayCircle, TrendingUp, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function MangaReadHistory() {
    const { getAllFromReadHistory, addToReadHistory, setChapterListForManga } = useManga();
    const [readHistory, setReadHistory] = useState([]);
    const router = useRouter();
    const [shownMangasInHistory, setShownMangasInHistory] = useState(2);
    const [isExpanded, setIsExpanded] = useState(false);
    const { setSelectedManga } = useManga();

    useEffect(() => {
        const history = getAllFromReadHistory();
        setReadHistory(history || []);
    }, [getAllFromReadHistory]);

    const handleMangaCoverImageClicked = useCallback((manga) => {
        setSelectedManga(manga);
        router.push(`/manga/${manga.id}/chapters`);
    }, [router, setSelectedManga]);

    const handleChapterClicked = useCallback(
        (manga, chapter, allChaptersList) => {
            setChapterListForManga(manga.id, allChaptersList);
            addToReadHistory(manga, chapter, allChaptersList);
            router.push(`/manga/${manga.id}/chapter/${chapter.id}/read`);
        },
        [router, setChapterListForManga, addToReadHistory]
    );

    const handleToggleExpand = () => {
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        setShownMangasInHistory(newExpanded ? readHistory.length : 2);
    };

    // Calculate reading progress for a manga
    const calculateProgress = (item) => {
        if (!item.allChaptersList || !item.chapters || item.allChaptersList.length === 0) {
            return { percentage: 0, current: 0, total: 0 };
        }

        const totalChapters = item.allChaptersList.length;
        const currentChapter = item.chapters[0]?.chapter || 0;
        const percentage = Math.min((currentChapter / totalChapters) * 100, 100);

        return {
            percentage: Math.round(percentage),
            current: currentChapter,
            total: totalChapters
        };
    };

    console.log(readHistory)
    return (
        <div className="w-[100% -12px] ml-2 px-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-9">
                <div className="flex items-center gap-3">
                    <div className="relative p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm border border-purple-500/20">
                        <History className="w-5 h-5 text-purple-400" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            READ HISTORY
                        </h2>
                        {readHistory.length > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {readHistory.length} manga in your history
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => router.push('/history')}
                    className="group relative text-sm px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white transition-all duration-200 backdrop-blur-sm overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        View All
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {readHistory.length === 0 ? (
                    <div className="flex flex-col items-center ml-2 mt-11 justify-center py-16 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/30 backdrop-blur-sm relative overflow-hidden">
                        {/* Background decoration */}

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/20 shadow-lg">
                                <BookOpen className="w-10 h-10 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-200 mb-3">No Reading History Yet</h3>
                            <p className="text-gray-400 text-center text-sm max-w-sm leading-relaxed mb-4">
                                Start your manga journey and build your personalized reading history
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Track your progress automatically</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {readHistory.sort((item1,item2)=>new Date(item2.lastReadAT)-new Date(item1.lastReadAT)).slice(0, shownMangasInHistory).map((item, index) => {
                                const progress = calculateProgress(item);
                                return (
                                    <div
                                        key={item.manga.id}
                                        className="group relative bg-gradient-to-r from-gray-900/60 to-gray-800/40 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        {/* Background gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative flex items-center p-4 gap-4">
                                            {/* Manga Cover */}
                                            <div
                                                onClick={() => handleMangaCoverImageClicked(item.manga)}
                                                className="relative cursor-pointer group/cover flex-shrink-0"
                                            >
                                                <div className="relative w-16 h-20 rounded-lg overflow-hidden border-2 border-gray-600/50 group-hover/cover:border-purple-500/50 transition-colors duration-200 shadow-lg">
                                                    <Image
                                                        width={64}
                                                        height={80}
                                                        src={item.manga.coverImageUrl}
                                                        alt={item.manga.title}
                                                        className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0zMiA0MEwyOCAzNkwyOCA0NEwzMiA0MFoiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                        <PlayCircle className="w-6 h-6 text-white/80" />
                                                    </div>
                                                </div>

                                                {/* Progress indicator on cover */}
                                                {progress.percentage > 0 && (
                                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                                        <span className="font-bold text-white text-[8px]">
                                                            {progress.percentage}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Manga Info */}
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div>
                                                    <h3
                                                        onClick={() => handleMangaCoverImageClicked(item.manga)}
                                                        className="font-semibold text-white text-sm mb-1 line-clamp-1 cursor-pointer hover:text-purple-300 transition-colors duration-200"
                                                    >
                                                        {item.manga.title}
                                                    </h3>

                                                    {/* Last Read Chapter */}
                                                    {item.chapters?.slice(0, 1).map((chapter) => (
                                                        <div
                                                            key={chapter.id}
                                                            onClick={() => handleChapterClicked(item.manga, chapter, item.allChaptersList)}
                                                            className="flex items-center gap-2 cursor-pointer group/chapter mb-2"
                                                        >
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover/chapter:text-purple-300 transition-colors duration-200">
                                                                <Clock className="w-3 h-3" />
                                                                <span>Chapter {chapter.chapter}</span>
                                                            </div>
                                                            <div className="w-1 h-1 bg-gray-600 rounded-full" />
                                                            <span className="text-xs text-gray-500">
                                                                {(() => {
                                                                    const readableAt = new Date(item.lastReadAT);
                                                                    const now = new Date();
                                                                    const diffInMs = now - readableAt;
                                                                    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                                                                    const diffInMonths = Math.floor(diffInDays / 30);
                                                                    const diffInYears = Math.floor(diffInDays / 365);
                                                                    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                                                                    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                                                                    const diffInSeconds = Math.floor(diffInMs / 1000);

                                                                    if (diffInYears >= 1) {
                                                                        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
                                                                    } else if (diffInMonths >= 1) {
                                                                        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
                                                                    } else if (diffInDays >= 1) {
                                                                        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                                                                    } else if (diffInHours >= 1) {
                                                                        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                                                                    } else if (diffInMinutes >= 1) {
                                                                        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
                                                                    } else {
                                                                        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
                                                                    }
                                                                })()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-400">
                                                            Progress: {progress.current}/{progress.total} chapters
                                                        </span>
                                                        <span className="text-purple-400 font-medium">
                                                            {progress.percentage}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out relative"
                                                            style={{ width: `${progress.percentage}%` }}
                                                        >
                                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chapter Action Button */}
                                            <div className="flex-shrink-0">
                                                {item.chapters?.slice(0, 1).map((chapter) => (
                                                    <button
                                                        key={chapter.id}
                                                        onClick={() => handleChapterClicked(item.manga, chapter, item.allChaptersList)}
                                                        className="group/btn relative px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300 hover:text-white transition-all duration-200 backdrop-blur-sm overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-200" />
                                                        <span className="relative flex items-center gap-1.5">
                                                            <PlayCircle className="w-3.5 h-3.5" />
                                                            Continue
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Expand/Collapse Button */}
                        {readHistory.length > 2 && (
                            <button
                                onClick={handleToggleExpand}
                                className="w-full flex items-center justify-center gap-2 pt-2.5 text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 rounded-lg transition-all duration-200"
                            >
                                {isExpanded ? (
                                    <>
                                        <ChevronUp className="w-4 h-4" />
                                        <span>Show less</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4" />
                                        <span>Show more</span>
                                    </>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default MangaReadHistory;