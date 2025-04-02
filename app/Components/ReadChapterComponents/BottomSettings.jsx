import React, { useCallback, memo } from 'react';
import Image from 'next/image';
import LayoutSelector from "./LayoutSelector";

const BottomSettings = ({
  setLayout,
  setCurrentIndex,
  layout,
  currentIndex,
  panels,
  pages,
  setPanels,
  allAtOnce,
  setAllAtOnce
}) => {
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, pages.length - panels) : prevIndex - panels
    );
  }, [setCurrentIndex, panels, pages]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + panels >= pages.length ? 0 : prevIndex + panels
    );
  }, [setCurrentIndex, panels, pages]);

  return (
layout === "horizontal" ? (
      <div className="relative w-auto bg-[#070920] bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 backdrop-blur-md shadow-xl border-t border-blue-950">
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-100 ml-3 font-semibold tracking-tight">Layout:</label>
            <LayoutSelector layout={layout} setLayout={setLayout} />
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={handlePrev}
              className={`relative gap-4 text-sm cursor-pointer brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-5 rounded-xl overflow-hidden
                before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100`}
              style={{
                background: "linear-gradient(#3b235a, #24143f)",
              }}
            >
              <Image className="brightness-200" src="/previous.svg" alt="prev" width={20} height={20} />Prev
            </button>

            <span className="text-sm text-gray-300">
              {currentIndex + 1}
              {panels === 2 && "-" + Math.min(currentIndex + panels, pages.length)} / {pages.length}
            </span>

            <button
              onClick={handleNext}
              className={`relative gap-4 text-sm cursor-pointer brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-5 rounded-xl overflow-hidden
                before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100`}
              style={{
                background: "linear-gradient(#3b235a, #24143f)",
              }}
            >
              Next
              <Image className="brightness-200" src="/next.svg" alt="next" width={20} height={20} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPanels(1)}
                className={`p-2 text-white rounded-md bg-white shadow-md focus:outline-none ${panels === 1
                  ? 'border-b-4 border-orange-500 bg-opacity-20 transition-all duration-300'
                  : 'hover:border-b-4 hover:border-orange-400 bg-opacity-10'
                  }`}
              >
                <img src="/single.svg" alt="Single Panel" className="w-6 h-6 brightness-200" />
              </button>

              <button
                onClick={() => setPanels(2)}
                className={`p-2 text-white rounded-md bg-white shadow-md focus:outline-none ${panels === 2
                  ? 'border-b-4 border-orange-500 bg-opacity-20 transition-all duration-300'
                  : 'hover:border-b-4 hover:border-orange-400 bg-opacity-10'
                  }`}
              >
                <img src="/double.svg" alt="Double Panel" className="w-6 h-6 brightness-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className=" w-[79%] fixed bottom-0 bg-[#070920] flex items-center justify-between px-6 py-4 backdrop-blur-md shadow-xl border-t border-blue-950">
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-100 ml-3 font-semibold tracking-tight">Layout:</label>
            <LayoutSelector layout={layout} setLayout={setLayout} />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAllAtOnce(true)}
              className={`p-2 text-white rounded-md bg-gray-700 shadow-md focus:outline-none ${allAtOnce
                ? 'border-b-2 border-orange-500'
                : 'hover:border-b-2 hover:border-orange-400'
                }`}
            >
              All At Once
            </button>

            <button
              onClick={() => setAllAtOnce(false)}
              className={`p-2 text-white rounded-md bg-gray-700 shadow-md focus:outline-none ${!allAtOnce
                ? 'border-b-2 border-orange-500'
                : 'hover:border-b-2 hover:border-orange-400'
                }`}
            >
              Page wise
            </button>
          </div>
        </div>

      </div>
    )
  );
}

export default BottomSettings;
