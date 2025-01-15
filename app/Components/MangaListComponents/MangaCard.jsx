'use client';
import Image from "next/image";
import Flag from "react-world-flags";

const MangaCard = ({ manga }) => {
    const getRatingColor = (rating) => {
        switch (rating) {
            case "safe":
                return "bg-green-600";
            case "suggestive":
                return "bg-yellow-600";
            case "erotica":
                return "bg-red-600";
            default:
                return "bg-gray-600";
        }
    };
    const langToCountryMap = {
        ja: "JP", // Japanese
        ms: "MY", // Malay
        ko: "KR", // Korean
        en: "US", // English
        zh: "CN", // Chinese
    };

    const countryCode = langToCountryMap[manga.originalLanguage] || "UN"; // UN for unknown flag
    return (
        <>
            <div className="max-w-xs min-h-[385px] bg-gray-800 overflow-hidden rounded-lg shadow-md  transform transition-transform duration-300 hover:scale-[101%] hover:shadow-lg">

                <span className="flex absolute top-1 right-1 font-bold z-10 text-[10px] justify-center items-center flex-row bg-gray-900   py-0.5 pr-2 pl-0 rounded-md ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 6.35 6.35" className="icon">
                        <path fill={manga.status === "completed" ? "#00c9f5" : manga.status === "ongoing" ? "#04d000" : "#da7500"} d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"></path>
                    </svg>
                    <span>{manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}</span>
                </span>
                <div className="relative h-64">
                    <Image
                        src={manga.coverImageUrl || '/placeholder.jpg'}
                        alt={manga.title}
                        fill
                        className="object-cover transition-transform duration-500 "
                        placeholder="blur"
                        blurDataURL="/placeholder.jpg"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent">
                        <div className="flex w-full flex-col items-center justify-between   p-3 pb-1 ">
                            <h3 className="text-xs font-bold text-white mb-3  flex justify-center items-start">
                            <Flag
                    code={countryCode}
                    className="w-5  shadow-[0_0_4px_rgba(0,0,0,1)] shadow-black mt-0.5  mr-2"
                    alt="flag"
                />
                                {manga.title}
                            </h3>

                            <div className="flex flex-row w-full  items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-300">
                                    <img src="/star.svg" alt="Rating" className="w-3 h-3" />
                                    <span>{manga?.rating?.rating?.average || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-300">
                                    <img src="/comment.svg" alt="Comments" className="w-3 h-3" />
                                    <span>{manga?.rating?.comments?.repliesCount || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-300">
                                    <img src="/heart.svg" alt="Likes" className="w-3 h-3" />
                                    <span>{manga?.rating?.follows || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="p-4 bg-gray-800">

                    {/* Manga Info */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-1">
                            <span
                                className={`px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold rounded-lg text-white ${getRatingColor(
                                    manga.contentRating
                                )}`}
                            >
                                {manga.contentRating.toUpperCase()}
                            </span>

                            {manga.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-gray-900 text-nowrap shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 p-1 rounded-lg border border-gray-800 text-xs transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                    </div>
                    {/* Last Updated */}
                    <p className="text-[10px] absolute left-0 right-0 bottom-2 brightness-150 text-gray-500 mt-2 text-center">
                        Last updated:{" "}
                        {(() => {
                            const timeDifference = Math.floor((new Date() - new Date(manga.updatedAt)) / 60000);
                            const hours = Math.floor(timeDifference / 60);
                            const minutes = timeDifference % 60;
                            return `${hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""} ${minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : ""
                                } ago`;
                        })()}
                    </p>
                </div>
            </div>
        </>
    );
};

export default MangaCard;
