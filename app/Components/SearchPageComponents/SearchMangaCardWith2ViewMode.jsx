import React, { useCallback, useMemo, memo, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
const SearchMangaCard = memo(
  lazy(() => import("./SearchMangaCardWith2ViewModeModules/SearchMangaCard"))
);
const SearchMangaList = memo(
  lazy(() => import("./SearchMangaCardWith2ViewModeModules/SearchMangaList"))
);
// Memoized StarRating component
const StarRating = memo(({ rating }) => {
  const fullStars = Math.floor(rating / 2);
  const fractionalPart = rating / 2 - fullStars;
  const hasHalfStar = fractionalPart >= 0.35; // Show half star if fractional part is 0.35 or more

  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          // Full star
          return (
            <Star
              key={i}
              className="w-[15px] h-[15px] text-amber-400 fill-current"
              aria-hidden="true"
            />
          );
        }
        if (i === fullStars && hasHalfStar) {
          // Half star
          return (
            <Star
              key={i}
              className="w-[17px] h-[17px] -mt-0.5"
              style={{
                fill: "url(#half-gradient)",
                stroke: "none",
              }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#475569" />
                </linearGradient>
              </defs>
            </Star>
          );
        }
        // Empty star
        return (
          <Star
            key={i}
            className="w-[15px] h-[15px]  text-slate-600 fill-current"
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
});

// Move formatCount and timeSinceUpdate outside the component for stability
const formatCount = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const timeSinceUpdate = (dateString) => {
  const timeDiff = Date.now() - new Date(dateString);
  const minutes = Math.floor(timeDiff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
  return `${minutes}m ago`;
};

const SearchMangaCardWith2ViewMode = ({ manga, viewMode }) => {
  const navigate = useNavigate();

  // Memoize manga ID to stabilize handleMangaClicked
  const mangaId = useMemo(() => manga.id, [manga.id]);

  // Stabilize handleMangaClicked with useCallback and stable dependencies
  const handleMangaClicked = useCallback(() => {
    navigate(`/manga/${mangaId}/chapters`, { state: { manga } });
  }, [navigate, mangaId, manga]);

  // Memoize props to ensure stability
  const cardProps = useMemo(
    () => ({
      StarRating,
      handleMangaClicked,
      manga,
      timeSinceUpdate,
      formatCount,
    }),
    [handleMangaClicked, manga]
  );

  return viewMode === "grid" ? (
    <SearchMangaCard {...cardProps} key={mangaId} />
  ) : (
    <SearchMangaList {...cardProps} key={mangaId} />
  );
};

export default memo(SearchMangaCardWith2ViewMode);