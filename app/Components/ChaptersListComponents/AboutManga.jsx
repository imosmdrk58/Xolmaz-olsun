"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Flag from "react-world-flags";

const AboutManga = ({ manga, handleChapterClick,setExtraInfo,last }) => {
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
        zh: "CN", // Chinese (Simplified)
        fr: "FR", // French
        lt: "LT", // Lithuanian
        es: "ES", // Spanish
        tr: "TR", // Turkish
        ru: "RU", // Russian
        th: "TH", // Thai
        es_la: "LA", // Spanish (Latin America)
        uk: "UA", // Ukrainian
        vi: "VN", // Vietnamese
    };
    const countryCode = langToCountryMap[manga?.originalLanguage] || "UN"; // UN for unknown flag
    const [authorData, setAuthorData] = useState("N/A");
    const [artistData, setArtistData] = useState("N/A");
    useEffect(() => {
        const fetchData = async (key, nameType, setData) => {
            const storedData = localStorage.getItem(`manga_${manga.id}_${nameType}`);
            if (storedData) {
                setData(storedData);            
                setExtraInfo({[nameType]:storedData})
                return;
            }

            try {
                const authorId = manga[nameType]?.[0]?.id;
                if (!authorId) return;

                const response = await fetch(`/api/manga/getAuthor/${authorId}`);
                if (response.ok) {
                    const data = await response.json();
                    const name = data.author?.name || "N/A";
                    setData(name);
                    setExtraInfo((prev) => ({ ...prev, [nameType]: name }));
                    localStorage.setItem(`manga_${manga.id}_${nameType}`, name);
                }
            } catch (err) {
                console.error(`Error fetching ${nameType} data for manga ID ${manga.id}:`, err);
            }
        };

        if (manga?.id) {
            fetchData(`manga_${manga.id}_authorName`, "authorName", setAuthorData);
            fetchData(`manga_${manga.id}_artistName`, "artistName", setAuthorData);
        }
    }, [manga?.id]);

    return (
        <>
            {manga && <div className="md-content flex-grow">
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
                                    <div className="font-normal  text-xs sm:text-base sm:truncate -mt-10 ">
                                        {authorData}
                                    </div>
                                </div>
                            </div>
                            <div className=" relative mt-4 flex flex-col  gap-2">
                                <div className="grid grid-cols-9 w-full items-center">
                                    <button
                                        onClick={() => handleChapterClick(last)}
                                        className="flex flex-grow col-span-2 bg-[#4d229e] bg-opacity-40 border-2 border-[#4d229e] whitespace-nowrap px-3 rounded relative items-center overflow-hidden shadow-sm transition hover:bg-opacity-60"
                                        style={{ minHeight: '3rem' }}
                                    >
                                        <span className="flex items-center gap-5 justify-center font-medium select-none w-full pointer-events-none text-white">
                                            <Image className=" brightness-200" src="/list.svg" alt="list" width={28} height={28} />
                                            Read Latest
                                        </span>
                                    </button>

                                    <div className="flex flex-row col-span-5 items-center gap-5 ml-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <img
                                                src="/star.svg"
                                                alt="Rating"
                                                className="w-5 h-5 object-contain opacity-80"
                                            />
                                            <span className="font-semibold text-gray-200">
                                                {manga?.rating?.rating?.average || "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <img
                                                src="/comment.svg"
                                                alt="Comments"
                                                className="w-5 h-5 object-contain opacity-80"
                                            />
                                            <span className="font-semibold text-gray-200">
                                                {manga?.rating?.comments?.repliesCount || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <img
                                                src="/heart.svg"
                                                alt="Likes"
                                                className="w-5 h-5 object-contain opacity-80"
                                            />
                                            <span className="font-semibold text-gray-200">
                                                {manga?.rating?.follows || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="flex flex-row w-full min-w-72 items-center gap-2 text-xs font-semibold text-gray-300 uppercase">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 6.35 6.35"
                                            className="w-5 h-5 text-blue-500"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"
                                            ></path>
                                        </svg>
                                        <span className="tracking-wide">Publication: 2014, Completed</span>
                                    </span>
                                </div>




                                <div className="sm:mx-2 flex flex-col" style={{ gridArea: "info" }}>
                                    <div className="flex gap-2 flex-wrap items-center">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-3 py-1 text-[11px] shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 font-semibold text-white transition-transform duration-150 ease-out hover:scale-105 ${getRatingColor(
                                                        manga.contentRating
                                                    )}`}
                                                >
                                                    {manga.contentRating.toUpperCase()}
                                                </span>

                                                {manga.flatTags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className=" inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-3 py-1 text-[11px] shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 font-semibold text-white transition-transform duration-150 ease-out hover:scale-105"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-4 text-sm mt-2 bg-gray-900 rounded-lg ">

                                        <div className="flex flex-col items-start shadow-sm shadow-purple-500 p-4 rounded-lg">
                                            <h2 className="text-lg font-bold text-white mb-2 border-b w-full border-gray-700 pb-1">Manga Description</h2>
                                            <p className="text-gray-300 leading-relaxed tracking-wide">
                                                {manga.description}
                                            </p>
                                        </div>
                                    </div>
                                    <hr className="border-gray-700 mb-4" />

                                    <div className="flex flex-wrap gap-8 justify-start w-full locale-en">
                                        <div className="mb-4">
                                            <div className="font-bold text-lg text-white mb-2">Author</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a
                                                    href="/author/049feddc-1bb9-41ee-96b8-200c7b3e25cc/eguchi-hiro"
                                                    className="inline-flex items-center rounded-md text-sm px-3 py-1 text-[11px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 font-semibold text-white transition-transform duration-150 ease-out hover:scale-105"
                                                >
                                                    {authorData}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="font-bold text-lg text-white mb-2">Artist</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a
                                                    href="/author/049feddc-1bb9-41ee-96b8-200c7b3e25cc/eguchi-hiro"
                                                    className="inline-flex items-center rounded-md text-sm px-3 py-1 text-[11px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 font-semibold text-white  transition-transform duration-150 ease-out hover:scale-105"
                                                >
                                                    {artistData}
                                                </a>
                                            </div>
                                        </div>

                                        {manga?.tags?.map(
                                            (tagGroup) =>
                                                tagGroup?.tags?.length > 0 && (
                                                    <div key={tagGroup.group} className="flex flex-col mb-4">
                                                        <div className="font-bold text-lg text-white mb-2 capitalize">{tagGroup.group}</div>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {tagGroup.tags.slice(0, tagGroup.group === "genre" || tagGroup.group === "format" ? 2 : tagGroup.tags.length).map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="inline-flex items-center rounded-md text-sm px-3 py-1 text-[11px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 font-semibold text-white transition-transform duration-150 ease-out hover:scale-105"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                        )}

                                        <div className="mb-4">
                                            <div className="font-bold text-lg text-white mb-2">Demographic</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a
                                                    href="/titles?demos=josei"
                                                    className="inline-flex items-center rounded-md text-sm px-3 py-1 text-[11px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 font-semibold text-white  transition-transform duration-150 ease-out hover:scale-105"
                                                >
                                                    {manga.MangaStoryType[0].related ? manga.MangaStoryType[0].related : manga.MangaStoryType}
                                                </a>
                                            </div>
                                        </div>
                                    </div>



                                    <div>
                                        {manga.links && (
                                            <div className="mb-4 flex flex-row items-center justify-start gap-3">
                                                <div className="font-bold mb-2 text-gray-300">Read or Buy</div>
                                                <div className="flex gap-2 flex-wrap">
                                                    {Object.entries(manga.links).map(([key, link]) => {
                                                        if (link) {
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
                                                                                : key === "kt"
                                                                                    ? `https://mangadex.org/title/${manga.id}/${link}`
                                                                                    : key === "al"
                                                                                        ? `https://anilist.co/manga/${link}`
                                                                                        : link;

                                                            return (
                                                                <a
                                                                    key={key}
                                                                    className="inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-0.5 py-1.5 transition-all duration-200 ease-out hover:scale-105 hover:shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                                                                    href={fullLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <span className=" inline-flex items-center rounded-md text-sm min-h-[1.75rem] px-3 py-1 text-[11px] shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 font-semibold text-white transition-transform duration-150 ease-out hover:scale-105">
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
                                                                        {key === "cdj" && "CDJapan"}
                                                                        {key === "engtl" && "YEN Press"}
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
                                                <div className="font-semibold text-sm text-gray-300 mb-2">Alternative Titles</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {manga.altTitles.map((title, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-gray-800 transition-all duration-150"
                                                        >
                                                            <div className="w-8 h-8 flex items-center justify-center">
                                                                <Flag
                                                                    code={langToCountryMap[Object.keys(title)[0]] ? langToCountryMap[Object.keys(title)[0]] : langToCountryMap["en"]}
                                                                    className="w-full h-full rounded-md shadow-sm"
                                                                    alt="flag"
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-200">{Object.values(title)[0]}</span>
                                                        </div>
                                                    ))}
                                                </div>
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
            </div>}
        </>

    )
}

export default AboutManga