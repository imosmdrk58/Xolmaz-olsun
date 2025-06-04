import { Flame } from 'lucide-react';
const SkeletonShimmer = ({ className = "" }) => (
  <div className={`bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-pulse ${className}`} />
);

// MangaCard Skeleton
export default function MangaCardSkeleton({ count = 12 })  {
  return (
    <div className="w-full flex flex-col mb-10">
      {/* Header Section */}
      <div className="flex mx-1 sm:mx-5 xl:mx-16 mb-7 sm:mb-8 items-center gap-3">
        <div className="bg-white/10 p-3 rounded-lg">
          <Flame className="w-6 h-6 text-yellow-400 drop-shadow-md" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
            Latest Releases
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Fresh Manga Updates
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid w-[95%] sm:gap-y-4 mx-auto md:mx-5 xl:ml-16 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="manga-card w-full flex justify-center items-start">
            <div className="w-full sm:w-[250px] overflow-hidden min-h-[290px] sm:min-h-[400px] rounded-lg bg-[#0c0221]/50 p-[5px] shadow-slate-600 shadow-[0_0_4px_rgba(0,0,0,1)]">
              {/* Image Section */}
              <div className="relative flex h-[155px] sm:h-[250px] flex-col rounded-[5px] ">
                <SkeletonShimmer className="object-fill relative -mt-[1px] flex h-[155px] sm:h-[250px] flex-col rounded-[5px] rounded-tl-[20px]" />
                
                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent p-2 sm:p-4">
                  <div className="flex flex-row w-full items-center gap-3 sm:items-start justify-center">
                    <SkeletonShimmer className="w-4 sm:w-7 h-3 sm:h-5 rounded" />
                    <SkeletonShimmer className="h-2 sm:h-3 w-24 sm:w-32 rounded" />
                  </div>
                </div>

                {/* Status badge area */}
                <div className="absolute z-20 h-[29px] md:h-[39px] -ml-1 -mt-1 w-[60%] -skew-x-[40deg] rounded-br-[10px] bg-[#0c0221] shadow-[-10px_-10px_0_0_#0c0221] before:absolute before:right-[-2px] before:top-0 before:h-[12px] before:w-[70px] sm:before:w-[129px] before:rounded-tl-[11px]" />
                <div className="absolute left-0 top-6 sm:top-[34px] h-[55px] w-[125px] before:absolute before:h-full before:w-1/2 sm:before:w-full before:rounded-tl-[15px] before:shadow-[-5px_-5px_0_2px_#0c0221]" />
                
                {/* Top badges */}
                <div className="absolute top-0 flex h-[30px] w-full justify-between">
                  <div className="h-full flex flex-row justify-center items-center aspect-square">
                    <span className="absolute -ml-2 sm:-ml-3 lg:-ml-0 -mt-[7px] sm:-mt-[8px] top-0 left-0 z-30 text-[9px] sm:text-[11px] sm:tracking-widest rounded-full pr-2 sm:min-w-24 flex items-center justify-start font-bold">
                      <SkeletonShimmer className="size-3 mx-4 sm:size-4 mt-2 sm:mt-4 rounded-full" />
                      <SkeletonShimmer className="h-4 w-12 mt-2 sm:mt-4 sm:w-16 ml-1 rounded" />
                    </span>
                  </div>
                  <div className="flex">
                    <SkeletonShimmer className="z-10 mt-[1px] sm:mt-[2px] mr-2 top-0 right-0 absolute py-[3px] sm:py-[7px] min-w-36 h-6 sm:h-8 rounded-lg md:rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-[2px_4px] sm:p-[5px_10px] w-full">
                {/* Stats Row */}
                <div className="flex justify-between mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex text-[11px] sm:text-base items-center gap-0.5 sm:gap-2">
                      <SkeletonShimmer className="w-6 h-6 sm:w-7 sm:h-7 rounded-md" />
                      <SkeletonShimmer className="h-3 sm:h-4 w-6 sm:w-8 rounded" />
                    </div>
                  ))}
                </div>

                {/* Tags and Content */}
                <div className="mt-3 flex flex-col sm:min-h-[100px] justify-between">
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <SkeletonShimmer 
                        key={i}
                        className="h-6 sm:h-8 w-12 sm:w-16 rounded border border-gray-700"
                      />
                    ))}
                  </div>
                  <div className="h-8" />
                  <div className="bottom-2 md:bottom-3  mx-auto relative z-30 flex justify-center items-center w-full">
                    <SkeletonShimmer className="h-2 sm:h-3 w-24 sm:w-32 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};