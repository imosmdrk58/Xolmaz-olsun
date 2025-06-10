import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MessageCircle,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  User2,
  Heart,
  ArrowUpCircle,
  MessageSquare,
  TrendingUp,
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

  const thread = useMemo(() => manga?.rating?.comments?.threadId || null);
  const repliesCount = useMemo(() => manga?.rating?.comments?.repliesCount || 0);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedTexts, setExpandedTexts] = useState({});
  const [expandedSpoilers, setExpandedSpoilers] = useState({});

  // Calculate total pages based on replies count
  useEffect(() => {
    if (repliesCount > 0) {
      setTotalPages(Math.ceil(repliesCount / COMMENTS_PER_PAGE));
    }
  }, [repliesCount]);

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

  console.log(comments);

  if (loading) {
    return (
      <div className="w-full  min-h-screen">
        <div className="w-full px-6 py-8">
          {/* Simple Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-purple-400/20 rounded-lg animate-pulse"></div>
            <div className="w-40 h-8 bg-zinc-800 rounded-lg animate-pulse"></div>
            <div className="w-20 h-6 bg-zinc-800 rounded-full animate-pulse ml-auto"></div>
          </div>

          {/* Loading Spinner Only */}
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-zinc-800 rounded-full animate-spin border-t-purple-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  min-h-screen">
      <div className="w-full px-6 py-8">
        {/* Clean Header */}
        <div className="flex  mb-7 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-400/10 rounded-lg relative border border-purple-400/20">
              <MessageCircle className="w-7 h-7 text-purple-400" />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-gray-950 flex items-center justify-center animate-pulse">
            </div> </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                Comments
              </h2>
              <p className="text-xs text-gray-400 uppercase tracking-wide flex flex-row w-full"><Activity className="w-4 h-4 mr-2 text-yellow-300" />
                Join the discussion
                </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {total > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-zinc-300 font-medium">{total.toLocaleString()}</span>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span className="text-zinc-300 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>


        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-red-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {comments.length === 0 && !loading ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="w-20 h-20 mx-auto mb-6 bg-zinc-800 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-300 mb-3">No comments yet</h3>
            <p className="text-zinc-500 text-lg">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            {/* Comments Grid */}
            <div className="grid grid-cols-2 gap-6">
              {comments.map((comment, index) => {
                const commentId = comment.id || index;
                const { parts } = parseCommentContent(comment.commentContent);

                return (
                  <article
                    key={commentId}
                    className="group bg-white/5 backdrop-blur-md rounded-xl border border-zinc-800 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/5"
                  >
                    <div className="p-6">
                      {/* User Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 relative">
                          {comment.avatarUrl ? (
                            <img
                              src={comment.avatarUrl}
                              alt={`${comment.username || "Anonymous"} avatar`}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-zinc-700 group-hover:border-purple-400/50 transition-colors"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 group-hover:border-purple-400/50 transition-colors ${comment.avatarUrl ? 'hidden' : 'flex'}`}
                            style={{ display: comment.avatarUrl ? 'none' : 'flex' }}
                          >
                            <User2 className="w-6 h-6 text-zinc-400" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white text-lg truncate group-hover:text-purple-400 transition-colors">
                              {comment.username || "Anonymous"}
                            </h3>
                            {comment.userTitle && (
                              <span className="px-3 py-1 bg-purple-400/10 border border-purple-400/20 rounded-full text-xs text-purple-400 font-medium">
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

                      {/* Comment Content */}
                      <div className="space-y-4 text-zinc-300 leading-relaxed">
                        {parts.map((part, partIndex) => {
                          const key = `${commentId}-${partIndex}`;

                          if (part.type === "reaction") {
                            return (
                              <div
                                key={key}
                                className="flex items-center gap-3 p-4 bg-purple-400/5 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300"
                              >
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                <span className="text-zinc-300 font-medium">{part.content.split(" ")[0]}</span>
                                <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-purple-400/10 rounded-full">
                                  <ArrowUpCircle className="w-4 h-4 text-purple-400" />
                                  <span className="text-xs text-purple-400">Upvote</span>
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
                                    <div className="absolute inset-0 bg-zinc-900/60 group-hover/expand:bg-zinc-900/40 transition-all duration-300 rounded-lg flex items-center justify-center">
                                      <div className="px-4 py-2 bg-zinc-800 flex items-center gap-2 rounded-lg text-sm text-zinc-300 border border-zinc-600 group-hover/expand:border-purple-400/50 transition-all duration-300">
                                        <Eye className="w-4 h-4" />
                                        <span>Click to view</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
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
                              <div key={key} className="border border-yellow-400/30 rounded-lg bg-yellow-400/5 overflow-hidden">
                                <button
                                  onClick={() => toggleSpoiler(key)}
                                  className="w-full p-4 flex items-center justify-between hover:bg-yellow-400/10 transition-all duration-300"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <span className="text-yellow-400 font-semibold">
                                      Spoiler: {part.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-yellow-400 px-2 py-1 bg-yellow-400/20 rounded-full">
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
                                  <div className="p-4 border-t border-yellow-400/20 bg-zinc-900/50 animate-in slide-in-from-top-2 duration-300">
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

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                          {comment.reactionType && comment.reactionUsers !== "None" && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-400/10 border border-red-400/20 rounded-full hover:border-red-400/40 transition-all duration-300">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400 font-medium">{comment.reactionUsers}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {comment.postUrl && (
                            <a
                              href={comment.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all duration-300"
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

            {/* Clean Load More Button */}
            {currentPage < totalPages && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMoreComments}
                  disabled={loadingMore}
                  className="group relative px-8 py-4 bg-purple-900 hover:bg-purple-900 disabled:bg-zinc-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:text-zinc-400"
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
      </div>
    </div>
  );
};

export default CommentsOnManga;