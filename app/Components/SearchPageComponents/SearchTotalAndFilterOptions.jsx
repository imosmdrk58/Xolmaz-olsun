import React, { useState, useEffect } from 'react';
import filterOptions from "../../constants/filterOptions";
import FilterCustomDropDown from "./SearchTotalAndFilterOptionsModules/FilterCustomDropDown"
import ThemeGenreTags from "./SearchTotalAndFilterOptionsModules/ThemeGenreTags"
function SearchTotalAndFilterOptions({
  setActiveFilters,
  activeFilters,
  setViewMode,
  viewMode,
  clearAllFilters,
  searchQuery,
  filteredResults,
  handleSearch,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState(searchQuery);
  const [showTags, setShowTags] = useState(false);

  // Sync searchText with searchQuery
  useEffect(() => {
    setSearchText(searchQuery);
  }, [searchQuery]);

  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(
    value => (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'string' && value !== '')
  );

  // Toggle filter selection
  const toggleFilter = (filterType, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if (filterType === 'tags' || filterType === 'genres' || filterType === 'rating' || filterType === 'status' || filterType === 'publicationType' || filterType === "demographic" || filterType === "year" || filterType === "language") {
        if (newFilters[filterType]?.includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = value === newFilters[filterType] ? '' : value;
      }

      return newFilters;
    });
  };

  // Handle opening/closing filter panel with animation
  const toggleFilterPanel = () => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
    } else {
      setIsFilterOpen(true);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Count active filters
  const activeFilterCount = Object.entries(activeFilters).reduce((count, [key, value]) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return count + (value ? 1 : 0);
  }, 0);


  const sortOptions = filterOptions.sortOptions.map(sort => ({
    label: sort.label,
    value: sort.id
  }));

  // const hasChaptersOptions = filterOptions.hasChaptersOptions.map(option => ({
  //   label: option.label,
  //   value: option.id
  // }));

  return (
    <div className="bg-black relative z-50 bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-purple-900/30">
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex-1 w-full">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search manga..."
              className="w-full px-5 py-4 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-xl text-purple-50 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-600/70 focus:border-purple-600 transition-all duration-300 shadow-inner pl-12"
            />
            <button
              type="submit"
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-purple-400"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 self-end lg:self-auto">
          {/* Results count */}
          {searchQuery && (
            <div className="hidden lg:flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-900/30">
              <span className="text-purple-400 font-bold">
                {filteredResults.length}
              </span>
              <span className="text-purple-200/70">
                {filteredResults.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          )}

          {/* Filter button */}
          <button
            onClick={toggleFilterPanel}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300
              ${isFilterOpen
                ? 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white shadow-xl shadow-purple-700/30'
                : 'bg-black/60 hover:bg-black/80 text-purple-200 border border-purple-900/50 hover:border-purple-700/70'}`}
            aria-expanded={isFilterOpen}
            aria-controls="filter-panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-purple-300 text-purple-900 text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex bg-black/60 border border-purple-900/50 rounded-lg overflow-hidden shadow-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-all duration-300 ${viewMode === 'grid'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/30'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-all duration-300 ${viewMode === 'list'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/30'}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search query display and results count (mobile) */}
      {searchQuery && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="text-purple-500">Results for </span>
            <span className="text-white">"</span>
            <span className="text-purple-300 font-semibold">{searchQuery}</span>
            <span className="text-white">"</span>
          </h1>
          <p className="text-purple-300/70 lg:hidden">
            {filteredResults.length > 0 && (
              `${filteredResults.length} ${filteredResults.length === 1 ? 'result' : 'results'} found`
            )}
          </p>
        </div>
      )}

      {/* Filters panel */}
      {isFilterOpen && (
        <div
          id="filter-panel"
          className={`bg-black/80 backdrop-blur-md border border-purple-900/50 rounded-xl p-6 mb-8 shadow-2xl`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-800 p-2 rounded-lg shadow-lg shadow-purple-700/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-purple-200">Advanced Search</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Filters
              </button>
            )}
          </div>
          {console.log(activeFilters)}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Content Rating */}
            <FilterCustomDropDown
              title="Content Rating"
              multiple={true}
              options={filterOptions.ratings}
              selectedValues={activeFilters.rating}
              onSelectionChange={(value) => toggleFilter('rating', value)}
              countLabel={"Any Rating"}
            />

            {/* Publication Status */}

            <FilterCustomDropDown
              multiple={true}
              title="Publication Status"
              options={filterOptions.statuses}
              selectedValues={activeFilters.status}
              onSelectionChange={(value) => toggleFilter('status', value)}
              countLabel={"Any Status"}
            />

            {/* Original Language */}
            <FilterCustomDropDown
              title="Original Language"
              multiple={true}
              options={filterOptions.languages}
              selectedValues={activeFilters.language}
              onSelectionChange={(value) => toggleFilter('language', value)}
              countLabel={"Any Language"}
            />

            {/* Tags - Spans 2 columns on larger screens */}
             <ThemeGenreTags activeFilters={activeFilters} filterOptions={filterOptions} toggleFilter={toggleFilter} key={"ThemeGenreTags"} />
           

            {/* Publication Demographic */}

            <FilterCustomDropDown
              title="Publication Demographic"
              options={filterOptions.demographics}
              selectedValues={activeFilters.demographic}
              onSelectionChange={(value) => toggleFilter('demographic', value)}
              countLabel={"Any Demographic"}
            />

            {/* Publication Type */}
            <div className="filter-group">
              <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Publication Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.publicationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleFilter('publicationType', type.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all duration-300
                      ${activeFilters.publicationType?.includes(type.id)
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white shadow-lg shadow-purple-700/30'
                        : 'bg-black/50 text-purple-200 hover:bg-purple-900/40 border border-purple-800/50'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${type.color}`}></span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Created At */}
            {/* <div className="filter-group">
              <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Created At
              </h3>
              <div className="relative">
                <select
                  value={activeFilters.year || ''}
                  onChange={(e) => toggleFilter('year', e.target.value)}
                  className="w-full p-3 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-lg text-purple-200 appearance-none focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all duration-300"
                >
                  <option value="">Any Year</option>
                  {yearOptions.map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div> */}

            {/* Has Available Chapters */}
            {/* <div className="filter-group">
              <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Has Available Chapters
              </h3>
              <div className="flex gap-2">
                {hasChaptersOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleFilter('hasChapters', option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                      ${activeFilters.hasChapters === option.value
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white shadow-lg shadow-purple-700/30'
                        : 'bg-black/50 text-purple-200 hover:bg-purple-900/40 border border-purple-800/50'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Sort By */}
            <div className="filter-group">
              <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Sort By
              </h3>
              <div className="relative">
                <select
                  value={activeFilters.sortBy || ''}
                  onChange={(e) => toggleFilter('sortBy', e.target.value)}
                  className="w-full p-3 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-lg text-purple-200 appearance-none focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all duration-300"
                >
                  <option value="">Relevance</option>
                  {sortOptions.map(sort => (
                    <option key={sort.value} value={sort.value}>
                      {sort.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Author/Artist */}
            {/* <div className="filter-group">
              <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Author/Artist
              </h3>
              <input
                type="text"
                value={activeFilters.author || ''}
                onChange={(e) => toggleFilter('author', e.target.value)}
                placeholder="Enter author/artist name..."
                className="w-full p-3 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-lg text-purple-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all duration-300"
              />
            </div> */}

            {/* Group */}
            {/* <div className="filter-group">
              <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Group
              </h3>
              <input
                type="text"
                value={activeFilters.group || ''}
                onChange={(e) => toggleFilter('group', e.target.value)}
                placeholder="Enter group name..."
                className="w-full p-3 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-lg text-purple-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all duration-300"
              />
            </div> */}

            {/* Uploader */}
            {/* <div className="filter-group">
              <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Uploader
              </h3>
              <input
                type="text"
                value={activeFilters.uploader || ''}
                onChange={(e) => toggleFilter('uploader', e.target.value)}
                placeholder="Enter uploader name..."
                className="w-full p-3 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-lg text-purple-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all duration-300"
              />
            </div> */}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !isFilterOpen && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.rating.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Content Rating:</span>
              <div className="flex gap-1">
                {activeFilters.rating.map(ratingId => {
                  const rating = filterOptions.ratings.find(r => r.id === ratingId);
                  return (
                    <span key={ratingId} className="text-purple-300 font-medium">
                      {rating?.label}
                    </span>
                  );
                })}
              </div>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, rating: [] })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.status.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Status:</span>
              <div className="flex gap-1">
                {activeFilters.status.map(statusId => {
                  const status = filterOptions.statuses.find(s => s.id === statusId);
                  return (
                    <span key={statusId} className="text-purple-300 font-medium">
                      {status?.label}
                    </span>
                  );
                })}
              </div>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, status: [] })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.language && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Language:</span>
              <span className="text-purple-300 font-medium">
                {filterOptions.languages.find(l => l.code === activeFilters.language)?.label}
              </span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, language: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.demographic && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Demographic:</span>
              <span className="text-purple-300 font-medium">
                {filterOptions.demographics.find(d => d.id === activeFilters.demographic)?.label}
              </span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, demographic: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.publicationType.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Publication Type:</span>
              <div className="flex gap-1">
                {activeFilters.publicationType.map(typeId => {
                  const type = filterOptions.publicationTypes.find(t => t.id === typeId);
                  return (
                    <span key={typeId} className="text-purple-300 font-medium">
                      {type?.label}
                    </span>
                  );
                })}
              </div>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, publicationType: [] })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.year && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Created At:</span>
              <span className="text-purple-300 font-medium">{activeFilters.year}</span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, year: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.hasChapters && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Has Chapters:</span>
              <span className="text-purple-300 font-medium">
                {filterOptions.hasChaptersOptions.find(o => o.id === activeFilters.hasChapters)?.label}
              </span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, hasChapters: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.sortBy && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Sort By:</span>
              <span className="text-purple-300 font-medium">
                {filterOptions.sortOptions.find(s => s.id === activeFilters.sortBy)?.label}
              </span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, sortBy: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.author && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Author/Artist:</span>
              <span className="text-purple-300 font-medium">{activeFilters.author}</span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, author: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.group && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Group:</span>
              <span className="text-purple-300 font-medium">{activeFilters.group}</span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, group: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.uploader && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Uploader:</span>
              <span className="text-purple-300 font-medium">{activeFilters.uploader}</span>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, uploader: '' })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeFilters.genres.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm">
              <span className="text-purple-400">Genres:</span>
              <div className="flex gap-1">
                {activeFilters.genres.slice(0, 3).map(tag => (
                  <span key={tag} className="text-purple-300 font-medium">
                    {tag}
                  </span>
                ))}
                {activeFilters.genres.length > 3 && (
                  <span className="text-purple-300 font-medium">
                    +{activeFilters.genres.length - 3} more
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveFilters({ ...activeFilters, genres: [] })}
                className="ml-1 text-purple-400 hover:text-white transition-colors"
                aria-label="Remove filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-sm text-purple-400 hover:text-white transition-colors"
          >
            Clear All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchTotalAndFilterOptions;