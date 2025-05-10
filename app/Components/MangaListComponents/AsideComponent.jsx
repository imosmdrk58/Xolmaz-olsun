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
        <div className="w-5/12">
          <div className="pl-7 text-white shadow-lg w-full">
            {/* Section Header */}
            <div className="pb-7 text-2xl font-bold text-purple-200 tracking-wide uppercase ">
              <h1 className="border-b-4 border-purple-900 flex flex-row w-fit gap-4 items-center pb-2">
                <Crown className="w-6 h-6 text-white fill-white"/>
                <span>
                  {selectedCategory === "Top"
                    ? "Top Manga"
                    : selectedCategory === "Favourite"
                    ? "Favourite Manga"
                    : "New Manga"}
                </span>
              </h1>
            </div>
            <div className="w-full p-3 rounded-lg mb-2">
              <div className="grid grid-cols-3 gap-3">
                {["Top", "Favourite", "New"].map((category, index) => {
                  const Icon = categoryIcons[category];
                  return (
                    <span
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`relative cursor-pointer flex justify-center items-center min-w-[127px] px-3 py-2 rounded-xl overflow-hidden
                  ${
                    selectedCategory === category
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
                        className={`w-7 h-7 ${category=="Top"?"fill-yellow-500/10 text-yellow-600":category=="Favourite"?"fill-rose-500/50 text-rose-500":"fill-white/70 text-black/70 "}  rounded-md p-1`}
                      />
                      <span className="font-semibold text-[16px] ml-1 flex py-2 text-purple-300">
                        {category}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <ul className="flex flex-col">
                {mangaToDisplay.slice(0, 10).map((manga, index) => (
                  <li
                    key={manga.id}
                    className="cursor-pointer"
                    onClick={() => handleMangaClicked(manga)}
                  >
                    <div className="relative flex w-full gap-5 py-3.5 items-center transition-all duration-300 hover:bg-gray-800 rounded-lg">
                      <div className="relative left-4 top-0 flex h-[72px] w-10 items-center justify-center text-right">
                        <span className="text-5xl font-extrabold text-gray-400">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-5 pl-12.8">
                        {/* Manga Cover - replaced with Image icon */}
                        <div
                          className="relative w-[48px] h-[48px] rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center bg-gray-700"
                          title={manga?.title ?? "Unavailable"}
                        >
                        <Image width={300} height={300}
                        className="w-full min-w-12 h-full object-cover rounded-lg"
                        src={manga?.coverImageUrl}
                        alt={manga?.title ?? 'No title'}
                      />
                        </div>

                        <div className="flex flex-col justify-center gap-1.6">
                          {/* Manga Title */}
                          <h3>
                            <div className="font-semibold line-clamp-1 text-white text-lg hover:text-yellow-300 transition duration-300">
                              {manga?.title ?? "Untitled Manga"}
                            </div>
                          </h3>

                          {/* Manga Rating */}
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Star
                              className="w-4 h-4 text-yellow-400"
                              aria-hidden="true"
                            />
                            <span className="text-sm">
                              {manga?.rating?.rating?.bayesian?.toFixed(2) ?? "0"}
                            </span>
                          </div>
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
