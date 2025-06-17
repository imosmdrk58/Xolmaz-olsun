'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useManga } from '../../providers/MangaContext';
import { BookOpen, Bookmark, Heart, History, Search, Star, Clock, Eye, Tag, Zap } from 'lucide-react';

// Compact Manga Card for Sidebar and History
const CompactMangaCard = ({ manga, onClick }) => (
  <div
    onClick={() => onClick(manga)}
    role="button"
    tabIndex={0}
    className="cursor-pointer w-24 flex-shrink-0 rounded-lg bg-slate-900/70 border border-slate-800/50 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all p-1.5 flex flex-col items-center group"
  >
    <div className="relative w-full h-28 rounded-md overflow-hidden">
      <img
        src={manga.coverImageUrl || '/placeholder.jpg'}
        alt={manga.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h4 className="text-[10px] font-semibold text-white truncate w-full text-center mt-1 group-hover:text-purple-200">
      {manga.title}
    </h4>
    {manga.rating?.rating?.bayesian && (
      <div className="flex items-center gap-1 text-amber-400 text-[9px] mt-0.5">
        <Star className="w-2.5 h-2.5 fill-current" />
        <span>{manga.rating.rating.bayesian.toFixed(1)}</span>
      </div>
    )}
  </div>
);

// Horizontal Scroll for History
const HorizontalScroll = ({ title, icon: Icon, items, onItemClick }) => (
  <section className="mb-4">
    <h3 className="flex items-center gap-1.5 text-white font-semibold text-sm mb-2">
      <Icon className="w-4 h-4 text-purple-400" />
      {title}
    </h3>
    <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
      {items.length > 0 ? (
        items.map((item, idx) => (
          <CompactMangaCard key={idx} manga={item.manga || item} onClick={onItemClick} />
        ))
      ) : (
        <p className="text-slate-500 text-xs italic">No items available.</p>
      )}
    </div>
  </section>
);

// Main Manga Card
const MangaCard = ({ manga, onClick }) => {
  const tags = manga.flatTags?.slice(0, 2) || [];
  const chapterCount = manga.latestUploadedChapter ? parseInt(manga.latestUploadedChapter) : 'N/A';
  const author = manga.authorName?.[0]?.attributes?.name || 'Unknown';

  return (
    <div
      onClick={() => onClick(manga)}
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-xl bg-slate-900/80 border border-slate-800/50 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20 transition-all p-3 flex gap-3 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity" />
      <img
        src={manga.coverImageUrl || '/placeholder.jpg'}
        alt={manga.title}
        className="w-20 h-28 rounded-md object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <h2 className="text-white font-bold text-sm truncate">{manga.title}</h2>
        <p className="text-slate-400 text-xs line-clamp-2 mt-1">{manga.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-[9px] px-1 bg-purple-500/10 text-purple-400 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 flex-wrap">
          {manga.rating?.rating?.bayesian && (
            <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-1.5 rounded">
              <Star className="w-3 h-3 fill-current" />
              {manga.rating.rating.bayesian.toFixed(1)}
            </span>
          )}
          {manga.status && (
            <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-1.5 rounded">
              <Zap className="w-3 h-3" />
              {manga.status}
            </span>
          )}
          <span className="flex items-center gap-1 bg-slate-700/10 px-1.5 rounded">
            <BookOpen className="w-3 h-3" />
            {chapterCount} ch
          </span>
          <span className="flex items-center gap-1 bg-slate-700/10 px-1.5 rounded">
            <Tag className="w-3 h-3" />
            {author}
          </span>
        </div>
      </div>
    </div>
  );
}
// Search History Item
const SearchItem = ({ query, onClick }) => (
  <button
    onClick={() => onClick(query)}
    className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/50 hover:bg-slate-800/80 hover:border-purple-500/40 transition-all text-xs text-white truncate w-full text-left group"
    title={query}
  >
    <Search className="w-3 h-3 text-purple-400 flex-shrink-0" />
    <span className="truncate group-hover:text-purple-200">{query}</span>
    <Clock className="w-3 h-3 text-slate-500 ml-auto group-hover:text-purple-400" />
  </button>
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
          <BookOpen className="w-6 h-6 animate-pulse" />
          <span className="text-sm">Loading library...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-white relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-950 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto relative z-10">
        <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Manga Library
        </h1>

        {selectedManga ? (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              Currently Reading
            </h2>
            <MangaCard manga={selectedManga} onClick={handleMangaClick} />
          </section>
        ) : (
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/50 mb-6 text-center">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No manga currently selected.</p>
          </div>
        )}

        <HorizontalScroll
          title={`Reading History (${readHistory.length})`}
          icon={History}
          items={readHistory.sort((a, b) => b.lastReadAT.getTime() - a.lastReadAT.getTime())}
          onItemClick={handleMangaClick}
        />

        <section>
          <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-purple-400" />
            Search History
          </h2>
          {searchHistory.length > 0 ? (
            <div className="grid gap-1.5 max-h-48 overflow-y-auto rounded-lg border border-slate-800/50 bg-slate-900/60 p-2">
              {searchHistory.map((query, idx) => (
                <SearchItem key={idx} query={query} onClick={handleSearchClick} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No search history available.</p>
          )}
        </section>
      </main>

      {/* Sidebar */}
      <aside className="w-64 bg-slate-950/90 backdrop-blur-md border-l border-slate-800/50 p-4 flex flex-col gap-4 overflow-y-auto relative z-10">
        <section>
          <h3 className="flex items-center gap-1.5 text-white font-semibold text-sm mb-2">
            <Bookmark className="w-4 h-4 text-blue-400" />
            Bookmarks ({bookmarks.length})
          </h3>
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {bookmarks
                .sort((a, b) => b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime())
                .map((bookmark, idx) => (
                  <CompactMangaCard key={idx} manga={bookmark.manga} onClick={handleMangaClick} />
                ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No bookmarks yet.</p>
          )}
        </section>

        <section>
          <h3 className="flex items-center gap-1.5 text-white font-semibold text-sm mb-2">
            <Heart className="w-4 h-4 text-red-400" />
            Favorites ({favorites.length})
          </h3>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {favorites.map((fav, idx) => (
                <CompactMangaCard key={idx} manga={fav.mangaInfo} onClick={handleMangaClick} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No favorites yet.</p>
          )}
        </section>
      </aside>
    </div>
  );
};

export default Library;
