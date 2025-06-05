import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const MangaCardPagination = React.memo(({
    currentPage,
    totalPages,
    onPageChange,
    loadMoreMangas,
}) => {
    if (totalPages <= 1 && !loadMoreMangas) return null;

    return (
        <div className="flex w-full justify-center items-center -mb-4 px-4 select-none max-w-full">
            <div className="flex items-center space-x-4 bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border border-purple-900/40 rounded-xl px-8 py-3 shadow-[0_0_5px_rgba(147,51,234,0.3)]">
                {/* Left Arrow with Glow Effect */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 ${currentPage === 1
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-purple-700/10 hover:shadow-[0_0_5px_rgba(147,51,234,0.6)] border border-purple-800/50'
                        }`}
                >
                    <ChevronLeft size={24} className="text-purple-300 hover:text-purple-100 transition-colors duration-300" />
                </button>

                {/* Page Numbers with Neon Effect */}
                <div className="flex space-x-3">
                    {[...Array(totalPages).keys()].map((_, index) => {
                        const page = index + 1;
                        const isActive = page === currentPage;
                        return (
                            <button
                                key={index}
                                onClick={() => onPageChange(page)}
                                className={`relative w-10 h-10 flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-500 ${isActive
                                        ? 'bg-purple-800/30 text-purple-100 border border-purple-500/70 shadow-[0_0_12px_rgba(147,51,234,0.5)]'
                                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-purple-200 hover:shadow-[0_0_8px_rgba(147,51,234,0.3)]'
                                    }`}
                            >
                                {page}
                                {isActive && (
                                    <span className="absolute inset-0 rounded-lg border border-purple-400/30 animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Arrow with Glow Effect */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 ${currentPage === totalPages
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-purple-700/10 hover:shadow-[0_0_5px_rgba(147,51,234,0.6)] border border-purple-800/50'
                        }`}
                >
                    <ChevronRight size={24} className="text-purple-300 hover:text-purple-100 transition-colors duration-300" />
                </button>
            </div>
        </div>
    );
});

export default MangaCardPagination;