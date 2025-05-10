import React, { memo, lazy, useMemo } from 'react'
import Image from 'next/image';
import { Heart, MessageSquareText, Bookmark } from 'lucide-react';
const StableFlag = memo(lazy(() => import("../../StableFlag")));
function SearchMangaList({ formatCount, manga, handleMangaClicked, StarRating, timeSinceUpdate }) {
    return (
        <article
            className={`relative mt-2 tracking-wide bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl overflow-hidden border border-slate-800 cursor-pointer group hover:border-violet-500/50 hover:shadow-md hover:shadow-violet-500/20 group-hover:translate-y-[-2px]`}
            onClick={handleMangaClicked}
            role="button"
            aria-label={`Open manga ${manga.title}`}
        >
            <div className="flex">
                {/* Left Column: Cover with Gradient Overlay */}
                <div className="relative w-28 md:w-32 h-40 md:h-40 flex-shrink-0">
                    <Image
                        src={manga.coverImageUrl || "/placeholder.jpg"}
                        width={136}
                        height={204}
                        alt={`${manga.title} cover`}
                        className={`object-cover w-full h-full rounded-l-xl transition-all  group-hover:scale-[102%]`}
                        loading="lazy"
                        priority={false}
                    />
                    <StableFlag code={manga.originalLanguage || "UN"} className="h-auto w-4 absolute bottom-1.5 right-4 shadow-black shadow-md" />

                    {/* Content Rating Badge */}
                    <div className="absolute top-0 left-1 z-10">
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium backdrop-blur-md shadow-md ${{
                                'safe': 'bg-emerald-500/80 text-emerald-50 ring-1 ring-emerald-400',
                                'suggestive': 'bg-amber-500/80 text-amber-50 ring-1 ring-amber-400',
                                'erotica': 'bg-rose-500/80 text-rose-50 ring-1 ring-rose-400',
                                'pornographic': 'bg-red-900/80 text-red-50 ring-1 ring-red-800'
                            }[manga.contentRating] || 'bg-slate-700/80 text-slate-200 ring-1 ring-slate-600'}`}
                        >
                            {manga.contentRating === "pornographic"
                                ? "ADULT"
                                : manga.contentRating.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-4 relative overflow-hidden">
                    {/* Top Info Bar */}
                    <div className="flex items-center gap-2 mb-1.5 justify-between">
                        <div className="flex flex-row gap-4 items-center">
                            <h3 className="font-bold text-lg text-white leading-tight tracking-wide group-hover:text-violet-300 transition-colors line-clamp-1">
                                {manga.title}
                            </h3>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-2.5">
                            {/* Status Badge - Redesigned */}
                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${{
                                    'ongoing': 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30',
                                    'completed': 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30',
                                    'hiatus': 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30',
                                    'cancelled': 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                                }[manga.status] || 'bg-slate-700/20 text-slate-400 ring-1 ring-slate-700/30'
                                    }`}
                            >
                                <span className={`relative flex h-2 w-2 rounded-lg  ${{
                                    'ongoing': 'bg-emerald-400',
                                    'completed': 'bg-blue-400',
                                    'hiatus': 'bg-amber-400',
                                    'cancelled': 'bg-red-400'
                                }[manga.status] || 'bg-slate-400'
                                    }`} />
                                {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
                            </span>

                            <div className="relative flex items-center gap-4 bg-slate-900/60 backdrop-blur-md rounded-lg py-1.5 px-2.5 border border-slate-800/60">
                                <div className="flex items-center gap-1">
                                    <Heart className={`w-5 h-5 text-rose-500 fill-rose-500/20 `} />
                                    <span className="text-xs font-medium text-slate-300">
                                        {manga.rating?.follows ? formatCount(manga.rating.follows) : "0"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquareText className={`w-5 h-5 text-sky-500 fill-sky-500/20 `} />
                                    <span className="text-xs font-medium text-slate-300">
                                        {manga.rating?.comments?.repliesCount ? formatCount(manga.rating.comments.repliesCount) : "0"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Bookmark className={`w-5 h-5 text-emerald-500 fill-emerald-500/20 `} />
                                    <span className="text-xs font-medium text-slate-300">
                                        {manga.rating?.bookmarks ? formatCount(manga.rating.bookmarks) : "0"}
                                    </span>
                                </div>
                            </div>
                            {/* Update Time */}
                            <span className="text-slate-500 tracking-widest absolute bottom-2 right-4 text-xs">
                                Updated {timeSinceUpdate(manga.updatedAt)}
                            </span>
                            {/* Rating */}
                            {manga.rating?.rating?.bayesian > 0 && (
                                <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-2 px-2.5  flex items-center gap-1.5 shadow-inner">
                                    <span className="text-amber-400 font-bold text-base leading-none">
                                        {manga.rating.rating.bayesian.toFixed(1)}
                                    </span>
                                    <StarRating rating={manga.rating.rating.bayesian} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title and Author Section */}
                    <div className="mb-1.5">
                        {/* Bottom Section with Metrics and Tags */}
                        <div className="flex items-center justify-between ">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 max-w-full ">
                                {manga.flatTags.slice(0, 7).map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-slate-800 text-slate-300 text-xs px-1.5 py-0.5 rounded-md border border-slate-700/30 hover:bg-violet-900/40 hover:border-violet-700/40 hover:text-violet-200 transition-colors truncate"
                                        title={tag}
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {manga.flatTags.length > 7 && (
                                    <span className="bg-violet-900/30 text-violet-300 text-xs px-1.5 py-0.5 rounded-md border border-violet-700/30 truncate">
                                        +{manga.flatTags.length - 6}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-xs mt-1.5 text-white flex items-center gap-1.5">
                            <span className="font-medium ">
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

                    {/* Description */}
                    <p className="text-xs tracking-wide  text-slate-400 mb-0.5 leading-relaxed line-clamp-2 max-w-[85%]">
                        {manga.description || "No description available"}
                    </p>
                </div>
            </div>
        </article>
    )
}

export default SearchMangaList