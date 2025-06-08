import React, { useState, useEffect } from "react";
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
  CircleFadingArrowUp,
} from "lucide-react";

const CommentsOnManga = ({ manga }) => {
  const CACHE_KEY = `comments_on_manga_${manga?.id || "unknown"}`;
  const LAST_FETCH_TIMESTAMP_KEY = `comments_on_manga_${manga?.id || "unknown"}_last_fetch`;
  const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  const [thread, setThread] = useState(manga?.rating?.comments?.threadId || null);
  const [repliesCount, setRepliesCount] = useState(
    manga?.rating?.comments?.repliesCount || 0
  );
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedTexts, setExpandedTexts] = useState({});
  const [expandedSpoilers, setExpandedSpoilers] = useState({});

  const fetchComments = async () => {
    if (!thread || !repliesCount) {
      console.warn("No thread or repliesCount, skipping fetch");
      return;
    }

    setLoading(true);
    setError("");

    const now = Date.now();
    const cachedTimestamp = Number(localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY)) || 0;

    // Check cached data
    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData?.data && parsedData?.total) {
            setComments(parsedData.data);
            setTotal(parsedData.total);
            setLoading(false);
            console.log("Loaded comments from cache");
            return;
          }
        }
      } catch (e) {
        console.error("Error parsing cached comments:", e);
      }
    }

    // Fetch new data
    try {
      const url = new URL("/api/comments", window.location.origin);
      url.searchParams.append("thread", thread);
      url.searchParams.append("repliesCount", repliesCount.toString());

      const response = await fetch(url);
      const responseData = await response.json();

      const { data, total, error: apiError } = responseData;
      if (apiError) {
        setError(apiError);
      } else {
        setComments(data);
        setTotal(total);
        const newTimestamp = Date.now();

        // Store in localStorage
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data, total, timestamp: newTimestamp })
          );
          localStorage.setItem(LAST_FETCH_TIMESTAMP_KEY, newTimestamp.toString());
          console.log("Cached comments and timestamp successfully");
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }
    } catch (err) {
      setError("Failed to load comments: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [thread, repliesCount]);

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
      <div className="bg-zinc-950 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-6 bg-zinc-800 rounded-lg animate-pulse"></div>
            <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="w-28 h-4 bg-zinc-800 rounded"></div>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-zinc-800 rounded"></div>
                      <div className="w-3/4 h-3 bg-zinc-800 rounded"></div>
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
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <MessageCircle className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Comments</h2>
          {total > 0 && (
            <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <span className="text-sm text-zinc-400">{total.toLocaleString()}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {comments.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-900 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-zinc-400 mb-2">No comments yet</h3>
            <p className="text-zinc-600">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => {
              const commentId = comment.id || index;
              const { parts } = parseCommentContent(comment.commentContent);

              return (
                <article
                  key={commentId}
                  className="bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="p-6">
                    {/* User Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {comment.avatarUrl ? (
                          <img
                            src={comment.avatarUrl}
                            alt={`${comment.username || "Anonymous"} avatar`}
                            className="w-10 h-10 rounded-lg object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <User2 className="w-5 h-5 text-zinc-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-white truncate">
                            {comment.username || "Anonymous"}
                          </h3>
                          {comment.userTitle && (
                            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">
                              {comment.userTitle}
                            </span>
                          )}
                          {comment.timeAgo && (
                            <div className="flex items-center gap-1 text-zinc-500 text-sm">
                              <Clock className="w-3 h-3" />
                              <time dateTime={comment.postDateTime || undefined}>
                                {comment.timeAgo}
                              </time>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          {comment.joinedDate && (
                            <span>
                              Joined {new Date(comment.joinedDate).toLocaleDateString()}
                            </span>
                          )}
                          {comment.messageCount && (
                            <span>{comment.messageCount.toLocaleString()} messages</span>
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
                              className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-800"
                            >
                              <CircleFadingArrowUp className="w-4 h-4 text-purple-400" />
                              <span className="text-zinc-300">{part.content.split(" ")[0]}</span>
                              <div className="ml-auto text-xs text-zinc-500 flex items-center gap-1">
                                <ArrowUpCircle className="w-3 h-3" />
                                Upvote
                              </div>
                            </div>
                          );
                        }

                        if (part.type === "normal") {
                          return (
                            <p key={key} className="text-zinc-300">
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
                                  className="relative cursor-pointer group"
                                  onClick={() => toggleExpandText(key)}
                                >
                                  <div className="blur-sm select-none">
                                    <p className="text-zinc-400">{part.content}</p>
                                  </div>
                                  <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-zinc-900/10 transition-colors rounded flex items-center justify-center">
                                    <div className="px-2 py-1 bg-zinc-800 flex flex-row gap-1 rounded text-xs text-zinc-400 border border-zinc-700">
                                      <Eye className=" w-4 h-4 text-gray-400"/> view
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <p className="text-zinc-300">{part.content}</p>
                                  <button
                                    onClick={() => toggleExpandText(key)}
                                    className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
                                  >
                                    Hide
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        }

                        if (part.type === "spoiler") {
                          const isExpanded = expandedSpoilers[key];
                          return (
                            <div key={key} className="border border-yellow-600/20 rounded-lg bg-yellow-500/5">
                              <button
                                onClick={() => toggleSpoiler(key)}
                                className="w-full p-3 flex items-center justify-between hover:bg-yellow-500/10 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-500">⚠️</span>
                                  <span className="text-yellow-400 font-medium">
                                    Spoiler: {part.title}
                                  </span>
                                </div>
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-yellow-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-yellow-400" />
                                )}
                              </button>
                              {isExpanded && (
                                <div className="p-3 border-t border-yellow-600/20 bg-zinc-900/30">
                                  <p className="text-zinc-300 whitespace-pre-wrap">
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
                        {comment.reactionType && comment.reactionUsers!="None" && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-300">{comment.reactionUsers}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {comment.postUrl && (
                          <a
                            href={comment.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-500 hover:text-zinc-400 transition-colors"
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
        )}
      </div>
    </div>
  );
};

export default CommentsOnManga;