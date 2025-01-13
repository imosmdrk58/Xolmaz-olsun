import React from 'react';

function AsideComponent({ memoizedMangas }) {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 w-full justify-center text-2xl font-semibold text-yellow-400">
          <img src="/trophy.svg" alt="Trophy" className="w-7 h-7" />
          <span className="tracking-wide">This Month's Rankings</span>
        </h2>
      </div>

      {/* Tab Section */}
      <div
        dir="ltr"
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 p-2 rounded-lg mb-6"
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { 'Top': "star.svg" },
            { 'Favourite': "heart.svg" },
            { 'New': "clock.svg" }
          ].map((category, index) => {
            const categoryName = Object.keys(category)[0]; // Get the category name ('Top', 'Favourite', 'New')
            const icon = category[categoryName]; // Get the icon for the category

            return (
              <button
                key={index}
                className="flex items-center justify-center gap-3 text-sm font-medium text-gray-200 hover:text-white py-3 px-5 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <img
                  src={`/${icon}`}
                  alt={categoryName}
                  className="w-6 h-6"
                />
                {categoryName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manga List */}
      <div>
        <ul className="flex flex-col gap-6">
          {memoizedMangas.slice(0, 10).map((manga, index) => (
            <li key={manga.id} className="relative flex w-full gap-6 py-4 items-center">
              {/* Ranking Number */}
              <div className="absolute left-6 top-0 flex h-[72px] w-10 items-center justify-center text-right">
                <span className="text-5xl font-extrabold text-indigo-400">{index + 1}</span>
              </div>

              <div className="flex items-center gap-6 pl-16">
                {/* Manga Cover */}
                <a
                  href={`/nettrom/truyen-tranh/${manga.id}`}
                  className="relative w-[70px] h-[70px] overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                  title={manga?.title ?? 'Unavailable'}
                >
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={`https://og.mangadex.org/og-image/manga/${manga.id}`}
                    alt={manga?.title ?? 'No title'}
                  />
                </a>

                <div className="flex flex-col justify-center gap-2">
                  {/* Manga Title */}
                  <h3>
                    <a
                      className="font-semibold text-white text-lg hover:text-indigo-500 transition duration-300"
                    >
                      {manga?.title ?? 'Untitled Manga'}
                    </a>
                  </h3>

                  {/* Manga Rating */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <img src="/star.svg" alt="star" className="w-5 h-5" />
                    <span className="text-sm">
                      {manga?.rating?.rating?.average ?? '0'}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AsideComponent;
