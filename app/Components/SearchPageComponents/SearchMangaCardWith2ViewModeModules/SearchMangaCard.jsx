import React, { memo, lazy, useMemo } from "react";
import Image from "next/image";
import { Heart, MessageSquareText, Bookmark } from 'lucide-react';
const StableFlag = memo(lazy(() => import("../../StableFlag")));

const contentRatingStyles = {
  safe: {
    badge: "bg-emerald-500 border-emerald-500",
    text: "text-emerald-50",
  },
  suggestive: {
    badge: "bg-orange-500 border-orange-500",
    text: "text-amber-50",
  },
  erotica: {
    badge: "bg-red-500 border-red-500",
    text: "text-rose-50",
  },
  pornographic: {
    badge: "bg-red-800 border-orange-800",
    text: "text-red-50",
  },
};

const statusStyles = {
  ongoing: {
    text: "text-emerald-50",
    icon: "bg-emerald-400",
  },
  completed: {
    text: "text-blue-50",
    icon: "bg-blue-400",
  },
  hiatus: {
    text: "text-amber-50",
    icon: "bg-amber-400",
  },
  cancelled: {
    text: "text-red-50",
    icon: "bg-red-400",
  },
};

const SearchMangaCard = ({
  formatCount,
  manga,
  handleMangaClicked,
  StarRating,
  timeSinceUpdate,
}) => {
  // Memoize remainingTagsCount
  const remainingTagsCount = useMemo(() => {
    const limit = 3;
    return manga.flatTags.length - limit;
  }, [manga.flatTags]);

  // Memoize ratingStyle with stable dependency
  const ratingStyle = useMemo(
    () =>
      contentRatingStyles[manga.contentRating?.toLowerCase()] || {
        badge: "bg-gradient-to-r from-slate-700 to-slate-600",
        text: "text-slate-200",
      },
    [manga.contentRating]
  );

  // Memoize statusStyle with stable dependency
  const statusStyle = useMemo(
    () =>
      statusStyles[manga.status] || {
        badge: "bg-gradient-to-r from-slate-700 to-slate-600",
        text: "text-slate-200",
        icon: "bg-slate-400",
      },
    [manga.status]
  );

  // Memoize bayesian rating for stability
  const bayesianRating = useMemo(
    () => manga?.rating?.rating?.bayesian || 0,
    [manga?.rating?.rating?.bayesian]
  );

  return (
    <article
      className="relative group w-full tracking-wide flex justify-center cursor-pointer"
      onClick={handleMangaClicked}
      role="button"
    >
      <div
        className={`relative w-[280px] group rounded-2xl overflow-hidden bg-slate-900  transition-shadow ease-out 
 hover:shadow-[0px_0px_7px_rgba(0,0,0,1)] hover:shadow-purple-500 shadow-[0px_0px_2px_rgba(0,0,0,1)] shadow-purple-500 scale-100
         transform`}
      >
        <div className="absolute group inset-0 z-10 h-20 bg-gradient-to-b from-black via-black/70 to-transparent" />
        <div className="relative h-[360px] overflow-hidden rounded-2xl">
          <Image
            src={manga.coverImageUrl || "/placeholder.jpg"}
            alt={manga.title}
            fill
            className={`object-cover transition-transform ease-out group-hover:scale-[102%]`}
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
            priority={false}
          />
          {/* Content Rating Badge */}
          <span
            className={`absolute z-20 top-3 text-xs opacity-70 right-2 min-w-24 flex justify-center items-center rounded-lg bg-opacity-40 border-2 py-1 px-4 font-bold shadow-lg backdrop-blur-md cursor-default select-none ${ratingStyle.badge} ${ratingStyle.text}`}
          >
            {(manga.contentRating || "Unknown").toUpperCase()}
          </span>
          {/* Status Badge */}
          <div
            className={`absolute z-20 top-3 left-2 opacity-70 gap-2 min-w-24 flex justify-center items-center rounded-lg bg-opacity-40 border-2 py-1 px-4 font-bold shadow-lg backdrop-blur-md cursor-default select-none border-gray-700 bg-[#121212]`}
          >
            <span className={`relative flex h-2 w-2 rounded-full ${statusStyle.icon}`} />
            <span className={`${statusStyle.text} text-xs font-bold tracking-wider`}>
              {(manga.status || "unknown").charAt(0).toUpperCase() +
                (manga.status || "unknown").slice(1)}
            </span>
          </div>
        </div>
        {/* Info Section */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="flex items-center gap-2 mb-4">
            <StableFlag code={manga.originalLanguage || "UN"} className="h-4 w-4 flex-shrink-0" />
            <h1 className="text-white font-bold text-lg line-clamp-1">{manga.title}</h1>
          </div>
          <div className="flex justify-between items-center mb-4">
            {bayesianRating > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-amber-400 font-bold text-sm">
                  {bayesianRating.toFixed(1)}
                </span>
                <StarRating rating={bayesianRating} />
              </div>
            )}
            <span className="text-xs text-gray-400 font-medium tracking-wide">
              {timeSinceUpdate(manga.updatedAt)}
            </span>
          </div>
          <div className="flex justify-between text-xs bg-slate-800/40 backdrop-blur-md p-2 rounded-lg">
            {[
              {
                icon: Heart,
                value: manga?.rating?.follows || 0,
                label: "Follows",
                color: "text-rose-500 fill-rose-500/20",
              },
              {
                icon: MessageSquareText,
                value: manga?.rating?.comments?.repliesCount || 0,
                label: "Comments",
                color: "text-sky-200/70 fill-blue-400/20",
              },
              {
                icon: Bookmark,
                value: manga?.rating?.bookmarks || 0,
                label: "Bookmarks",
                color: "text-emerald-500 fill-emerald-400/20",
              },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Icon className={`w-5 h-5 ${color} `} />
                  <span className={`${color} font-semibold`}>{formatCount(value)}</span>
                </div>
                <span className="text-[10px] text-gray-500">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-2 overflow-hidden h-6">
            {(manga.flatTags || []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-slate-800/70 backdrop-blur-sm text-white/90 text-[10px] px-2 py-0.5 rounded-md border border-slate-700/50 hover:bg-purple-900/40 transition-colors truncate"
                title={tag}
              >
                {tag}
              </span>
            ))}
            {remainingTagsCount > 0 && (
              <span className="bg-purple-800/60 text-purple-100 text-[10px] px-2 py-0.5 rounded-md border border-purple-700/50 truncate">
                +{remainingTagsCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(SearchMangaCard);