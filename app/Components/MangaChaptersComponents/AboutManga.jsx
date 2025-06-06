"use client";
import React, { useState } from "react";
import Image from "next/image";
import StableFlag from "../StableFlag";
import { getRatingColor } from "../../constants/Flags";
import {
  Star,
  MessageSquareText,
  Heart,
  List,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const MemoStableFlag = React.memo(StableFlag);

const AboutManga = ({ manga, handleChapterClick, last }) => {
  if (!manga) return null;

  const [isExpanded, setIsExpanded] = useState(false);

  const websiteNames = {
    al: "AniList",
    amz: "Amazon",
    bw: "BookWalker",
    ebj: "eBookJapan",
    mal: "MyAnimeList",
    mu: "MangaUpdates",
    ap: "Anime Planet",
    nu: "Novel Updates",
    kt: "MangaDex",
    raw: "Raw",
    cdj: "CDJapan",
    yen: "YEN Press",
  };

  const getFullLink = (key, link) =>
  ({
    mu: `https://www.mangaupdates.com/${link}`,
    mal: `https://myanimelist.net/manga/${link}`,
    bw: `https://bookwalker.jp/${link}`,
    ap: `https://www.anime-planet.com/${link}`,
    nu: `https://www.novelupdates.com/${link}`,
    kt: `https://mangadex.org/title/${manga.id}/${link}`,
    al: `https://anilist.co/manga/${link}`,
  }[key] || link);

  return (
    <div className="flex-grow px-2 sm:px-4">
      {/* Cover Background */}
      <div
        className="absolute inset-x-0 top-0 h-[240px] sm:h-[360px] bg-cover"
        style={{ backgroundImage: `url('${manga.coverImageUrl}')` }}
      >
        <div className="absolute inset-0 h-[240px] sm:h-[360px] bg-black/40 backdrop-blur-sm z-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Cover Image */}
        <div className="relative w-40 h-60 sm:absolute sm:w-48 sm:h-[295px] group select-none mx-auto sm:mx-0">
          <a href={manga.coverImageUrl} className="block relative w-full h-full">
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
              <List className="text-white" size={20} />
            </div>
            <Image
              className="w-full h-full rounded shadow-md transition-transform duration-200 group-hover:translate-y-0 object-cover"
              src={manga.coverImageUrl}
              alt="Cover image"
              width={384}
              height={295}
              loading="lazy"
            />
            <MemoStableFlag
              code={manga.originalLanguage || "UN"}
              className="absolute bottom-2 right-2 w-8 sm:w-10 rounded shadow-md"
              alt="flag"
            />
          </a>
        </div>

        {/* Title and Info */}
        <div className="flex flex-col justify-between sm:ml-56">
          <div className="flex flex-col justify-between gap-4 sm:gap-24 text-center sm:text-left">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight text-shadow-md break-words">
                {manga.title.length < 30
                  ? manga.title
                  : manga.title.slice(0, 25) + "..."}
              </h1>
              <p className="ml-0 sm:ml-1 text-sm sm:text-base md:text-xl text-gray-300 line-clamp-2 leading-tight">
                {manga.altTitle.length < 30
                  ? manga.altTitle
                  : manga.altTitle.slice(0, 25) + "..."}
              </p>
            </div>
            <p className="text-sm sm:text-base text-white">
             <span className=" sm:hidden text-gray-400"> Author :  </span>{manga?.authorName[0]?.attributes?.name || "N/A"}
            </p>
          </div>

          {/* Actions and Stats */}
          <div className="mt-2 sm:mt-8 flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-9 items-center gap-4 sm:gap-0">
              <button
                onClick={() => handleChapterClick(last)}
                className="col-span-1 sm:col-span-2 bg-[#4d229e]/40 border-2 border-[#4d229e] rounded px-3 py-3 flex items-center justify-center gap-3 sm:gap-5 text-white font-medium whitespace-nowrap hover:bg-[#4d229e]/60 transition duration-200 shadow-sm"
              >
                <List size={24} className="brightness-200" />
                <span className="text-sm sm:text-base">Read Latest</span>
              </button>
              <div className="col-span-1 sm:col-span-5 flex items-center justify-center sm:justify-start gap-5 ml-0 sm:ml-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                  <Star size={18} className="opacity-80 text-yellow-500" />
                  <span className="font-semibold text-gray-200">
                    {manga?.rating?.rating?.bayesian?.toFixed(3) || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                  <MessageSquareText size={18} className="opacity-80 text-white/70" />
                  <span className="font-semibold text-gray-200">
                    {manga?.rating?.comments?.repliesCount || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                  <Heart size={18} className="opacity-80 fill-rose-500/50 text-rose-500" />
                  <span className="font-semibold text-gray-200">
                    {manga?.rating?.follows || 0}
                  </span>
                </div>
              </div>
              <span className="col-span-1 sm:col-span-2 flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-semibold text-gray-300 uppercase min-w-0 sm:min-w-72">
                <CheckCircle size={18} className="text-blue-500" />
                Publication: {manga.year}, {manga?.status}
              </span>
            </div>

         {/* View More Bar */}
              <div className="mt-5 flex sm:hidden  w-full justify-center sm:justify-start">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex flex-col justify-center items-center w-full gap-2 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <hr className="relative w-full border-2 -z-10 border-gray-800" />
                  <div className="flex -mt-7 bg-gray-800/40 rounded-lg p-2 px-4 backdrop-blur-md   flex-row-reverse gap-3 justify-center items-center">
                    <ChevronDown size={18} className={`${isExpanded ? "rotate-180" : ""}`} />
                    <span className="text-sm sm:text-base">View {isExpanded ? "Less" : "More"}</span>
                  </div>
                </button>
              </div>
            <div className={`flex flex-col gap-4 sm:gap-2`}>
              {/* Tags and Rating */}
              <div className={`mt-2 space-y-1 ${isExpanded?"flex sm:flex ":"hidden sm:flex "} sm:mt-3 sm:mx-2 flex-wrap gap-2 justify-center sm:justify-start`}>
                <span
                  className={`rounded-md h-fit mt-1 px-2 sm:px-3 py-1.5 text-xs sm:text-base font-semibold text-white shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150 ${getRatingColor(
                    manga.contentRating
                  )}`}
                >
                  {manga.contentRating.toUpperCase()}
                </span>
                {manga.flatTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 sm:px-4 tracking-wider font-bold py-1 sm:py-2 bg-[#4c2b8c]/30 hover:bg-[#5c3b9c]/50 rounded-lg text-xs sm:text-sm text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className={`bg-[#070920] mt-2  ${isExpanded?"block sm:block ":"hidden sm:block "} rounded-xl p-4 sm:p-8 shadow-[1px_2px_3px_rgba(76,43,140,0.3)] shadow-purple-400`}>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Description</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{manga.description}</p>
              </div>

              {/* View More Bar */}
              <div className="mt-5 hidden sm:flex w-full justify-center sm:justify-start">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex flex-col justify-center items-center w-full gap-2 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <hr className="relative w-full border-2 -z-10 border-gray-800" />
                  <div className="flex -mt-7 bg-gray-800/40 rounded-lg p-2 px-4 backdrop-blur-md   flex-row-reverse gap-3 justify-center items-center">
                    <ChevronDown size={18} className={`${isExpanded ? "rotate-180" : ""}`} />
                    <span className="text-sm sm:text-base">View {isExpanded ? "Less" : "More"}</span>
                  </div>
                </button>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <>
                  {/* Metadata */}
                  <div className="flex flex-wrap gap-6 sm:gap-10 gap-y-0 mt-4 sm:mt-6">
                    <div className="mb-4 w-full sm:w-auto">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">Author</h3>
                      <a
                        className="flex flex-wrap gap-2"
                        href={`/author/${manga?.authorName[0]?.id}/${manga?.authorName[0]?.attributes?.name}`}
                      >
                        <span className="px-3 sm:px-4 tracking-wider font-bold py-1 sm:py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-xs sm:text-sm text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                          {manga?.authorName[0]?.attributes?.name || "N/A"}
                        </span>
                      </a>
                    </div>
                    <div className="mb-4 w-full sm:w-auto">
                      <h3 className="text-base sm:text-lg font-bold tracking-wider text-white mb-2 capitalize">
                        Artist
                      </h3>
                      <a
                        className="flex flex-wrap gap-2"
                        href={`/author/${manga?.artistName[0]?.id}/${manga?.artistName[0]?.attributes?.name}`}
                      >
                        <span className="px-3 sm:px-4 tracking-wider font-bold py-1 sm:py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-xs sm:text-sm text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                          {manga?.artistName[0]?.attributes?.name || "N/A"}
                        </span>
                      </a>
                    </div>
                    {manga?.tags?.map(
                      (tagGroup) =>
                        tagGroup?.tags?.length > 0 && (
                          <div key={tagGroup.group} className="mb-4 w-full sm:w-auto">
                            <h3 className="text-base sm:text-lg font-bold tracking-wider text-white mb-2 capitalize">
                              {tagGroup.group}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {tagGroup.tags
                                .slice(
                                  0,
                                  tagGroup.group === "genre" ||
                                    tagGroup.group === "format"
                                    ? 2
                                    : tagGroup.tags.length
                                )
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-3 sm:px-4 tracking-wider font-bold py-1 sm:py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-xs sm:text-sm text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )
                    )}
                    <div className="mb-4 w-full sm:w-auto">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">Demographic</h3>
                      <a
                        className="flex flex-wrap gap-2"
                        href="/titles?demos=josei"
                      >
                        <span className="px-3 sm:px-4 tracking-wider font-bold py-1 sm:py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-xs sm:text-sm text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                          {manga?.MangaStoryType || "Not Available"}
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Links */}
                  {manga.links && (
                    <div className="mb-4 flex flex-col">
                      <span className="font-bold text-base sm:text-lg text-gray-300 mb-2">
                        Read or Buy
                      </span>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {Object.entries(manga.links).map(
                          ([key, link]) =>
                            link && (
                              <a
                                key={key}
                                href={getFullLink(key, link)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 sm:px-4 tracking-wider font-bold py-1 sm:py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-xs sm:text-sm text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                              >
                                {websiteNames[key] || key.toUpperCase()}
                              </a>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Alternative Titles */}
                  {manga.altTitles?.length > 0 && (
                    <div className="mb-8 sm:mb-4">
                      <span className="font-semibold text-sm sm:text-base text-gray-300 mb-2">
                        Alternative Titles
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {manga.altTitles.map((title, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-800 transition-all duration-150"
                          >
                            <MemoStableFlag
                              code={Object.keys(title)[0] || "en"}
                              className="w-6 sm:w-8 h-6 sm:h-8 rounded-md shadow-sm"
                              alt="flag"
                            />
                            <span className="text-xs sm:text-base font-medium text-gray-200">
                              {Object.values(title)[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManga;