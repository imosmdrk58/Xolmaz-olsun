"use client";
import React, { useState } from "react";
import {
  Star,
  Heart,
  Flame,
  Trophy,
  Eye,
  MessageCircle,
  UserPlus,
  TrendingUp
} from "lucide-react";

function AsideComponent({
  processedMangas = [],
  processedLatestMangas = [],
  processedFavouriteMangas = [],
  handleMangaClicked = () => { },
}) {
  const [selectedCategory, setSelectedCategory] = useState("Top");
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(".0", "") + "K";
    }
    return num.toString();
  };

  // Select manga list based on category
  const mangaToDisplay =
    selectedCategory === "Top"
      ? processedMangas
      : selectedCategory === "Favourite"
        ? processedFavouriteMangas
        : processedLatestMangas;

  // Category icon & label config for stats
  const statConfig = {
    Top: {
      title: "Top Ranked",
      subtitle: "Highest Rated Series",
      titleIcon: Trophy,
      icon: Star,
      label: "Rating",
      getValue: (m) =>
        m?.rating?.rating?.bayesian?.toFixed(2) ?? "0.00",
      color: "text-yellow-400",
      iconBg: "bg-yellow-400/10",
    },
    Favourite: {
      title: "Fan Favorites",
      subtitle: "Most Loved Series",
      titleIcon: Heart,
      icon: UserPlus,
      label: "Follows",
      getValue: (m) => formatNumber(m?.rating?.follows ?? 0),
      color: "text-rose-400",
      iconBg: "bg-rose-400/10",
    },
    New: {
      title: "New Releases",
      subtitle: "Latest Manga Drops",
      titleIcon: Flame,
      icon: MessageCircle,
      label: "Comments",
      getValue: (m) =>
        m?.rating?.rating?.bayesian?.toFixed(2) ?? "0.00",
      color: "text-cyan-400",
      iconBg: "bg-cyan-400/10",
    },
  };

  // Category button config
  const categories = [
    { key: "Top", label: "Top", icon: Trophy, accent: "text-yellow-400" },
    { key: "Favourite", label: "Favourite", icon: Heart, accent: "text-rose-400" },
    { key: "New", label: "New", icon: Flame, accent: "text-cyan-400" },
  ];


  const StatIcon = statConfig[selectedCategory].icon;
const TitleIcon= statConfig[selectedCategory].titleIcon
  return (
    <section
      aria-label="Manga list"
      className="w-full max-w-md mx-auto select-none"
      style={{ background: "transparent" }}
    >
      <div className="flex mx-9 mb-7 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-lg">< TitleIcon className={`w-6 h-6 ${statConfig[selectedCategory].color}   drop-shadow-md`} /></div>
          <div>
            <h2 className="text-lg font-semibold text-white">{statConfig[selectedCategory].title}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wide">{statConfig[selectedCategory].subtitle}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-300 text-sm hover:text-white hover:bg-gray-800/50 transition-all duration-200 border border-gray-700/50">
          <Eye className="w-4 h-4" />
          View All
        </button>
      </div>
      {/* Category Tabs */}
      <nav className="flex justify-center gap-4 mb-6">
        {categories.map(({ key, label, icon: Icon, accent }) => {
          const active = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex min-w-28 justify-center items-center gap-2 px-4 py-4 rounded-lg font-semibold text-sm transition-colors duration-300 focus:outline-none
                 ${active
                  ? `bg-[rgba(255,255,255,0.09)] ${accent}`
                  : "text-gray-400 bg-[rgba(255,255,255,0.05)]  hover:text-gray-200"
                }`}
              aria-pressed={active}
              type="button"
            >
              <Icon
                className={`w-5 h-5 ${active ? accent : "text-gray-500"
                  }`}
                aria-hidden="true"
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Manga List */}
      <ul className="space-y-3 mx-3">
        {mangaToDisplay.slice(0, 9).map((manga, idx) => (
          <li
            key={manga.id}
            onClick={() => handleMangaClicked(manga)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleMangaClicked(manga);
              }
            }}
            className="flex items-center gap-1 cursor-pointer rounded-lg px-3 py-2 transition-colors duration-250
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
              hover:bg-gray-800/40"
            aria-label={`${manga.title} - ${statConfig[selectedCategory].label}: ${statConfig[
              selectedCategory
            ].getValue(manga)}`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 text-center select-none">
              <span
                className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-gray-400 to-gray-600`}
              >
                {idx + 1}
              </span>
            </div>

            {/* Cover */}
            <div className="flex-shrink-0  w-12 h-16 rounded-md overflow-hidden shadow-md">
              <img
                src={manga.coverImageUrl}
                alt={manga.title ?? "Manga cover"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Title & Stats */}
            <div className="flex flex-col ml-3 flex-1 min-w-0">
              <h3
                className="text-white text-sm font-semibold truncate"
                title={manga.title}
              >
                {manga.title ?? "Untitled Manga"}
              </h3>

              <div className={`flex items-center gap-2 mt-1 text-xs text-gray-400 select-none ${selectedCategory == "New" ? "hidden" : ""}`}>
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full ${statConfig[selectedCategory].iconBg} ${statConfig[selectedCategory].color}`}
                  aria-hidden="true"
                >
                  <StatIcon className="w-3.5 h-3.5" />
                </span>
                <span className={`font-medium text-gray-300`}>
                  {selectedCategory !== "New" && statConfig[selectedCategory].getValue(manga)}
                </span>
              </div>
              {console.log(selectedCategory)
              }
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AsideComponent;
