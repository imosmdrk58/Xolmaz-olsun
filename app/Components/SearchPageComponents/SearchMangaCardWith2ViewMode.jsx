import React, { useCallback, lazy } from "react";
import Image from "next/image";
import { useNavigate } from "react-router-dom";
import { getRatingColor } from "../../constants/Flags"
const StableFlag = React.memo(lazy(() => import('../StableFlag')));
const SearchMangaCardWith2ViewMode = ({ manga, viewMode }) => {
    const navigate = useNavigate();
    const contentRatingColors = {
        safe: 'bg-emerald-600',
        suggestive: 'bg-amber-600',
        erotica: 'bg-rose-600',
        pornographic: 'bg-red-700'
    };

    const statusColors = {
        ongoing: 'bg-emerald-600',
        completed: 'bg-blue-600',
        hiatus: 'bg-amber-600',
        cancelled: 'bg-red-600'
    };

    const statusLabels = {
        ongoing: 'Ongoing',
        completed: 'Completed',
        hiatus: 'Hiatus',
        cancelled: 'Cancelled'
    };
    // Generate manga URL for linking
    const mangaUrl = `https://mangadex.org/title/${manga.id}`;
    const handleMangaClicked = useCallback((manga) => {
        navigate(`/manga/${manga.id}/chapters`, { state: { manga } });
    }, []);
    if (viewMode === 'grid') {
        return (
            <div
                key={manga.id}
                onClick={() => handleMangaClicked(manga)}
                className="manga-card cursor-pointer w-full min-h-[400px] flex justify-center items-start"
            >
                <div className="w-[250px] overflow-hidden rounded-[10px] bg-[#0c0221] p-[5px] shadow-slate-600 shadow-[0_0_4px_rgba(0,0,0,1)] transition-transform duration-300 ease-out hover:scale-[102%] will-change-transform">
                    <div className="relative flex h-[250px] flex-col rounded-[15px] bg-gradient-to-tr from-[#049fbb] to-[#50f6ff]">
                        <Image
                            src={manga.coverImageUrl || '/placeholder.jpg'}
                            alt={manga.title}
                            fill
                            className="object-cover relative -mt-[1px] flex h-[250px] flex-col rounded-[7px] rounded-tl-[20px] bg-gradient-to-tr from-[#1f2020] to-[#000d0e]"
                            placeholder="blur"
                            blurDataURL="/placeholder.jpg"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent p-4">
                            <h1 className="flex flex-row font-bold items-start justify-center text-xs tracking-[2px] text-white">
                                <StableFlag code={manga.originalLanguage || "UN"} />
                                {manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title}
                            </h1>
                        </div>
                        <div className="relative z-20 h-[39px] -mt-1 w-[145px] -skew-x-[40deg] rounded-br-[10px] bg-[#0c0221] shadow-[-10px_-10px_0_0_#0c0221] before:absolute before:right-[-2px] before:top-0 before:h-[12px] before:w-[129px] before:rounded-tl-[10px]" />
                        <div className="absolute left-0 top-[34px] h-[55px] w-[125px] before:absolute before:h-full before:w-full before:rounded-tl-[15px] before:shadow-[-5px_-5px_0_2px_#0c0221]" />
                        <div className="absolute top-0 flex h-[30px] w-full justify-between">
                            <div className="h-full aspect-square pb-[2px]">
                                <span className="absolute -mt-[1px] top-0 left-0 z-30 text-xs tracking-widest rounded-full py-1 pr-2 min-w-24 flex items-center justify-end font-bold">
                                    <svg width="24" height="24" viewBox="0 0 6.35 6.35" fill={manga.status === "completed" ? "#00c9f5" : manga.status === "ongoing" ? "#04d000" : "#da7500"}>
                                        <circle cx="3.175" cy="3.175" r="1.058" />
                                    </svg>
                                    {manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}
                                </span>
                            </div>
                            <div className="flex">
                                <span className={`${manga.contentRating.toUpperCase() === "SAFE" ? "pr-8" : manga.contentRating.toUpperCase() === "EROTICA" ? "pr-5" : "pr-2"} z-10 tracking-widest mt-[1px] mr-2 top-0 right-0 bg-gray-900 flex items-center justify-end text-center border-2 absolute py-[7px] min-w-36 text-[9px] font-semibold rounded-xl text-white bg-opacity-70 ${getRatingColor(manga.contentRating.toString() + "Border") || getRatingColor("default")} backdrop-blur-lg ${getRatingColor(manga.contentRating) || getRatingColor("default")}`}>
                                    {manga.contentRating.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-[5px_10px] w-full">
                        <div className="flex justify-between mt-2 text-gray-300 text-sm">
                            {["star", "comment", "heart"].map((icon, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Image width={300} height={300} src={`/${icon}.svg`} alt={icon} className="w-4 h-4" />
                                    <span>
                                        {icon === "comment" ? (manga?.rating?.comments?.repliesCount > 1000 ? manga?.rating?.comments?.repliesCount.toString()[0] + "K" : manga?.rating?.comments?.repliesCount || 0) :
                                            icon === "heart" ? (manga?.rating?.follows > 1000 ? manga?.rating?.follows?.toString()[0] + "K" : manga?.rating?.follows || 0) :
                                                manga?.rating?.rating?.bayesian?.toFixed(2) || "N/A"}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex flex-col min-h-[100px] justify-between">
                            {/* <div className="text-xs text-gray-400 bg-[#070920] rounded-md px-2 py-1 text-center flex justify-center items-center w-full gap-4">
                                                 Translated Language  :<StableFlag code={langToCountry[manga.availableTranslatedLanguages[0]] || "UN"} className="w-6 shadow-md shadow-black mr-2" />
                                                 {manga.availableTranslatedLanguages[0]}
                                             </div> */}
                            <div className="flex flex-wrap gap-1">
                                {manga.flatTags.slice(0, 4).map(tag => (
                                    <span key={tag} className="bg-[#070920] backdrop-blur-md min-w-16 shadow-lg px-3 py-1.5 border border-gray-700 transition-colors hover:bg-gray-800 text-center flex flex-row font-bold items-start justify-center text-[10px] tracking-[1.5px] text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs w-full pr-6 relative z-30 flex justify-center items-center text-center bottom-1 text-gray-400 mt-4">
                                Last updated: {(() => {
                                    const minutes = Math.floor((new Date() - new Date(manga.updatedAt)) / 60000);
                                    return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
                                })()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // List view
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-purple-600 transition duration-200">
                <div className="flex flex-col sm:flex-row">
                    <a
                        href={mangaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:w-36 md:w-40 flex-shrink-0 relative group"
                    >
                        <div className="aspect-w-3 aspect-h-4 bg-slate-800 h-full">
                            <Image
                                src={manga.coverImageUrl || '/placeholder.jpg'}
                                width={300}
                                height={300}
                                alt={`${manga.title} cover`}
                                className="object-cover max-h-72 w-full h-full transform group-hover:scale-105 transition duration-300"
                                loading="lazy"
                            />
                        </div>

                        {/* Content rating badge */}
                        <div className={`absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded ${contentRatingColors[manga.contentRating] || 'bg-slate-600'}`}>
                            {manga.contentRating === 'pornographic' ? 'Adult' :
                                manga.contentRating.charAt(0).toUpperCase() + manga.contentRating.slice(1)}
                        </div>
                    </a>

                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h3 className="font-semibold text-lg text-slate-200 hover:text-purple-400 transition">
                                    <a
                                        href={mangaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={manga.title}
                                    >
                                        {manga.title}
                                    </a>
                                </h3>

                                <p className="text-sm text-slate-400 mt-1">
                                    By {manga.artistName[0].attributes.name}
                                    {manga.year && ` • ${manga.year}`}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${statusColors[manga.status] || 'bg-slate-600'}`}>
                                    {statusLabels[manga.status] || 'Unknown'}
                                </span>

                                {manga.rating.rating.bayesian > 0 && (
                                    <span className="bg-slate-800 text-amber-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                        <Image width={300} height={300} src={`/star.svg`} alt={"star"} className="w-4 h-4" />
                                        {manga.rating.rating.bayesian.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-slate-400 mt-2 line-clamp-2 flex-1">
                            {manga.description?.length > 150
                                ? `${manga.description.substring(0, 150).trim()}...`
                                : manga.description || 'No description available'}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-3">
                            {manga.flatTags.slice(0, 6).map(genre => (
                                <span
                                    key={genre}
                                    className="inline-block bg-slate-800 text-slate-400 rounded px-2 py-0.5 text-xs"
                                >
                                    {genre}
                                </span>
                            ))}
                            {manga.flatTags.length > 6 && (
                                <span className="inline-block bg-slate-800 text-slate-400 rounded px-2 py-0.5 text-xs">
                                    +{manga.flatTags.length - 6}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default SearchMangaCardWith2ViewMode