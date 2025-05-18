import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MangaCardPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    loadMoreMangas,
}) => {
    if (totalPages <= 1 && !loadMoreMangas) return null;

    // Generate page numbers with ellipsis for large page counts
    const getPageNumbers = () => {
        // Adjust display based on screen size
        const useSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
        const delta = useSmallScreen ? 1 : 2; // Show fewer pages on small screens
        
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center mt-4 md:mt-8 bg-slate-900 border border-slate-800 rounded-lg px-2 sm:px-3 py-1 sm:py-2 select-none w-full max-w-full overflow-x-auto">
            <nav
                aria-label="MangaCardPagination Navigation"
                className="inline-flex items-center space-x-1 xs:space-x-2 sm:space-x-4"
            >
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex disabled:opacity-45 items-center tracking-wider justify-center w-fit px-1 sm:px-3 py-2 sm:py-3 text-xs font-medium text-gray-100 rounded-full focus:outline-none transition-all duration-300"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white font-extrabold fill-white" />
                </button>

                {/* Responsive pagination display */}
                <div className="flex items-center px-2 space-x-1 xs:space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar">
                    {pageNumbers.map((page, idx) =>
                        page === '...' ? (
                            <span
                                key={`dots-${idx}`}
                                className="px-1 sm:px-3 py-1 sm:py-2 text-gray-400 select-none"
                            >
                                &hellip;
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                aria-current={currentPage === page ? 'page' : undefined}
                                className={`flex items-center tracking-wider justify-center min-w-[32px] sm:min-w-[40px] px-2 sm:px-4 py-1 sm:py-2 text-xs font-medium text-gray-100 rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)] hover:shadow-[0_0_10px_rgba(139,92,246,0.4)] ${
                                    currentPage === page
                                        ? 'bg-purple-700/60'
                                        : 'bg-gradient-to-b from-[#1a1a2e] to-[#141426]'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex items-center disabled:opacity-45 tracking-wider justify-center w-fit px-1 sm:px-3 py-2 sm:py-3 text-xs font-medium text-gray-100 rounded-full focus:outline-none transition-all duration-300"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white font-extrabold fill-white" />
                </button>
            </nav>
        </div>
    );
};

// Add this CSS somewhere in your global stylesheet
// .no-scrollbar::-webkit-scrollbar {
//     display: none;
// }
// 
// .no-scrollbar {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
// }

export default MangaCardPagination;