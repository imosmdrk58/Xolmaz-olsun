import React from 'react'
import Image from 'next/image';
const InfoSidebar = ({ isCollapsed, setIsCollapsed, mangaInfo, chapterInfo }) => {
    console.log(mangaInfo,chapterInfo)
    return mangaInfo && (
        <div
            style={{
                scrollbarWidth: "none",
                scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
            }}
            className={`${isCollapsed ? "w-fit rounded-2xl h-fit flex justify-center items-center z-50 absolute top-1/2 left-4 shadow-[0_0_10px_rgba(0,0,0,1)] shadow-purple-500" : "w-80 h-[91vh] mt-1.5 py-6 px-5"} col-span-1 bg-gray-900/50 backdrop-blur-md shadow-2xl flex flex-col overflow-y-auto border border-gray-700 transition-all duration-300 `}
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
                            <Image
                            width={300}
                            height={300}
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
                            {mangaInfo?.authorName[0]?.attributes?.name || "N/A"}
                            </p>
                        </div>
                        {/* Artists */}
                        <div className="flex justify-center flex-col w-full items-center">
                            <h4 className="font-semibold w-full flex flex-row gap-4 text-purple-400 mb-2">
                                <Image width={20} height={20} className='opacity-80' src='/author.svg' alt="author" />Artists:</h4>
                            <p className="text-sm text-gray-300 bg-[#0c0221] py-1 px-3 rounded-full w-fit">
                            {mangaInfo?.artistName[0]?.attributes?.name || "N/A"}
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





// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { langFullNames } from '@/app/constants/Flags';
// const InfoSidebar = ({ isCollapsed, setIsCollapsed, mangaInfo, chapterInfo }) => {
//   if (!mangaInfo) return null;
  
//   const [activeTab, setActiveTab] = useState('overview');
//   const [animateIn, setAnimateIn] = useState(false);
  
//   useEffect(() => {
//     setAnimateIn(true);
//   }, []);

//   // Format links into groups for better organization
//   const linkGroups = Object.entries(mangaInfo.links || {}).reduce((acc, [key, value]) => {
//     const category = 
//       key.includes('amazon') || key.includes('book') ? 'purchase' :
//       key.includes('mal') || key.includes('anilist') ? 'tracking' : 'social';
    
//     if (!acc[category]) acc[category] = [];
//     acc[category].push({ name: key, url: value });
//     return acc;
//   }, {});

//   const ToggleButton = () => (
//     <button
//       onClick={() => setIsCollapsed(!isCollapsed)}
//       className={`relative z-10 h-16 w-16 rounded-full flex items-center justify-center
//                  bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800
//                  shadow-lg ${isCollapsed ? '' : 'shadow-purple-500/30'}
//                  transition-all duration-500 ease-in-out transform hover:scale-110
//                  ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
//     >
//       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M15 6L9 12L15 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     </button>
//   );
  
//   // Mini display when collapsed
//   if (isCollapsed) {
//     return (
//       <div className="raltive left-0 h-[91.7vh] z-50">
//         <div className="flex flex-col h-full items-center justify-center space-y-6">
//           <ToggleButton />
          
//           <div className="p-4 rounded-full bg-gray-900/90 backdrop-blur-xl shadow-xl border-2 border-purple-500/30 
//                         transition-all duration-300 hover:scale-110 hover:border-purple-500/60 cursor-pointer
//                         flex items-center justify-center group">
//             <div className="absolute opacity-0 group-hover:opacity-100 whitespace-nowrap bg-gray-900 px-4 py-2 rounded-lg 
//                           text-white text-sm font-medium -right-28 transition-opacity duration-300 shadow-lg">
//               {mangaInfo.title}
//             </div>
//             <Image
//               width={56}
//               height={56}
//               src={mangaInfo.coverImageUrl}
//               alt={mangaInfo.title}
//               className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
//             />
//           </div>
          
//           <div className="p-3 rounded-full bg-gray-900/90 backdrop-blur-xl shadow-xl border-2 border-indigo-500/30
//                         text-white flex items-center justify-center hover:border-indigo-500/60 cursor-pointer
//                         transition-all duration-300 hover:scale-110 group">
//             <div className="absolute opacity-0 group-hover:opacity-100 whitespace-nowrap bg-gray-900 px-4 py-2 rounded-lg 
//                           text-white text-sm font-medium -right-28 transition-opacity duration-300 shadow-lg">
//               Chapter {chapterInfo.title}
//             </div>
//             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M4 19.5V4.5C4 4.22386 4.22386 4 4.5 4H19.5C19.7761 4 20 4.22386 20 4.5V19.5C20 19.7761 19.7761 20 19.5 20H4.5C4.22386 20 4 19.7761 4 19.5Z" 
//                     stroke="white" strokeWidth="2"/>
//               <path d="M8 7H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M8 10H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M8 14H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M8 18H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const TabButton = ({ id, label, icon }) => (
//     <button 
//       onClick={() => setActiveTab(id)}
//       className={`flex items-center justify-center w-1/4 py-4 relative
//                 ${activeTab === id 
//                 ? 'text-white' 
//                 : 'text-gray-400 hover:text-gray-300'}`}
//     >
//       <div className="flex flex-col items-center">
//         <div className="mb-2">
//           {icon}
//         </div>
//         <span className="text-sm font-medium tracking-wide">{label}</span>
//       </div>
//       {activeTab === id && (
//         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-10 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"></div>
//       )}
//     </button>
//   );

//   return (
//     <div
//     style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
//       className={`fixed inset-y-4 left-4 w-96 bg-gray-900/95 backdrop-blur-xl rounded-2xl overflow-hidden 
//                 shadow-2xl border-2 border-gray-800 shadow-purple-800/20 flex flex-col
//                 transform ${animateIn ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'} 
//                 transition-all duration-700 ease-out z-30`}
//     >
//       {/* Top section with cover and title */}
//       <div className="relative">
//         {/* Full width background image with overlay */}
//         <div className="h-72 w-full relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
//           <div className="absolute inset-0 backdrop-blur-sm z-0">
//             <Image
//               src={mangaInfo.coverImageUrl}
//               fill
//               className="object-cover opacity-30"
//               alt="background"
//               priority
//             />
//           </div>
          
//           {/* Content */}
//           <div className="absolute bottom-0 left-0 right-0 z-20 p-5 flex space-x-5 items-end">
//             {/* Toggle button positioned at top right */}
//             <div className="absolute top-4 right-4">
//               <ToggleButton />
//             </div>
            
//             {/* Cover image */}
//             <div className="relative w-36 h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700">
//               <Image
//                 src={mangaInfo.coverImageUrl}
//                 fill
//                 className="object-cover"
//                 alt={mangaInfo.title}
//                 priority
//               />
//             </div>
            
//             {/* Title and quick stats */}
//             <div className="flex-1 pb-2">
//               <h1 className="text-white font-bold text-xl line-clamp-2">{mangaInfo.title}</h1>
//               <div className="flex items-center space-x-3 mt-2 text-sm">
//                 <span className="px-3 py-1 bg-purple-500/20 rounded-lg text-purple-300 border border-purple-500/30">
//                   {mangaInfo.status}
//                 </span>
//                 <span className="flex items-center text-gray-400">
//                   <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                     <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
//                   </svg>
//                   {mangaInfo.year}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Navigation Tabs */}
//       <div className="flex border-b-2 border-gray-800">
//         <TabButton 
//           id="overview" 
//           label="Overview" 
//           icon={
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
//               <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
//               <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
//               <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
//             </svg>
//           }
//         />
//         <TabButton 
//           id="details" 
//           label="Details" 
//           icon={
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M8 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M8 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
//             </svg>
//           }
//         />
//         <TabButton 
//           id="creators" 
//           label="Creators" 
//           icon={
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
//               <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           }
//         />
//         <TabButton 
//           id="links" 
//           label="Links" 
//           icon={
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M10 13C10.8631 13.6225 11.9324 14 13 14C16.3137 14 19 11.3137 19 8C19 4.68629 16.3137 2 13 2C9.68629 2 7 4.68629 7 8C7 9.06765 7.37752 10.1369 8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M14 11C13.1369 10.3775 12.0676 10 11 10C7.68629 10 5 12.6863 5 16C5 19.3137 7.68629 22 11 22C14.3137 22 17 19.3137 17 16C17 14.9324 16.6225 13.8631 16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           }
//         />
//       </div>

//       {/* Content area with dynamic tab content */}
//       <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
//         {activeTab === 'overview' && (
//           <div className="space-y-6 animate-fadeIn">
//             {/* Current chapter info */}
//             <div className="bg-indigo-900/30 rounded-xl p-4 border-2 border-indigo-900/40 hover:border-indigo-900/60 transition-colors duration-300">
//               <div className="flex items-center">
//                 <div className="w-12 h-12 rounded-full bg-indigo-700/40 flex items-center justify-center mr-4">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M8 6H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                     <path d="M8 10H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                     <path d="M8 14H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                     <path d="M8 18H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                     <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="text-sm text-indigo-300 font-medium">CURRENT CHAPTER</div>
//                   <div className="text-white text-lg font-medium">{chapterInfo.title}</div>
//                   <div className="text-sm text-gray-400 mt-1">
//                     {chapterInfo.pageCount} pages • {chapterInfo.translatedLanguage}
//                   </div>
//                 </div>
//               </div>
//             </div>

        

//             {/* Description with expanding capability */}
//             <div>
//               <div className="text-sm text-gray-400 uppercase font-medium mb-3">About</div>
//               <div className="bg-gray-800/40 rounded-xl p-4 text-base text-gray-300 hover:bg-gray-800/60 transition-colors">
//                 <p className=" transition-all duration-500 cursor-text">
//                   {mangaInfo.description}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'details' && (
//           <div className="space-y-2 animate-fadeIn">
//             {/* Content rating */}
//             <div className="flex items-center py-2">
//               <div className="w-1/3 text-sm text-gray-400 uppercase font-medium">Rating</div>
//               <div className="w-2/3">
//                 <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
//                   mangaInfo.contentRating === 'safe' ? 'bg-green-900/30 text-green-300 border-2 border-green-900/40' :
//                   mangaInfo.contentRating === 'suggestive' ? 'bg-blue-900/30 text-blue-300 border-2 border-blue-900/40' :
//                   'bg-red-900/30 text-red-300 border-2 border-red-900/40'
//                 }`}>
//                   {mangaInfo.contentRating.toUpperCase()}
//                 </span>
//               </div>
//             </div>

//             {/* Publication year */}
//             <div className="flex items-center py-2">
//               <div className="w-1/3 text-sm text-gray-400 uppercase font-medium">Year</div>
//               <div className="w-2/3 text-white text-lg">{mangaInfo.year}</div>
//             </div>

//             {/* Status */}
//             <div className="flex items-center py-2">
//               <div className="w-1/3 text-sm text-gray-400 uppercase font-medium">Status</div>
//               <div className="w-2/3">
//                 <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
//                   mangaInfo.status === 'completed' ? 'bg-green-900/30 text-green-300 border-2 border-green-900/40' :
//                   mangaInfo.status === 'ongoing' ? 'bg-blue-900/30 text-blue-300 border-2 border-blue-900/40' :
//                   'bg-gray-800 text-gray-300 border-2 border-gray-700'
//                 }`}>
//                   {mangaInfo.status.toUpperCase()}
//                 </span>
//               </div>
//             </div>

//             {/* Language */}
//             <div className="flex items-center py-2">
//               <div className="w-1/3 text-sm text-gray-400 uppercase font-medium">Language</div>
//               <div className="w-2/3 text-white text-lg">{langFullNames[chapterInfo.translatedLanguage]}</div>
//             </div>

//             {/* Tags in a grid */}
//             <div className="pt-4">
//               <div className="text-sm text-gray-400 uppercase font-medium mb-3">Tags</div>
//               <div className="grid grid-cols-2 gap-3">
//                 {mangaInfo.flatTags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className="px-4 py-2 bg-gray-800/60 rounded-lg text-sm text-center
//                              text-gray-300 border border-gray-700 truncate hover:bg-gray-700/50 transition-colors"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'creators' && (
//           <div className="space-y-6 animate-fadeIn">
//             {/* Author card */}
//             <div className="bg-gray-800/40 rounded-xl overflow-hidden border-2 border-gray-800 hover:border-gray-700 transition-colors">
//               <div className="py-3 px-4 bg-gray-800 text-sm text-gray-300 uppercase font-medium">Author</div>
//               <div className="p-5 flex items-center">
//                 <div className="w-14 h-14 rounded-full bg-indigo-900/40 flex items-center justify-center mr-4 border-2 border-indigo-900/40">
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
//                     <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="text-white text-lg font-medium">{mangaInfo?.authorName[0]?.attributes?.name || "N/A"}</div>
//                   <div className="text-sm text-gray-400 mt-1">Author</div>
//                 </div>
//               </div>
//             </div>

//             {/* Artist card */}
//             <div className="bg-gray-800/40 rounded-xl overflow-hidden border-2 border-gray-800 hover:border-gray-700 transition-colors">
//               <div className="py-3 px-4 bg-gray-800 text-sm text-gray-300 uppercase font-medium">Artist</div>
//               <div className="p-5 flex items-center">
//                 <div className="w-14 h-14 rounded-full bg-purple-900/40 flex items-center justify-center mr-4 border-2 border-purple-900/40">
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M2 21.5L4 13.5L12 5.5L18.5 12L10.5 20L2.5 22L2 21.5Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
//                     <path d="M15 6L18 3L21 6L18 9" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
//                     <path d="M10 16L14 12" stroke="white" strokeWidth="2"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="text-white text-lg font-medium">{mangaInfo?.artistName[0]?.attributes?.name || "N/A"}</div>
//                   <div className="text-sm text-gray-400 mt-1">Artist</div>
//                 </div>
//               </div>
//             </div>

//             {/* Similar content placeholder */}
//             <div className="pt-4">
//               <div className="text-sm text-gray-400 uppercase font-medium mb-4">You might also like</div>
//               <div className="grid grid-cols-3 gap-3">
//                 {[1, 2, 3].map((item) => (
//                   <div key={item} className="bg-gray-800/40 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-800/60 transition-colors duration-300 border-2 border-gray-800">
//                     <div className="w-full h-28 bg-gray-800/80"></div>
//                     <div className="p-3">
//                       <div className="w-full h-4 bg-gray-800 rounded-lg mb-2"></div>
//                       <div className="w-3/4 h-3 bg-gray-800 rounded-lg"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'links' && (
//           <div className="space-y-6 animate-fadeIn">
//             {/* Tracking sites */}
//             {linkGroups.tracking && linkGroups.tracking.length > 0 && (
//               <div>
//                 <div className="text-sm text-gray-400 uppercase font-medium mb-3">Tracking</div>
//                 <div className="grid grid-cols-2 gap-3">
//                   {linkGroups.tracking.map((link, idx) => (
//                     <a
//                       key={idx}
//                       href={link.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center p-4 bg-blue-900/30 border-2 border-blue-900/40 rounded-xl 
//                               hover:bg-blue-900/40 hover:border-blue-900/60 transition-all duration-300"
//                     >
//                       <div className="w-10 h-10 rounded-full bg-blue-800/40 flex items-center justify-center mr-3">
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path d="M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 18L5 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                       </div>
//                       <div className="overflow-hidden">
//                         <div className="text-blue-200 text-base truncate font-medium">{link.name}</div>
//                       </div>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Purchase links */}
//             {linkGroups.purchase && linkGroups.purchase.length > 0 && (
//               <div>
//                 <div className="text-sm text-gray-400 uppercase font-medium mb-3">Purchase</div>
//                 <div className="grid grid-cols-2 gap-3">
//                   {linkGroups.purchase.map((link, idx) => (
//                     <a
//                       key={idx}
//                       href={link.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center p-4 bg-green-900/30 border-2 border-green-900/40 rounded-xl 
//                               hover:bg-green-900/40 hover:border-green-900/60 transition-all duration-300"
//                     >
//                       <div className="w-10 h-10 rounded-full bg-green-800/40 flex items-center justify-center mr-3">
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                           <path d="M5 6L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           <path d="M9 11V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                           <path d="M15 11V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                           <path d="M8 6L8 5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                       </div>
//                       <div className="overflow-hidden">
//                         <div className="text-green-200 text-base truncate font-medium">{link.name}</div>
//                       </div>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Social and other links */}
//             {linkGroups.social && linkGroups.social.length > 0 && (
//               <div>
//                 <div className="text-sm text-gray-400 uppercase font-medium mb-3">Social & More</div>
//                 <div className="grid grid-cols-2 gap-3">
//                   {linkGroups.social.map((link, idx) => (
//                     <a
//                       key={idx}
//                       href={link.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center p-4 bg-purple-900/30 border-2 border-purple-900/40 rounded-xl 
//                               hover:bg-purple-900/40 hover:border-purple-900/60 transition-all duration-300"
//                     >
//                       <div className="w-10 h-10 rounded-full bg-purple-800/40 flex items-center justify-center mr-3">
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path d="M10 13C10.8631 13.6225 11.9324 14 13 14C16.3137 14 19 11.3137 19 8C19 4.68629 16.3137 2 13 2C9.68629 2 7 4.68629 7 8C7 9.06765 7.37752 10.1369 8 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                           <path d="M14 11C13.1369 10.3775 12.0676 10 11 10C7.68629 10 5 12.6863 5 16C5 19.3137 7.68629 22 11 22C14.3137 22 17 19.3137 17 16C17 14.9324 16.6225 13.8631 16 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                         </svg>
//                       </div>
//                       <div className="overflow-hidden">
//                         <div className="text-purple-200 text-base truncate font-medium">{link.name}</div>
//                       </div>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Support disclaimer */}
//             <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-400 italic border-2 border-gray-800">
//               Supporting creators by using official sources helps ensure the continuation of your favorite content.
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InfoSidebar;