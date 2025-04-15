"use client";
import Image from 'next/image';
import React from 'react';
import StableFlag from '../StableFlag';
import { getRatingColor } from "../../constants/Flags"
const MemoStableFlag = React.memo(StableFlag)

const AboutManga = ({ manga, handleChapterClick, last }) => {
  if (!manga) return null;
  console.log(manga)
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
            <MemoStableFlag code={manga.originalLanguage || "UN"} className="absolute bottom-2 right-2 w-10 rounded shadow-md" alt="flag" />
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
                <span key={index} className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/30 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_2px_rgba(76,43,140,0.3)] shadow-purple-500">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="bg-[#070920] mt-2 rounded-xl p-8 shadow-[1px_2px_3px_rgba(76,43,140,0.3)] shadow-purple-400">
              <h2 className="text-2xl font-semibold text-white mb-6">Description</h2>
              <p
                className={`text-gray-300 leading-relaxed`}
              >
                {manga.description}
              </p>
            </div>

            <hr className="my-4 border-gray-700" />

            {/* Metadata */}
            <div className="flex flex-wrap gap-8">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Author</h3>
                <a href={`/author/${manga?.authorName[0]?.id}/${manga?.authorName[0]?.attributes?.name}`} className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                  {manga?.authorName[0]?.attributes?.name || "N/A"}
                </a>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Artist</h3>
                <a href={`/author/${manga?.artistName[0]?.id}/${manga?.artistName[0]?.attributes?.name}`} className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500">
                  {manga?.artistName[0]?.attributes?.name || "N/A"}
                </a>
              </div>
              {manga?.tags?.map(tagGroup => tagGroup?.tags?.length > 0 && (
                <div key={tagGroup.group} className="mb-4">
                  <h3 className="text-lg font-bold tracking-wider text-white mb-2 capitalize">{tagGroup.group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagGroup.tags.slice(0, tagGroup.group === "genre" || tagGroup.group === "format" ? 2 : tagGroup.tags.length).map(tag => (
                      <span key={tag} className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-3">Demographic</h3>
                <a href="/titles?demos=josei" className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                >
                  {manga.MangaStoryType[0].related || manga.MangaStoryType}
                </a>
              </div>
            </div>

            {/* Links */}
            {manga.links && (
              <div className="mb-4 flex flex-col">
                <span className="font-bold text-lg text-gray-300 mb-2">Read or Buy</span>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(manga.links).map(([key, link]) => link && (
                    <a
                      key={key}
                      href={getFullLink(key, link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 tracking-wider font-bold py-2 bg-[#4c2b8c]/5 hover:bg-[#5c3b9c]/50 rounded-lg text-sm  text-white text-center transition-all duration-300 shadow-[0_0_5px_rgba(76,43,140,0.3)] shadow-purple-500"
                    >
                      {websiteNames[key] || key.toUpperCase()}
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
                      <MemoStableFlag
                        code={Object.keys(title)[0] || "en"}
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







// "use client";
// import Image from 'next/image';
// import React, { useState, useEffect } from 'react';
// import StableFlag from '../StableFlag';
// import { getRatingColor } from "../../constants/Flags"
// const MemoStableFlag = React.memo(StableFlag)

// const AboutManga = ({ manga, handleChapterClick, last }) => {
//   if (!manga) return null;

//   const [isDescExpanded, setIsDescExpanded] = useState(false);


//   const getFullLink = (key, link) => ({
//     mu: `https://www.mangaupdates.com/${link}`,
//     mal: `https://myanimelist.net/manga/${link}`,
//     bw: `https://bookwalker.jp/${link}`,
//     ap: `https://www.anime-planet.com/${link}`,
//     nu: `https://www.novelupdates.com/${link}`,
//     kt: `https://mangadex.org/title/${manga.id}/${link}`,
//     al: `https://anilist.co/manga/${link}`,
//   }[key] || link);

//   const websiteNames = {
//     al: "AniList",
//     amz: "Amazon",
//     bw: "BookWalker",
//     ebj: "eBookJapan",
//     mal: "MyAnimeList",
//     mu: "MangaUpdates",
//     ap: "Anime Planet",
//     nu: "Novel Updates",
//     kt: "MangaDex",
//     raw: "Raw",
//     cdj: "CDJapan",
//     yen: "YEN Press",
//   };

//   return (
//     <div className="flex-grow py-10 px-20">
//       {/* Cover Background */}
//       <div className="absolute inset-x-0 top-0 h-[360px] bg-cover" style={{ backgroundImage: `url('${manga.coverImageUrl}')` }}>
//         <div className="absolute inset-0 h-[360px] bg-black/40 backdrop-blur-sm z-10"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-20 flex flex-col  gap-6">
//         {/* Cover Image */}
//         <div className="absolute w-48 h-[295px] group select-none">
//           <a href={manga.coverImageUrl} className="block relative w-full h-full">
//             <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-white">
//                 <path fill="currentColor" d="m9.5 13.09 1.41 1.41-4.5 4.5H10v2H3v-7h2v3.59zm1.41-3.59L9.5 10.91 5 6.41V10H3V3h7v2H6.41zm3.59 3.59 4.5 4.5V14h2v7h-7v-2h3.59l-4.5-4.5zM13.09 9.5l4.5-4.5H14V3h7v7h-2V6.41l-4.5 4.5z" />
//               </svg>
//             </div>
//             <Image
//               className="w-full h-full rounded shadow-md transition-transform duration-200 group-hover:translate-y-0"
//               src={manga.coverImageUrl}
//               alt="Cover image"
//               width={384}
//               height={295}
//               loading="lazy"
//             />
//             <MemoStableFlag code={manga.originalLanguage || "UN"} className="absolute bottom-2 right-2 w-10 rounded shadow-md" alt="flag" />
//           </a>
//         </div>

//         {/* Title and Info */}
//         <div className="flex ml-56 flex-col justify-between">
//           <div className='flex flex-col justify-between gap-24'>
//             <div>
//               <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 leading-tight text-shadow-md break-words">
//                 {manga.title.length < 30 ? manga.title : manga.title.slice(0, 30) + "..."}
//               </h1>
//               <p className="ml-1 text-base mb-2 sm:text-xl text-gray-300 line-clamp-2 leading-tight">
//                 {manga.altTitle.length < 30 ? manga.altTitle : manga.altTitle.slice(0, 30) + "..."}
//               </p>
//             </div>
//             <p className="text-base sm:text-base text-white ">{manga?.authorName[0]?.attributes?.name || "N/A"}</p>
//           </div>

//           {/* Actions and Stats */}
//           <div className="mt-4 w-full flex flex-col gap-2">
//             <div className="grid grid-cols-9 items-center">
//               <button
//                 onClick={() => handleChapterClick(last)}
//                 className="col-span-2 bg-[#4d229e]/40 border-2 border-[#4d229e] rounded px-3 py-3 flex items-center justify-center gap-5 text-white font-medium whitespace-nowrap hover:bg-[#4d229e]/60 transition duration-200 shadow-sm"
//               >
//                 <Image src="/list.svg" alt="list" width={28} height={28} className="brightness-200" />
//                 Read Latest
//               </button>
//               <div className="col-span-5 flex items-center gap-5 ml-6">
//                 <div className="flex items-center gap-2 text-base text-gray-300">
//                   <img src="/star.svg" alt="Rating" className="w-5 h-5 opacity-80" />
//                   <span className="font-semibold text-gray-200">{manga?.rating?.rating?.bayesian?.toFixed(3) || "N/A"}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-base text-gray-300">
//                   <img src="/comment.svg" alt="Comments" className="w-5 h-5 opacity-80" />
//                   <span className="font-semibold text-gray-200">{manga?.rating?.comments?.repliesCount || 0}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-base text-gray-300">
//                   <img src="/heart.svg" alt="Likes" className="w-5 h-5 opacity-80" />
//                   <span className="font-semibold text-gray-200">{manga?.rating?.follows || 0}</span>
//                 </div>
//               </div>
//               <span className="col-span-2 flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase min-w-72">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 6.35 6.35" className="w-5 h-5 text-blue-500">
//                   <path fill="currentColor" d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058" />
//                 </svg>
//                 Publication: {manga.year}, {manga?.status}
//               </span>
//             </div>

//             {/* Tags and Rating */}
//             <div className="mt-3 sm:mx-2 flex flex-wrap gap-2">
//               <span className={`rounded-md px-3 py-1 text-base font-semibold text-white shadow-[0_0_3px_rgba(0,0,0,1)] shadow-purple-500 hover:scale-105 transition-transform duration-150 ${getRatingColor(manga.contentRating)}`}>
//                 {manga.contentRating.toUpperCase()}
//               </span>
//               {manga.flatTags.map((tag, index) => (
//                 <span key={index} className="px-4 py-2 bg-[#4c2b8c]/50 hover:bg-[#5c3b9c]/50 rounded-lg text-sm font-medium text-gray-200 transition-all duration-300 shadow-[0_0_10px_rgba(76,43,140,0.3)]">
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//         {/* Title and Info */}
//         <main className="max-w-full py-2">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

//             {/* Sidebar */}
//             <div className="lg:col-span-4 space-y-2">
//               <div className="bg-[#070920] rounded-xl p-6 shadow-[0_0_6px_rgba(76,43,140,0.3)]">
//                 <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
//                 <div className="space-y-4">
//                   <button
//                     onClick={() => handleChapterClick(last)}
//                     className="w-full py-3 bg-[#4c2b8c] hover:bg-[#5c3b9c] text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(76,43,140,0.5)]"
//                   >
//                     Start Reading
//                   </button>
//                   <div className="flex justify-between text-sm text-gray-400">
//                   <span>Last updated: {Math.floor((Date.now() - Date.parse(last.publishAt)) / (1000 * 60 * 60 * 24))} days ago</span>
//                     <span>Chapter {last?.chapter || '??'}</span>
//                   </div>
//                   <div className="flex justify-between gap-4">
//                     <button className="flex items-center gap-2 px-3 py-2 bg-[#070920] hover:bg-[#1a1b2a] rounded-lg text-sm font-medium transition-all duration-300">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-purple-600"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       Follow
//                     </button>
//                     <button className="flex items-center gap-2 px-3 py-2 bg-[#070920] hover:bg-[#1a1b2a] rounded-lg text-sm font-medium transition-all duration-300">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-purple-600"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
//                       </svg>
//                       Share
//                     </button>
//                     <button className="flex items-center gap-2 px-3 py-2 bg-[#070920] hover:bg-[#1a1b2a] rounded-lg text-sm font-medium transition-all duration-300">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-purple-600"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
//                       </svg>
//                       Bookmark
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-[#070920] rounded-xl p-6 shadow-[0_0_12px_rgba(76,43,140,0.4)]">
//     <h3 className="text-xl font-semibold text-white mb-4">Publication</h3>
//     <div className="space-y-3">
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5 text-white"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//             clipRule="evenodd"
//           />
//         </svg>
//         <span className="text-sm tracking-wider text-gray-300">First Published: {manga?.year}</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5 text-white"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//             clipRule="evenodd"
//           />
//         </svg>
//         <span className="text-sm tracking-wider text-gray-300">Status: {manga?.status}</span>
//       </div>
//     </div>
//   </div>
//               {/* External Links */}
//               {manga.links && Object.values(manga.links).some((link) => link) && (
//                 <div className="bg-[#070920] rounded-xl p-8 shadow-[0_0_6px_rgba(76,43,140,0.3)]">
//                   <h2 className="text-2xl font-semibold text-white mb-6">Read or Buy</h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     {Object.entries(manga.links).map(
//                       ([key, link]) =>
//                         link && (
//                           <a
//                             key={key}
//                             href={getFullLink(key, link)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-4 py-2 bg-[#4c2b8c]/50 hover:bg-[#5c3b9c]/50 rounded-lg text-sm font-medium text-white text-center transition-all duration-300 shadow-[0_0_10px_rgba(76,43,140,0.3)]"
//                           >
//                             {websiteNames[key] || key.toUpperCase()}
//                           </a>
//                         )
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>


//             {/* Main Content */}
//             <div className="lg:col-span-8 space-y-2">
//               {/* Synopsis */}
//               <div className="bg-[#070920] rounded-xl p-8 shadow-[0_0_6px_rgba(76,43,140,0.3)]">
//                 <h2 className="text-2xl font-semibold text-white mb-6">Description</h2>
//                 <p
//                   className={`text-gray-300 leading-relaxed ${!isDescExpanded && manga.description.length > 300 ? 'line-clamp-4' : ''
//                     }`}
//                 >
//                   {manga.description}
//                 </p>
//                 {manga.description.length > 300 && (
//                   <button
//                     onClick={() => setIsDescExpanded(!isDescExpanded)}
//                     className="mt-4 text-white hover:text-white font-medium transition-colors duration-300"
//                   >
//                     {isDescExpanded ? 'Show Less' : 'Read More'}
//                   </button>
//                 )}
//               </div>

//               <div className="col-span-1 space-y-8">
//   <div className="bg-[#070920] rounded-xl p-6 shadow-[0_0_6px_rgba(76,43,140,0.3)]">
//     <h3 className="text-xl font-semibold text-white mb-4">Creators</h3>
//     <div className="space-y-4">
//       <div>
//         <h4 className="text-sm font-medium text-gray-500 mb-2">Author</h4>
//         <a
//           href={`/author/${manga?.authorName[0]?.id}/${manga?.authorName[0]?.attributes?.name}`}
//           className="block px-4 py-2 rounded-lg bg-[#4c2b8c]/50 hover:bg-[#5c3b9c]/50 text-sm font-medium text-white hover:text-white transition-all duration-300 shadow-[0_0_8px_rgba(76,43,140,0.3)]"
//         >
//           {manga?.authorName[0]?.attributes?.name || "N/A"}
//         </a>
//       </div>
//       <div>
//         <h4 className="text-sm font-medium text-gray-500 mb-2">Artist</h4>
//         <a
//           href={`/author/${manga?.artistName[0]?.id}/${manga?.artistName[0]?.attributes?.name}`}
//           className="block px-4 py-2 rounded-lg bg-[#4c2b8c]/50 hover:bg-[#5c3b9c]/50 text-sm font-medium text-white hover:text-white transition-all duration-300 shadow-[0_0_8px_rgba(76,43,140,0.3)]"
//         >
//           {manga?.artistName[0]?.attributes?.name || "N/A"}
//         </a>
//       </div>
//       <div>
//         <h4 className="text-sm font-medium text-gray-500 mb-2">Demographic</h4>
//         <a
//           href="/titles?demos=josei"
//           className="block px-4 py-2 rounded-lg bg-[#4c2b8c]/50 hover:bg-[#5c3b9c]/50 text-sm font-medium text-white hover:text-white transition-all duration-300 shadow-[0_0_8px_rgba(76,43,140,0.3)]"
//         >
//           {manga.MangaStoryType?.[0]?.related || manga.MangaStoryType || "N/A"}
//         </a>
//       </div>
//     </div>
//   </div>

// </div>

//               {/* Categories */}
//               {manga?.tags?.some((tag) => tag?.tags?.length > 0) && (
//                 <div className="bg-[#070920] rounded-xl p-8 shadow-[0_0_6px_rgba(76,43,140,0.3)]">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {manga.tags.map(
//                       (tagGroup) =>
//                         tagGroup?.tags?.length > 0 && (
//                           <div key={tagGroup.group} className="space-y-3">
//                             <h3 className="text-2xl font-semibold text-white mb-6 capitalize">{tagGroup.group}</h3>
//                             <div className="flex flex-wrap gap-2">
//                               {tagGroup.tags.map((tag) => (
//                                 <span
//                                   key={tag}
//                                   className="px-3 py-1.5 bg-[#4c2b8c]/30 hover:bg-[#5c3b9c]/30 rounded-lg text-sm font-medium text-gray-300 transition-all duration-300"
//                                 >
//                                   {tag}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )
//                     )}
//                   </div>
//                 </div>
//               )}


//               {/* Alternative Titles */}
//               {manga.altTitles?.length > 0 && (
//                 <div className="bg-[#070920] rounded-xl p-8 shadow-[0_0_6px_rgba(76,43,140,0.3)]">
//                   <h2 className="text-2xl font-semibold text-white mb-6">Alternative Titles</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {manga.altTitles.map((title, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-3 p-3 bg-[#4c2b8c]/20 hover:bg-[#5c3b9c]/20 rounded-lg transition-all duration-300"
//                       >
//                         <MemoStableFlag
//                           code={Object.keys(title)[0] || "en"}
//                           className="w-6 h-6 rounded-sm shadow-sm"
//                           alt="flag"
//                         />
//                         <span className="text-sm font-medium text-gray-200">{Object.values(title)[0]}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>

//   );
// };

// export default AboutManga;