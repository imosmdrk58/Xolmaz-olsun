function LatestActivityCommentsSkeleton() {
  return (
     <div className="min-h-fit relative overflow-hidden">

                <div className="relative  -mr-4 mb-10 flex justify-center flex-col items-center">
                    <div className="max-w-[94%]">
                        {/* Header Skeleton */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-600/30 to-gray-500/30 rounded-2xl animate-pulse backdrop-blur-xl border border-white/10"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-8 w-80 bg-slate-700/50 rounded-xl animate-pulse"></div>
                                        <div className="h-4 w-60 bg-slate-800/50 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-16 bg-slate-700/50 rounded-xl animate-pulse"></div>
                                    <div className="h-12 w-32 bg-slate-700/50 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Comment Cards Skeleton */}
                        <div className="flex space-x-6 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex-shrink-0 w-96">
                                    <div className="relative group">
                                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                                            {/* Avatar and User */}
                                            <div className="flex items-start space-x-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 bg-slate-700/50 rounded-full animate-pulse"></div>
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
            </div>
  )
}

export default LatestActivityCommentsSkeleton