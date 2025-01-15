import React from 'react';

function AsideComponent({ memoizedMangas }) {
  console.log(memoizedMangas);
  return (
    <div className="bg-gray-900 text-white px-4 rounded-lg shadow-lg w-full">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 w-full justify-center text-2xl font-bold text-yellow-300 tracking-wide">
          <img src="/trophy.svg" alt="Trophy" className="w-6 h-6" />
          <span>This Month's Rankings</span>
        </h2>
      </div>

      {/* Tab Section */}
      <div className="w-full bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 rounded-lg mb-6">
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
                className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
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

      {/* Manga List */}
      <div>
        <ul className="flex flex-col gap-5">
          {memoizedMangas.slice(0, 10).map((manga, index) => (
            <li
              key={manga.id}
              className="relative flex w-full gap-5 py-3.5 items-center transition-all duration-300 hover:bg-gray-800 rounded-lg"
            >
              {/* Ranking Number */}
              <div className="relative left-4 top-0 flex h-[72px] w-10 items-center justify-center text-right">
                <span className="text-5xl font-extrabold text-gray-400">{index + 1}</span>
              </div>

              <div className="flex items-center gap-5 pl-12.8">
                {/* Manga Cover */}
                <a
                  className="relative w-[48px] h-[48px] overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                  title={manga?.title ?? 'Unavailable'}
                >
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={manga.coverImageUrl}
                    alt={manga?.title ?? 'No title'}
                  />
                </a>

                <div className="flex flex-col justify-center gap-1.6">
                  {/* Manga Title */}
                  <h3>
                    <a
                      className="font-semibold text-white text-lg hover:text-yellow-300 transition duration-300"
                    >
                      {manga?.title ?? 'Untitled Manga'}
                    </a>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AsideComponent;
