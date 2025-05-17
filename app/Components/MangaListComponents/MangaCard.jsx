'use client';
import Image from 'next/image';
import React, { useCallback, lazy, useMemo } from 'react';
import { getRatingColor } from '../../constants/Flags';
import { Star, MessageSquareText, Heart as HeartIcon,Dot } from 'lucide-react';
const StableFlag = React.memo(lazy(() => import('../StableFlag')));

const MangaCard = React.memo(({ processedLatestMangas, handleMangaClicked, loadMoreMangas,totalPages,currentPage }) => {
    const stableHandleMangaClicked = useCallback(handleMangaClicked, []);
    const MemoMangas = useMemo(() => {
        return processedLatestMangas;
    }, [processedLatestMangas]);

    return (
        MemoMangas && (
            <div className="w-full flex flex-col">
                <div className="mx-1 sm:mx-5 pb-2 mb-4 xl:mx-20 sm:pb-7 text-lg md:text-2xl font-bold text-purple-200 tracking-wide uppercase">
                    <h1 className="border-b-4 border-purple-900 w-fit pb-2">Latest Releases</h1>
                </div>
                <div className="grid w-[95%] sm:gap-y-4 mx-1 md:mx-5 xl:ml-16 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                    {MemoMangas.map((manga, index) => (
                        <div
                            key={manga.id}
                            onClick={() => stableHandleMangaClicked(manga)}
                            className="manga-card cursor-pointer w-full flex justify-center items-start"
                        >
                            <div className="w-full sm:w-[250px] overflow-hidden sm:min-h-[400px] rounded-lg bg-[#0c0221] p-[5px] shadow-slate-600 shadow-[0_0_4px_rgba(0,0,0,1)] transition-transform duration-300 ease-out hover:scale-[102%] will-change-transform">
                                <div className="relative flex h-[155px] sm:h-[250px] flex-col rounded-[5px] bg-gradient-to-tr from-[#049fbb] to-[#50f6ff]">
                                    <Image
                                        src={manga.coverImageUrl || '/placeholder.jpg'}
                                        alt={manga.title}
                                        fill
                                        className="object-cover relative -mt-[1px] flex h-[155px] sm:h-[250px] flex-col rounded-[5px] rounded-tl-[20px] bg-gradient-to-tr from-[#1f2020] to-[#000d0e]"
                                        placeholder="blur"
                                        blurDataURL="/placeholder.jpg"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-gray-900 to-transparent p-2 sm:p-4">
                                        <h1 className="flex flex-row w-full font-bold items-center gap-3 sm:items-start justify-center text-[8px] sm:text-xs tracking-[2px] text-white">
                                            <StableFlag className={`w-4 sm:w-7`} code={manga.originalLanguage || 'UN'} />
                                            {manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title}
                                        </h1>
                                    </div>
                                    <div className="relative z-20 h-[29px] md:h-[39px]  -ml-1 -mt-1 w-[60%]  -skew-x-[40deg] rounded-br-[10px] bg-[#0c0221] shadow-[-10px_-10px_0_0_#0c0221] before:absolute before:right-[-2px] before:top-0 before:h-[12px] before:w-[70px] sm:before:w-[129px] before:rounded-tl-[11px]" />
                                    <div className="absolute left-0 top-6 sm:top-[34px] h-[55px] w-[125px] before:absolute before:h-full before:w-1/2 sm:before:w-full before:rounded-tl-[15px] before:shadow-[-5px_-5px_0_2px_#0c0221]" />
                                    <div className="absolute top-0 flex h-[30px] w-full justify-between">
                                        <div className="h-full flex flex-row justify-center items-center aspect-square">
                                        <span className="absolute -ml-2 sm:-ml-3 lg:-ml-0 -mt-[7px] sm:-mt-[8px] top-0 left-0 z-30 text-[9px] sm:text-[11px] sm:tracking-widest rounded-full  pr-2  sm:min-w-24 flex items-center justify-start font-bold">
                                                <Dot className={` size-8 sm:size-12 ${manga.status === 'completed'
                                                    ? 'text-[#00c9f5]'
                                                    : manga.status === 'ongoing'
                                                        ? 'text-[#04d000]'
                                                        :manga.status=="hiatus"?'text-[#da7500]' :'text-[#da0000]'}`} />
                                                <span className=' -ml-2 md:-ml-0'>{manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}</span>
                                            </span>
                                        </div>
                                        <div className="flex">
                                            <span
                                                className={`${manga.contentRating.toUpperCase() === 'SAFE'
                                                        ? 'pr-4 xl:pr-8'
                                                        : manga.contentRating.toUpperCase() === 'EROTICA'
                                                            ? ' pr-2 xl:pr-5'
                                                            : 'pr-2'
                                                    } z-10 tracking-widest mt-[1px] sm:mt-[2px] mr-2 top-0 right-0 bg-gray-900 flex items-center justify-end text-center border-2 absolute py-[3px] sm:py-[7px] min-w-36 text-[8px] sm:text-[10px] font-semibold rounded-lg md:rounded-xl text-white bg-opacity-70 ${getRatingColor(manga.contentRating.toString() + 'Border') ||
                                                    getRatingColor('default')
                                                    } backdrop-blur-lg ${getRatingColor(manga.contentRating) || getRatingColor('default')
                                                    }`}
                                            >
                                                {manga.contentRating.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-[2px_4px] sm:p-[5px_10px] w-full">
                                    <div className="flex justify-between mt-2 text-gray-300 text-sm">
                                        {['star', 'comment', 'heart'].map((icon, i) => {
                                            let IconComponent;
                                            let value;
                                            if (icon === 'star') {
                                                IconComponent = Star;
                                                value = manga?.rating?.rating?.bayesian?.toFixed(2) || 'N/A';
                                            } else if (icon === 'comment') {
                                                IconComponent = MessageSquareText;
                                                const count = manga?.rating?.comments?.repliesCount || 0;
                                                value = count > 1000 ? count.toString()[0] + 'K' : count;
                                            } else if (icon === 'heart') {
                                                IconComponent = HeartIcon;
                                                const follows = manga?.rating?.follows || 0;
                                                value = follows > 1000 ? follows.toString()[0] + 'K' : follows;
                                            }
                                            return (
                                                <div key={i} className="flex text-[11px] sm:text-base items-center gap-0.5 sm:gap-2">
                                                    <IconComponent className={` w-6 h-6 sm:w-7 sm:h-7 ${icon == "star" ? " text-yellow-500" : icon == "heart" ? "fill-rose-500/50 text-rose-500" : " text-white/70  "}  rounded-md p-1`} aria-hidden="true" />
                                                    <span>{value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-3 flex flex-col sm:min-h-[100px] justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {manga.flatTags.slice(0, 4).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-[#070920] backdrop-blur-md sm:min-w-16 shadow-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-700 transition-colors hover:bg-gray-800 text-center flex flex-row font-bold items-start justify-center text-[9px] sm:text-[10px] sm:tracking-[1.5px] text-white"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-[7px] mx-auto sm:text-xs tracking-widest w-full pr-6 relative z-30 flex justify-center items-center text-center bottom-1 text-gray-400 mt-4">
                                            Last updated:{' '}
                                            {(() => {
                                                const minutes = Math.floor((new Date() - new Date(manga.updatedAt)) / 60000);
                                                return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {loadMoreMangas && currentPage === totalPages && (
                <button
                    className="px-8 py-3 mt-12 ml-12  bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Load More
                </button>
            )}
            </div>
        )
    );
});

MangaCard.displayName = 'MangaCard';

export default React.memo(MangaCard);
