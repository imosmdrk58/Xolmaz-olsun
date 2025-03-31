import React from 'react'
import Image from 'next/image';
const InfoSidebar = ({ isCollapsed, setIsCollapsed, mangaInfo, chapterInfo, extraInfo }) => {
    return mangaInfo && (
        <div
            style={{
                scrollbarWidth: "none",
                scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
            }}
            className={`${isCollapsed ? "w-fit rounded-2xl h-fit flex justify-center items-center absolute top-1/2 left-4 shadow-[0_0_10px_rgba(0,0,0,1)] shadow-purple-500" : "w-80 h-[91vh] mt-1.5 py-6 px-5"}  bg-gray-900/50 backdrop-blur-md shadow-2xl flex flex-col overflow-y-auto border border-gray-700 transition-all duration-300 `}
        >
            <div className='flex flex-row justify-start gap-4 items-center'>
                <span
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`relative cursor-pointer min-w-14 flex justify-center items-center w-fit p-4 rounded-xl overflow-hidden
            brightness-150 hover:brightness-175 transition-all duration-300
                      before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] hover:before:opacity-100
                      hover:shadow-md hover:shadow-purple-600/40`}
                    style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                >
                    <Image
                        src={`/list.svg`}
                        alt={"toggle"}
                        width={32}
                        height={32}
                        className="w-7 h-7"
                    />
                </span>
                {!isCollapsed && (
                    <div className="text-sm font-bold text-purple-200 tracking-widest uppercase">
                        <h1 className="border-b-4 border-purple-900 w-fit pb-2 hover:border-purple-600 transition-colors duration-300">Manga / Manhwa / Manhua Overview</h1>
                    </div>
                )}
            </div>


            {/* Manga Info Header */}
            {!isCollapsed && (
                <>
                    {/* Cover Image and Title */}
                    <div className="flex flex-col mt-7 items-center mb-4">
                        <div className="overflow-hidden rounded-lg shadow-lg shadow-purple-900/30">
                            <img
                                src={mangaInfo?.coverImageUrl}
                                alt={`${mangaInfo.title} cover`}
                                className="w-32 h-auto transition-transform duration-500 transform hover:scale-110"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-white mt-3 text-center bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                            {mangaInfo.title}
                        </h3>
                    </div>

                    {/* Key Details */}
                    <div className="gap-2 flex flex-col mb-4 bg-gradient-to-t from-black/20 to-black/20 via-transparent  p-3 py-6 rounded-lg">
                        <p className="text-sm text-gray-300 grid grid-cols-5 gap-6">
                            <span className="font-semibold flex justify-start items-center gap-2 flex-row text-purple-400 col-span-2">
                                <Image width={24} height={24} className='h-auto opacity-80' src='/status.svg' alt="status" />
                                Status:
                            </span>
                            <span className="text-gray-200 col-span-3 capitalize">{mangaInfo.status}</span>
                        </p>

                        <p className="text-sm text-gray-300 grid grid-cols-5 gap-6">
                            <span className="font-semibold flex justify-start items-center gap-2 flex-row text-purple-400 col-span-2">
                                <Image width={20} height={20} className='opacity-80' src='/content.svg' alt="content" />
                                Content:
                            </span>
                            <span className="text-gray-200 col-span-3 capitalize">{mangaInfo.contentRating}</span>
                        </p>

                        <p className="text-sm text-gray-300 grid grid-cols-5 gap-6">
                            <span className="font-semibold flex justify-start items-center gap-2 flex-row text-purple-400 col-span-2">
                                <Image width={20} height={20} className='opacity-80' src='/clock.svg' alt="clock" />
                                Year:
                            </span>
                            <span className="text-gray-200 col-span-3 capitalize">{mangaInfo.year}</span>
                        </p>

                        <p className="text-sm text-gray-300 grid grid-cols-5 gap-6">
                            <span className="font-semibold flex justify-start items-center gap-2 flex-row text-purple-400 col-span-2">
                                <Image width={20} height={20} className='opacity-80' src='/views.svg' alt="views" />
                                Current:
                            </span>
                            <span className="text-gray-200 col-span-3 capitalize">
                                {chapterInfo.title} (Pages: {chapterInfo.pageCount})
                            </span>
                        </p>

                        <p className="text-sm text-gray-300 grid grid-cols-5 gap-6">
                            <span className="font-semibold flex justify-center -mr-3  items-center gap-2 text-purple-400 col-span-2">
                                <Image width={20} height={20} className='opacity-80' src='/globe.svg' alt="globe" />
                                Language:
                            </span>
                            <span className="text-gray-200 col-span-3 capitalize">
                                {chapterInfo.translatedLanguage}
                            </span>
                        </p>


                    </div>
                    {/* Tags */}
                    <div className="mb-4">
                        <h4 className="font-semibold w-full flex flex-row gap-2 text-purple-400 mb-2"><Image width={20} height={20} className='opacity-80' src='/category.svg' alt="category" />Tags:</h4>
                        <div className="flex flex-wrap gap-1">
                            {mangaInfo.flatTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className={`relative text-xs  cursor-pointer flex justify-center items-center w-fit py-2 px-3 rounded-md overflow-hidden hover:bg-[#1a0445] transition-colors duration-300 text-purple-200 hover:text-purple-100 bg-[#070920] backdrop-blur-md min-w-16 shadow-lg  border border-gray-700 text-center  flex-row font-bold   `}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Description */}
                    <div className="text-sm text-gray-300 flex items-start gap-2 mb-3 bg-gray-800/30 p-3 rounded-lg">
                        <Image width={20} height={20} className='opacity-80 mt-1' src='/list.svg' alt="desc" />
                        <div>
                            <span className="font-semibold text-purple-400 block mb-1">Description:</span>
                            <span className="text-gray-200 italic leading-relaxed">{mangaInfo.description}</span>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 bg-gray-800/20 p-3 rounded-lg mb-4'>
                        {/* Authors */}
                        <div className="flex justify-center w-full flex-col items-center">
                            <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2"> <Image width={20} height={20} className='opacity-80' src='/author.svg' alt="author" />Authors:</h4>
                            <p className="text-sm text-gray-300 bg-[#0c0221] py-1 px-3 rounded-full w-fit">
                                {extraInfo?.authorName || "N/A"}
                            </p>
                        </div>
                        {/* Artists */}
                        <div className="flex justify-center flex-col w-full items-center">
                            <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2">
                                <Image width={20} height={20} className='opacity-80' src='/author.svg' alt="author" />Artists:</h4>
                            <p className="text-sm text-gray-300 bg-[#0c0221] py-1 px-3 rounded-full w-fit">
                                {extraInfo?.artistName || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2"><Image width={20} height={20} className='opacity-80' src='/source.svg' alt="source" />Links:</h4>
                        <ul className="flex flex-row flex-wrap gap-2">
                            {Object.entries(mangaInfo.links).map(([key, value]) => (
                                <li key={key}>
                                    <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#070920] backdrop-blur-md min-w-16 shadow-lg px-3 py-1.5  border border-gray-700  transition-colors hover:bg-gray-800 text-center flex flex-row font-bold items-start justify-center text-[10px] tracking-[1.5px] text-white">
                                        {key.toUpperCase()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    )
}

export default InfoSidebar