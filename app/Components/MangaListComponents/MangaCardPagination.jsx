import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MangaCardPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    loadMoreMangas,
}) => {
    if (totalPages <= 1 && !loadMoreMangas) return null;
    console.log([...Array(totalPages).keys()]);

    return (
        <div className="flex w-full justify-center bg-gray-900/30 items-center -mb-5 mt-4 md:mt-8  rounded-lg px-2 sm:px-3 py-1 sm:py-2 select-none max-w-full overflow-x-auto">
            <div className="flex space-x-2 md:space-x-16 items-center bg-gray-800/30 backdrop-blur-md px-4 py-2 rounded-lg ">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-8 h-8 md:w-12 md:h-12 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center text-white mr-2"
                >
                    <ChevronLeft size={18} className=' font-bold' />
                </button>

                {/* Dot indicators in the middle */}
                <div className="flex space-x-2 md:space-x-6 items-center">
                    {[...Array(totalPages).keys()].map((_, index) => (
                        <div
                            key={index}
                            className={`rounded-full cursor-pointer ${index+1 === currentPage ? "bg-gray-200/30 text-[11px] md:text-base w-4 h-4 md:h-7 md:w-7 flex justify-center items-center " : "bg-white/40 w-2 h-2 md:w-3 md:h-3 "
                                } transition-all duration-300`}
                            onClick={() => onPageChange(index+1)}
                        ><span className={`${index+1 === currentPage?"block":"hidden"}`}>{index+1}</span></div>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-8 h-8 md:w-12 md:h-12 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center text-white ml-2"
                >
                    <ChevronRight size={18} className=' font-bold' />
                </button>
            </div>
        </div>

    );
};

export default MangaCardPagination;
