"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ExternalLink, RefreshCw, User, MessageCircle,Sparkles,Activity, TrendingUp } from 'lucide-react';

const CACHE_KEY = 'mangadex_latest_comments';
const LAST_FETCH_TIMESTAMP_KEY = 'mangadex_latest_comments_last_fetch';
const CACHE_DURATION_MS = 15 * 60 * 1000;

const LatestComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(null);
    const [lastFetchTimestamp, setLastFetchTimestamp] = useState(null);

    const fetchComments = useCallback(async (force = false) => {
        setLoading(true);
        setError(null);

        const now = Date.now();
        const cachedTimestamp = lastFetchTimestamp || 0;

        if (!force && now - cachedTimestamp < CACHE_DURATION_MS) {
            console.log('Using cached data...');
            try {
                const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
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

        console.log('Fetching fresh comments...');
        try {
            const response = await fetch('/api/comments/latestActivity');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch comments');
            }

            const fetchedComments = data.data || [];
            setComments(fetchedComments);

            const newTimestamp = Date.now();
            setLastUpdatedDisplay(new Date(newTimestamp).toLocaleTimeString());
            setLastFetchTimestamp(newTimestamp);

            localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fetchedComments, timestamp: newTimestamp }));
            localStorage.setItem(LAST_FETCH_TIMESTAMP_KEY, newTimestamp.toString());

        } catch (err) {
            setError(err.message);
            console.error('Error fetching comments:', err);

            try {
                const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
                if (cachedData.data) {
                    setComments(cachedData.data);
                    setLastUpdatedDisplay(new Date(parseInt(localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY) || '0')).toLocaleTimeString());
                }
            } catch (e) {
                console.error("Error loading fallback cache:", e);
            }
        } finally {
            setLoading(false);
        }
    }, [lastFetchTimestamp]);

    useEffect(() => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestampStr = localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY);
        const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : null;

        if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION_MS)) {
            try {
                const parsedData = JSON.parse(cachedData);
                setComments(parsedData.data || []);
                setLastUpdatedDisplay(new Date(cachedTimestamp).toLocaleTimeString());
                setLastFetchTimestamp(cachedTimestamp);
                setLoading(false);
                console.log('Loaded comments from cache on mount.');
            } catch (e) {
                console.error("Error parsing initial cached data, fetching fresh:", e);
                fetchComments();
            }
        } else {
            console.log('Cache is stale or empty, fetching fresh comments on mount.');
            fetchComments();
        }
    }, [fetchComments]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Checking for background refresh...');
            const now = Date.now();
            const cachedTimestampStr = localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY);
            const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : 0;

            if (now - cachedTimestamp >= CACHE_DURATION_MS) {
                console.log('Cache is stale, refreshing in background...');
                fetchComments();
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchComments]);

    const truncateTitle = (title, maxLength = 45) => {
        if (!title) return 'Unknown Title';
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };
    const getActionText = (reactionType) => {
        switch (reactionType) {
            case 'Like':
            case 'Love':
            case 'Haha':
            case 'Wow':
            case 'Sad':
            case 'Angry':
                return 'reacted to';
            case 'Replied':
                return 'replied to';
            case 'Posted Thread':
                return 'created';
            case 'Reacted':
                return 'reacted to';
            default:
                return 'interacted with';
        }
    };

    const getReactionEmoji = (type) => {
        const reactions = {
            'Like': '👍',
            'Love': '❤️',
            'Haha': '😄',
            'Wow': '😲',
            'Sad': '😢',
            'Angry': '😡',
            'Replied': '💬'
        };
        return reactions[type] || '⚡';
    };

    if (loading && comments.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
                    
                    {/* Floating Particles */}
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${3 + Math.random() * 4}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Premium Header Skeleton */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-2xl animate-pulse backdrop-blur-xl border border-white/10"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-2xl animate-ping"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 w-80 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30 rounded-xl animate-pulse"></div>
                                        <div className="h-4 w-60 bg-gradient-to-r from-slate-600/50 to-slate-700/50 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-32 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl animate-pulse"></div>
                                    <div className="h-12 w-28 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Comment Cards Skeleton */}
                        <div className="flex space-x-6 overflow-hidden">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex-shrink-0 w-96">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 via-cyan-600/50 to-purple-600/50 rounded-2xl blur opacity-20 animate-pulse"></div>
                                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                                            {/* Avatar and User */}
                                            <div className="flex items-start space-x-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full animate-pulse"></div>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500/30 rounded-full animate-pulse"></div>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-5 bg-gradient-to-r from-slate-600/50 to-slate-700/50 rounded-lg w-2/3 animate-pulse"></div>
                                                    <div className="h-3 bg-slate-700/50 rounded w-1/2 animate-pulse"></div>
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="space-y-3">
                                                <div className="h-4 bg-slate-700/50 rounded w-full animate-pulse"></div>
                                                <div className="h-4 bg-slate-700/50 rounded w-4/5 animate-pulse"></div>
                                                <div className="h-16 bg-slate-800/50 rounded-xl animate-pulse"></div>
                                                <div className="h-4 bg-slate-700/50 rounded w-3/4 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Premium Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    <div className="relative w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
                                        <MessageCircle className="w-8 h-8 relative  text-cyan-400" />
                                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-ping" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                                        Community Pulse
                                    </h1>
                                    <p className="text-slate-400 flex items-center space-x-2">
                                        <Activity className="w-4 h-4 text-green-400" />
                                        <span>Live conversations from the manga community</span>
                                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {lastUpdatedDisplay && (
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50">
                                        <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{animationDuration: '3s'}} />
                                        <span className="text-slate-300 text-sm font-medium">{lastUpdatedDisplay}</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => fetchComments(true)}
                                    className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 font-medium shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                                    disabled={loading}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur"></div>
                                    <div className="relative flex items-center">
                                        {loading ? (
                                            <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                                        )}
                                        <span>Refresh</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-70"></div>
                                <div className="relative bg-red-900/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                            <span className="text-red-400 text-2xl">⚠️</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-red-300 text-lg">System Alert</h3>
                                            <p className="text-red-400">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Premium Horizontal Feed */}
                    <div className="relative">
                        {comments.length > 0 ? (
                            <div 
                                className="flex space-x-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-purple-600/50 hover:scrollbar-thumb-purple-500/70"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "rgba(147, 51, 234, 0.5) rgba(30, 41, 59, 0.3)",
                                }}
                            >
                                {comments.map((comment, index) => (
                                    <div
                                        key={comment.id || index}
                                        className="flex-shrink-0 w-96 relative group"
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 via-cyan-600/50 to-purple-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                        
                                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/30 transform hover:scale-[1.02] hover:-translate-y-1">
                                            {/* User Section */}
                                            <div className="flex items-start space-x-4 mb-6">
                                                <div className="relative">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-40"></div>
                                                    <img
                                                        src={comment.avatarUrl}
                                                        alt={`${comment.username}'s avatar`}
                                                        className="relative w-14 h-14 rounded-full border-2 border-purple-500/30 group-hover:border-purple-400/60 transition-all duration-300 object-cover shadow-lg"
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&background=8b5cf6&color=fff`;
                                                        }}
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-slate-900 rounded-full shadow-lg">
                                                        <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                                                        {comment.username}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                                                        <Clock className="w-4 h-4 text-cyan-400" />
                                                        <span>{comment.timeAgo}</span>
                                                        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                                                        <span className="text-xs bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                                                            {getReactionEmoji(comment.reactionType)} {comment.reactionType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Info */}
                                            <div className="mb-4">
                                                <div className="flex items-center space-x-2 text-sm flex-wrap gap-2">
                                                    <span className="text-slate-300">
                                                        {getActionText(comment.reactionType)}
                                                        {comment.repliedTO && (
                                                            <a
                                                                href={`https://forums.mangadex.org${comment.postUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 underline decoration-cyan-500/30 hover:decoration-cyan-400/60"
                                                            >
                                                                {comment.repliedTO}
                                                            </a>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Manga Info Card */}
                                            <div className="mb-6">
                                                <div className="relative group/card">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-xl blur opacity-50 group-hover/card:opacity-100 transition duration-300"></div>
                                                    <div className="relative bg-slate-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 space-y-2">
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
                                                            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Manga Details</span>
                                                        </div>
                                                        
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-slate-400 font-medium">Title:</span>
                                                                <span className="text-white font-semibold text-right max-w-64 truncate">
                                                                    {truncateTitle(comment.mangaTitle, 30)}
                                                                </span>
                                                            </div>
                                                            
                                                            {comment.volumeNo && (
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-slate-400 font-medium">Volume:</span>
                                                                    <span className="text-cyan-300 font-bold">#{comment.volumeNo}</span>
                                                                </div>
                                                            )}
                                                            
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-slate-400 font-medium">Chapter:</span>
                                                                <span className="text-purple-300 font-bold">#{comment.chapterNo}</span>
                                                            </div>
                                                            
                                                            {comment.chapterTitle &&<div className="pt-2 border-t border-slate-700/50">
                                                                <span className="text-slate-300 text-xs italic">
                                                                    "{truncateTitle(comment.chapterTitle, 35)}"
                                                                </span>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Comment Content */}
                                            {comment.commentContent && (
                                                <div className="mb-6">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl blur-sm"></div>
                                                        <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4 shadow-inner">
                                                            <p className="text-slate-200 leading-relaxed line-clamp-4 text-sm">
                                                                {comment.commentContent}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Footer */}
                                            {comment.threadUrl && comment.threadUrl !== '#' && (
                                                <div className="flex justify-between items-center pt-4 border-t border-slate-700/30">
                                                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                                        <span>Active Discussion</span>
                                                    </div>
                                                    <a
                                                        href={comment.threadUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/link flex items-center space-x-2 text-sm bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                                                    >
                                                        <span className="font-medium">Join Discussion</span>
                                                        <ExternalLink className="w-4 h-4 group-hover/link:rotate-12 transition-transform duration-300" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !loading && (
                            /* Premium Empty State */
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-cyan-600/30 to-purple-600/30 rounded-3xl blur opacity-60"></div>
                                <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
                                    <div className="relative group/empty">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur animate-pulse"></div>
                                        <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover/empty:scale-110 transition-transform duration-500">
                                            <User className="w-12 h-12 text-purple-400" />
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-white animate-spin" style={{animationDuration: '3s'}} />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
                                        Awaiting Community Voices
                                    </h3>
                                    <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                                        The conversation streams are quiet right now. New discussions and reactions will appear here as the community engages.
                                    </p>
                                    <button
                                        onClick={() => fetchComments(true)}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 font-semibold shadow-xl hover:shadow-purple-500/30 transform hover:scale-105"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur"></div>
                                        <div className="relative flex items-center space-x-2">
                                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                            <span>Refresh Feed</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes tilt {
                    0%, 50%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(0.5deg); }
                    75% { transform: rotate(-0.5deg); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-tilt {
                    animation: tilt 10s infinite linear;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    height: 8px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.3);
                    border-radius: 10px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: linear-gradient(90deg, rgba(147, 51, 234, 0.5), rgba(6, 182, 212, 0.5));
                    border-radius: 10px;
                    border: 2px solid rgba(30, 41, 59, 0.3);
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(90deg, rgba(147, 51, 234, 0.7), rgba(6, 182, 212, 0.7));
                }
            `}</style>
        </div>
    );
};

export default LatestComments;