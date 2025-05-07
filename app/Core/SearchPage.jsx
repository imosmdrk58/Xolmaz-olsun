import React, { useEffect, useState, useCallback } from 'react';
// import { debounce } from 'lodash';
import SearchMangaCardWith2ViewMode from "../Components/SearchPageComponents/SearchMangaCardWith2ViewMode"
import SearchTotalAndFilterOptions from "../Components/SearchPageComponents/SearchTotalAndFilterOptions"
import BottomPagination from "../Components/SearchPageComponents/BottomPagination"
import LoadingSpinner from '../Components/LoadingSpinner';
import Image from 'next/image';
// Main component
const SearchPage = () => {
  // State management
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    rating: [],
    status: [],
    language: [],
    year: [],
    minScore: '',
    demographic: [],
    genres: []
  });


  // Constants
  const ITEMS_PER_PAGE = 24;

  // Initialize search from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);

    if (query) {
      fetchMangaData(query);
    } else {
      setIsLoading(false);
      setError('Please enter a search term');
    }
  }, []);

  // console.log(filteredResults)
  // Filter manga when filter state changes
  useEffect(() => {
    if (searchResults.length > 0) {
      applyFilters();
    }
  }, [activeFilters, searchResults]);

  // Fetch manga data with caching
  const fetchMangaData = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      const cacheKey = `manga_search_${query}`;
      const cachedData = getFromCache(cacheKey);

      if (cachedData) {
        setSearchResults(cachedData);
        setFilteredResults(cachedData);
        setIsLoading(false);
        return;
      }

      // Fetch from API if not cached
      const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=100&includes[]=cover_art&includes[]=author&includes[]=artist`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        setSearchResults([]);
        setFilteredResults([]);
        setError('No manga found');
        setIsLoading(false);
        return;
      }

      // Process the manga data
      const processedData = await processMangaData(data.data);
      saveToCache(cacheKey, processedData);

      setSearchResults(processedData);
      setFilteredResults(processedData);
      setCurrentPage(1);

    } catch (err) {
      console.error('Error fetching manga:', err);
      setError(err.message || 'Failed to fetch manga data');
    } finally {
      setIsLoading(false);
    }
  };

  // Process raw manga data into usable format
  const processMangaData = async (mangaList) => {
    if (!mangaList || mangaList.length === 0) return [];

    // Batch fetch ratings
    const mangaIds = mangaList.map((manga) => manga.id);
    let ratings = {};
    const ratingsCacheKey = `manga_ratings_batch_${mangaIds.join('_')}`;
    const cachedRatings = getFromCache(ratingsCacheKey);

    if (cachedRatings?.data) {
      ratings = cachedRatings.data;
    } else {
      try {
        const response = await fetch(
          'https://api.mangadex.org/statistics/manga?' +
          mangaIds.map((id) => `manga[]=${id}`).join('&')
        );
        if (response.ok) {
          const ratingData = await response.json();
          ratings = ratingData.statistics || {};
          saveToCache(ratingsCacheKey, ratings);
        }
      } catch (err) {
        console.error('Error fetching batch ratings:', err);
      }
    }

    const result = await Promise.all(
      mangaList.map(async (manga) => {
        const { id, attributes, relationships, type } = manga;

        const {
          title,
          links,
          availableTranslatedLanguages,
          latestUploadedChapter,
          originalLanguage,
          description,
          altTitles,
          contentRating,
          publicationDemographic,
          status,
          year,
          updatedAt,
          tags,
        } = attributes;

        const grouped = relationships.reduce((acc, rel) => {
          if (!acc[rel.type]) acc[rel.type] = [];
          acc[rel.type].push(rel);
          return acc;
        }, {});

        const coverArt = grouped.cover_art?.[0]?.attributes?.fileName;
        const coverImageUrl = `https://mangadex.org/covers/${id}/${coverArt}.256.jpg`;
        const authorName = grouped.author;
        const artistName = grouped.artist;
        const creatorName = grouped.creator ?? 'N/A';
        const rating = ratings[id] || {};

        const groupedTags = tags?.reduce((acc, tag) => {
          const group = tag.attributes?.group || 'Unknown Group';
          const tagName = tag.attributes?.name?.en || 'Unknown Tag';
          if (!acc[group]) acc[group] = [];
          acc[group].push(tagName);
          return acc;
        }, {});

        const groupedTagsArray = Object.keys(groupedTags || {}).map((group) => ({
          group,
          tags: groupedTags[group],
        }));

        return {
          id,
          title: title?.en || Object?.values(altTitles?.[0] || {})[0] || 'Untitled',
          description: description?.en || 'No description available.',
          altTitle: Object.values(altTitles?.[0] || { none: 'N/A' })[0] || 'N/A',
          contentRating: contentRating || 'N/A',
          status: status || 'Unknown',
          altTitles: altTitles || [],
          year: year || 'N/A',
          updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
          tags: groupedTagsArray,
          flatTags: tags?.map((tag) => tag.attributes?.name?.en || 'Unknown Tag') || [],
          coverImageUrl,
          authorName,
          artistName,
          rating,
          links,
          creatorName,
          MangaStoryType: publicationDemographic,
          availableTranslatedLanguages: availableTranslatedLanguages || [],
          latestUploadedChapter,
          originalLanguage,
          type,
        };
      })
    );
    return result;
  };

  console.log(filteredResults[0]);
  
  // Apply filters to search results
  const applyFilters = useCallback(() => {
    let results = [...searchResults];

    // Filter by content rating
    if (activeFilters.rating.length > 0) {
      results = results.filter(manga =>
        activeFilters.rating.includes(manga.contentRating)
      );
    }

    // Filter by status
    if (activeFilters.status.length > 0) {
      results = results.filter(manga =>
        activeFilters.status.includes(manga.status)
      );
    }

    // Filter by year
    if (activeFilters.year.length>0) {
      results = results.filter(manga =>
        activeFilters.year.includes(manga.year && manga.year.toString())
      );
    }

    // Filter by genre (using flatTags)
    if (activeFilters.genres.length > 0) {
      results = results.filter(manga =>
        activeFilters.genres.every(genre => manga.flatTags.includes(genre))
      );
    }


    // Filter by language (check originalLanguage or availableTranslatedLanguages)
    if (activeFilters.language.length > 0) {
      results = results.filter(manga =>
        activeFilters.language.every(lang=>manga.originalLanguage === lang ||
          (manga.availableTranslatedLanguages &&
            manga.availableTranslatedLanguages.includes(lang)))
      );
    }

    // Filter by minimum score
    if (activeFilters.minScore) {
      const minScore = parseFloat(activeFilters.minScore);
      results = results.filter(
        manga => (manga.rating?.rating?.bayesian || 0) >= minScore
      );
    }

    // Filter by demographic (check tags with group 'demographic')
    if (activeFilters.demographic.length > 0) {
      results = results.filter(manga =>
        activeFilters.demographic.every(demo=>demo=="none"?manga.MangaStoryType==null:manga.MangaStoryType==demo) || activeFilters.demographic.includes(manga.MangaStoryType==null?"none":manga.MangaStoryType)
      );
    }

    setFilteredResults(results);
    setCurrentPage(1);
  }, [activeFilters, searchResults]);


  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      rating: [],
      status: [],
      year: [],
      genres: [],
      language: [],
      minScore: '',
      demographic: []
    });
  };

  // Cache helpers
  const getFromCache = (key) => {
    try {
      // localStorage.clear()
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  };

  const saveToCache = (key, data) => {
    try {
      // Check storage limit before saving
      const serializedData = JSON.stringify(data);
      const dataSize = new Blob([serializedData]).size;

      // Max size: 4MB
      if (dataSize > 4 * 1024 * 1024) {
        return false;
      }

      // Manage cache size by removing oldest entries if needed
      const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith('manga_'));
      if (cacheKeys.length > 10) {
        cacheKeys.sort((a, b) => {
          const timeA = localStorage.getItem(`${a}_timestamp`) || 0;
          const timeB = localStorage.getItem(`${b}_timestamp`) || 0;
          return timeA - timeB;
        });

        // Remove oldest entries
        for (let i = 0; i < cacheKeys.length - 9; i++) {
          localStorage.removeItem(cacheKeys[i]);
          localStorage.removeItem(`${cacheKeys[i]}_timestamp`);
        }
      }

      // Save data with timestamp
      localStorage.setItem(key, serializedData);
      localStorage.setItem(`${key}_timestamp`, Date.now());
      return true;
    } catch (error) {
      console.error('Cache save error:', error);
      return false;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Page navigation
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });



  // Handle new search
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements[0].value.trim();
    if (query) {
      setSearchQuery(query);
      fetchMangaData(query);

      // Update URL without full page reload
      const url = new URL(window.location);
      url.searchParams.set('query', query);
      window.history.pushState({}, '', url);
    }
  };

  return (
    <div className="min-h-screen  bg-slate-950 text-slate-100">

      <main className="max-w-[90vw] mx-auto px-4 py-6">
        {/* Results header with controls */}
        <SearchTotalAndFilterOptions handleSearch={handleSearch} setActiveFilters={setActiveFilters} activeFilters={activeFilters} clearAllFilters={clearAllFilters} filteredResults={filteredResults} searchQuery={searchQuery} setViewMode={setViewMode} viewMode={viewMode} />
        {/* Error state */}

        {/* Loading state */}
        {isLoading && (
          <LoadingSpinner className="relative h-[59dvh]  z-50" text='Loading Mangas...' />
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full text-center">
              <div className="bg-slate-800/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Image alt='alert' src={"./AlertIcon.svg"} width={300} height={300} className=' w-6 h-6' />
              </div>
              <h2 className="text-xl font-semibold text-slate-200 mb-2">{error}</h2>
              <p className="text-slate-400 mb-5">
                {error === 'No manga found'
                  ? 'Try adjusting your search terms or filters.'
                  : 'Please try again later.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty results after filtering */}
        {!isLoading && !error && filteredResults.length === 0 && searchResults.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full text-center">
              <div className="bg-slate-800/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Image alt='alert' src={"./FilterOffIcon.svg"} width={300} height={300} className=' w-8 h-8' />
              </div>
              <h2 className="text-xl font-semibold text-slate-200 mb-2">No matches found</h2>
              <p className="text-slate-400 mb-5">
                No manga matched your current filter settings.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results grid/list */}
        {!isLoading && !error && filteredResults.length > 0 && (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 relative z-10 mt-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'
              : 'flex flex-col space-y-2 z-10'
            }>
              {paginatedItems.map(manga => (
                <SearchMangaCardWith2ViewMode
                  key={manga.id}
                  manga={manga}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <BottomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};



export default SearchPage;