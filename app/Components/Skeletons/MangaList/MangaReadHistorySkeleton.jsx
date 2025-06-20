'use client';
import React from 'react';
import { BookOpenCheck, Eye } from 'lucide-react';

const MangaReadHistorySkeleton = () => {
  return (
    <div className="w-[calc(100%-12px)] mx-2 md:ml-2 md:px-6 mb-6">
      {/* Header */}
      <div className="flex mb-7 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-lg">
            <BookOpenCheck className="w-6 h-6 text-cyan-300 drop-shadow-md" />
          </div>
          <div className="leading-5 sm:leading-normal mt-1 sm:mt-0">
            <div className="h-5 w-32 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-700/50 rounded animate-pulse mt-1" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-3.5 rounded-md bg-gray-700/50 text-transparent border border-gray-700/50 animate-pulse">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="h-3 w-12 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Desktop & Tablet View */}
        <div className="hidden sm:block space-y-3">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden animate-pulse"
            >
              <div className="relative flex items-center p-2 gap-3">
                {/* Manga Cover */}
                <div className="relative w-20 h-24 rounded-md overflow-hidden bg-gray-700/50" />
                {/* Manga Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-row gap-3 w-full items-center justify-between">
                    <div className="flex flex-col w-full items-start justify-between space-y-2">
                      <div className="h-4 w-40 bg-gray-700/50 rounded" />
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-20 bg-gray-700/50 rounded" />
                        <div className="w-1 h-1 bg-gray-600 rounded-full" />
                        <div className="h-3 w-16 bg-gray-700/50 rounded" />
                      </div>
                    </div>
                    <div className="w-20 h-10 bg-gray-700/50 rounded-lg border border-white/10" />
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-24 bg-gray-700/50 rounded" />
                      <div className="h-3 w-12 bg-gray-700/50 rounded" />
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gray-200/30 rounded-full w-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Only cover image and title */}
        <div className="flex sm:hidden gap-2 overflow-x-auto pb-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-24 animate-pulse">
              <div className="relative w-24 h-32 border border-white/30 rounded bg-gray-700/50" />
              <div className="h-3 w-20 bg-gray-700/50 rounded mt-2 mx-auto" />
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button Placeholder */}
        <div className="w-full hidden sm:flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-700/50 animate-pulse">
          <div className="h-4 w-4 bg-gray-600 rounded" />
          <div className="h-4 w-20 bg-gray-600 rounded" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MangaReadHistorySkeleton);