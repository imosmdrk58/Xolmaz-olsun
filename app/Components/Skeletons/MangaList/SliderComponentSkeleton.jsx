'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SkeletonShimmer = ({ className = '' }) => (
  <div
    className={`bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-pulse ${className}`}
  />
);

const SliderComponentSkeleton = () => {
  // Number of thumbnails to show in skeleton
  const thumbnailCount = 8;

  return (
    <div className="relative w-full min-h-[59vh] sm:h-[60vh] border-b-[16px] border-black/10 overflow-hidden bg-black/60 select-none">
      {/* Background noise texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23noiseFilter%29%27%2F%3E%3C%2Fsvg%3E')]"></div>

      {/* Progress Timeline */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <SkeletonShimmer className="h-full w-full" />
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Panel - Feature Display */}
        <div className="relative w-full md:w-[73%] h-full overflow-hidden">
          {/* Blurred background skeleton */}
          <SkeletonShimmer className="absolute inset-0 blur-md opacity-30" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 sm:to-transparent z-10" />

          {/* Mobile Navigation Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-40 md:hidden">
            <div className="flex space-x-3 items-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
              <button
                disabled
                className="w-8 h-8 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white mr-2 cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex space-x-2 items-center">
                {Array.from({ length: thumbnailCount }).map((_, i) => (
                  <SkeletonShimmer
                    key={i}
                    className={`rounded-full ${
                      i === 0 ? 'w-3 h-3' : 'w-2 h-2'
                    }`}
                  />
                ))}
              </div>
              <button
                disabled
                className="w-8 h-8 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white ml-2 cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Content Container */}
          <div className="relative h-full z-20 flex items-center justify-between">
            <div className="w-[75%] md:w-4/5 px-6 md:px-16 md:pl-24 pt-12 pb-32 sm:py-12">
              {/* Language badge */}
              <div className="inline-flex items-center px-3 py-1 mb-4 md:mb-6 rounded-full border border-purple-600/30 bg-black/30 backdrop-blur-sm">
                <SkeletonShimmer className="w-6 h-6 rounded-full mr-2" />
                <SkeletonShimmer className="h-4 w-16 rounded" />
              </div>

              {/* Title */}
              <div className="mb-4 md:mb-6">
                <SkeletonShimmer className="h-10 sm:h-14 md:h-20 w-full max-w-[600px] rounded" />
              </div>

              {/* Description */}
              <div className="mb-6 md:mb-8 max-w-xl md:max-w-2xl">
                <SkeletonShimmer className="h-4 sm:h-6 rounded mb-2 w-full" />
                <SkeletonShimmer className="h-4 sm:h-6 rounded mb-2 w-[90%]" />
                <SkeletonShimmer className="h-4 sm:h-6 rounded w-[80%]" />
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <SkeletonShimmer className="h-10 md:h-12 w-28 md:w-40 rounded" />
                <SkeletonShimmer className="h-10 md:h-12 w-36 rounded" />
              </div>
            </div>

            {/* Mobile cover image */}
            <div
              className="absolute top-[70px] right-3 w-24 h-44 md:hidden z-30 rounded-sm overflow-hidden"
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
              }}
            >
              <SkeletonShimmer className="w-full h-full rounded-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
            </div>

            {/* Desktop cover image */}
            <div className="hidden md:block md:w-2/5 h-full relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 right-16 w-64 h-[360px] z-30 rounded-sm overflow-hidden"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                <SkeletonShimmer className="w-full h-full rounded-sm" />
                <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-white to-transparent opacity-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Navigation & Thumbnails */}
        <div className="relative w-full md:w-[27%] h-full bg-black/80 backdrop-blur-sm hidden md:flex flex-col">
          {/* Top navigation */}
          <div className="h-24 border-b py-3 border-white/10 flex items-center justify-between px-8">
            <button
              disabled
              className="flex items-center gap-3 text-white/30 cursor-not-allowed"
            >
              <span className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-full">
                <ChevronLeft size={18} />
              </span>
              <span className="hidden sm:block uppercase text-[11px] tracking-widest">
                Prev
              </span>
            </button>
            <div className="text-center">
              <SkeletonShimmer className="h-4 w-12 rounded mx-auto mb-1" />
              <SkeletonShimmer className="h-3 w-20 rounded mx-auto" />
            </div>
            <button
              disabled
              className="flex items-center gap-3 text-white/30 cursor-not-allowed"
            >
              <span className="hidden sm:block uppercase text-[11px] tracking-widest">
                Next
              </span>
              <span className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-full">
                <ChevronRight size={18} />
              </span>
            </button>
          </div>

          {/* Thumbnails scroll area */}
          <div
            className="flex-grow p-6 pt-3 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 className="text-white/50 uppercase text-xs tracking-widest mb-3">
              Discover More
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: thumbnailCount }).map((_, index) => (
                <div
                  key={index}
                  className={`relative cursor-default transition-all duration-300 ${
                    index === 0
                      ? 'ring-2 ring-purple-600'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-full aspect-[2/3] overflow-hidden rounded-sm bg-gray-700">
                    <SkeletonShimmer className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center mb-1 space-x-2">
                      <SkeletonShimmer className="w-5 h-5 rounded-full" />
                      <SkeletonShimmer className="h-3 w-10 rounded" />
                    </div>
                    <SkeletonShimmer className="h-4 w-24 rounded" />
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Side Indicators */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40 hidden md:block">
        <button
          disabled
          className="w-12 h-12 mb-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="relative w-1 h-40 bg-white/20 rounded-full overflow-hidden">
          <SkeletonShimmer className="absolute top-0 left-0 right-0 h-full" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SliderComponentSkeleton);