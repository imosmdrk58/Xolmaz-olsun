'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useManga } from '../../providers/MangaContext';
import {
  BookOpen,
  Bookmark,
  Heart,
  History,
  Search,
  Star,
  Clock,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
  Zap,
  RotateCw,
  Clock5
} from 'lucide-react';
import ReadingHistorySlider from "../../Components/LibraryComponents/ReadHistorySlider"


// Manga Card for Favorites and Bookmarks
const DetailMangaCard = ({ item, onClick, type }) => {
  const manga = item.manga || item.mangaInfo;
  const chapterCount = manga.latestUploadedChapter ? parseInt(manga.latestUploadedChapter) : 'N/A';

  return (
    <div
      onClick={() => onClick(manga)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(manga)}
      className="bg-slate-900/90 border border-slate-700/30 rounded-xl p-2.5 cursor-pointer hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/20 transition-all duration-200 group"
    >
      <div className="relative w-full h-24 rounded-lg overflow-hidden">
        <img
          src={manga.coverImageUrl || '/placeholder.jpg'}
          alt={manga.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>
      <div className="mt-2">
        <h4 className="text-white text-xs font-semibold truncate group-hover:text-purple-300">{manga.title}</h4>
        <div className="flex gap-1 flex-wrap mt-1">
          {manga.flatTags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[9px] px-1 bg-purple-500/10 text-purple-400 rounded">
              {tag}
            </span>
          ))}
        </div>
        {manga.rating?.rating?.bayesian && (
          <div className="text-amber-400 text-[10px] mt-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" aria-hidden="true" />
            <span>{manga.rating.rating.bayesian.toFixed(1)}</span>
          </div>
        )}
        <div className="text-slate-400 text-[10px] mt-1 flex items-center gap-1">
          <BookOpen className="w-3 h-3" aria-hidden="true" />
          <span>{chapterCount} ch</span>
        </div>
        {type === 'bookmark' && item.bookmarkedAt && (
          <div className="text-slate-500 text-[10px] mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>{new Date(item.bookmarkedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Currently Reading Card (Sidebar)
const CurrentReadingCard = ({ manga, readHistory, onClick }) => {
  if (!manga) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-3 text-center text-slate-400 text-xs">
        No manga currently selected
      </div>
    );
  }

  const mangaHistory = readHistory.find((h) => h.manga?.id === manga.id);
  const readChapters = mangaHistory?.readChapters || [];
  const progress = manga.totalChapters > 0 ? (readChapters.length / manga.totalChapters) * 100 : 0;

  return (
    <div
      onClick={() => onClick(manga)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(manga)}
      className="bg-slate-900/90 border border-slate-700/30 rounded-xl p-3 cursor-pointer hover:border-purple-500/40 hover:shadow-sm hover:shadow-purple-500/20 transition-all duration-200"
    >
      <div className="flex gap-3">
        <img
          src={manga.coverImageUrl || '/placeholder.jpg'}
          alt={manga.title}
          className="w-16 h-24 rounded-lg object-cover"
          loading="lazy"
        />
        <div className="flex-1">
          <h4 className="text-white text-xs font-semibold truncate">{manga.title}</h4>
          <p className="text-slate-400 text-[10px] line-clamp-2 mt-1">{manga.description}</p>
          <div className="mt-2 w-full h-1.5 bg-slate-700/50 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
              aria-label={`Progress: ${Math.round(progress)}%`}
            />
          </div>
          <div className="text-slate-400 text-[10px] mt-1">
            {readChapters.length}/{manga.totalChapters || 'N/A'} ch
          </div>
        </div>
      </div>
    </div>
  );
};

// Search History Item (Sidebar)
const SearchItem = ({ query, onClick }) => (
  <button
    onClick={() => onClick(query)}
    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:bg-purple-500/10 hover:border-purple-500/30 text-xs text-white truncate w-full text-left transition-all duration-200"
    title={query}
    aria-label={`Search for ${query}`}
  >
    <Search className="w-4 h-4 text-purple-400" aria-hidden="true" />
    <span className="truncate flex-1">{query}</span>
    <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
  </button>
);

// Reading History Item (Sidebar)
const ReadingHistoryItem = ({ item, index, onClick }) => {
  const manga = item.manga;
  const lastChapter = item.lastChapterRead;

  return (
    <div
      onClick={() => onClick(manga)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(manga)}
      className="flex gap-2 py-2 border-b border-slate-700/20 last:border-0 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer"
    >
      <span className="text-purple-400 text-xs font-bold w-6 text-right">{index + 1}.</span>
      <div className="flex-1">
        <h4 className="text-white text-xs font-semibold truncate">{manga.title}</h4>
        {lastChapter && (
          <div className="text-slate-400 text-[10px] mt-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" aria-hidden="true" />
            <span>Ch. {lastChapter.chapter}</span>
          </div>
        )}
        <div className="text-slate-500 text-[10px] mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" aria-hidden="true" />
          <span>{new Date(item.lastReadAT).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};



// Favorites Section
const FavoritesSection = ({ items, onItemClick }) => (
  <section className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
    <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
      <Heart className="w-5 h-5 text-purple-400" aria-hidden="true" />
      Favorites ({items.length})
    </h2>
    {items.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.slice(0, 6).map((item, idx) => (
          <DetailMangaCard key={idx} item={item} onClick={onItemClick} type="favorite" />
        ))}
      </div>
    ) : (
      <p className="text-slate-400 text-sm italic">No favorites yet.</p>
    )}
  </section>
);

// Bookmarks Section
const BookmarksSection = ({ items, onItemClick }) => (
  <section className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
    <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
      <Bookmark className="w-5 h-5 text-purple-400" aria-hidden="true" />
      Bookmarks ({items.length})
    </h2>
    {items.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items
          .sort((a, b) => b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime())
          .slice(0, 6)
          .map((item, idx) => (
            <DetailMangaCard key={idx} item={item} onClick={onItemClick} type="bookmark" />
          ))}
      </div>
    ) : (
      <p className="text-slate-400 text-sm italic">No bookmarks yet.</p>
    )}
  </section>
);

// Sidebar
const Sidebar = ({ selectedManga, readHistory, searchHistory, onMangaClick, onSearchClick }) => (
  <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 h-[calc(100vh-2rem)] sticky top-4 space-y-4">
    {/* Currently Reading */}
    <div>
      <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
        <Eye className="w-4 h-4 text-purple-400" aria-hidden="true" />
        Currently Reading
      </h3>
      <CurrentReadingCard manga={selectedManga} readHistory={readHistory} onClick={onMangaClick} />
    </div>

    {/* Search History */}
    <div>
      <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-purple-400" aria-hidden="true" />
        Search History ({searchHistory.length})
      </h3>
      {searchHistory.length > 0 ? (
        <div className="grid gap-2 max-h-32 overflow-y-auto">
          {searchHistory.slice(0, 4).map((query, idx) => (
            <SearchItem key={idx} query={query} onClick={onSearchClick} />
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-xs italic">No search history yet.</p>
      )}
    </div>

    {/* Reading History */}
    <div>
      <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
        <History className="w-4 h-4 text-purple-400" aria-hidden="true" />
        Recent Reads ({readHistory.length})
      </h3>
      {readHistory.length > 0 ? (
        <div className="max-h-48 overflow-y-auto">
          {readHistory
            .sort((a, b) => b.lastReadAT.getTime() - a.lastReadAT.getTime())
            .slice(0, 5)
            .map((item, idx) => (
              <ReadingHistoryItem key={idx} item={item} index={idx} onClick={onMangaClick} />
            ))}
        </div>
      ) : (
        <p className="text-slate-400 text-xs italic">No recent reads yet.</p>
      )}
    </div>
  </div>
);

const Library = () => {
  const router = useRouter();
  const { getSelectedManga, getAllFavorites, getAllBookMarks, getAllFromReadHistory } = useManga();
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const searches = Object.keys(localStorage)
        .filter((key) => key.startsWith('manga_search_'))
        .map((key) => key.replace('manga_search_', ''))
        .reverse();
      setSearchHistory(searches);
    } catch {
      setSearchHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMangaClick = useCallback((manga) => router.push(`/manga/${manga.id}/chapters`), [router]);
  const handleSearchClick = useCallback((query) => router.push(`/search?query=${encodeURIComponent(query)}`), [router]);

  const selectedManga = getSelectedManga();
  const favorites = Object.values(getAllFavorites());
  const bookmarks = getAllBookMarks();
  const readHistory = getAllFromReadHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex items-center gap-2 text-purple-400">
          <BookOpen className="w-6 h-6 animate-pulse" aria-hidden="true" />
          <span className="text-sm">Loading library...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white ">
      <div className=" w-full  gap-4">
        {/* Main Content */}
        <div className="w-full space-y-4">
          <div className='flex flex-row w-full'>
            <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-12 flex justify-center items-center relative">
              <div className="absolute left-0  w-[60vh] h-full flex justify-center items-center">
                <div className="flex flex-row w-fit -ml-4 -translate-x-1/3 text-nowrap py-5  h-full min-w-fit min-h-fit items-center px-24 gap-2   rounded-lg text-white text-4xl font-semibold transform rotate-[270deg] z-50">
                  <Clock className="w-8 h-8 text-purple-400" aria-hidden="true" />
                  Reading History
                </div>
              </div>
            </div>
            <ReadingHistorySlider readHistory={readHistory} handleMangaClick={handleMangaClick} />

          </div>
          <Sidebar
            selectedManga={selectedManga}
            readHistory={readHistory}
            searchHistory={searchHistory}
            onMangaClick={handleMangaClick}
            onSearchClick={handleSearchClick}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BookmarksSection items={bookmarks} onItemClick={handleMangaClick} />
            <FavoritesSection items={favorites} onItemClick={handleMangaClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;