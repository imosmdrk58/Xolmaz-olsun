'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  X,
  SortAsc,
  TrendingUp,
  ArrowUpDown,
  List,
  Grid3x3,
  Clock5,
  ChevronRight,
  Tag,
  Filter,
} from 'lucide-react';

// Reading History Card (compact, darker)
const ReadingHistoryCard = ({ item, onClick }) => {
  const [showChapters, setShowChapters] = useState(false);
  const manga = item.manga;
  const progress = Math.round(
    (item.chapters.length / (item.allChaptersList.length || 1)) * 100
  );

  return (
    <div className="group relative bg-gradient-to-br from-gray-950/95 to-gray-900/90 backdrop-blur-md border border-gray-900 rounded-xl overflow-hidden hover:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-gray-850/30 to-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none" />

      <div className="relative flex gap-3 p-3">
        {/* Cover Image */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-28 rounded-lg overflow-hidden shadow-md ring-1 ring-gray-900/80">
            <img
              src={manga.coverImageUrl || '/placeholder.jpg'}
              alt={manga.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          </div>
          {/* Progress badge */}
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md border border-gray-800/70 select-none">
            <span className="relative z-10">{progress}%</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full opacity-50 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and Date */}
          <div className="flex items-start justify-between">
            <h3
              className="text-base font-semibold text-gray-100 cursor-pointer hover:text-gray-300 transition-colors line-clamp-2 leading-tight"
              onClick={() => onClick(manga)}
              title={manga.title}
            >
              {manga.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs bg-gray-900/70 px-2 py-0.5 rounded-full select-none">
              <Clock className="w-3 h-3" />
              <span>{new Date(item.lastReadAT).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-yellow-900/30 px-2 py-0.5 rounded-full border border-yellow-900/50 select-none">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-semibold text-xs">
                {manga?.rating?.rating?.bayesian?.toFixed(1) || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-900/50 select-none">
              <Users className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 font-semibold text-xs">
                {(manga?.rating?.follows / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="flex items-center gap-1 bg-green-900/30 px-2 py-0.5 rounded-full border border-green-900/50 select-none">
              <Bookmark className="w-3 h-3 text-green-400" />
              <span className="text-green-400 font-semibold text-xs">
                {manga?.rating?.comments?.repliesCount || 0}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {(manga.flatTags || ['Action', 'Adventure', 'Supernatural'])
              .slice(0, 4)
              .map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-gray-900/70 text-gray-400 text-[10px] font-medium rounded-full border border-gray-800 backdrop-blur-sm select-none"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

      </div>
      {/* Chapters Section */}
      <div className=" rounded-lg p-2  max-h-36 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-xs font-semibold text-gray-200 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-gray-400" />
            Recent Chapters ({item.chapters.length})
          </h4>
          {item.chapters.length > 2 && (
            <button
              onClick={() => setShowChapters(!showChapters)}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-300 text-xs font-medium transition-all hover:bg-gray-800/50 px-2 py-0.5 rounded-full"
              aria-label={showChapters ? 'Show Less' : 'Show All'}
            >
              {showChapters ? (
                <>
                  Show Less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Show All <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-1">
          {item.chapters
            .slice(0, showChapters ? item.chapters.length : 2)
            .map((chapter, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-1 bg-gray-950/90 hover:bg-gray-900/70 border border-gray-800 hover:border-gray-700 rounded-md transition-colors duration-200 cursor-default"
              >
                <div className="flex items-center gap-1">
                  <span className="bg-gray-900 text-gray-300 font-semibold text-[10px] px-1 py-0.5 rounded select-none">
                    Ch. {chapter.chapter}
                  </span>
                  <span className="text-gray-300 text-xs truncate max-w-[140px]">
                    {chapter.title}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// Filter Panel (darker)
const FilterPanel = ({ filters, onFiltersChange }) => {
  const genres = [
    'Action',
    'Romance',
    'Fantasy',
    'Comedy',
    'Drama',
    'Horror',
    'Slice of Life',
    'Supernatural',
    'Thriller',
    'Adventure',
    'Mystery',
    'Isekai',
  ];
  const statusOptions = [
    { value: 'all', label: 'All Status', icon: BookOpen },
    { value: 'ongoing', label: 'Ongoing', icon: Clock },
    { value: 'completed', label: 'Completed', icon: BookmarkCheck },
    { value: 'hiatus', label: 'On Hiatus', icon: Clock5 },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recently Read', icon: Clock },
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'title', label: 'Title A-Z', icon: SortAsc },
    { value: 'progress', label: 'Progress', icon: ArrowUpDown },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 backdrop-blur-md border border-gray-900 rounded-xl p-4 sticky top-6 shadow-lg max-h-[72vh] overflow-y-auto custom-scrollbar text-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1 bg-gray-900 rounded-md">
          <Filter className="w-4 h-4 text-gray-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-100">Filters</h2>
      </div>

      {/* Genre Filter */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
          <Tag className="w-3 h-3" />
          Genres
        </h3>
        <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto custom-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                const newGenres = filters.genre.includes(genre)
                  ? filters.genre.filter((g) => g !== genre)
                  : [...filters.genre, genre];
                onFiltersChange({ ...filters, genre: newGenres });
              }}
              className={`px-2 py-1 text-[10px] font-medium rounded-lg transition-all duration-300 ${filters.genre.includes(genre)
                  ? 'bg-gray-900 text-gray-100 shadow-inner scale-105'
                  : 'bg-gray-950 text-gray-500 hover:bg-gray-900 hover:text-gray-300'
                }`}
              aria-pressed={filters.genre.includes(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">Status</h3>
        <div className="space-y-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFiltersChange({ ...filters, status: option.value })}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs transition-all duration-300 ${filters.status === option.value
                  ? 'bg-gray-900 text-gray-100 border border-gray-800 shadow-inner'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
                }`}
              aria-pressed={filters.status === option.value}
            >
              <option.icon className="w-3 h-3" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">Sort By</h3>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFiltersChange({ ...filters, sort: option.value })}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs transition-all duration-300 ${filters.sort === option.value
                  ? 'bg-gray-900 text-gray-100 border border-gray-800 shadow-inner'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
                }`}
              aria-pressed={filters.sort === option.value}
            >
              <option.icon className="w-3 h-3" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFiltersChange({ genre: [], status: 'all', sort: 'recent' })}
        className="w-full p-2 bg-gray-950 hover:bg-red-900 text-gray-500 hover:text-red-400 rounded-lg transition-all flex items-center justify-center gap-1 border border-gray-900 hover:border-red-700 text-xs"
      >
        <X className="w-3 h-3" />
        Clear All Filters
      </button>
    </div>
  );
};

// Compact Card for Bookmarks/Favorites (darker)
const CompactMangaCard = ({ item, onClick, type }) => {
  const manga = item.manga || item.mangaInfo || item;
  const isChapter = type === 'favorite' && item.chapterInfo;

  return (
    <div
      onClick={() => onClick(manga)}
      className={`group  backdrop-blur-sm border border-gray-900 rounded-lg ${isChapter?"p-3 bg-gray-950/90":"p-0"}  cursor-pointer hover:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-sm`}      title={manga.title}
    >
      <div className={`flex gap-3 ${isChapter?"":"flex-col"}`}>
        <div className={`relative ${isChapter?"w-12 h-18":"w-full h-18"} rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-gray-900/80`}>
          <img
            src={manga.coverImageUrl || '/placeholder.jpg'}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          {/* Emphasize chapter info for favorites */}
          {isChapter ? (
            <>
              <div className="text-sm font-semibold text-gray-100 truncate">
                {item.chapterInfo[0]?.title || 'Chapter Title'}
              </div>
              <div className="text-xs text-gray-500 select-none">
                Ch. {item.chapterInfo[0]?.chapter}
              </div>
              <div className="text-xs text-gray-600 truncate max-w-full">
                Manga: <span className="text-gray-400">{manga.title}</span>
              </div>
            </>
          ) : (
            <h4 className="text-gray-100 mb-4 text-xs text-center font-semibold line-clamp-2 group-hover:text-gray-300 transition-colors">
              {manga.title}
            </h4>
          )}

         {isChapter &&  <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="font-medium">
                {manga.rating?.rating?.bayesian?.toFixed(1) || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-400" />
              <span className="font-medium">
                {manga.rating?.follows
                  ? `${(manga.rating.follows / 1000).toFixed(1)}K`
                  : '0'}
              </span>
            </div>
          </div>}

          {type === 'bookmark' && item.bookmarkedAt && (
            <div className="text-white bg-gray-950/90 rounded-lg p-2 flex-row justify-center text-xs flex items-center gap-1 select-none">
              <Calendar className="w-3 h-3" />
              <span>{new Date(item.bookmarkedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Right Sidebar with grid layouts for bookmarks and favorites (darker)
const RightSidebar = ({
  bookmarks,
  favorites,
  searchHistory,
  onMangaClick,
  onSearchClick,
}) => {
  return (
    <div className="space-y-5 h-[79vh] overflow-scroll custom-scrollbar">
      {/* Bookmarks Section */}
      <div className="bg-gradient-to-b from-gray-950 to-gray-900 backdrop-blur-md border border-gray-900 rounded-xl p-4 flex-1 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-gray-900 rounded-md">
            <BookmarkCheck className="w-4 h-4 text-gray-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-100">Bookmarks</h2>
          <span className="ml-auto bg-gray-900/70 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-800 select-none">
            {bookmarks.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {bookmarks
                .sort(
                  (a, b) =>
                    new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt)
                )
                .map((item, idx) => (
                  <CompactMangaCard
                    key={idx}
                    item={item}
                    onClick={onMangaClick}
                    type="bookmark"
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-6">
              <div className="p-3 bg-gray-900 rounded-full mb-3">
                <Bookmark className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium">No bookmarks yet</p>
              <p className="text-gray-700 text-xs mt-1">Save manga to read later</p>
            </div>
          )}
        </div>
      </div>

      {/* Favorites Section */}
      <div className="bg-gradient-to-b from-gray-950 to-gray-900 backdrop-blur-md border border-gray-900 rounded-xl p-4 flex-1 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-gray-900 rounded-md">
            <Heart className="w-4 h-4 text-gray-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-100">Favorites</h2>
          <span className="ml-auto bg-gray-900/70 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-800 select-none">
            {favorites.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
          {favorites.length > 0 ? (
            favorites.map((item, idx) => (
              <CompactMangaCard
                key={idx}
                item={item}
                onClick={onMangaClick}
                type="favorite"
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-6">
              <div className="p-3 bg-gray-900 rounded-full mb-3">
                <Heart className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium">No favorites yet</p>
              <p className="text-gray-700 text-xs mt-1">Heart your favorite chapters</p>
            </div>
          )}
        </div>
      </div>

      {/* Search History Section */}
      <div className="bg-gradient-to-b from-gray-950 to-gray-900 backdrop-blur-md border border-gray-900 rounded-xl p-4 flex-1 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-gray-900 rounded-md">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-100">Recent Searches</h2>
          <span className="ml-auto bg-gray-900/70 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-800 select-none">
            {searchHistory.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {searchHistory.length > 0 ? (
            <div className="space-y-1">
              {searchHistory.slice(0, 10).map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => onSearchClick(query)}
                  className="w-full flex items-center gap-2 p-2 bg-gray-950 hover:bg-gray-900 border border-gray-900 rounded-lg text-left transition-colors duration-200 text-xs text-gray-400 hover:text-gray-300"
                >
                  <Search className="w-3 h-3" />
                  <span className="truncate flex-1">{query}</span>
                  <Clock className="w-3 h-3 text-gray-600" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-6 text-gray-500 text-xs">
              <div className="p-3 bg-gray-900 rounded-full mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p>No search history</p>
              <p className="mt-1 text-gray-600 text-xs">Your searches will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Library = () => {
  const router = useRouter();
  const { getSelectedManga, getAllFavorites, getAllBookMarks, getAllFromReadHistory } =
    useManga();

  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: [],
    status: 'all',
    sort: 'recent',
  });
  console.log(getSelectedManga());
    console.log(getAllFavorites());
  console.log(getAllBookMarks());
  console.log(getAllFromReadHistory());
  console.log(searchHistory);
  useEffect(() => {
    try {
      const searches = Object.keys(localStorage || {})
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

  const handleMangaClick = useCallback(
    (manga) => router.push(`/manga/${manga.id}/chapters`),
    [router]
  );
  const handleSearchClick = useCallback(
    (query) => router.push(`/search?query=${encodeURIComponent(query)}`),
    [router]
  );

  const selectedManga = getSelectedManga();
  const favorites = Object.values(getAllFavorites());
  const bookmarks = getAllBookMarks();
  const readHistory = getAllFromReadHistory();

  // Filter and sort reading history
  const filteredHistory = useMemo(() => {
    let filtered = [...readHistory];

    if (filters.genre.length > 0) {
      filtered = filtered.filter((item) =>
        item.manga.flatTags?.some((tag) => filters.genre.includes(tag))
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((item) => item.manga.status === filters.status);
    }

    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'recent':
          return new Date(b.lastReadAT) - new Date(a.lastReadAT);
        case 'rating':
          return (
            (b.manga.rating?.rating?.bayesian || 0) -
            (a.manga.rating?.rating?.bayesian || 0)
          );
        case 'popular':
          return (b.manga.rating?.follows || 0) - (a.manga.rating?.follows || 0);
        case 'title':
          return a.manga.title.localeCompare(b.manga.title);
        case 'progress':
          const progressA =
            (a.chapters.length / (a.allChaptersList.length || 1)) * 100;
          const progressB =
            (b.chapters.length / (b.allChaptersList.length || 1)) * 100;
          return progressB - progressA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [readHistory, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-gray-700 rounded-full animate-spin" />
            <BookOpen className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <span className="text-lg font-semibold text-gray-100 block">
              Loading your library
            </span>
            <span className="text-gray-500 text-xs">
              Please wait while we fetch your data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[89vh] bg-gradient-to-br from-gray-950 to-gray-900">
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(20, 20, 20, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #303030, #808080);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #303030, #808080);
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-gray-900 bg-gray-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center gap-3 text-sm">
          <div className="p-2 bg-gray-900 rounded-lg shadow-md">
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">My Library</h1>
            <p className="text-gray-500 text-xs">
              Manage your manga collection and reading progress
            </p>
          </div>
          <div className="ml-auto bg-gray-900/80 px-3 py-1 rounded-lg border border-gray-800 select-none">
            <span className="text-gray-300 text-xs font-semibold">
              {filteredHistory.length} of {readHistory.length} manga
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-6 pt-6">
        <div className="grid grid-cols-12 gap-6" style={{ height: '72vh' }}>
          {/* Left Sidebar - Filters */}
          <div className="col-span-12 overflow-y-auto lg:col-span-3">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Main Content Area - Reading History (2 per row) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col bg-gradient-to-b from-gray-950 to-gray-900 backdrop-blur-md border border-gray-900 rounded-xl p-4 shadow-lg overflow-hidden">
            <div className="flex items-center justify-between mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gray-900 rounded-md">
                  <History className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-100">
                    Reading History
                  </h2>
                  <p className="text-gray-500 text-xs">Continue where you left off</p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-900/80 p-1 rounded-lg border border-gray-800">
                <button
                  className="p-1 bg-gray-900 text-gray-400 rounded-md border border-gray-800 cursor-default"
                  aria-label="List View"
                >
                  <List className="w-3 h-3" />
                </button>
                <button
                  className="p-1 text-gray-600 hover:text-gray-300 hover:bg-gray-800 rounded-md transition-all"
                  aria-label="Grid View"
                >
                  <Grid3x3 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Reading History List (grid 2 columns) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredHistory.map((item, idx) => (
                    <ReadingHistoryCard
                      key={`${item.manga.id}-${idx}`}
                      item={item}
                      onClick={handleMangaClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8 text-xs text-gray-400">
                  <div className="p-4 bg-gray-900 rounded-full mb-4">
                    <History className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    No Reading History
                  </h3>
                  <p className="mb-4 max-w-xs">
                    {readHistory.length === 0
                      ? 'Start reading some manga to see your progress here!'
                      : 'No manga match your current filters. Try adjusting your search criteria.'}
                  </p>
                  <button
                    onClick={() => router.push('/search')}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold rounded-lg shadow-md transition-all"
                  >
                    <Search className="w-3 h-3 inline mr-1" />
                    Discover Manga
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Bookmarks (3 per row), Favorites, Search History */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
            <RightSidebar
              bookmarks={bookmarks}
              favorites={favorites}
              searchHistory={searchHistory}
              onMangaClick={handleMangaClick}
              onSearchClick={handleSearchClick}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Library;