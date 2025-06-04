import {
  Heart,
  Flame,
  Trophy,
  Eye,
} from "lucide-react";

const SkeletonShimmer = ({ className = "" }) => (
  <div className={`bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-pulse ${className}`} />
);

export default function AsideComponentSkeleton(){
    return (
             <section className="w-full max-w-md mx-auto select-none mb-10 md:mb-0">
      {/* Header */}
      <div className="flex mx-2 md:mx-9 mb-7 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-md" />
          </div>
          <div>
            <SkeletonShimmer className="h-5 w-24 rounded mb-1" />
            <SkeletonShimmer className="h-3 w-32 rounded" />
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-300 text-sm border border-gray-700/50">
          <Eye className="w-4 h-4" />
          View All
        </button>
      </div>

      {/* Category Tabs */}
      <nav className="flex justify-center mx-2 md:mx-0 gap-4 mb-6">
        {[Trophy, Heart, Flame].map((Icon, index) => (
          <button
            key={index}
            className={`flex min-w-24 md:min-w-28 justify-center items-center gap-2 px-4 py-4 rounded-lg font-semibold text-sm transition-colors duration-300
              ${index === 0 
                ? 'bg-[rgba(255,255,255,0.09)] text-yellow-400' 
                : 'text-gray-400 bg-[rgba(255,255,255,0.05)]'
              }`}
          >
            <Icon className={`w-5 h-5 ${index === 0 ? 'text-yellow-400' : 'text-gray-500'}`} />
            <SkeletonShimmer className="h-4 w-12 rounded" />
          </button>
        ))}
      </nav>

      {/* Manga List */}
      <ul className="grid grid-cols-3 md:block md:space-y-3 mx-1 md:mx-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <li key={idx} className="flex items-center md:gap-1 rounded-lg md:px-3 py-2">
            {/* Rank */}
            <div className="flex-shrink-0 w-5 md:w-8 text-center select-none">
              <span className="text-2xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-gray-400 to-gray-600">
                {idx + 1}
              </span>
            </div>

            {/* Cover */}
            <div className="flex-shrink-0 w-10 h-12 md:w-12 md:h-16 rounded-md overflow-hidden shadow-md">
              <SkeletonShimmer className="w-full h-full" />
            </div>

            {/* Title & Stats */}
            <div className="flex flex-col ml-1 md:ml-3 flex-1 min-w-0">
              <SkeletonShimmer className="h-3 w-20 md:w-32 rounded mb-2" />
              
              <div className="flex items-center gap-1 md:gap-2 mt-1">
                <SkeletonShimmer className="w-5 h-5 rounded-full" />
                <SkeletonShimmer className="h-3 w-8 md:w-12 rounded" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
    )
}