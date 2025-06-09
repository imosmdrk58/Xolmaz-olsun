import React, { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  User2,
  Heart,
  ArrowUpCircle,
  MessageSquare,
  Zap,
  ArrowUp,
  TrendingUp,
  ChevronLeft,
  ChevronUp,
  Loader2,
  Users,
  Calendar,
  Activity,
} from "lucide-react";

const CommentsOnManga = ({ manga }) => {
  const CACHE_KEY = `comments_on_manga_${manga?.id || "unknown"}`;
  const LAST_FETCH_TIMESTAMP_KEY = `comments_on_manga_${manga?.id || "unknown"}_last_fetch`;
  const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  const COMMENTS_PER_PAGE = 20;

  const [thread, setThread] = useState(manga?.rating?.comments?.threadId || null);
  const [repliesCount, setRepliesCount] = useState(
    manga?.rating?.comments?.repliesCount || 0
  );
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedTexts, setExpandedTexts] = useState({});
  const [expandedSpoilers, setExpandedSpoilers] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Calculate total pages based on replies count
  useEffect(() => {
    if (repliesCount > 0) {
      setTotalPages(Math.ceil(repliesCount / COMMENTS_PER_PAGE));
    }
  }, [repliesCount]);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchComments = useCallback(async (page = 1) => {
    if (!thread || !repliesCount) {
      console.warn("No thread or repliesCount, skipping fetch");
      return;
    }

    const isFirstPage = page === 1;
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError("");

    const now = Date.now();
    const cacheKey = `${CACHE_KEY}_page_${page}`;
    const timestampKey = `${LAST_FETCH_TIMESTAMP_KEY}_page_${page}`;
    const cachedTimestamp = Number(localStorage.getItem(timestampKey)) || 0;

    // Check cached data for this specific page
    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData?.data && parsedData?.total) {
            if (isFirstPage) {
              setComments(parsedData.data);
            } else {
              setComments(prev => [...prev, ...parsedData.data]);
            }
            setTotal(parsedData.total);
            setLoading(false);
            setLoadingMore(false);
            console.log(`Loaded page ${page} comments from cache`);
            return;
          }
        }
      } catch (e) {
        console.error("Error parsing cached comments:", e);
      }
    }

    // Calculate skip count based on page
    const skip = (page - 1) * COMMENTS_PER_PAGE;
    const adjustedRepliesCount = Math.max(0, repliesCount - skip);

    try {
      const url = new URL("/api/comments", window.location.origin);
      url.searchParams.append("thread", thread);
      url.searchParams.append("repliesCount", adjustedRepliesCount.toString());
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", COMMENTS_PER_PAGE.toString());

      const response = await fetch(url);
      const responseData = await response.json();

      const { data, total, error: apiError } = responseData;
      if (apiError) {
        setError(apiError);
      } else {
        if (isFirstPage) {
          setComments(data || []);
        } else {
          setComments(prev => [...prev, ...(data || [])]);
        }
        setTotal(total || 0);
        const newTimestamp = Date.now();

        // Store in localStorage
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, total, timestamp: newTimestamp })
          );
          localStorage.setItem(timestampKey, newTimestamp.toString());
          console.log(`Cached page ${page} comments successfully`);
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }
    } catch (err) {
      setError("Failed to load comments: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [thread, repliesCount, CACHE_KEY, LAST_FETCH_TIMESTAMP_KEY]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const loadMoreComments = () => {
    if (currentPage < totalPages && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchComments(nextPage);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const parseCommentContent = (content) => {
    if (!content) return { parts: [] };

    const parts = [];
    const lines = content
      .split("\n")
      .map((line) => line.replace(/\t/g, ""))
      .filter((line) => line !== "");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.endsWith("said:")) {
        parts.push({
          type: "reaction",
          content: line.trim(),
        });
      } else if (line === "Click to expand...") {
        parts.push({
          type: "expandable",
          content: [lines[i - 1]].join("\n").trim(),
        });
      } else if (line.startsWith("Spoiler:")) {
        const spoilerTitle = line.replace("Spoiler:", "").trim() || "Spoiler";
        const spoilerContent = lines.slice(i + 1).join("\n").trim();
        parts.push({
          type: "spoiler",
          title: spoilerTitle,
          content: spoilerContent,
        });
        break;
      } else {
        if (lines[i + 1] === "Click to expand...") continue;
        parts.push({
          type: "normal",
          content: line,
        });
      }
    }

    return { parts };
  };

  const toggleExpandText = (key) => {
    setExpandedTexts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSpoiler = (key) => {
    setExpandedSpoilers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen">
        <div className="w-full px-6 py-8">
          {/* Animated Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl animate-pulse"></div>
            <div className="w-40 h-8 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg animate-pulse"></div>
            <div className="w-20 h-6 bg-zinc-800 rounded-full animate-pulse ml-auto"></div>
          </div>
          
          {/* Loading Animation */}
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full animate-spin border-t-purple-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Skeleton Comments */}
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 rounded-2xl p-6 border border-zinc-800/50 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="w-32 h-5 bg-zinc-700 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-zinc-700 rounded"></div>
                      <div className="w-3/4 h-4 bg-zinc-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen">
      <div className="w-full px-6 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                Comments
              </h2>
              <p className="text-zinc-400 text-sm">Join the discussion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {total > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full backdrop-blur-sm">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-zinc-300 font-medium">{total.toLocaleString()}</span>
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full backdrop-blur-sm">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-zinc-300 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-950/50 to-red-900/30 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-red-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {comments.length === 0 && !loading ? (
          <div className="text-center py-20 bg-gradient-to-br from-zinc-900/30 to-zinc-800/20 rounded-2xl border border-zinc-800/50">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-300 mb-3">No comments yet</h3>
            <p className="text-zinc-500 text-lg">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            {/* Comments Grid */}
            <div className="grid gap-6">
              {comments.map((comment, index) => {
                const commentId = comment.id || index;
                const { parts } = parseCommentContent(comment.commentContent);

                return (
                  <article
                    key={commentId}
                    className="group bg-gradient-to-br from-zinc-900/70 to-zinc-800/30 rounded-2xl border border-zinc-800/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-sm"
                  >
                    <div className="p-6">
                      {/* Enhanced User Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 relative">
                          {comment.avatarUrl ? (
                            <img
                              src={comment.avatarUrl}
                              alt={`${comment.username || "Anonymous"} avatar`}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-zinc-700 group-hover:border-purple-500/50 transition-colors"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border-2 border-zinc-700 group-hover:border-purple-500/50 transition-colors">
                              <User2 className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-zinc-900"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white text-lg truncate group-hover:text-purple-300 transition-colors">
                              {comment.username || "Anonymous"}
                            </h3>
                            {comment.userTitle && (
                              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-medium">
                                {comment.userTitle}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-zinc-500">
                            {comment.timeAgo && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <time dateTime={comment.postDateTime || undefined} className="hover:text-zinc-400 transition-colors">
                                  {comment.timeAgo}
                                </time>
                              </div>
                            )}
                            {comment.joinedDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {new Date(comment.joinedDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {comment.messageCount && (
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>{comment.messageCount.toLocaleString()} messages</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Comment Content */}
                      <div className="space-y-4 text-zinc-300 leading-relaxed">
                        {parts.map((part, partIndex) => {
                          const key = `${commentId}-${partIndex}`;

                          if (part.type === "reaction") {
                            return (
                              <div
                                key={key}
                                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                              >
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                <span className="text-zinc-300 font-medium">{part.content.split(" ")[0]}</span>
                                <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full">
                                  <ArrowUpCircle className="w-4 h-4 text-purple-400" />
                                  <span className="text-xs text-purple-300">Upvote</span>
                                </div>
                              </div>
                            );
                          }

                          if (part.type === "normal") {
                            return (
                              <p key={key} className="text-zinc-300 text-base leading-relaxed">
                                {part.content}
                              </p>
                            );
                          }

                          if (part.type === "expandable") {
                            const isExpanded = expandedTexts[key];
                            return (
                              <div key={key} className="relative">
                                {!isExpanded ? (
                                  <div
                                    className="relative cursor-pointer group/expand"
                                    onClick={() => toggleExpandText(key)}
                                  >
                                    <div className="blur-sm select-none">
                                      <p className="text-zinc-400">{part.content}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/40 to-zinc-800/20 group-hover/expand:from-zinc-900/20 group-hover/expand:to-zinc-800/10 transition-all duration-300 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                      <div className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-700 flex items-center gap-2 rounded-xl text-sm text-zinc-300 border border-zinc-600 group-hover/expand:border-purple-500/50 transition-all duration-300">
                                        <Eye className="w-4 h-4" />
                                        <span>Click to view</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700">
                                    <p className="text-zinc-300">{part.content}</p>
                                    <button
                                      onClick={() => toggleExpandText(key)}
                                      className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
                                    >
                                      <EyeOff className="w-4 h-4" />
                                      Hide content
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          if (part.type === "spoiler") {
                            const isExpanded = expandedSpoilers[key];
                            return (
                              <div key={key} className="border border-yellow-500/30 rounded-xl bg-gradient-to-r from-yellow-500/5 to-orange-500/5 overflow-hidden">
                                <button
                                  onClick={() => toggleSpoiler(key)}
                                  className="w-full p-4 flex items-center justify-between hover:bg-yellow-500/10 transition-all duration-300"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <span className="text-yellow-400 font-semibold">
                                      Spoiler: {part.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-yellow-500 px-2 py-1 bg-yellow-500/20 rounded-full">
                                      {isExpanded ? 'Click to hide' : 'Click to reveal'}
                                    </span>
                                    {isExpanded ? (
                                      <ChevronUp className="w-5 h-5 text-yellow-400 transition-transform duration-300" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-yellow-400 transition-transform duration-300" />
                                    )}
                                  </div>
                                </button>
                                {isExpanded && (
                                  <div className="p-4 border-t border-yellow-500/20 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 animate-in slide-in-from-top-2 duration-300">
                                    <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                      {part.content}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>

                      {/* Enhanced Footer */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                          {comment.reactionType && comment.reactionUsers !== "None" && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-full hover:border-red-500/40 transition-all duration-300">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-300 font-medium">{comment.reactionUsers}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {comment.postUrl && (
                            <a
                              href={comment.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-300"
                              aria-label="Open post in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Enhanced Load More Section */}
            {currentPage < totalPages && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMoreComments}
                  disabled={loadingMore}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-zinc-700 disabled:to-zinc-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading more comments...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                        <span>Load more comments</span>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                          {Math.min(COMMENTS_PER_PAGE, repliesCount - (currentPage * COMMENTS_PER_PAGE))} more
                        </span>
                      </>
                    )}
                  </div>
                </button>
                
                <div className="mt-4 text-zinc-500 text-sm">
                  Showing {comments.length} of {total} comments
                </div>
              </div>
            )}
          </>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentsOnManga;