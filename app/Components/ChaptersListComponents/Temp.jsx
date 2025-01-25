"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Flag from "react-world-flags";

const Temp = ({ manga, handleChapterClick }) => {
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

    const countryCode = langToCountryMap[manga?.originalLanguage] || "UN"; // UN for unknown flag
    const [authorData, setAuthorData] = useState("N/A");
    const [artistData, setArtistData] = useState("N/A");
        useEffect(() => {
            const fetchAuthorData = async () => {
                try {
                    const authorId=manga.authorName[0].id
                    const response = await fetch(`/api/manga/getAuthor/${authorId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setAuthorData(data.author.name || "N/A");
                    }
                } catch (err) {
                    console.error(`Error fetching AuthorData for manga ID ${manga.id}:`, err);
                }
            };
            const fetchArtistData = async () => {
                try {
                    const authorId=manga.artistName[0].id
                    const response = await fetch(`/api/manga/getAuthor/${authorId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setArtistData(data.author.name || "N/A");
                    }
                } catch (err) {
                    console.error(`Error fetching AuthorData for manga ID ${manga.id}:`, err);
                }
            };
    
            if(manga?.authorName[0].id) fetchAuthorData();
            
            if(manga?.artistName[0].id)fetchArtistData()
        }, [manga]);
        
        console.log(manga)
        console.log(artistData,authorData)
    return (

        <div className="md-content flex-grow">
            <div className="layout-container flex flex-col justify-center items-start manga has-gradient px-4">
                <div className="absolute left-0 top-0 w-full block">
                    <div
                        className="banner-image bg-cover w-full h-[350px]"
                        style={{
                            backgroundImage:
                                `url('${manga.coverImageUrl}')`,
                        }}
                    ></div>
                    <div className="bg-black backdrop-blur-sm absolute left-0 top-0 h-[350px] bg-opacity-40 w-full z-10"></div>
                </div>


                <div className="flex relative z-20 gap-6 flex-row">
                <div className="relative w-96 h-[295px] group mb-auto select-none">
  <a
    href={manga.coverImageUrl}
    target="_self"
    className="flex items-start relative w-full h-full"
  >
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        className="icon xLarge text-white"
      >
        <path
          fill="currentColor"
          d="m9.5 13.09 1.41 1.41-4.5 4.5H10v2H3v-7h2v3.59zm1.41-3.59L9.5 10.91 5 6.41V10H3V3h7v2H6.41zm3.59 3.59 4.5 4.5V14h2v7h-7v-2h3.59l-4.5-4.5zM13.09 9.5l4.5-4.5H14V3h7v7h-2V6.41l-4.5 4.5z"
        ></path>
      </svg>
    </div>
    <Image
      className="rounded shadow-md w-full min-w-44 h-full transform group-hover:translate-y-0 transition-transform"
      src={manga.coverImageUrl}
      alt="Cover image"
      width={500}
      height={288}
      loading="lazy"
    />
    <Flag
      code={countryCode}
      className="w-10 absolute bottom-2 right-2 shadow-md"
      alt="flag"
    />
  </a>
</div>

                    <div className="title flex flex-col   justify-start items-start">
                        <div className='h-60 flex justify-between flex-col '>
                            <div>
                                <p className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 leading-tight text-shadow-md text-primary w-full sm:w-auto break-words">
                                    {manga.title.length < 30 ? manga.title : manga.title.slice(0, 30) + "..."}
                                </p>

                                <div className="font-normal ml-1 text-base sm:text-xl inline-block leading-tight line-clamp-2" >
                                    {manga.altTitle.length < 30 ? manga.altTitle : manga.altTitle.slice(0, 30) + "..."}
                                </div>
                            </div>

                            <div className="flex flex-row  gap-2">
                                <div className="font-normal text-xs sm:text-base sm:truncate flex-shrink-0 ">
                                    {authorData}
                                </div>
                            </div>
                        </div>
                        <div className=" relative mt-4 flex flex-col  gap-2">
                            <div className="grid grid-cols-9 w-full items-center">
                                <button
                                    onClick={() => handleChapterClick(manga.latestUploadedChapter)}
                                    className="flex flex-grow bg-[#cc5233] col-span-2 whitespace-nowrap px-2 sm:px-3 rounded custom-opacity relative items-center overflow-hidden primary glow"
                                    style={{ minHeight: '3rem' }}>
                                    <span className="flex relative items-center justify-center font-medium select-none w-full pointer-events-none">
                                        Read Latest
                                    </span>
                                </button>

                                <div className="flex flex-row col-span-5 items-center gap-16 ml-6">
                                    <div className="flex items-center gap-3 text-lg text-gray-300">
                                        <img src="/star.svg" alt="Rating" className="w-7 h-7" />
                                        <span>{manga?.rating?.rating?.average || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-lg text-gray-300">
                                        <img src="/comment.svg" alt="Comments" className="w-7 h-7" />
                                        <span>{manga?.rating?.comments?.repliesCount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-lg text-gray-300">
                                        <img src="/heart.svg" alt="Likes" className="w-7 h-7" />
                                        <span>{manga?.rating?.follows || 0}</span>
                                    </div>
                                </div>

                            </div>


                            <div className="sm:mx-2 flex flex-col" style={{ gridArea: "info" }}>
                                <div className="flex gap-1 flex-wrap items-center">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <span
                                                className={`inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white transition-all duration-100 ease-out ${getRatingColor(
                                                    manga.contentRating
                                                )}`}
                                            >
                                                {manga.contentRating.toUpperCase()}
                                            </span>

                                            {manga.flatTags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-900 inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white transition-all duration-100 ease-out"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                    </div>
                                    <span className="tag dot no-wrapper flex flex-row sm:font-bold uppercase">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 6.35 6.35"
                                            className="icon"
                                            style={{ color: "rgb(var(--md-status-blue))" }}
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"
                                            ></path>
                                        </svg>
                                        <span>Publication: 2014, Completed</span>
                                    </span>
                                </div>
                                <div className="py-2 text-sm">
                                    <div className="align-top items-start justify-start flex flex-row">
                                        <p className='mt-1.5'>{manga.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-7 justify-start w-full locale-en">
                                    <div className="mb-4 ">
                                        <div className="font-bold text-lg mb-2">Author</div>
                                        <div className="flex gap-2 flex-wrap">
                                            <a
                                                href="/author/049feddc-1bb9-41ee-96b8-200c7b3e25cc/eguchi-hiro"
                                                className=" inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white transition-all duration-100 ease-out"
                                            >
                                                {authorData}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mb-4 ">
                                        <div className="font-bold text-lg mb-2">Artist</div>
                                        <div className="flex gap-2 flex-wrap">
                                            <a
                                                href="/author/049feddc-1bb9-41ee-96b8-200c7b3e25cc/eguchi-hiro"
                                                className="inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white transition-all duration-100 ease-out"
                                            >
                                               {artistData}
                                            </a>
                                        </div>
                                    </div>


                                    {manga?.tags?.map(
                                        (tagGroup) =>
                                            tagGroup?.tags?.length > 0 && (
                                                <div key={tagGroup.group} className="w-fit flex flex-row   rounded-md shadow-sm">
                                                    {tagGroup.group === "genre" && (
                                                        <div className="mb-2 flex flex-col">
                                                            <span className="font-bold text-lg mb-1 block">Genre</span>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {tagGroup.tags.slice(0, 2).map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className=" inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white transition-all duration-100 ease-out"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {tagGroup.group === "theme" && (
                                                        <div className="mb-2">
                                                            <span className="font-bold text-lg mb-1 block">Theme</span>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {tagGroup.tags.map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className=" inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white transition-all duration-100 ease-out"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {tagGroup.group === "format" && (
                                                        <div className="mb-2">
                                                            <span className="font-bold text-lg mb-1 block">Format</span>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {tagGroup.tags.slice(0, 2).map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className=" inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white transition-all duration-100 ease-out"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                    )}


                                    <div className="mb-4 ">
                                        <div className="font-bold text-lg mb-2">Demographic</div>
                                        <div className="flex gap-2 flex-wrap">
                                            <a
                                                href="/titles?demos=josei"
                                                className=" inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold  text-white transition-all duration-100 ease-out"
                                            >
                                                {manga.MangaStoryType[0].related ? manga.MangaStoryType[0].related : manga.MangaStoryType}
                                            </a>
                                        </div>
                                    </div>
                                </div>


                                <div>
                                    {manga.links && (
                                        <div className="mb-4 flex flex-row items-center justify-start gap-3">
                                            <div className="font-bold mb-2">Read or Buy</div>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.entries(manga.links).map(([key, link]) => {
                                                    if (link) {
                                                        // Apply conditional full link generation for all keys
                                                        const fullLink = key === "mu"
                                                            ? `https://www.mangaupdates.com/${link}`
                                                            : key === "mal"
                                                                ? `https://myanimelist.net/manga/${link}`
                                                                : key === "bw"
                                                                    ? `https://bookwalker.jp/${link}`
                                                                    : key === "ap"
                                                                        ? `https://www.anime-planet.com/${link}`
                                                                        : key === "nu"
                                                                            ? `https://www.novelupdates.com/${link}`
                                                                            :key==="kt"
                                                                            ?`https://mangadex.org/title/${manga.id}/${link}`
                                                                            : key === "al"
                                                                                ? `https://anilist.co/manga/${link}`
                                                                                : link

                                                        return (
                                                            <a
                                                                key={key}
                                                                className="bg-accent inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2 py-1 transition-all duration-100 ease-out tag"
                                                                href={fullLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <span className=' inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold text-white  transition-all duration-100 ease-out'>
                                                                    {key === "al" && "AniList"}
                                                                    {key === "amz" && "Amazon"}
                                                                    {key === "bw" && "BookWalker"}
                                                                    {key === "ebj" && "eBookJapan"}
                                                                    {key === "mal" && "MyAnimeList"}
                                                                    {key === "mu" && "MangaUpdates"}
                                                                    {key === "ap" && "Anime Planet"}
                                                                    {key === "nu" && "Novel Updates"}
                                                                    {key === "kt" && "MangaDex"}
                                                                    {key === "raw" && "Raw"}
                                                                </span>
                                                            </a>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Alternative Titles */}
                                    {manga.altTitles && manga.altTitles.length > 0 && (
                                        <div className="w-full">
                                            <div className="font-bold mb-2">Alternative Titles</div>
                                            {manga.altTitles.map((title, index) => (
                                                <div key={index} className="mb-2 w-full flex space-x-4   ">
                                                    <div
                                                        className=" w-full max-w-10 max-h-10 h-full"
                                                    >
                                                        <Flag
                                                            code={langToCountryMap[Object.keys(title)[0]]}
                                                            className="w-full h-full "
                                                            alt="flag"
                                                        />
                                                    </div>
                                                    <span>{Object.values(title)[0]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div>

                </div>

            </div>
        </div>

    )
}

export default Temp