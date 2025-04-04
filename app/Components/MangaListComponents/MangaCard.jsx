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
    <div className="w-full flex flex-col ">
        <div className="mx-20 pb-7 text-2xl font-bold text-purple-200 tracking-wide uppercase ">
            <h1 className=" border-b-4 border-purple-900 w-fit pb-2">      Latest Releases
            </h1>
        </div>
        <div className="grid w-[95%] gap-y-4 ml-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {processedLatestMangas.map((manga, index) => (
                <motion.div
                    key={manga.id}
                    onClick={() => handleMangaClicked(manga)}
                    className="group flex justify-center min-h-[400px] items-start h-fit cursor-pointer w-full"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * stagger, ease: "easeInOut", duration: 0.5 }}
                >
                    <div className="w-[250px] overflow-hidden rounded-[10px] bg-[#0c0221]  p-[5px] shadow-[0px_0px_6px_0_rgba(100,100,111,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[102%]">
                        <div className="relative flex h-[250px]  flex-col rounded-[15px] bg-gradient-to-tr from-[#049fbb] to-[#50f6ff]"
                        >
                            <Image src={manga.coverImageUrl || '/placeholder.jpg'} alt={manga.title} fill className="object-cover transition-transform duration-500 relative -mt-[1px] flex h-[250px] flex-col rounded-[7px] rounded-tl-[20px] bg-gradient-to-tr from-[#1f2020] to-[#000d0e]" placeholder="blur" blurDataURL="/placeholder.jpg" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent p-4">
                                <h1 className=" flex flex-row font-bold items-start justify-center text-xs tracking-[2px] text-white">
                                    <Flag code={langToCountry[manga.originalLanguage] || "UN"} className="w-6 shadow-lg shadow-black  mr-2" />
                                    {manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title}
                                </h1>

                            </div>
                            <div className="relative z-20 h-[30px] mt-1 w-[140px] -skew-x-[40deg] rounded-br-[10px] bg-[#0c0221] shadow-[-10px_-10px_0_0_#0c0221] before:absolute before:right-[-2px] before:top-0 before:h-[9px] before:w-[129px] before:rounded-tl-[10px] before:shadow-[-5px_-5px_0_1px_#0c0221,-3px_-5px_0_1px_#0c0221]" />

                            <div className="absolute  left-0 top-[34px] h-[55px] w-[125px] before:absolute before:h-full before:w-full before:rounded-tl-[15px] before:shadow-[-5px_-5px_0_2px_#0c0221]" />

                            <div className="absolute top-0 flex h-[30px] w-full justify-between">
                                <div className="h-full aspect-square pb-[2px]">
                                    <span className="absolute -mt-[1px] top-0 left-0 z-30 text-xs tracking-widest rounded-full  py-1 pr-2 min-w-24  flex items-center justify-end font-bold">
                                        <svg width="24" height="24" viewBox="0 0 6.35 6.35" className="" fill={manga.status === "completed" ? "#00c9f5" : manga.status === "ongoing" ? "#04d000" : "#da7500"}>
                                            <circle cx="3.175" cy="3.175" r="1.058" />
                                        </svg>
                                        {manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}
                                    </span>

                                </div>

                                <div className="flex">
                                    <span className={`${manga.contentRating.toUpperCase() == "SAFE" ? "pr-8" :manga.contentRating.toUpperCase() ==  "EROTICA"?"pr-5": "pr-2"} z-10 tracking-widest mt-[1px] mr-2  top-0 right-0  bg-gray-900     flex items-center justify-end  text-center border-2  absolute  py-[7px] min-w-36 text-[9px] font-semibold rounded-xl  text-white bg-opacity-70 backdrop-blur-lg ${ratingColors[manga.contentRating] || ratingColors.default}`}>
                                        {manga.contentRating.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className=" p-[5px_10px] w-full">
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
                            <div className="mt-3 flex flex-col min-h-[100px] justify-between">

                                <div className="flex flex-wrap gap-1">
                                    {manga.flatTags.slice(0, 4).map(tag => (
                                        <span key={tag} className="bg-[#070920] backdrop-blur-md min-w-16 shadow-lg px-3 py-1.5  border border-gray-700  transition-colors hover:bg-gray-800 text-center flex flex-row font-bold items-start justify-center text-[10px] tracking-[1.5px] text-white">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs w-full pr-6 relative z-30 flex justify-center items-center text-center bottom-1  text-gray-400 mt-4 ">
                                    Last updated: {(() => {
                                        const minutes = Math.floor((new Date() - new Date(manga.updatedAt)) / 60000);
                                        return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
                                    })()}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

export default MangaCard;