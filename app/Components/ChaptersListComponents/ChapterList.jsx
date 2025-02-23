import Image from 'next/image';
import React from 'react';

const ChapterList = ({ chapters, handleChapterClick, manga }) => {
  return (
    <div className="w-full">
      <div className="bg-gray-900 rounded-xl shadow-xl p-6">
        {/* Header Section */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Latest Chapters Section */}
            <div className="flex-1 ">
              <div className="flex  items-center gap-4  p-4 text-lg font-semibold bg-gray-800 bg-opacity-30 border shadow-[0_0_5px_rgba(0,0,0,1)] shadow-purple-500  border-gray-800 text-gray-200 rounded-md transition-all duration-200 ease-in-out w-full">
                <Image src="/list.svg" alt="list" width={30} height={30} />
                <span className="text-white">Watch Latest Chapters</span>
              </div>
            </div>

            {/* Chapter Stats */}
            <div className="bg-gray-800 rounded-lg px-4 py-1 shadow-[0_0_5px_rgba(0,0,0,1)] shadow-purple-500 w-fit ">
              <div className="flex items-center gap-4 justify-between">
                <div className="space-y-1 flex items-center flex-col ">
                <div className="text-gray-400 text-sm">Available</div>
                <div className="text-2xl font-bold text-white">{chapters.length}</div>
                 
                </div>
                <div className="h-12 w-[1px] bg-gray-700"></div>
                <div className="space-y-1 flex min-w-14 items-center flex-col ">
                <div className="text-gray-400 text-sm">Total : </div>
                <div className="text-2xl font-bold text-purple-500">{chapters.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => handleChapterClick(chapter, manga)}
              className="group cursor-pointer"
            >
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 
                transition-all duration-200 hover:border-purple-500 hover:bg-gray-750 
                relative overflow-hidden"
              >
                {/* Chapter Number Badge */}
                <div className="absolute right-4 top-4">
                  <div className="bg-gray-900 text-purple-500 px-3 py-1 rounded-lg text-sm font-medium">
                    Chapter {chapter.chapter}
                  </div>
                </div>
                {/* Chapter Content */}
                <div className="mt-0">
                  <h3 className="text-white font-semibold text-lg mb-2 pr-20 truncate">
                    {chapter.title || `Chapter ${chapter.chapter}`}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      {chapter.pageCount ? `${chapter.pageCount} pages` : 'Pages: TBD'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                      <span className="text-purple-400">
                        {chapter.pageCount ? 'Available' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 transform scale-x-0 
                  group-hover:scale-x-100 transition-transform duration-200 origin-left"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterList;