'use client';
import Image from "next/image";

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

    return (
        <>
            <div className="max-w-xs min-h-[435px] bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[101%] hover:shadow-lg">
            <div className="relative h-64">
                <Image
                    src={manga.coverImageUrl || '/placeholder.jpg'}
                    alt={manga.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[103%]"
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent">
                        <div className="flex w-full flex-col items-center justify-between   p-4 pb-1 ">
                        <h3 className="text-xl font-bold text-white mb-3 ">
                        {manga.title.length<12?manga.title:manga.title.slice(0,12)+"..."}
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
                                className={`px-2 py-1 text-xs shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold rounded-lg text-white ${getRatingColor(
                                    manga.contentRating
                                )}`}
                            >
                                {manga.contentRating.toUpperCase()}
                            </span>
                            {manga.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-gray-900 text-nowrap shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 p-1 rounded-lg border border-gray-800 text-xs transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-indigo-400">Alt Title:</span>  {manga.altTitle.length<25?manga.altTitle:manga.altTitle.slice(0,25)+"..."}
                        </p>
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
