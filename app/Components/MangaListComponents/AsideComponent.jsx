import React, { useState } from 'react';

function AsideComponent({ 
  processedMangas, 
  processedLatestMangas, 
  processedFavouriteMangas,
  handleMangaClicked,
}) {
  const [selectedCategory, setSelectedCategory] = useState("Top");
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Choose which manga list to display based on the selected category
  const mangaToDisplay = selectedCategory === 'Top'?processedMangas:selectedCategory === 'Favourite' ?processedFavouriteMangas:processedLatestMangas
  return (
    <>
      {mangaToDisplay.length > 0 && (
        <div className='w-4/12'>
          <div className="bg-gray-900 py-7 text-white px-4 rounded-lg shadow-lg w-full">

            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 w-full justify-center text-2xl font-bold text-yellow-300 tracking-wide">
                <img src="/trophy.svg" alt="Trophy" className="w-6 h-6" />
                <span>{selectedCategory === 'Top' ? "Top Manga" : selectedCategory === 'Favourite' ? "Favourite Manga" : "New Manga"}</span>
              </h2>
            </div>

            <div className="w-full bg-gray-500 bg-opacity-10 p-2.5 rounded-lg mb-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { 'Top': 'star.svg' },
                  { 'Favourite': 'heart.svg' },
                  { 'New': 'clock.svg' },
                ].map((category, index) => {
                  const categoryName = Object.keys(category)[0];
                  const icon = category[categoryName];
                  return (
                    <button
                      key={index}
                      onClick={() => handleCategoryChange(categoryName)}
                      className={`flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 
                        ${selectedCategory === categoryName ? 'bg-gray-700 text-white' : 'bg-[#1a1919] text-gray-300'}`}
                    >
                      <img
                        src={`/${icon}`}
                        alt={categoryName}
                        className="w-4 h-4"
                      />
                      {categoryName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <ul className="flex flex-col">
                {mangaToDisplay.slice(0, 10).map((manga, index) => (
                  <li
                    key={manga.id}
                    className='cursor-pointer'
                    onClick={() => handleMangaClicked(manga)}
                  >
                    <div className='relative flex w-full gap-5 py-3.5 items-center transition-all duration-300 hover:bg-gray-800 rounded-lg'>
                      <div className="relative left-4 top-0 flex h-[72px] w-10 items-center justify-center text-right">
                        <span className="text-5xl font-extrabold text-gray-400">{index + 1}</span>
                      </div>

                      <div className="flex items-center gap-5 pl-12.8">
                        {/* Manga Cover */}
                        <div
                          className="relative w-[48px] h-[48px] overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                          title={manga?.title ?? 'Unavailable'}
                        >
                          <img
                            className="w-full h-full object-cover rounded-lg"
                            src={manga?.coverImageUrl}
                            alt={manga?.title ?? 'No title'}
                          />
                        </div>

                        <div className="flex flex-col justify-center gap-1.6">
                          {/* Manga Title */}
                          <h3>
                            <div
                              className="font-semibold text-white text-lg hover:text-yellow-300 transition duration-300"
                            >
                              {manga?.title ?? 'Untitled Manga'}
                            </div>
                          </h3>

                          {/* Manga Rating */}
                          <div className="flex items-center gap-1.6 text-gray-400">
                            <img src="/star.svg" alt="star" className="w-3.2 h-3.2" />
                            <span className="text-sm">
                              {manga?.rating?.rating?.average ?? '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AsideComponent;
