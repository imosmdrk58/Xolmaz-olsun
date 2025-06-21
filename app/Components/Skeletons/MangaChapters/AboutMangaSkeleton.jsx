import {
  Book,
  Users,
  Eye,
  Star,
  Library,
  UserPlus,
  ChevronUp,

} from 'lucide-react';

const AboutMangaSkeleton = () => {
  return (
    <div suppressHydrationWarning className="min-h-full w-full">
      <div className="relative">
        {/* Background Image Skeleton */}
        <div className="absolute inset-x-0 top-0 h-[180px] sm:h-[220px] md:h-[350px] bg-gray-900 animate-pulse">
          <div className="absolute inset-0 h-[180px] sm:h-[220px] md:h-[350px] bg-black/60 backdrop-blur-sm z-10"></div>
        </div>

        <main className="relative px-4 sm:px-6 md:px-10">
          <div className="relative z-10 pt-6 sm:pt-8 md:p-8 pb-0">

            {/* Mobile Layout (< 768px) */}
            <div className="block md:hidden">
              {/* Mobile Cover Image Skeleton - Centered and Larger */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-52 sm:w-40 sm:h-56 group select-none shadow-2xl">
                  <div className="w-full h-full rounded-lg bg-gray-900 animate-pulse"></div>
                </div>
              </div>

              {/* Mobile Title Section Skeleton */}
              <div className="text-center mb-6 px-2">
                <div className="h-8 sm:h-9 bg-white/20 rounded mb-2 animate-pulse"></div>
                <div className="h-4 sm:h-5 bg-white/20 rounded mb-3 w-3/4 mx-auto animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded mb-4 w-1/2 mx-auto animate-pulse"></div>
              </div>

              <div className='grid grid-cols-2 w-full gap-4'>
                {/* Mobile Secondary Button Skeleton */}
                <div className="mb-2 w-full">
                  <div className="w-full bg-gray-700/50 h-14 rounded-lg animate-pulse"></div>
                </div>
                {/* Mobile Action Button Skeleton */}
                <div className="mb-6 w-full">
                  <div className="w-full bg-purple-600/50 h-14 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Mobile Stats Row Skeleton */}
              <div className="flex justify-center items-center gap-6 mb-6 px-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-gray-400" />
                  <div className="w-8 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1 text-gray-400" />
                  <div className="w-6 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  <div className="w-8 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Mobile Publication Info Skeleton */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center text-white/60 text-sm">
                  <Book className="w-4 h-4 mr-2 text-gray-400" />
                  <div className="w-32 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Expandable Section Skeleton */}
              <div className="px-4 mb-0">
                <button
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded px-4 py-2 text-white hover:bg-white/20 transition-colors duration-200 w-fit mx-auto lg:mx-0"
                >
                  <span className="text-sm font-medium">
                    Show Less
                  </span>
                 
                    <ChevronUp className="w-4 h-4" />
                  
                </button>

              </div>
            </div>

            {/* Desktop Layout (>= 768px) - Skeleton */}
            <div className="hidden md:flex gap-8 mt-14">
              {/* Left Column - Manga Cover Skeleton */}
              <div className="relative w-40 h-60 lg:w-48 lg:h-[295px] group select-none mx-auto md:mx-0">
                <div className="w-full h-full rounded bg-white/30 animate-pulse"></div>
              </div>

              {/* Right Column - Manga Details Skeleton */}
              <div className="flex-1">
                <div className="h-72 flex justify-between flex-col">
                  <div className="flex flex-col">
                    <div className="h-16 lg:h-20 bg-white/20 rounded mb-4 w-4/5 animate-pulse"></div>
                    <div className="h-6 bg-white/20 rounded mb-6 w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-5 bg-white/20 rounded mb-8 w-1/3 animate-pulse"></div>
                </div>

                <div className="flex gap-4 mb-5">
                  <div className="bg-purple-900/50 h-12 w-32 rounded animate-pulse"></div>
                  <div className="bg-gray-600/30 h-12 w-32 rounded animate-pulse"></div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-gray-400" />
                      <div className="w-8 h-4 bg-white/20 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center">
                      <UserPlus className="w-4 h-4 mr-1 text-gray-400" />
                      <div className="w-8 h-4 bg-white/20 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center">
                      <Library className="w-4 h-4 mr-1 text-gray-400" />
                      <div className="w-6 h-4 bg-white/20 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center ml-2">
                      <Book className="w-4 h-4 mr-2 text-gray-400" />
                      <div className="w-32 h-4 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="h-6 w-16 bg-white/20 rounded animate-pulse"></div>
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="h-6 w-12 bg-gray-600/30 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Description Skeleton */}
            <div className="hidden md:block mt-4">
              <div className="h-5 bg-white/20 rounded mb-4 w-1/2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutMangaSkeleton;