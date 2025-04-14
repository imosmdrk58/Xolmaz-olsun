"use client";
import Image from 'next/image';
import React from 'react';
import Flag from "react-world-flags";

const AboutManga = ({ manga, handleChapterClick, last }) => {
  if (!manga) return null;

  const getRatingColor = (rating) => ({
    safe: "bg-green-600",
    suggestive: "bg-yellow-600",
    erotica: "bg-red-600",
  }[rating] || "bg-gray-600");

  const langToCountryMap = {
    ja: "JP", ms: "MY", ko: "KR", en: "US", zh: "CN", fr: "FR", lt: "LT",
    es: "ES", tr: "TR", ru: "RU", th: "TH", es_la: "LA", uk: "UA", vi: "VN",
  };

  const countryCode = langToCountryMap[manga.originalLanguage] || "UN";

  const getFullLink = (key, link) => ({
    mu: `https://www.mangaupdates.com/${link}`,
    mal: `https://myanimelist.net/manga/${link}`,
    bw: `https://bookwalker.jp/${link}`,
    ap: `https://www.anime-planet.com/${link}`,
    nu: `https://www.novelupdates.com/${link}`,
    kt: `https://mangadex.org/title/${manga.id}/${link}`,
    al: `https://anilist.co/manga/${link}`,
  }[key] || link);

  return (
    <div className="flex-grow px-4">
      {/* Cover Background */}
      <div className="absolute inset-x-0 top-0 h-[360px] bg-cover" style={{ backgroundImage: `url('${manga.coverImageUrl}')` }}>
        <div className="absolute inset-0 h-[360px] bg-black/40 backdrop-blur-sm z-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col sm:flex-row gap-6">
        {/* Cover Image */}
        <div className="absolute w-48 h-[295px] group select-none">
          <a href={manga.coverImageUrl} className="block relative w-full h-full">
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-white">
                <path fill="currentColor" d="m9.5 13.09 1.41 1.41-4.5 4.5H10v2H3v-7h2v3.59zm1.41-3.59L9.5 10.91 5 6.41V10H3V3h7v2H6.41zm3.59 3.59 4.5 4.5V14h2v7h-7v-2h3.59l-4.5-4.5zM13.09 9.5l4.5-4.5H14V3h7v7h-2V6.41l-4.5 4.5z" />
              </svg>
            </div>
            <Image
              className="w-full h-full rounded shadow-md transition-transform duration-200 group-hover:translate-y-0"
              src={manga.coverImageUrl}
              alt="Cover image"
              width={384}
              height={295}
              loading="lazy"
            />
            <Flag code={countryCode} className="absolute bottom-2 right-2 w-10 rounded shadow-md" alt="flag" />
          </a>
        </div>

        {/* Title and Info */}
        <div className="flex ml-56 flex-col justify-between">
          <div className='flex flex-col justify-between gap-24'>
            <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 leading-tight text-shadow-md break-words">
              {manga.title.length < 30 ? manga.title : manga.title.slice(0, 30) + "..."}
            </h1>
            <p className="ml-1 text-base mb-2 sm:text-xl text-gray-300 line-clamp-2 leading-tight">
              {manga.altTitle.length < 30 ? manga.altTitle : manga.altTitle.slice(0, 30) + "..."}
            </p>
            </div>
            <p className="text-base sm:text-base text-white ">{manga?.authorName[0]?.attributes?.name || "N/A"}</p>
          </div>

          {/* Actions and Stats */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-9 items-center">
              <button
                onClick={() => handleChapterClick(last)}
                className="col-span-2 bg-[#4d229e]/40 border-2 border-[#4d229e] rounded px-3 py-3 flex items-center justify-center gap-5 text-white font-medium whitespace-nowrap hover:bg-[#4d229e]/60 transition duration-200 shadow-sm"
              >
                <Image src="/list.svg" alt="list" width={28} height={28} className="brightness-200" />
                Read Latest
              </button>
              <div className="col-span-5 flex items-center gap-5 ml-6">
                <div className="flex items-center gap-2 text-base text-gray-300">
                  <img src="/star.svg" alt="Rating" className="w-5 h-5 opacity-80" />
                  <span className="font-semibold text-gray-200">{manga?.rating?.rating?.bayesian?.toFixed(3) || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-300">
                  <img src="/comment.svg" alt="Comments" className="w-5 h-5 opacity-80" />
                  <span className="font-semibold text-gray-200">{manga?.rating?.comments?.repliesCount || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-300">
                  <img src="/heart.svg" alt="Likes" className="w-5 h-5 opacity-80" />
                  <span className="font-semibold text-gray-200">{manga?.rating?.follows || 0}</span>
                </div>
              </div>
              <span className="col-span-2 flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase min-w-72">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 6.35 6.35" className="w-5 h-5 text-blue-500">
                  <path fill="currentColor" d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058" />
                </svg>
                Publication: 2014, Completed
              </span>
            </div>

            {/* Tags and Rating */}
            <div className="mt-3 sm:mx-2 flex flex-wrap gap-2">
              <span className={`rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150 ${getRatingColor(manga.contentRating)}`}>
                {manga.contentRating.toUpperCase()}
              </span>
              {manga.flatTags.map((tag, index) => (
                <span key={index} className="rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mt-4 bg-[#070920]/80 backdrop-blur-md rounded-lg p-4 shadow-[0px_1px_2px_rgba(0,0,0,1)] shadow-purple-500">
              <h2 className="text-lg font-bold text-white mb-2 border-b border-gray-700 pb-1">Manga Description</h2>
              <p className="text-gray-300 text-base leading-relaxed tracking-wide">{manga.description}</p>
            </div>

            <hr className="my-4 border-gray-700" />

            {/* Metadata */}
            <div className="flex flex-wrap gap-8">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Author</h3>
                <a href="/author/049feddc-1bb9-41ee-96b8-200c7b3e25cc/eguchi-hiro" className="rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150">
                  {manga?.authorName[0]?.attributes?.name || "N/A"}
                </a>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Artist</h3>
                <a href="/author/049feddc-1bb9-41ee-96b8-200c7b3e25cc/eguchi-hiro" className="rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150">
                  {manga?.artistName[0]?.attributes?.name || "N/A"}
                </a>
              </div>
              {manga?.tags?.map(tagGroup => tagGroup?.tags?.length > 0 && (
                <div key={tagGroup.group} className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2 capitalize">{tagGroup.group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagGroup.tags.slice(0, tagGroup.group === "genre" || tagGroup.group === "format" ? 2 : tagGroup.tags.length).map(tag => (
                      <span key={tag} className="rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Demographic</h3>
                <a href="/titles?demos=josei" className="rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_4px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150">
                  {manga.MangaStoryType[0].related || manga.MangaStoryType}
                </a>
              </div>
            </div>

            {/* Links */}
            {manga.links && (
              <div className="mb-4 flex flex-col">
                <span className="font-bold text-lg text-gray-300 mb-2">Read or Buy</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(manga.links).map(([key, link]) => link && (
                    <a
                      key={key}
                      href={getFullLink(key, link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150"
                    >
                      {key === "al" ? "AniList" : key === "amz" ? "Amazon" : key === "bw" ? "BookWalker" : key === "ebj" ? "eBookJapan" : key === "mal" ? "MyAnimeList" : key === "mu" ? "MangaUpdates" : key === "ap" ? "Anime Planet" : key === "nu" ? "Novel Updates" : key === "kt" ? "MangaDex" : key === "raw" ? "Raw" : key === "cdj" ? "CDJapan" : "YEN Press"}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Alternative Titles */}
            {manga.altTitles?.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold text-base text-gray-300 mb-2">Alternative Titles</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {manga.altTitles.map((title, index) => (
                    <div key={index} className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-800 transition-all duration-150">
                      <Flag
                        code={langToCountryMap[Object.keys(title)[0]] || langToCountryMap.en}
                        className="w-8 h-8 rounded-md shadow-sm"
                        alt="flag"
                      />
                      <span className="text-base font-medium text-gray-200">{Object.values(title)[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManga;