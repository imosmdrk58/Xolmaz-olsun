import React, { memo, lazy } from "react";
import Image from "next/image";
import { Heart, MessageSquareText, Bookmark } from "lucide-react";
const StableFlag = memo(lazy(() => import("../../StableFlag")));

function SearchMangaList({
  formatCount,
  manga,
  handleMangaClicked,
  StarRating,
  timeSinceUpdate,
}) {
  return (
    <article
      className="relative mt-2 tracking-wide bg-gradient-to-br from-slate-950 to-slate-900 rounded-lg overflow-hidden border border-slate-800 cursor-pointer group hover:border-violet-500/50 hover:shadow-md hover:shadow-violet-500/20 group-hover:-translate-y-0.5 transition-transform"
      onClick={handleMangaClicked}
      role="button"
      aria-label={`Open manga ${manga.title}`}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-24 md:w-28 h-36 sm:h-32 md:h-40 flex-shrink-0">
          <Image
            src={manga.coverImageUrl || "/placeholder.jpg"}
            width={96}
            height={144}
            alt={`${manga.title} cover`}
            className="object-cover w-full h-full rounded-t-xl sm:rounded-l-md sm:rounded-tr-none transition-transform group-hover:scale-[102%]"
            loading="lazy"
            priority={false}
          />
          <StableFlag
            code={manga.originalLanguage || "UN"}
            className="h-auto w-3 sm:w-4 absolute bottom-1 sm:bottom-1.5 right-3 sm:right-4 shadow-black shadow-md"
          />
          <div className="absolute top-0 left-1 z-10">
            <span
              className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[9px]  font-medium backdrop-blur-md shadow-md ${
                {
                  safe: "bg-emerald-500/80 text-emerald-50 ring-1 ring-emerald-400",
                  suggestive: "bg-amber-500/80 text-amber-50 ring-1 ring-amber-400",
                  erotica: "bg-rose-500/80 text-rose-50 ring-1 ring-rose-400",
                  pornographic: "bg-red-900/80 text-red-50 ring-1 ring-red-800",
                }[manga.contentRating] || "bg-slate-700/80 text-slate-200 ring-1 ring-slate-600"
              }`}
            >
              {manga.contentRating === "pornographic"
                ? "ADULT"
                : manga.contentRating.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 sm:block sm:gap-0 p-3 sm:p-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
            <h3 className="font-bold  mt-2 sm:-mt-4 text-base max-w-[60%] sm:text-lg text-white leading-tight tracking-wide group-hover:text-violet-300 transition-colors line-clamp-1">
              {manga.title}
            </h3>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 md:gap-4">
              <span
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium ${
                  {
                    ongoing: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30",
                    completed: "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30",
                    hiatus: "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30",
                    cancelled: "bg-red-500/20 text-red-400 ring-1 ring-red-500/30",
                  }[manga.status] || "bg-slate-700/20 text-slate-400 ring-1 ring-slate-700/30"
                }`}
              >
                <span
                  className={`relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-lg ${
                    {
                      ongoing: "bg-emerald-400",
                      completed: "bg-blue-400",
                      hiatus: "bg-amber-400",
                      cancelled: "bg-red-400",
                    }[manga.status] || "bg-slate-400"
                  }`}
                />
                {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
              </span>
              <div className="relative flex items-center gap-2 sm:gap-4 bg-slate-900/60 backdrop-blur-md rounded-lg py-1 sm:py-1.5 px-2 sm:px-2.5 border border-slate-800/60">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500/20" />
                  <span className="text-[10px] sm:text-xs font-medium text-slate-300">
                    {manga.rating?.follows ? formatCount(manga.rating.follows) : "0"}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 fill-sky-500/20" />
                  <span className="text-[10px] sm:text-xs font-medium text-slate-300">
                    {manga.rating?.comments?.repliesCount
                      ? formatCount(manga.rating.comments.repliesCount)
                      : "0"}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 fill-emerald-500/20" />
                  <span className="text-[10px] sm:text-xs font-medium text-slate-300">
                    {manga.rating?.bookmarks ? formatCount(manga.rating.bookmarks) : "0"}
                  </span>
                </div>
              </div>
              <span className="text-slate-500 tracking-widest text-[10px] sm:text-xs whitespace-nowrap md:mr-16 lg:mr-0">
                Updated {timeSinceUpdate(manga.updatedAt)}
              </span>
              {manga.rating?.rating?.bayesian > 0 && (
                <div className="bg-slate-800/70 -mt-3 top-7 right-3 sm:-mt-4 absolute lg:relative md:top-1 md:-right-4 lg:right-0 md:bg-transparent lg:bg-slate-800/70 md:flex-col lg:flex-row backdrop-blur-sm md:backdrop-blur-none lg:backdrop-blur-sm rounded-lg p-1.5 sm:p-2 px-2 sm:px-2.5 flex items-center gap-1 sm:gap-1.5 shadow-inner">
                  <span className="text-amber-400 font-bold text-sm sm:text-base leading-none">
                    {manga.rating.rating.bayesian.toFixed(1)}
                  </span>
                  <div className="transform md:bg-slate-800 lg:bg-transparent rounded-lg md:p-1.5 sm:p-2 lg:p-0 md:rotate-90 md:transform md:translate-y-8 sm:translate-y-10 lg:translate-y-0 lg:rotate-0">
                    <StarRating rating={manga.rating.rating.bayesian} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-1 sm:mb-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex flex-wrap gap-1 max-w-full">
                {manga.flatTags.slice(0, 7).map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-800 text-slate-300 text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-md border border-slate-700/30 hover:bg-violet-900/40 hover:border-violet-700/40 hover:text-violet-200 transition-colors truncate"
                    title={tag}
                  >
                    {tag}
                  </span>
                ))}
                {manga.flatTags.length > 7 && (
                  <span className="bg-violet-900/30 text-violet-300 text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-md border border-violet-700/30 truncate">
                    +{manga.flatTags.length - 6}
                  </span>
                )}
              </div>
            </div>
            <p className="text-[10px] sm:text-xs mt-1 sm:mt-1.5 text-white flex flex-wrap items-center gap-1 sm:gap-1.5">
              <span className="font-medium">
                By {manga.artistName[0]?.attributes?.name || "Unknown"}
              </span>
              {manga.year && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 tracking-wide">{manga.year}</span>
                </>
              )}
            </p>
          </div>
          <p className="text-[10px] sm:text-xs tracking-wide text-slate-400 mb-0.5 leading-relaxed line-clamp-2 max-w-full sm:max-w-[85%]">
            {manga.description || "No description available"}
          </p>
        </div>
      </div>
    </article>
  );
}

export default memo(SearchMangaList);