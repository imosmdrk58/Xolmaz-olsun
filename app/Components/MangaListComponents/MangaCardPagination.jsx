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
        const delta = 2; // how many pages to show around current
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
        <div className="flex justify-center items-center mt-8 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 select-none">
            <nav
                aria-label="MangaCardPagination Navigation"
                className="inline-flex items-center space-x-4"
            >
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`flex disabled:opacity-45 items-center tracking-wider justify-center w-fit gap-4 px-3 py-3  text-xs font-medium text-gray-100 rounded-full  focus:outline-none transition-all duration-300  `}
                >
                    <ChevronLeft className="w-5 h-5 text-white font-extrabold fill-white" />
                </button>

                {pageNumbers.map((page, idx) =>
                    page === '...' ? (
                        <span
                            key={`dots-${idx}`}
                            className="px-3 py-2 text-gray-400 select-none"
                        >
                            &hellip;
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-current={currentPage === page ? 'page' : undefined}
                                className={`flex items-center tracking-wider justify-center w-fit gap-4 px-5 py-3  text-xs font-medium text-gray-100  rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)] hover:shadow-[0_0_10px_rgba(139,92,246,0.4)] ${currentPage === page
                                    ? 'bg-purple-700/60 '
                                    : 'bg-gradient-to-b from-[#1a1a2e] to-[#141426]'
                                    }`}
                                >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`flex items-center disabled:opacity-45 tracking-wider justify-center w-fit gap-4 px-3 py-3  text-xs font-medium text-gray-100 rounded-full  focus:outline-none transition-all duration-300  `}
                >
                    <ChevronRight className="w-5 h-5 text-white font-extrabold fill-white" />
                </button>
            </nav>
        </div>
    );
};

export default MangaCardPagination;
