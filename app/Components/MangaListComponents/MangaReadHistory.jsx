import React, { useState, useEffect, useCallback } from 'react';
import { useManga } from '../../providers/MangaContext';
import { History, BookOpen, ArrowBigRightDash, Ellipsis, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function MangaReadHistory() {
    const { getAllFromReadHistory, addToReadHistory, setChapterListForManga } = useManga();
    const [readHistory, setReadHistory] = useState([]);
    const router = useRouter();
    const [shownMangasInHistory, setShownMangasInHistory] = useState(3)
    const { setSelectedManga } = useManga()
    useEffect(() => {
        const history = getAllFromReadHistory();
        setReadHistory(history || []);
    }, [getAllFromReadHistory]);

    const handleMangaCoverImageClicked = useCallback((manga) => {
        setSelectedManga(manga);
        router.push(`/manga/${manga.id}/chapters`);
    }, [])

    const handleChapterClicked = useCallback(
        (manga, chapter, allChaptersList) => {
            setChapterListForManga(manga.id, allChaptersList);
            addToReadHistory(manga, chapter, allChaptersList)
            router.push(`/manga/${manga.id}/chapter/${chapter.id}/read`);
        },
        [router] // Added chapters to dependencies
    );


    return (
        <div className="w-full mb-9 overflow-hidden  pl-2 sm:pl-7">
            {/* Header */}
            <div className="pb-7 text-lg lg:text-2xl flex flex-row justify-between font-bold text-purple-200 tracking-wide uppercase ">
                <h1 className="border-b-4 border-purple-900 flex flex-row w-fit gap-2 items-center pb-2">
                    <History className="w-6 h-6 text-white " />
                    <span className="line-clamp-1">
                        Read History
                    </span>
                </h1>
                <button className='text-sm p-1 pl-5 pr-4 rounded-lg mr-4 bg-purple-700/10 flex items-center gap-1 flex-row'>More <ArrowBigRightDash /></button>
            </div>

            {/* Content */}
            <div className=" pb-1 pt-3">
                {readHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-5">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                            <BookOpen className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Reading History</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            Start reading manga to see your reading history here
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-6 mr-4">
                            {readHistory.slice(0, shownMangasInHistory).map((item) => (
                                <div
                                    key={item.manga.id}
                                    className="cursor-pointer"
                                >
                                    {/* Manga Cover */}
                                    <div
                                        onClick={() => handleMangaCoverImageClicked(item.manga)}
                                        className="relative mb-3">
                                        <Image
                                            width={300}
                                            height={300}
                                            src={item.manga.coverImageUrl}
                                            alt={item.manga.title}
                                            className="w-full aspect-[3/4] object-cover rounded-md shadow-lg  transition-all duration-300 hover:scale-[102%]"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMDAgMTMzTDk2IDEyOUw5NiAxMzdMMTAwIDEzM1oiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+Cg==';
                                            }}
                                        />
                                    </div>

                                    {/* Chapter List */}
                                    <div className="space-y-2">
                                        {item.chapters?.slice(0, 1).map((chapter) => (
                                            <div
                                                key={chapter.id}
                                                onClick={() => handleChapterClicked(item.manga, chapter, item.allChaptersList)}
                                                className="bg-gray-800/50 backdrop-blur-sm rounded-md px-3 py-2 border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-200"
                                            >
                                                <div className="text-sm text-gray-300">
                                                    Chapter {chapter.chapter}
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            ))}
                        </div>
                        {readHistory.length>3 &&<div
                            onClick={() => {
                                if (shownMangasInHistory == readHistory.length) {
                                    setShownMangasInHistory(3)
                                }
                                else {
                                    setShownMangasInHistory(readHistory.length)
                                }

                            }
                            }
                            className="w-[100% - 16px] flex mr-4 justify-center items-center gap-2 py-3 bg-gray-800/50 rounded-lg mt-4 hover:bg-gray-700/70 transition-colors duration-200 cursor-pointer">
                            <Ellipsis className="w-5 h-5 text-purple-400" />
                            <span className="text-sm font-medium text-gray-400">
                                Show {shownMangasInHistory == readHistory.length ? "less" : `more `} 
                            </span>
                        </div>}
                    </>
                )}
            </div>
        </div>
    );
}

export default MangaReadHistory;