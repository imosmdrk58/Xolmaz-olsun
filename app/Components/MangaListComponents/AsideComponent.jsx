import React from 'react';

function AsideComponent({ manga, index }) {
// console.log(manga)
  return (
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
  );
}

export default AsideComponent;
