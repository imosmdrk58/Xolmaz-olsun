"use client";
import React, { useState } from "react";
import {
  Crown,
  Star,
  Heart,
  Sparkles,
  Flame,
  Trophy,
  Eye,
} from "lucide-react";
import Image from "next/image";
function AsideComponent({
  processedMangas,
  processedLatestMangas,
  processedFavouriteMangas,
  handleMangaClicked,
}) {
  const [selectedCategory, setSelectedCategory] = useState("Top");
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  // Choose which manga list to display based on the selected category
  const mangaToDisplay =
    selectedCategory === "Top"
      ? processedMangas
      : selectedCategory === "Favourite"
        ? processedFavouriteMangas
        : processedLatestMangas;
  // Enhanced title configuration with icons and descriptions
  const getTitleConfig = (selectedCategory) => {
    switch (selectedCategory) {
      case "Top":
        return {
          title: "Elite Rankings",
          subtitle: "Premium Collection",
          icon: Trophy,
          gradient: "from-yellow-500 via-amber-400 to-orange-400",
        };
      case "Favourite":
        return {
          title: "Beloved Series",
          subtitle: "Heart's Collection",
          icon: Heart,
          gradient: "from-rose-400 via-pink-500 to-red-600",
        };
      case "New":
        return {
          title: "Fresh Arrivals",
          subtitle: "Latest Drops",
          icon: Flame,
          gradient: "from-cyan-400 via-blue-500 to-indigo-600",
        };
      default:
        return {
          title: "Manga Realm",
          subtitle: "Discover Stories",
          icon: Crown,
          gradient: "from-purple-400 via-violet-500 to-purple-600",
        };
    }
  };
  // Map category to icon component
  const categoryIcons = {
    Top: Star,
    Favourite: Heart,
    New: Flame,
  };
  const currentConfig = getTitleConfig(selectedCategory);
  const TitleIcon = currentConfig.icon;
  return (
    <>
      {mangaToDisplay.length > 0 && (
        <div className="w-[100% - 20px] ml-2 overflow-hidden">
          {/* Premium Header Section */}
          <div className="relative mb-6 group">
            {/* Background glow effect */}
            <div className={`absolute -inset-2  opacity-10 blur-2xl rounded-3xl group-hover:opacity-15 transition-opacity duration-700`}></div>
            <div className={`relative overflow-hidden`}>

              <div className="relative p-6">
                {/* Title Section */}
                <div className="flex items-center w-full justify-between mb-5">
                  <div className="flex items-center w-full gap-4">
                    {/* Animated Icon */}
                    <div className={`relative p-3 rounded-xl bg-gradient-to-r ${currentConfig.gradient}  shadow-lg transition-all duration-300`}>
                      <TitleIcon className="w-6 h-6 text-white drop-shadow-lg" />
                      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-white/60 fill-white animate-pulse" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                        {currentConfig.title}
                      </h2>
                      <p className="text-xs text-gray-400 font-medium tracking-wider opacity-80">
                        {currentConfig.subtitle}
                      </p>
                    </div>

                  </div>
                  <button
                    onClick={() => router.push('/history')}
                    className="group relative min-w-[107px] text-sm px-4 py-2.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white transition-all duration-200 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      View All
                    </span>
                  </button>
                </div>

                {/* Enhanced Category Buttons */}
                <div className="flex justify-center mt-9  gap-2 mb-6">
                  <div className="grid  grid-cols-3 mx-2 md:mx-0  gap-3">
                    {["Top", "Favourite", "New"].map((category, index) => {
                      const Icon = categoryIcons[category];
                      return (
                        <span
                          key={index}
                          onClick={() => handleCategoryChange(category)}
                          className={`relative h-12  cursor-pointer flex justify-center items-center xl:min-w-[127px] lg:px-3 py-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[102%]
              ${selectedCategory === category
                              ? "brightness-150 shadow-[0_0_5px_rgba(0,0,0,1)] shadow-purple-500 sm:shadow-[0_0_7px_rgba(0,0,0,1)] sm:shadow-purple-500 scale-[102%]"
                              : "hover:brightness-110"
                            } 
              before:absolute tracking-tighter before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
            `}
                          style={{
                            background: selectedCategory === category
                              ? "linear-gradient(135deg, #321c4f, #1a0f35, #2d1b4e)"  // Enhanced gradient
                              : "linear-gradient(135deg, #3b235a, #24143f, #332050)", // Slightly lighter purple
                          }}
                        >
                          <Icon
                            className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300 ${category == "Top" ? "fill-yellow-500/20 text-yellow-500" : category == "Favourite" ? "fill-rose-500/50 text-rose-400" : "fill-cyan-500/50 text-cyan-400"}  rounded-md p-1`}
                          />
                          <span className="font-semibold md:hidden tracking-wide text-[12px] sm:text-[16px] ml-1 xl:flex py-2 text-purple-200 transition-colors duration-300">
                            {category}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 -ml-0.5">
                  <ul className="grid grid-cols-3 md:flex md:flex-col space-y-1 sm:space-y-2">
                    {mangaToDisplay.slice(0, 9).map((manga, index) => (
                      <li
                        key={manga.id}
                        className="cursor-pointer"
                        onClick={() => handleMangaClicked(manga)}
                      >
                        <div className="relative flex w-full gap-0.5 sm:gap-2 lg:gap-3 py-2 items-center transition-all duration-300 hover:bg-gray-800/50 hover:scale-[101%] rounded-lg sm:px-2 group">
                          {/* Rank Number with enhanced styling */}
                          <div className="flex-shrink-0 w-5 sm:w-6 lg:w-8 text-left">
                            <span className="text-3xl sm:text-5xl font-bold bg-gradient-to-b from-gray-300 to-gray-500 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-purple-500 transition-all duration-300">
                              {index + 1}
                            </span>
                          </div>

                          {/* Manga Cover with enhanced hover effect */}
                          <div className="flex-shrink-0 w-8 h-12 sm:w-10 sm:h-14 lg:w-12 lg:h-16 rounded-lg overflow-hidden shadow-md transition-all duration-300  hover:shadow-xl hover:shadow-purple-500/25">
                            <Image
                              width={100}
                              height={150}
                              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                              src={manga?.coverImageUrl}
                              alt={manga?.title ?? 'No title'}
                            />
                          </div>

                          {/* Manga Details */}
                          <div className="flex flex-col justify-center ml-1 sm:ml-2 min-w-0">
                            {/* Manga Title */}
                            <h3 className="font-semibold text-[10px] sm:text-sm lg:text-base line-clamp-1 text-white hover:text-purple-300 transition duration-300">
                              {manga?.title ?? "Untitled Manga"}
                            </h3>

                            {/* Manga Rating */}
                            <div className="flex items-center gap-1.5 text-[#a1a1aa]">
  {selectedCategory === "Top" && (
    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400/30" aria-hidden="true" />
  )}
  {selectedCategory === "Favourite" && (
    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400 fill-rose-400/30" aria-hidden="true" />
  )}
  {selectedCategory === "New" && (
    <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 fill-cyan-400/30" aria-hidden="true" />
  )}
  <span className="text-xs sm:text-sm">
    {selectedCategory === "Top"
      ? manga?.rating?.rating?.bayesian?.toFixed(2) ?? "0.0"
      : selectedCategory === "Favourite"
      ? manga?.rating?.follows ?? 0
      : manga?.rating?.comments?.repliesCount ?? 0}
  </span>
</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default AsideComponent;