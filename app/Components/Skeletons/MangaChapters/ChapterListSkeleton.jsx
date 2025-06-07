import React from 'react';
import {
  ScrollText,
  History,
  Grid2X2,
  Filter,
  Search,
  Languages,
  ArrowUpDown,
  X,
} from 'lucide-react';

const ChapterListSkeleton = () => {
  return (
    <div className="min-h-fit md:mt-5 flex gap-3 md:flex-row-reverse text-gray-100 font-sans py-6 w-full">
      <div className="w-full flex flex-col">
        {/* Header Skeleton */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-14 h-14 rounded-lg bg-gray-700 animate-pulse shadow-lg flex items-center justify-center flex-shrink-0">
              <ScrollText className="w-7 h-7 text-gray-600" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-600 animate-pulse text-white font-semibold flex items-center justify-center text-xs shadow-md">
                <div className="w-3 h-3 bg-gray-500 rounded animate-pulse"></div>
              </span>
            </div>
            <div className="max-w-3xl min-w-0 flex flex-col">
              <div className="h-8 bg-gray-700 rounded animate-pulse mb-2 w-64"></div>
              <div className="w-full flex flex-row justify-start items-center gap-3 mt-1 min-w-0">
                <div className="h-4 bg-gray-700 rounded animate-pulse w-32"></div>
                <div className="relative flex-1 h-2 rounded-full bg-gray-800 shadow-inner">
                  <div className="h-2 rounded-full bg-gray-600 animate-pulse w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap justify-center flex-shrink-0">
            <div className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gray-700 animate-pulse">
              <History className="w-6 h-6 text-gray-600" />
              <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700 animate-pulse">
              <Grid2X2 className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6 flex-1 h-fit overflow-hidden">
          {/* Chapters List Skeleton */}
          <section className="w-full">
            <div className="flex flex-col gap-3 h-[450px] overflow-hidden pr-2">
              {[...Array(6)].map((_, index) => (
                <article
                  key={index}
                  className="relative h-fit bg-gray-850 rounded-xl border border-gray-700 animate-pulse"
                >
                  <div className="w-full flex items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg bg-gray-700 animate-pulse flex items-center justify-center font-bold text-lg flex-shrink-0">
                        <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="h-5 bg-gray-700 rounded animate-pulse mb-2 w-48"></div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <div className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
                          <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse flex items-center justify-center">
                      <div className="w-5 h-5 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="md:flex flex-col w-full hidden max-w-[320px] ml-6">
        {/* Filters Panel Skeleton */}
        <section className="p-4 pb-6 mb-2 bg-gray-850 w-full rounded-xl border border-gray-700 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <div className="h-5 bg-gray-700 rounded animate-pulse w-16"></div>
              </h2>
              <div className="px-4 py-2 border-2 rounded-lg bg-gray-700 border-gray-800 animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
              </div>
            </div>
            
            {/* Search Input Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-24"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <div className="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-4 h-10 animate-pulse"></div>
              </div>
            </div>

            {/* Language Select Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <div className="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-8 h-10 animate-pulse"></div>
              </div>
            </div>

            {/* Sort Order Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-20"></div>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-700 animate-pulse">
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                  <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-700 animate-pulse">
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                  <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reading History Skeleton - Desktop */}
        <aside className="hidden md:block mb-2 w-full bg-gray-850 rounded-xl border border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              <div className="h-5 bg-gray-700 rounded animate-pulse w-24"></div>
            </h2>
            <div className="p-1 rounded-full bg-gray-700 animate-pulse">
              <X className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <ul className="space-y-2 max-h-[140px] overflow-hidden">
            {[...Array(3)].map((_, index) => (
              <li key={index}>
                <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800 animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-gray-700 animate-pulse flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-700 rounded animate-pulse mb-2 w-32"></div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="w-4 h-4 rounded-full bg-gray-700 animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-gray-700 rounded animate-pulse flex-shrink-0"></div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile Recent Chapters Skeleton */}
        <div className="sm:hidden mb-4">
          <div className="w-full flex items-center justify-between p-3 bg-gray-850 rounded-lg border border-gray-700 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-24"></div>
            </div>
            <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterListSkeleton;