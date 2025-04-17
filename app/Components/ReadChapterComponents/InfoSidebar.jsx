import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const InfoSidebar = ({ isCollapsed, setIsCollapsed, mangaInfo, chapterInfo }) => {
  if (!mangaInfo) return null;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Animation timing
    setAnimateIn(true);
  }, []);

  // Format links into groups for better organization
  const linkGroups = Object.entries(mangaInfo.links || {}).reduce((acc, [key, value]) => {
    const category = 
      key.includes('amazon') || key.includes('book') ? 'purchase' :
      key.includes('mal') || key.includes('anilist') ? 'tracking' : 'social';
    
    if (!acc[category]) acc[category] = [];
    acc[category].push({ name: key, url: value });
    return acc;
  }, {});

  const ToggleButton = () => (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={`relative z-10 h-12 w-12 rounded-full flex items-center justify-center
                 bg-gradient-to-br from-indigo-600 to-purple-700
                 shadow-lg ${isCollapsed ? '' : 'shadow-purple-500/30'}
                 transition-all duration-500 ease-in-out transform
                 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 6L9 12L15 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
  
  // Mini display when collapsed
  if (isCollapsed) {
    return (
      <div className="fixed left-6 top-1/3 z-50">
        <div className="flex flex-col items-center space-y-5">
          <ToggleButton />
          
          <div className="p-3 rounded-full bg-gray-900/90 backdrop-blur-xl shadow-lg border border-purple-500/20 
                        transition-all duration-300 hover:scale-110 hover:border-purple-500/50 cursor-pointer
                        flex items-center justify-center group">
            <div className="absolute opacity-0 group-hover:opacity-100 whitespace-nowrap bg-gray-900 px-3 py-1 rounded-md 
                          text-white text-xs font-medium -right-24 transition-opacity duration-300">
              {mangaInfo.title}
            </div>
            <Image
              width={40}
              height={40}
              src={mangaInfo.coverImageUrl}
              alt={mangaInfo.title}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          
          <div className="p-2 rounded-full bg-gray-900/90 backdrop-blur-xl shadow-lg border border-indigo-500/20
                        text-white flex items-center justify-center hover:border-indigo-500/50 cursor-pointer
                        transition-all duration-300 hover:scale-110 group">
            <div className="absolute opacity-0 group-hover:opacity-100 whitespace-nowrap bg-gray-900 px-3 py-1 rounded-md 
                          text-white text-xs font-medium -right-20 transition-opacity duration-300">
              Chapter {chapterInfo.title}
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5V4.5C4 4.22386 4.22386 4 4.5 4H19.5C19.7761 4 20 4.22386 20 4.5V19.5C20 19.7761 19.7761 20 19.5 20H4.5C4.22386 20 4 19.7761 4 19.5Z" 
                    stroke="white" strokeWidth="1.5"/>
              <path d="M8 7H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 17H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center w-1/4 py-3 relative
                ${activeTab === id 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'}`}
    >
      <div className="flex flex-col items-center">
        <div className="mb-1">
          {icon}
        </div>
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </div>
      {activeTab === id && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"></div>
      )}
    </button>
  );

  return (
    <div
      className={`fixed inset-y-4 left-4 w-80 bg-gray-900/95 backdrop-blur-xl rounded-2xl overflow-hidden 
                shadow-2xl border border-gray-800 shadow-purple-800/10 flex flex-col
                transform ${animateIn ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'} 
                transition-all duration-700 ease-out z-30`}
    >
      {/* Top section with cover and title */}
      <div className="relative">
        {/* Full width background image with overlay */}
        <div className="h-64 w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
          <div className="absolute inset-0 backdrop-blur-sm z-0">
            <Image
              src={mangaInfo.coverImageUrl}
              fill
              className="object-cover opacity-30"
              alt="background"
            />
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex space-x-4 items-end">
            {/* Toggle button positioned at top right */}
            <div className="absolute top-3 right-3">
              <ToggleButton />
            </div>
            
            {/* Cover image */}
            <div className="relative w-28 h-36 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <Image
                src={mangaInfo.coverImageUrl}
                fill
                className="object-cover"
                alt={mangaInfo.title}
              />
            </div>
            
            {/* Title and quick stats */}
            <div className="flex-1 pb-1">
              <h1 className="text-white font-bold line-clamp-2">{mangaInfo.title}</h1>
              <div className="flex items-center space-x-3 mt-1 text-xs">
                <span className="px-2 py-0.5 bg-purple-500/20 rounded text-purple-300 border border-purple-500/30">
                  {mangaInfo.status}
                </span>
                <span className="flex items-center text-gray-400">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {mangaInfo.year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800">
        <TabButton 
          id="overview" 
          label="Overview" 
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          }
        />
        <TabButton 
          id="details" 
          label="Details" 
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          }
        />
        <TabButton 
          id="creators" 
          label="Creators" 
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        />
        <TabButton 
          id="links" 
          label="Links" 
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13C10.8631 13.6225 11.9324 14 13 14C16.3137 14 19 11.3137 19 8C19 4.68629 16.3137 2 13 2C9.68629 2 7 4.68629 7 8C7 9.06765 7.37752 10.1369 8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 11C13.1369 10.3775 12.0676 10 11 10C7.68629 10 5 12.6863 5 16C5 19.3137 7.68629 22 11 22C14.3137 22 17 19.3137 17 16C17 14.9324 16.6225 13.8631 16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        />
      </div>

      {/* Content area with dynamic tab content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Current chapter info */}
            <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-900/30">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-700/30 flex items-center justify-center mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 10H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 14H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 18H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-indigo-300 font-medium">CURRENT CHAPTER</div>
                  <div className="text-white">{chapterInfo.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {chapterInfo.pageCount} pages • {chapterInfo.translatedLanguage}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags section with horizontal scroll */}
            <div>
              <div className="text-xs text-gray-400 uppercase font-medium mb-2">Tags</div>
              <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar-x">
                {mangaInfo.flatTags.map((tag, index) => (
                  <span
                    key={index}
                    className="whitespace-nowrap px-3 py-1.5 bg-gray-800 rounded-full text-xs 
                             text-gray-300 border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description with expanding capability */}
            <div>
              <div className="text-xs text-gray-400 uppercase font-medium mb-2">About</div>
              <div className="bg-gray-800/30 rounded-lg p-3 text-sm text-gray-300">
                <p className="line-clamp-3 hover:line-clamp-none transition-all duration-500">
                  {mangaInfo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Content rating */}
            <div className="flex items-center">
              <div className="w-1/3 text-xs text-gray-400 uppercase font-medium">Rating</div>
              <div className="w-2/3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  mangaInfo.contentRating === 'safe' ? 'bg-green-900/20 text-green-300 border border-green-900/30' :
                  mangaInfo.contentRating === 'suggestive' ? 'bg-blue-900/20 text-blue-300 border border-blue-900/30' :
                  'bg-red-900/20 text-red-300 border border-red-900/30'
                }`}>
                  {mangaInfo.contentRating.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Publication year */}
            <div className="flex items-center">
              <div className="w-1/3 text-xs text-gray-400 uppercase font-medium">Year</div>
              <div className="w-2/3 text-white">{mangaInfo.year}</div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <div className="w-1/3 text-xs text-gray-400 uppercase font-medium">Status</div>
              <div className="w-2/3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  mangaInfo.status === 'completed' ? 'bg-green-900/20 text-green-300 border border-green-900/30' :
                  mangaInfo.status === 'ongoing' ? 'bg-blue-900/20 text-blue-300 border border-blue-900/30' :
                  'bg-gray-800 text-gray-300 border border-gray-700'
                }`}>
                  {mangaInfo.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center">
              <div className="w-1/3 text-xs text-gray-400 uppercase font-medium">Language</div>
              <div className="w-2/3 text-white">{chapterInfo.translatedLanguage}</div>
            </div>

            {/* Tags in a grid */}
            <div>
              <div className="text-xs text-gray-400 uppercase font-medium mb-2">Tags</div>
              <div className="grid grid-cols-2 gap-2">
                {mangaInfo.flatTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-800/50 rounded text-xs text-center
                             text-gray-300 border border-gray-700 truncate"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creators' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Author card */}
            <div className="bg-gray-800/30 rounded-lg overflow-hidden">
              <div className="py-2 px-3 bg-gray-800 text-xs text-gray-300 uppercase font-medium">Author</div>
              <div className="p-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center mr-3 border border-indigo-900/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5"/>
                    <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">{mangaInfo?.authorName[0]?.attributes?.name || "N/A"}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Author</div>
                </div>
              </div>
            </div>

            {/* Artist card */}
            <div className="bg-gray-800/30 rounded-lg overflow-hidden">
              <div className="py-2 px-3 bg-gray-800 text-xs text-gray-300 uppercase font-medium">Artist</div>
              <div className="p-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-3 border border-purple-900/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 21.5L4 13.5L12 5.5L18.5 12L10.5 20L2.5 22L2 21.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M15 6L18 3L21 6L18 9" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M10 16L14 12" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">{mangaInfo?.artistName[0]?.attributes?.name || "N/A"}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Artist</div>
                </div>
              </div>
            </div>

            {/* Similar content placeholder */}
            <div className="pt-2">
              <div className="text-xs text-gray-400 uppercase font-medium mb-3">You might also like</div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-gray-800/30 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800/50 transition-colors duration-300">
                    <div className="w-full h-24 bg-gray-800/80"></div>
                    <div className="p-2">
                      <div className="w-full h-3 bg-gray-800 rounded mb-1"></div>
                      <div className="w-2/3 h-2 bg-gray-800 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Tracking sites */}
            {linkGroups.tracking && linkGroups.tracking.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 uppercase font-medium mb-2">Tracking</div>
                <div className="grid grid-cols-2 gap-2">
                  {linkGroups.tracking.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-blue-900/20 border border-blue-900/30 rounded-lg 
                              hover:bg-blue-900/30 transition-colors duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-800/30 flex items-center justify-center mr-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 18L5 21Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-blue-200 text-sm truncate">{link.name}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase links */}
            {linkGroups.purchase && linkGroups.purchase.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 uppercase font-medium mb-2">Purchase</div>
                <div className="grid grid-cols-2 gap-2">
                  {linkGroups.purchase.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-green-900/20 border border-green-900/30 rounded-lg 
                              hover:bg-green-900/30 transition-colors duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-800/30 flex items-center justify-center mr-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M5 6L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 11V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M15 11V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M8 6L8 5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-green-200 text-sm truncate">{link.name}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Social and other links */}
            {linkGroups.social && linkGroups.social.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 uppercase font-medium mb-2">Social & More</div>
                <div className="grid grid-cols-2 gap-2">
                  {linkGroups.social.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-purple-900/20 border border-purple-900/30 rounded-lg 
                              hover:bg-purple-900/30 transition-colors duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-800/30 flex items-center justify-center mr-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 13C10.8631 13.6225 11.9324 14 13 14C16.3137 14 19 11.3137 19 8C19 4.68629 16.3137 2 13 2C9.68629 2 7 4.68629 7 8C7 9.06765 7.37752 10.1369 8 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M14 11C13.1369 10.3775 12.0676 10 11 10C7.68629 10 5 12.6863 5 16C5 19.3137 7.68629 22 11 22C14.3137 22 17 19.3137 17 16C17 14.9324 16.6225 13.8631 16 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-purple-200 text-sm truncate">{link.name}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Support disclaimer */}
            <div className="bg-gray-800/40 rounded-lg p-3 text-xs text-gray-400 italic">
              Supporting creators by using official sources helps ensure the continuation of your favorite content.
            </div>
          </div>
        )}
      </div>
      
 
    </div>
  );
};

export default InfoSidebar;