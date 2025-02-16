'use client';
import Image from "next/image";
import Flag from "react-world-flags";

const MangaCard = ({ processedLatestMangas, handleMangaClicked }) => {
    const getRatingColor = (rating) => {
        switch (rating) {
            case "safe":
                return "bg-green-600 border-green-600";
            case "suggestive":
                return "bg-yellow-600 border-yellow-600";
            case "erotica":
                return "bg-red-600 border-red-600";
            default:
                return "bg-gray-600 border-gray-600";
        }
    };
    const langToCountryMap = {
        ja: "JP",
        ms: "MY",
        ko: "KR",
        en: "US",
        zh: "CN",
    };

    return (
        <>
            <div className="grid w-10/12 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {processedLatestMangas.map((manga, index) => (
                    <div
                        key={manga.id}
                        onClick={() => { handleMangaClicked(manga) }}
                        className="group cursor-pointer"
                    >
                        <div className="bg-gray-800 overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[102%] hover:shadow-xl min-h-[440px]">
                            <span
                                className={`px-3 min-w-20 text-center border-2 absolute bg-opacity-70 backdrop-blur-lg top-2 left-2 z-10 py-1.5 text-xs shadow-lg font-semibold rounded-lg text-white ${getRatingColor(
                                    manga.contentRating
                                )}`}
                            >
                                {manga.contentRating.toUpperCase()}
                            </span>

                            <span className="flex absolute top-2 right-2 font-bold z-10 text-xs justify-center items-center flex-row bg-gray-900 bg-opacity-90 py-1 px-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 6.35 6.35" className="icon mr-1">
                                    <path fill={manga.status === "completed" ? "#00c9f5" : manga.status === "ongoing" ? "#04d000" : "#da7500"} d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"></path>
                                </svg>
                                <span>{manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}</span>
                            </span>

                            <div className="relative h-80">
                                <Image
                                    src={manga.coverImageUrl || '/placeholder.jpg'}
                                    alt={manga.title}
                                    fill
                                    className="object-cover transition-transform duration-500 "
                                    placeholder="blur"
                                    blurDataURL="/placeholder.jpg"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent pt-8">
                                    <div className="flex w-full flex-col items-center justify-between p-4 pb-2">
                                        <h3 className="text-sm font-bold text-white mb-4 flex justify-center items-start">
                                            <Flag
                                                code={langToCountryMap[manga.originalLanguage] || "UN"}
                                                className="w-6 shadow-lg shadow-black mt-0.5 mr-2"
                                                alt="flag"
                                            />
                                            {manga.title}
                                        </h3>

                                        <div className="flex flex-row w-full items-center justify-between px-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <img src="/star.svg" alt="Rating" className="w-4 h-4" />
                                                <span>{manga?.rating?.rating?.average || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <img src="/comment.svg" alt="Comments" className="w-4 h-4" />
                                                <span>{manga?.rating?.comments?.repliesCount || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <img src="/heart.svg" alt="Likes" className="w-4 h-4" />
                                                <span>{manga?.rating?.follows || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-800">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {manga.flatTags.slice(0, 4).map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-gray-900 min-w-16 text-center text-nowrap shadow-lg shadow-black/20 px-3 py-1.5 rounded-lg border border-gray-700 text-sm transition-colors hover:bg-gray-800"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 mt-4 text-center">
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
                    </div>
                ))}
            </div>
        </>
    );
};

export default MangaCard;