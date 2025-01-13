'use client';
import Image from "next/image";

const MangaCard = ({ manga }) => {
    console.log(manga);
    return (
        <div className="max-w-sm bg-gray-900 hover:scale-[101%] rounded-lg shadow-lg overflow-hidden group">
            <div className="relative h-60">
                <Image
                    src={manga.coverImageUrl || '/placeholder.jpg'}
                    alt={manga.title}
                    fill
                    className="group-hover:scale-[101%] transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent">
                    <h3 className="text-lg font-bold bg-black bg-opacity-60 text-center text-white truncate">
                        {manga.title}
                    </h3>
                    <div className="flex items-center bg-black bg-opacity-60 p-2 rounded-lg justify-around gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                            <img src="/star.svg" alt="Rating" className="w-4 h-4" />
                            <span>{manga?.rating?.rating?.average || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                            <img src="/comment.svg" alt="Comments" className="w-4 h-4" />
                            <span>{manga?.rating?.comments?.repliesCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                            <img src="/heart.svg" alt="Likes" className="w-4 h-4" />
                            <span>{manga?.rating?.follows || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-2">
                <p className="text-sm text-gray-400 truncate">
                    <span className="font-semibold text-indigo-300">Alt Title:</span> {manga.altTitle || "N/A"}
                </p>
                {/* <p className="text-sm text-gray-400 truncate">
                    <span className="font-semibold text-indigo-300">Author:</span> {manga.authorName || "Unknown"}
                </p>
                <p className="text-sm text-gray-400 truncate">
                    <span className="font-semibold text-indigo-300">Artist:</span> {manga.artistName || "Unknown"}
                </p> */}
                <p className="text-sm text-gray-400 truncate">
                    <span className="font-semibold text-indigo-300">Last Chapter:</span>{" "}
                    {(() => {
                        const timeDifference = Math.floor((new Date() - new Date(manga.updatedAt)) / 60000);
                        const hours = Math.floor(timeDifference / 60);
                        const minutes = timeDifference % 60;
                        return `${hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""} ${minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : ""} ago`;
                    })()}
                </p>
            </div>
        </div>
    );
};

export default MangaCard;
