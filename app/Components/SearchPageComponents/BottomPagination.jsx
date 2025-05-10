import React, { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BottomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageRange = 2;
  const getPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const leftSide = Math.max(1, currentPage - pageRange);
    const rightSide = Math.min(totalPages, currentPage + pageRange);

    // Add first page if not included in range
    if (leftSide > 1) {
      pageNumbers.push(1);
      if (leftSide > 2) {
        pageNumbers.push('...');
      }
    }

    // Add page numbers in range
    for (let i = leftSide; i <= rightSide; i++) {
      pageNumbers.push(i);
    }

    // Add last page if not included in range
    if (rightSide < totalPages) {
      if (rightSide < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-8 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${currentPage === 1
            ? 'text-slate-600 cursor-not-allowed'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1 px-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => (typeof page === 'number' ? onPageChange(page) : null)}
            className={`min-w-8 h-8 flex items-center justify-center rounded-md text-sm ${page === currentPage
                ? 'bg-purple-600 text-white font-medium'
                : page === '...'
                  ? 'text-slate-500 cursor-default'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${currentPage === totalPages
            ? 'text-slate-600 cursor-not-allowed'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default BottomPagination;
