import React from 'react';
import { Book } from 'lucide-react';
import StableFlag from '../../../Components/StableFlag';
import ChapterListWithFiltersSkeleton from './ChapterListSkeleton';

const MemoStableFlag = React.memo(StableFlag);

function TabsAndSectionsSkeleton() {
  return (
    <div suppressHydrationWarning className="px-4 sm:px-[70px] animate-pulse">
      {/* Tabs Skeleton */}
      <div className="mb-6 sm:mb-8 w-fit">
        <div className="bg-gray-600/30 backdrop-blur-md rounded overflow-x-auto flex-nowrap">
          <div className="flex">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="px-4 py-2 text-sm md:text-base font-bold bg-gray-600/20 text-transparent rounded w-24 h-8"
              >
                <div className="bg-gray-500/50 h-4 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-2">
        {/* Metadata Section Skeleton (Left Column) */}
        <div className="w-full hidden md:flex sm:w-5/12 flex-wrap gap-6 sm:gap-9 h-fit">
          {/* Author and Artist */}
          <div className="flex flex-row gap-4 w-full">
            <div className="min-w-1/3">
              <h3 className="text-white font-bold text-lg mb-2">Author</h3>
              <div className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-sm rounded w-24 h-8">
                <div className="bg-gray-500/50 h-4 w-16 rounded" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Artist</h3>
              <div className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-sm rounded w-24 h-8">
                <div className="bg-gray-500/50 h-4 w-16 rounded" />
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="h-fit">
            <h3 className="text-white font-bold text-lg mb-2">Genres</h3>
            <div className="flex gap-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-20 h-6"
                >
                  <div className="bg-gray-500/50 h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div className="h-fit">
            <h3 className="text-white font-bold text-lg mb-2">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-20 h-6"
                >
                  <div className="bg-gray-500/50 h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="h-fit">
            <h3 className="text-white font-bold text-lg mb-2">Format</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-20 h-6"
                >
                  <div className="bg-gray-500/50 h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Demographic */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Demographic</h3>
            <div className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-24 h-6">
              <div className="bg-gray-500/50 h-3 w-20 rounded" />
            </div>
          </div>

          {/* Read or Buy */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Read or Buy</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded px-3 py-2 flex items-center w-24 h-8"
                >
                  <Book className="w-4 h-4 mr-2 text-white" />
                  <div className="bg-gray-500/50 h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Track */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Track</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded px-3 py-2 flex items-center w-24 h-8"
                >
                  <Book className="w-4 h-4 mr-2 text-white" />
                  <div className="bg-gray-500/50 h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Titles */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Alternative Titles</h3>
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-1 px-2 rounded-md w-full h-8"
                >
                  <MemoStableFlag
                    code="en"
                    className="w-6 sm:w-8 h-6 sm:h-8 rounded-md shadow-sm"
                    alt="flag"
                  />
                  <div className="bg-gray-500/50 h-3 w-32 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area Skeleton (Right Column) */}
        <div className="w-full sm:-mt-6 sm:ml-5">
          {/* Placeholder for ChapterList skeleton */}
          <div className="bg-gray-600/20 backdrop-blur-md rounded p-4">
            <ChapterListWithFiltersSkeleton/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabsAndSectionsSkeleton;