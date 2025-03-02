import React from 'react'
import Image from 'next/image';
const InfoSidebar = ({ isCollapsed, setIsCollapsed, mangaInfo, chapterInfo, extraInfo }) => {
    return  mangaInfo &&(
        <div
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
            }}
            className={`${isCollapsed ? "w-fit h-fit flex justify-center items-center absolute top-1/2 left-4 shadow-[0_0_10px_rgba(0,0,0,1)] shadow-purple-500" : "w-80 h-[88vh] -mb-6 py-6 px-5"}  bg-gray-800 shadow-2xl rounded-xl  flex flex-col overflow-y-auto border border-gray-700 transition-all duration-300 `}
        >
            <div className=' flex flex-row justify-start gap-4 items-center'>
                <span
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`relative cursor-pointer min-w-14 flex justify-center items-center w-fit p-4 rounded-xl overflow-hidden
                brightness-150
                          before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                        `}
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
                    <div className=" text-sm font-bold text-purple-200 tracking-widest uppercase  ">
                        <h1 className=" border-b-4 border-purple-900  w-fit pb-2"> Manga / Manhwa / Manhua Overview</h1>
                    </div>
                )}
            </div>


            {/* Manga Info Header */}
            {!isCollapsed && (
                <>
                    {/* Cover Image and Title */}
                    <div className="flex flex-col  mt-7 items-center mb-4">
                        <img
                            src={mangaInfo?.coverImageUrl}
                            alt={`${mangaInfo.title} cover`}
                            className="w-32 h-auto  shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                        />
                        <h3 className="text-xl font-semibold text-white mt-2 text-center">
                            {mangaInfo.title}
                        </h3>
                    </div>

                    {/* Key Details */}
                    <div className="gap-2 flex flex-col mb-2">
                        <p className="text-sm -ml-1 text-gray-300 flex items-center gap-2">
                            <Image width={24} height={24} className='h-auto' src='/status.svg' alt="status" />
                            <span className="font-semibold text-purple-400">Status:</span>
                            <span className="text-gray-200">{mangaInfo.status}</span>
                        </p>

                        <p className="text-sm text-gray-300 flex items-center gap-2">
                            <Image width={20} height={20} src='/content.svg' alt="content" />
                            <span className="font-semibold text-purple-400">Content Rating:</span>{" "}
                            <span className="text-gray-200">{mangaInfo.contentRating}</span>
                        </p>
                        <p className="text-sm text-gray-300 flex items-center gap-2">
                            <Image width={20} height={20} src='/clock.svg' alt="clock" />
                            <span className="font-semibold text-purple-400">Year:</span>{" "}
                            <span className="text-gray-200">{mangaInfo.year}</span>
                        </p>
                        <p className="text-sm text-gray-300 flex items-center gap-2">
                            <Image width={20} height={20} src='/views.svg' alt="views" />
                            <span className="font-semibold text-purple-400">Current:</span>{" "}
                            <span className="text-gray-200">
                                {chapterInfo.title} (Pages: {chapterInfo.pageCount})
                            </span>
                        </p>
                        <p className="text-sm text-gray-300 flex items-center gap-2">
                            <Image width={20} height={20} src='/globe.svg' alt="globe" />
                            <span className="font-semibold text-purple-400">Translated Language:</span>{" "}
                            <span className="text-gray-200">{chapterInfo.translatedLanguage}</span>
                        </p>
                    </div>
                    {/* Tags */}
                    <div className="mb-4">
                        <h4 className="font-semibold w-full flex flex-row gap-2 text-purple-400 mb-2"><Image width={20} height={20} src='/category.svg' alt="category" />Tags:</h4>
                        <div className="flex flex-wrap gap-1">
                            {mangaInfo.flatTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className={`relative text-sm cursor-pointer flex justify-center items-center w-fit py-2 px-3 overflow-hidden brightness-150
                                before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                              `}
                                    style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-gray-300 flex items-start gap-2 mb-2">
                        <Image width={20} height={20} src='/list.svg' alt="desc" />
                        <span className="font-semibold text-purple-400">Description :               <span className="text-gray-200">{mangaInfo.description}</span></span>{" "}
                    </p>
                    <div className=' flex flex-row gap-4'>
                        {/* Authors */}
                        <div className="mb-4 flex justify-center w-full flex-col items-center">
                            <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2"> <Image width={20} height={20} src='/author.svg' alt="author" />Authors:</h4>
                            <p className="text-sm text-gray-300">
                                {extraInfo?.authorName || "N/A"}
                            </p>
                        </div>
                        {/* Artists */}
                        <div className="mb-4 flex justify-center flex-col w-full items-center">
                            <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2">
                                <Image width={20} height={20} src='/author.svg' alt="author" />Artists:</h4>
                            <p className="text-sm text-gray-300">
                                {extraInfo?.artistName || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2"><Image width={20} height={20} src='/source.svg' alt="source" />Links:</h4>
                        <ul className=" flex flex-row flex-wrap gap-2">
                            {Object.entries(mangaInfo.links).map(([key, value]) => (
                                <li key={key}>
                                    <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`relative text-xs cursor-pointer rounded-full flex justify-center items-center w-fit p-3 overflow-hidden brightness-150
                    before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                  `}
                                        style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                                    >
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