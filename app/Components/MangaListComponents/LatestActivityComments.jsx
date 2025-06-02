"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Clock,
    ExternalLink,
    RefreshCw,
    User,
    MessageCircle,
    Activity,
    Zap,
    BookOpen,
    ChevronUp,
    ChevronDown,
    Laugh,
    CircleX,
    ThumbsUp,
    Heart,
    CircleFadingArrowUp,
    Eye,
    EyeOff,
} from "lucide-react";

const CACHE_KEY = "mangadex_latest_comments";
const LAST_FETCH_TIMESTAMP_KEY = "mangadx_latest_comments_last_fetch";
const CACHE_DURATION_MS = 15 * 60 * 1000;

const LatestComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(null);
    const [lastFetchTimestamp, setLastFetchTimestamp] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showMore, setShowMore] = useState({});
    const [visible, setVisible] = useState(true); // Toggle for entire component

    const fetchComments = useCallback(
        async (force = false) => {
            setLoading(true);
            setError(null);

            const now = Date.now();
            const cachedTimestamp = lastFetchTimestamp || 0;

            if (!force && now - cachedTimestamp < CACHE_DURATION_MS) {
                try {
                    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
                    if (cachedData.data) {
                        setComments(cachedData.data);
                        setLastUpdatedDisplay(new Date(cachedTimestamp).toLocaleTimeString());
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing cached data:", e);
                }
            }

            try {
                const response = await fetch("/api/comments/latestActivity");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch comments");
                }

                const fetchedComments = data.data || [];
                setComments(fetchedComments);

                const newTimestamp = Date.now();
                setLastUpdatedDisplay(new Date(newTimestamp).toLocaleTimeString());
                setLastFetchTimestamp(newTimestamp);

                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({ data: fetchedComments, timestamp: newTimestamp })
                );
                localStorage.setItem(LAST_FETCH_TIMESTAMP_KEY, newTimestamp.toString());
            } catch (err) {
                setError(err.message);
                console.error("Error fetching comments:", err);

                try {
                    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
                    if (cachedData.data) {
                        setComments(cachedData.data);
                        setLastUpdatedDisplay(
                            new Date(parseInt(localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY) || "0")).toLocaleTimeString()
                        );
                    }
                } catch (e) {
                    console.error("Error loading fallback cache:", e);
                }
            } finally {
                setLoading(false);
            }
        },
        [lastFetchTimestamp]
    );

    useEffect(() => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestampStr = localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY);
        const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : null;

        if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < CACHE_DURATION_MS) {
            try {
                const parsedData = JSON.parse(cachedData);
                setComments(parsedData.data || []);
                setLastUpdatedDisplay(new Date(cachedTimestamp).toLocaleTimeString());
                setLastFetchTimestamp(cachedTimestamp);
                setLoading(false);
            } catch (e) {
                fetchComments();
            }
        } else {
            fetchComments();
        }
    }, [fetchComments]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const cachedTimestampStr = localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY);
            const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : 0;

            if (now - cachedTimestamp >= CACHE_DURATION_MS) {
                fetchComments();
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchComments]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    const truncateTitle = (title, maxLength = 25) => {
        if (!title) return "Unknown";
        return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
    };

    const getReactionIcon = (type) => {
        switch (type) {
            case "Funny":
                return <Laugh className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />;
            case "Strike":
                return <CircleX className="w-5 h-5 text-red-400 fill-yellow-400/20" />;
            case "Like":
                return <ThumbsUp className="w-5 h-5 text-blue-400 fill-blue-400/20" />;
            case "Love":
                return <Heart className="w-5 h-5 text-pink-400 fill-current" />;
            case "Replied":
                return <MessageCircle className="w-5 h-5 text-purple-400" />;
            default:
                return <CircleFadingArrowUp className="w-5 h-5 text-emerald-400" />;
        }
    };

    if (!visible) {
        return (
            <div className="p-6 max-w-[95%] mb-2 flex justify-end items-center mx-auto">
                <hr className=" w-full border-[1px] border-white/20 " /> 
                <button
                    onClick={() => setVisible((prev) => !prev)}
                    className="px-5 py-3 bg-black/30 min-w-fit gap-2 flex flex-row justify-start items-center border-[1px] border-white/20   text-gray-300 rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                    aria-label="Toggle comments visibility"
                    title={visible ? "Hide Comments" : "Show Comments"}
                >
                    <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${visible ? 'bg-purple-600/70' : 'bg-gray-600'}`}>
                        <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-0 transition-transform duration-300 ${visible ? 'translate-x-4' : 'translate-x-0.5'}`}
                        />
                    </div>
                    <span>{visible ? 'Hide Comments' : 'Show Comments'}</span>
                </button>
            </div>
        );
    }

    if (loading && comments.length === 0) {
        return (
            <div className="min-h-screen mb-6 bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 scale-[0.85]">
                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Skeleton */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-800/50 to-yellow-600/50 rounded-2xl animate-pulse"></div>
                                    <div className="space-y-3">
                                        <div className="h-6 w-44 bg-purple-800/30 rounded-lg animate-pulse"></div>
                                        <div className="h-3 w-32 bg-purple-700/30 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Skeleton */}
                        <div className="flex space-x-5 overflow-hidden">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-[272px] h-[204px] bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-5 animate-pulse"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 bg-purple-700/50 rounded-full"></div>
                                            <div className="space-y-1.5">
                                                <div className="h-3.5 w-20 bg-purple-700/50 rounded"></div>
                                                <div className="h-2.5 w-14 bg-purple-600/30 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="h-2.5 bg-purple-700/40 rounded"></div>
                                            <div className="h-2.5 bg-purple-700/30 rounded w-3/4"></div>
                                        </div>
                                        <div className="h-14 bg-purple-800/30 rounded-xl"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-h-screen  mt-5 w-full">
            <div className="p-6 w-full">
                <div className="max-w-[95%] mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-gray-950 flex items-center justify-center animate-pulse">
                                    <Zap className="w-3 h-3 text-white fill-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white">COMMUNITY ACTIVITY</h1>
                                <p className="text-gray-400 text-xs flex items-center font-medium">
                                    <Activity className="w-4 h-4 mr-2 text-yellow-400" />
                                    Real-time community interactions
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {lastUpdatedDisplay && (
                                <div
                                    className="px-6 py-3 bg-black/20 min-w-fit gap-2 flex flex-row justify-start items-center border-[1px] border-white/20   text-gray-300 rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105">
                                    <Clock className="w-3 h-3 mr-1.5 text-white" />
                                    {lastUpdatedDisplay}
                                </div>
                            )}
                            <button
                                onClick={() => fetchComments(true)}
                                className="px-5 py-3.5 bg-black/30 min-w-fit gap-2 flex flex-row justify-start items-center border-[1px] border-white/20   text-gray-300 rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                                disabled={loading}
                                aria-label="Refresh comments"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                ) : (
                                    <RefreshCw className="w-5 h-5" />
                                )}
                            </button>

                            {/* Toggle Button */}
                            <button
                                onClick={() => setVisible((prev) => !prev)}
                                className="px-5 py-3 bg-black/30 min-w-fit gap-2 flex flex-row justify-start items-center border-[1px] border-white/20   text-gray-300 rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                                aria-label="Toggle comments visibility"
                                title={visible ? "Hide Comments" : "Show Comments"}
                            >
                                <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${visible ? 'bg-purple-600/70' : 'bg-gray-600'}`}>
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full absolute top-0 transition-transform duration-300 ${visible ? 'translate-x-4' : 'translate-x-0.5'}`}
                                    />
                                </div>
                                <span>{visible ? 'Hide Comments' : 'Hide Comments'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-6">
                            <div className="bg-gradient-to-r from-red-900/30 to-purple-900/30 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                                <div className="flex items-center text-red-300 font-medium">
                                    <span className="mr-3 text-xl select-none">⚡</span>
                                    Connection failed: {error}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Horizontal Scrolling Container */}
                    {comments.length > 0 ? (
                        <div className="relative">
                            <div
                                id="comments-container"
                                className="flex space-x-5 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                    WebkitOverflowScrolling: "touch",
                                    scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                            >
                                {comments.map((comment, index) => (
                                    <div
                                        key={comment.id || index}
                                        className={`flex-shrink-0 ${showMore[comment.id] ? "h-auto" : "h-[230px]"
                                            } w-64 bg-gray-800/10 mt-1  backdrop-blur-2xl border border-purple-500/20 rounded-2xl p-5 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02] group relative`}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <img
                                                        src={comment.avatarUrl}
                                                        alt={comment.username}
                                                        className="w-9 h-9 rounded-full border-2 border-purple-400/50 object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                comment.username
                                                            )}&background=7c3aed&color=fff&size=40`;
                                                        }}
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full border-2 border-gray-950"></div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-xs">{comment.username}</h3>
                                                    <div className="flex items-center space-x-1 text-[10px] text-purple-300">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{comment.timeAgo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">{getReactionIcon(comment.reactionType)}</div>
                                        </div>

                                        {/* Comment Content */}
                                        {comment.commentContent && (
                                            <div className="bg-black/10 h-20 rounded-xl p-2.5 border border-yellow-500/10">
                                                <p className="text-white/90 text-xs leading-relaxed line-clamp-3">
                                                    {comment.commentContent}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={() =>
                                                setShowMore((prev) => {
                                                    return { ...prev, [comment.id]: !prev[comment.id] };
                                                })
                                            }
                                            className="w-full mb-1.5 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 rounded-lg transition-all duration-200"
                                        >
                                            {showMore[comment.id] ? (
                                                <>
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                    <span>Show less Info</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                    <span>Show more Info</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Manga Info */}
                                        {showMore[comment.id] && (
                                            <div className={`bg-gray-900/20 backdrop-blur-sm rounded-2xl p-2.5 px-4 mb-4  border border-purple-700/50`}>
                                                <div className={`flex items-center ${(comment.chapterNo || comment.volumeNo) ? "mb-2" : "mb-0"} space-x-3 `}>
                                                    <BookOpen className="w-4 h-4 text-white-500 drop-shadow-[0_0_2px_rgba(255,204,0,0.7)]" />
                                                    <h3
                                                        className="text-yellow-400 text-xs truncate max-w-[calc(100%-3rem)] select-text"
                                                        title={comment.mangaTitle}
                                                    >
                                                        {truncateTitle(comment.mangaTitle, 30)}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap justify-between items-center gap-2">
                                                    <div className="flex flex-row w-full space-x-6 text-[10px] text-purple-300 font-semibold tracking-wide min-w-[140px]">
                                                        {comment.volumeNo && (
                                                            <div className="flex justify-start flex-row w-1/2 gap-1 items-center">
                                                                <span className="uppercase text-purple-400 select-none">Volume :</span>
                                                                <span className="text-yellow-400 text-xs">{comment.volumeNo}</span>
                                                            </div>
                                                        )}
                                                        {comment.chapterNo && <div className="flex flex-row w-1/2 gap-1 items-center">
                                                            <span className="uppercase text-purple-400 select-none">Chapter :</span>
                                                            <span className="text-yellow-400 text-xs">{comment.chapterNo}</span>
                                                        </div>}
                                                    </div>

                                                    {(comment.chapterTitle || comment.chapterNo) && (
                                                        <p
                                                            className="text-purple-300/90 flex flex-row text-xs gap-1 max-w-[60%] select-text"
                                                            title={comment.chapterTitle || `Chapter ${comment.chapterNo}`}
                                                        >
                                                            <span className="uppercase font-semibold text-purple-400 select-none mr-2 text-[10px]">
                                                                Title:
                                                            </span>
                                                            &quot;
                                                            <span className="w-full flex justify-start items-center whitespace-nowrap italic">
                                                                {truncateTitle(comment.chapterTitle || `Chapter ${comment.chapterNo}`, 20)}
                                                            </span>
                                                            &quot;
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="h-4" />
                                        <div className="flex absolute bottom-3 w-10/12 items-center justify-between">
                                            <div className="px-2 flex flex-row gap-1 py-1.5 bg-gradient-to-r from-purple-600/30 to-purple-500/30 rounded-lg text-[10px] font-bold text-purple-200 border border-purple-400/30 line-clamp-1 text-ellipsis">
                                                Reacted to{" "}
                                                <a
                                                    className="underline flex flex-row items-center gap-1 truncate max-w-[8rem]"
                                                    target="_blank"
                                                    href={`https://forums.mangadex.org${comment.postUrl}`}
                                                    rel="noopener noreferrer"
                                                    title={comment.repliedTO}
                                                >
                                                    {truncateTitle(comment.repliedTO.split("'s")[0], 7)}...'s post{" "}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                            {comment.threadUrl && comment.threadUrl !== "#" && (
                                                <a
                                                    href={comment.threadUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 rounded-lg transition-all duration-200 group-hover:scale-110 "
                                                    aria-label="Open thread"
                                                >
                                                    <ExternalLink className="w-4 h-4 text-gray-900" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        !loading && (
                            /* Empty State */
                            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-12 text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/50">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3">No Activity Yet</h3>
                                <p className="text-purple-300/80 text-sm mb-6 max-w-md mx-auto">
                                    The community is quiet right now. Check back soon for fresh discussions!
                                </p>
                                <button
                                    onClick={() => fetchComments(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500 hover:from-purple-700 hover:via-purple-600 hover:to-yellow-600 text-white rounded-xl transition-all duration-300 font-bold text-sm flex items-center mx-auto shadow-2xl shadow-purple-500/50 hover:scale-105"
                                >
                                    <RefreshCw className="w-5 h-5 mr-3" />
                                    REFRESH FEED
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default LatestComments;