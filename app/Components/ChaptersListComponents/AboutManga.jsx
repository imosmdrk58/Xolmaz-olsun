"use client";
import React from "react";
import Image from "next/image";
import StableFlag from "../StableFlag";
import { getRatingColor } from "../../constants/Flags";
import {
  Star,
  MessageSquareText,
  Heart,
  List,
  ExternalLink,
  Calendar,
  CheckCircle,
} from "lucide-react";

const MemoStableFlag = React.memo(StableFlag);

const AboutManga = ({ manga, handleChapterClick, last }) => {
  if (!manga) return null;

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
    <div className="flex-grow px-4">
      {/* Cover Background */}
      <div
        className="absolute inset-x-0 top-0 h-[360px] bg-cover"
        style={{ backgroundImage: `url('${manga.coverImageUrl}')` }}
      >
        <div className="absolute inset-0 h-[360px] bg-black/40 backdrop-blur-sm z-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col sm:flex-row gap-6">
        {/* Cover Image */}
        <div className="absolute w-48 h-[295px] group select-none">
          <a href={manga.coverImageUrl} className="block relative w-full h-full">
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
              <List className="text-white" size={24} />
            </div>
            <Image
              className="w-full h-full rounded shadow-md transition-transform duration-200 group-hover:translate-y-0"
              src={manga.coverImageUrl}
              alt="Cover image"
              width={384}
              height={295}
              loading="lazy"
            />
            <MemoStableFlag
              code={manga.originalLanguage || "UN"}
              className="absolute bottom-2 right-2 w-10 rounded shadow-md"
              alt="flag"
            />
          </a>
        </div>

        {/* Title and Info */}
        <div className="flex ml-56 flex-col justify-between">
          <div className="flex flex-col justify-between gap-24">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 leading-tight text-shadow-md break-words">
                {manga.title.length < 30
                  ? manga.title
                  : manga.title.slice(0, 25) + "..."}
              </h1>
              <p className="ml-1 text-base mb-2 sm:text-xl text-gray-300 line-clamp-2 leading-tight">
                {manga.altTitle.length < 30
                  ? manga.altTitle
                  : manga.altTitle.slice(0, 25) + "..."}
              </p>
            </div>
            <p className="text-base sm:text-base text-white ">
              {manga?.authorName[0]?.attributes?.name || "N/A"}
            </p>
          </div>

          {/* Actions and Stats */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-9 items-center">
              <button
                onClick={() => handleChapterClick(last)}
                className="col-span-2 bg-[#4d229e]/40 border-2 border-[#4d229e] rounded px-3 py-3 flex items-center justify-center gap-5 text-white font-medium whitespace-nowrap hover:bg-[#4d229e]/60 transition duration-200 shadow-sm"
              >
                <List size={28} className="brightness-200" />
                Read Latest
              </button>
              <div className="col-span-5 flex items-center gap-5 ml-6">
                <div className="flex items-center gap-2 text-base text-gray-300">
                  <Star size={20} className="opacity-80 text-yellow-500" />
                  <span className="font-semibold text-gray-200">
                    {manga?.rating?.rating?.bayesian?.toFixed(3) || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-300">
                  <MessageSquareText size={20} className="opacity-80 text-white/70" />
                  <span className="font-semibold text-gray-200">
                    {manga?.rating?.comments?.repliesCount || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-300">
                  <Heart size={20} className="opacity-80 fill-rose-500/50 text-rose-500" />
                  <span className="font-semibold text-gray-200">
                    {manga?.rating?.follows || 0}
                  </span>
                </div>
              </div>
              <span className="col-span-2 flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase min-w-72">
                <CheckCircle size={20} className="text-blue-500" />
                Publication: {manga.year}, {manga?.status}
              </span>
            </div>

            {/* Tags and Rating */}
            <div className="mt-3 sm:mx-2 flex flex-wrap gap-2">
              <span
                className={`rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150 ${getRatingColor(
                  manga.contentRating
                )}`}
              >
                {manga.contentRating.toUpperCase()}
              </span>
              {manga.flatTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/30 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="bg-[#070920] mt-2 rounded-xl p-8 shadow-[1px_2px_3px_rgba(76,43,140,0.3)] shadow-purple-400">
              <h2 className="text-2xl font-semibold text-white mb-6">Description</h2>
              <p className="text-gray-300 leading-relaxed">{manga.description}</p>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-10 gap-y-0 mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Author</h3>
                <a
                  className="flex flex-wrap gap-2"
                  href={`/author/${manga?.authorName[0]?.id}/${manga?.authorName[0]?.attributes?.name}`}
                >
                  <span className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                    {manga?.authorName[0]?.attributes?.name || "N/A"}
                  </span>
                </a>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold tracking-wider text-white mb-2 capitalize">
                  Artist
                </h3>
                <a
                  className="flex flex-wrap gap-2"
                  href={`/author/${manga?.artistName[0]?.id}/${manga?.artistName[0]?.attributes?.name}`}
                >
                  <span className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                    {manga?.artistName[0]?.attributes?.name || "N/A"}
                  </span>
                </a>
              </div>
              {manga?.tags?.map(
                (tagGroup) =>
                  tagGroup?.tags?.length > 0 && (
                    <div key={tagGroup.group} className="mb-4">
                      <h3 className="text-lg font-bold tracking-wider text-white mb-2 capitalize">
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
                              className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  )
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Demographic</h3>
                <a
                  className="flex flex-wrap gap-2"
                  href="/titles?demos=josei"
                >
                  <span className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                    {manga?.MangaStoryType || "Not Available"}
                  </span>
                </a>
              </div>
            </div>

            {/* Links */}
            {manga.links && (
              <div className="mb-4 flex flex-col">
                <span className="font-bold text-lg text-gray-300 mb-2">
                  Read or Buy
                </span>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(manga.links).map(
                    ([key, link]) =>
                      link && (
                        <a
                          key={key}
                          href={getFullLink(key, link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
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
              <div className="mb-4">
                <span className="font-semibold text-base text-gray-300 mb-2">
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
                        className="w-8 h-8 rounded-md shadow-sm"
                        alt="flag"
                      />
                      <span className="text-base font-medium text-gray-200">
                        {Object.values(title)[0]}
                      </span>
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