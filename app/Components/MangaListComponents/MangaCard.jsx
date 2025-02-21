'use client';
import Image from "next/image";
import Flag from "react-world-flags";
import { motion } from "framer-motion";

const stagger = 0.2;
const variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

const ratingColors = {
    safe: "bg-green-600 border-green-600",
    suggestive: "bg-yellow-600 border-yellow-600",
    erotica: "bg-red-600 border-red-600",
    default: "bg-gray-600 border-gray-600",
};

const langToCountry = { ja: "JP", ms: "MY", ko: "KR", en: "US", zh: "CN" };

const MangaCard = ({ processedLatestMangas, handleMangaClicked }) => (
    <div className="w-full flex flex-col bg-black/10">
        <div className="mx-20 pb-7 text-2xl font-bold text-purple-200 tracking-wide uppercase ">
            <h1 className=" border-b-4 border-purple-900 w-fit pb-2">      Latest Releases
            </h1>
        </div>
        <div className="grid w-[93%] ml-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {processedLatestMangas.map((manga, index) => (
                <motion.div
                    key={manga.id}
                    onClick={() => handleMangaClicked(manga)}
                    className="group cursor-pointer"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * stagger, ease: "easeInOut", duration: 0.5 }}
                >
                    <div className="bg-gray-800 shadow-lg transform transition-all duration-300 hover:scale-[102%] hover:shadow-xl min-h-[440px] overflow-hidden relative">
                        <span className={`px-3 text-center border-2 absolute top-1 left-1 z-10 py-[6px] min-w-24 text-xs font-semibold  text-white bg-opacity-70 backdrop-blur-lg ${ratingColors[manga.contentRating] || ratingColors.default}`}>
                            {manga.contentRating.toUpperCase()}
                        </span>
                        <span className="absolute top-1 right-1 z-10 text-xs bg-gray-900 bg-opacity-90 py-1 px-3  flex items-center font-bold">
                            <svg width="24" height="24" viewBox="0 0 6.35 6.35" className="mr-1" fill={manga.status === "completed" ? "#00c9f5" : manga.status === "ongoing" ? "#04d000" : "#da7500"}>
                                <circle cx="3.175" cy="3.175" r="1.058" />
                            </svg>
                            {manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}
                        </span>
                        <div className="relative h-80">
                            <Image src={manga.coverImageUrl || '/placeholder.jpg'} alt={manga.title} fill className="object-cover transition-transform duration-500" placeholder="blur" blurDataURL="/placeholder.jpg" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent p-4">
                                <h3 className="text-sm font-bold text-white flex items-start">
                                    <Flag code={langToCountry[manga.originalLanguage] || "UN"} className="w-6 shadow-lg shadow-black mt-0.5 mr-2" />
                                    {manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title}
                                </h3>
                                <div className="flex justify-between mt-2 text-gray-300 text-sm">
                                    {["star", "comment", "heart"].map((icon, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <img src={`/${icon}.svg`} alt={icon} className="w-4 h-4" />
                                            <span>{
                                                icon === "comment" ? (manga?.rating?.comments?.repliesCount > 1000 ? manga?.rating?.comments?.repliesCount.toString()[0] + "K" : manga?.rating?.comments?.repliesCount || 0) :
                                                    icon === "heart" ? (manga?.rating?.follows > 1000 ? manga?.rating?.follows?.toString()[0] + "K" : manga?.rating?.follows || 0) :
                                                        manga?.rating?.rating?.average?.toFixed(2) || "N/A"
                                            }</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-800">
                            <div className="flex flex-wrap gap-1">
                                {manga.flatTags.slice(0, 4).map(tag => (
                                    <span key={tag} className="bg-gray-900 min-w-16 text-center shadow-lg px-3 py-1.5  border border-gray-700 text-sm transition-colors hover:bg-gray-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs w-full pr-6 absolute flex justify-center items-center text-center bottom-1  text-gray-400 mt-4 ">
                                Last updated: {(() => {
                                    const minutes = Math.floor((new Date() - new Date(manga.updatedAt)) / 60000);
                                    return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
                                })()}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

export default MangaCard;