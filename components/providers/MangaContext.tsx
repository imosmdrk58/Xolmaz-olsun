'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the full Manga type based on the provided response
interface Manga {
  id: string;
  title: string;
  description: string;
  altTitle: string;
  contentRating: string;
  status: string;
  altTitles: { [key: string]: string }[];
  year: number;
  updatedAt: string;
  tags: { group: string; tags: string[] }[];
  flatTags: string[];
  coverImageUrl: string;
  authorName: {
    id: string;
    type: string;
    attributes: {
      name: string;
      imageUrl: string | null;
      biography: { [key: string]: string };
      twitter: string | null;
      pixiv: string | null;
      melonBook: string | null;
      fanBox: string | null;
      booth: string | null;
      namicomi: string | null;
      nicoVideo: string | null;
      skeb: string | null;
      fantia: string | null;
      tumblr: string | null;
      youtube: string | null;
      weibo: string | null;
      naver: string | null;
      website: string | null;
      createdAt: string;
      updatedAt: string;
      version: number;
    };
  }[];
  artistName: {
    id: string;
    type: string;
    attributes: {
      name: string;
      imageUrl: string | null;
      biography: { [key: string]: string };
      twitter: string | null;
      pixiv: string | null;
      melonBook: string | null;
      fanBox: string | null;
      booth: string | null;
      namicomi: string | null;
      nicoVideo: string | null;
      skeb: string | null;
      fantia: string | null;
      tumblr: string | null;
      youtube: string | null;
      weibo: string | null;
      naver: string | null;
      website: string | null;
      createdAt: string;
      updatedAt: string;
      version: number;
    };
  }[];
  rating: {
    comments: {
      threadId: number;
      repliesCount: number;
    };
    follows: number;
    rating: {
      average: number;
      bayesian: number;
    };
  };
  links: { [key: string]: string };
  creatorName: string;
  MangaStoryType: string | null;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
  originalLanguage: string;
  type: string;
}

// Define Chapter type (assuming a structure based on typical MangaDex chapter data)
interface Chapter {
  id: string;
  chapter: string;
  title: string;
  mangaId: string;
  pageCount: string;
  [key: string]: any;
}

interface MangaContextType {
  // Selected Manga
  selectedManga: Manga | null;
  setSelectedManga: (manga: Manga | null) => void;
  getSelectedManga: () => Manga | null;

  // Read History
  addToReadHistory: (manga: Manga) => void;
  getAllFromReadHistory: () => Manga[];

  // Favorite Chapters
  addToFavoriteChapter: (chapter: Chapter) => void;
  getAllFromFavoriteChapter: () => Chapter[];

  // Chapter List for Manga
  setChapterListForManga: (mangaId: string, chapters: Chapter[]) => void;
  getChapterListForManga: (mangaId: string) => Chapter[];
}

const MangaContext = createContext<MangaContextType | undefined>(undefined);

// Storage keys for persistence
const STORAGE_KEYS = {
  READ_HISTORY: 'readHistory',
  FAVORITE_CHAPTERS: 'favoriteChapters',
  CHAPTER_LIST: 'chapterList',
  SELECTED_MANGA: 'selectedManga',
};

export function MangaProvider({ children }: { children: ReactNode }) {
  const [selectedManga, setSelectedMangaState] = useState<Manga | null>(null);
  const [readHistory, setReadHistory] = useState<Manga[]>([]);
  const [favoriteChapters, setFavoriteChapters] = useState<Chapter[]>([]);
  const [chapterLists, setChapterLists] = useState<{ [mangaId: string]: Chapter[] }>({}); // Store as object with mangaId keys

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load Selected Manga
      const storedSelectedManga = localStorage.getItem(STORAGE_KEYS.SELECTED_MANGA);
      if (storedSelectedManga) {
        setSelectedMangaState(JSON.parse(storedSelectedManga));
      }

      // Load Read History
      const storedReadHistory = localStorage.getItem(STORAGE_KEYS.READ_HISTORY);
      if (storedReadHistory) {
        setReadHistory(JSON.parse(storedReadHistory));
      }

      // Load Favorite Chapters
      const storedFavoriteChapters = localStorage.getItem(STORAGE_KEYS.FAVORITE_CHAPTERS);
      if (storedFavoriteChapters) {
        setFavoriteChapters(JSON.parse(storedFavoriteChapters));
      }

      // Load Chapter Lists
      const storedChapterLists = localStorage.getItem(STORAGE_KEYS.CHAPTER_LIST);
      if (storedChapterLists) {
        setChapterLists(JSON.parse(storedChapterLists));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save Selected Manga to localStorage
  const setSelectedManga = (manga: Manga | null) => {
    setSelectedMangaState(manga);
    try {
      if (manga) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_MANGA, JSON.stringify(manga));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_MANGA);
      }
    } catch (error) {
      console.error('Error saving selectedManga to localStorage:', error);
    }
  };

  const getSelectedManga = () => {
    return selectedManga;
  };

  // Read History Methods
  const addToReadHistory = (manga: Manga) => {
    setReadHistory((prev) => {
      const updatedHistory = [manga, ...prev.filter((item) => item.id !== manga.id)].slice(0, 50); // Limit to 50 items
      try {
        localStorage.setItem(STORAGE_KEYS.READ_HISTORY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving readHistory to localStorage:', error);
      }
      return updatedHistory;
    });
  };

  const getAllFromReadHistory = () => {
    return readHistory;
  };

  // Favorite Chapters Methods
  const addToFavoriteChapter = (chapter: Chapter) => {
    setFavoriteChapters((prev) => {
      const updatedFavorites = [chapter, ...prev.filter((item) => item.id !== chapter.id)];
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITE_CHAPTERS, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving favoriteChapters to localStorage:', error);
      }
      return updatedFavorites;
    });
  };

  const getAllFromFavoriteChapter = () => {
    return favoriteChapters;
  };

  // Chapter List for Manga Methods
 const setChapterListForManga = (mangaId: string, chapters: Chapter[]) => {
  setChapterLists((prev) => {
    const updatedLists = {
      ...prev,
      [mangaId]: chapters,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.CHAPTER_LIST, JSON.stringify(updatedLists));
    } catch (error) {
      console.error('Error saving chapterLists to localStorage:', error);
    }
    return updatedLists;
  });
};

  const getChapterListForManga = (mangaId: string) => {
    return chapterLists[mangaId] || [];
  };

  return (
    <MangaContext.Provider
      value={{
        selectedManga,
        setSelectedManga,
        getSelectedManga,
        addToReadHistory,
        getAllFromReadHistory,
        addToFavoriteChapter,
        getAllFromFavoriteChapter,
        setChapterListForManga,
        getChapterListForManga,
      }}
    >
      {children}
    </MangaContext.Provider>
  );
}

export function useManga() {
  const context = useContext(MangaContext);
  if (!context) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
}
