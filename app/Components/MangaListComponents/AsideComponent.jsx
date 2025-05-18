"use client";
import React, { useState } from "react";
import {
  Crown,
  Star,
  Heart,
  Clock,
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

  // Map category to icon component
  const categoryIcons = {
    Top: Star,
    Favourite: Heart,
    New: Clock,
  };

  return (
    <>
      {mangaToDisplay.length > 0 && (
        <div className="w-full mb-10 overflow-hidden">
          <div className=" pl-2 sm:pl-7 text-white shadow-lg w-full">
            {/* Section Header */}
            <div className="pb-7 text-lg lg:text-2xl font-bold text-purple-200 tracking-wide uppercase ">
              <h1 className="border-b-4 border-purple-900 flex flex-row w-fit gap-2 items-center pb-2">
                <Crown className="w-6 h-6 text-white fill-white" />
                <span className="line-clamp-1">
                  {(selectedCategory === "Top"
                    ? "Top Manga"
                    : selectedCategory === "Favourite"
                      ? "Favourite Manga"
                      : "New Manga")}
                </span>
              </h1>
            </div>
            <div className="w-full lg:p-3 rounded-lg mb-2">
              <div className="grid  grid-cols-3 gap-1 lg:gap-3">
                {["Top", "Favourite", "New"].map((category, index) => {
                  const Icon = categoryIcons[category];
                  return (
                    <span
                      key={index}
                      onClick={() => handleCategoryChange(category)}
                      className={`relative cursor-pointer flex justify-center items-center xl:min-w-[127px] lg:px-3 py-2 rounded-xl overflow-hidden
                  ${selectedCategory === category
                          ? "brightness-150 shadow-[0_0_10px_rgba(0,0,0,1)] shadow-purple-500"
                          : ""
                        } 
                  before:absolute tracking-tighter before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                `}
                      style={{
                        background: selectedCategory === category
                          ? "linear-gradient(#321c4f, #1a0f35)"  // Dark purple gradient
                          : "linear-gradient(#3b235a, #24143f)", // Slightly lighter purple
                      }}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-7 sm:h-7 ${category == "Top" ? "fill-yellow-500/10 text-yellow-600" : category == "Favourite" ? "fill-rose-500/50 text-rose-500" : "fill-white/70 text-black/70 "}  rounded-md p-1`}
                      />
                      <span className="font-semibold md:hidden  sm:text-[16px] ml-1 xl:flex py-2 text-purple-300">
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
                    <div className="relative flex w-full gap-0.5 sm:gap-2 lg:gap-3 py-2 items-center transition-all duration-300 hover:bg-gray-800 rounded-lg sm:px-2">
                      {/* Rank Number */}
                      <div className="flex-shrink-0 w-5 sm:w-6 lg:w-8 text-left">
                        <span className="text-3xl sm:text-5xl font-bold text-gray-400">
                          {index + 1}
                        </span>
                      </div>

                      {/* Manga Cover */}
                      <div className="flex-shrink-0 w-8 h-12 sm:w-10 sm:h-14 lg:w-12 lg:h-16 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-105">
                        <Image
                          width={100}
                          height={150}
                          className="w-full h-full object-cover"
                          src={manga?.coverImageUrl}
                          alt={manga?.title ?? 'No title'}
                        />
                      </div>

                      {/* Manga Details */}
                      <div className="flex flex-col justify-center ml-1 sm:ml-2 min-w-0">
                        {/* Manga Title */}
                        <h3 className="font-semibold text-[10px] sm:text-sm lg:text-base line-clamp-1 text-white hover:text-yellow-300 transition duration-300">
                          {manga?.title ?? "Untitled Manga"}
                        </h3>

                        {/* Manga Rating */}
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star
                            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                            aria-hidden="true"
                          />
                          <span className="text-xs sm:text-sm">
                            {manga?.rating?.rating?.bayesian?.toFixed(2) ?? "0"}
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
      )}
    </>
  );
}

export default AsideComponent;
