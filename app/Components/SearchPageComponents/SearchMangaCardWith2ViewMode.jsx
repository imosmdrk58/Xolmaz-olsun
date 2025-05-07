import React, { useCallback, useState, memo, lazy, useMemo } from "react";
import Image from "next/image";
import { useNavigate } from "react-router-dom";

const StableFlag = memo(lazy(() => import("../StableFlag")));

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

const formatCount = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const timeSinceUpdate = (dateString) => {
    const timeDiff = Date.now() - new Date(dateString);
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    return `${minutes}m ago`;
};

const StarRating = memo(({ rating }) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating / 2 - fullStars >= 0.5;

    return (
        <div className="flex gap-0.5" aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
            {[...Array(5)].map((_, i) => {
                if (i < fullStars) {
                    return (
                        <svg
                            key={i}
                            className="w-4 h-4 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-4.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-4.292z" />
                        </svg>
                    );
                }
                if (hasHalfStar && i === fullStars) {
                    return (
                        <svg
                            key={i}
                            className="w-4 h-4 text-amber-400"
                            fill="url(#half-gradient)"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient id="half-gradient">
                                    <stop offset="50%" stopColor="currentColor" />
                                    <stop offset="50%" stopColor="#475569" />
                                </linearGradient>
                            </defs>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-4.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-4.292z" />
                        </svg>
                    );
                }
                return (
                    <svg
                        key={i}
                        className="w-4 h-4 text-slate-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-4.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-4.292z" />
                    </svg>
                );
            })}
        </div>
    );
});

const SkeletonLoader = memo(() => (
    <div className="absolute inset-0 bg-slate-900 animate-pulse" />
));

const SearchMangaCardWith2ViewMode = ({ manga, viewMode }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleMangaClicked = useCallback(() => {
        navigate(`/manga/${manga.id}/chapters`, { state: { manga } });
    }, [navigate, manga]);

    // const mangaUrl = useMemo(() => `https://mangadex.org/title/${manga.id}`, [manga.id]);

    const ratingStyle = useMemo(
        () =>
            contentRatingStyles[manga.contentRating.toLowerCase()] || {
                badge: "bg-gradient-to-r from-slate-700 to-slate-600",
                text: "text-slate-200",
            },
        [manga.contentRating]
    );

    const statusStyle = useMemo(
        () =>
            statusStyles[manga.status] || {
                badge: "bg-gradient-to-r from-slate-700 to-slate-600",
                text: "text-slate-200",
                icon: "bg-slate-400",
            },
        [manga.status]
    );

    const remainingTagsCount = useMemo(() => {
        const limit = 3;
        return manga.flatTags.length - limit;
    }, [manga.flatTags.length, isHovered]);

    return viewMode === "grid" ? (
        <article
            className="relative w-full flex justify-center cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Open manga ${manga.title}`}
            onClick={handleMangaClicked}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleMangaClicked();
            }}
        >
            <div
                className={`relative w-[280px] rounded-2xl overflow-hidden bg-slate-900 shadow-lg transition-shadow  ease-out ${isHovered ? "shadow-purple-600/50 scale-[1.02]" : "shadow-purple-900/20 scale-100"
                    } transform`}
            >
                <div className="absolute inset-0 z-10 h-20 bg-gradient-to-b from-black via-black/70 to-transparent " />
                <div className="relative h-[360px] overflow-hidden rounded-2xl">
                    <Image
                        src={manga.coverImageUrl || "/placeholder.jpg"}
                        alt={manga.title}
                        fill
                        className={`object-cover transition-transform  ease-out ${isHovered ? "scale-105 blur-sm" : "scale-100 blur-0"
                            } `}
                        placeholder="blur"
                        blurDataURL="/placeholder.jpg"
                        priority={false}
                    />
                    <div
                        className={`absolute flex justify-center items-center inset-0 bg-gradient-to-t bg-black/70 transition-opacity  ${isHovered ? "opacity-100 z-50" : "opacity-10"
                            }`}
                    >
                        <button
                            onClick={handleMangaClicked}
                            className={`text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg border-2 border-purple-600 bg-opacity-55 font-semibold transition-opacity  ${isHovered ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
                                }`}
                            type="button"
                        >
                            Read Now
                        </button>
                    </div>
                    {/* Content Rating Badge */}
                    <span
                        className={`absolute z-20 top-4 text-xs opacity-70 right-4 min-w-24 flex justify-center items-center rounded-lg  bg-opacity-40 border-2 py-1 px-4 font-bold shadow-lg backdrop-blur-md cursor-default select-none
              ${ratingStyle.badge} ${ratingStyle.text}`}
                    >
                        {manga.contentRating.toUpperCase()}
                    </span>
                    {/* Status Badge */}
                    <div className={`absolute z-20 top-4 left-4 opacity-70 gap-2 min-w-24 flex justify-center items-center rounded-lg  bg-opacity-40 border-2 py-1 px-4 font-bold shadow-lg backdrop-blur-md cursor-default select-none border-gray-700 bg-[#121212]`}>
                        <span className={`relative flex h-2 w-2 rounded-full ${statusStyle.icon}`} />
                        <span className={`${statusStyle.text} text-xs  font-bold tracking-wider `}>
                            {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
                        </span>
                    </div>
                </div>
                {/* Info Section */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <div className="flex items-center gap-2 mb-4">
                        <StableFlag code={manga.originalLanguage || "UN"} className="h-4 w-4 flex-shrink-0" />
                        <h1 className="text-white font-bold text-lg  line-clamp-1">{manga.title}</h1>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        {manga?.rating?.rating?.bayesian > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="text-amber-400 font-bold text-sm">
                                    {manga.rating.rating.bayesian.toFixed(1)}
                                </span>
                                <StarRating rating={manga.rating.rating.bayesian} />
                            </div>
                        )}
                        <span className="text-xs text-gray-400 font-medium">{timeSinceUpdate(manga.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between text-xs bg-slate-800/40 backdrop-blur-md p-2 rounded-lg">
                        {[
                            {
                                icon: "heart",
                                value: manga?.rating?.follows,
                                label: "Follows",
                                color: "text-rose-400",
                            },
                            {
                                icon: "comment",
                                value: manga?.rating?.comments?.repliesCount,
                                label: "Comments",
                                color: "text-blue-400",
                            },
                            {
                                icon: "bookmark",
                                value: manga?.rating?.bookmarks,
                                label: "Bookmarks",
                                color: "text-purple-400",
                            },
                        ].map(({ icon, value, label, color }) => (
                            <div key={icon} className="flex flex-col items-center">
                                <div className="flex items-center gap-1">
                                    <Image
                                        width={14}
                                        height={14}
                                        src={`/${icon}.svg`}
                                        alt={icon}
                                        className={`w-4.5 h-4.5 ${color}`}
                                        priority={false}
                                    />
                                    <span className={`${color} font-semibold`}>{value ? formatCount(value) : "0"}</span>
                                </div>
                                <span className="text-[10px] text-gray-500">{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 overflow-hidden h-6">
                        {manga.flatTags.slice(0, 3).map((tag) => (
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
    ) : (
        <article
            className={`relative mt-2 tracking-wide bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl overflow-hidden border border-slate-800 cursor-pointer group hover:border-violet-500/50 hover:shadow-md hover:shadow-violet-500/20 ${isHovered ? "translate-y-[-2px]" : ""}`}
            onClick={handleMangaClicked}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleMangaClicked();
            }}
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
                        className={`object-cover w-full h-full rounded-l-xl transition-all  ${isHovered ? "scale-[102%]" : "scale-100"}`}
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
                                    <span className="text-rose-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-4.656z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span className="text-xs font-medium text-slate-300">
                                        {manga.rating?.follows ? formatCount(manga.rating.follows) : "0"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-4.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-4.123C2.493 12.767 2 11.434 2 10c0-4.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span className="text-xs font-medium text-slate-300">
                                        {manga.rating?.comments?.repliesCount ? formatCount(manga.rating.comments.repliesCount) : "0"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-violet-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-4-2.5L5 18V4z" />
                                        </svg>
                                    </span>
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
                                <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-1.5 px-2.5 flex items-center gap-1.5 shadow-inner">
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
    );
};

export default memo(SearchMangaCardWith2ViewMode);
