import React, { useCallback, useMemo, memo, lazy } from "react";
import { useNavigate } from "react-router-dom";

const SearchMangaCard = memo(
  lazy(() => import("./SearchMangaCardWith2ViewModeModules/SearchMangaCard"))
);
const SearchMangaList = memo(
  lazy(() => import("./SearchMangaCardWith2ViewModeModules/SearchMangaList"))
);
// Memoized StarRating component
const StarRating = memo(({ rating }) => {
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating / 2 - fullStars >= 0.5;

  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <svg
              key={i}
              className="w-4 h-4 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-4.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-4.292z" />
            </svg>
          );
        }
        if (hasHalfStar && i === fullStars) {
          return (
            <svg
              key={i}
              className="w-4 h-4 text-amber-400"
              fill="url(#half-gradient)"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="half-gradient">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#475569" />
                </linearGradient>
              </defs>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-4.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-4.292z" />
            </svg>
          );
        }
        return (
          <svg
            key={i}
            className="w-4 h-4 text-slate-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 neutrality.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-4.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-4.292z" />
          </svg>
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