'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import InfoSidebar from "../Components/ReadChapterComponents/InfoSidebar";
import Image from 'next/image';
import BottomSettings from "../Components/ReadChapterComponents/BottomSettings";

export default function ReadChapter() {
  const { mangaId, chapterId } = useParams();
  const location = useLocation();
  const [textResult, setTextResult] = useState("");
  const { chapterInfo, mangaInfo, extraInfo } = location.state || {};
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [layout, setLayout] = useState('horizontal');
  const [panels, setPanels] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageCache, setImageCache] = useState([]);
  const [imageKey, setImageKey] = useState(0); // Key to force image re-fetch
  const [showMessage, setShowMessage] = useState(false); // State for message box visibility
  const [fullOCRResult, setFullOCRResult] = useState("");
  setFullOCRResult
  const { data: pages, isLoading, isError } = useQuery({
    queryKey: ['chapterPages', chapterId],
    queryFn: async () => {
      const cachedPages = localStorage.getItem(`chapter_${chapterId}`);
      if (cachedPages) return JSON.parse(cachedPages);

      const response = await fetch(`/api/manga/chapter/${chapterId}/pages`);
      if (!response.ok) throw new Error('Failed to fetch chapter pages.');
      const data = await response.json();
      if (data.images) {
        localStorage.setItem(`chapter_${chapterId}`, JSON.stringify(data.images));
        return data.images;
      }
      throw new Error('No pages found.');
    },
    retry: 2,
  });

  const handleImageLoad = (url) => {
    setImageCache((prevCache) => [...prevCache, url]);
  };

  const handleImageError = () => {
    setImageKey((prevKey) => prevKey + 1); // Change key to force re-fetch
  };

  // const handleUpload = async (imageUrl) => {
  //   if (!imageUrl) return alert("No image found!");

  //   try {
  //     // Fetch the image and convert it to a Blob
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob();
  //     const file = new File([blob], "image.jpg", { type: blob.type });

  //     // Append file to FormData
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     // Send to backend
  //     const apiResponse = await fetch("/api/readTextAndReplace", {
  //       method: "POST",
  //       body: formData, // Do NOT set Content-Type
  //     });

  //     if (!apiResponse.ok) throw new Error("API request failed");

  //     const result = await apiResponse.json();
  //     console.log("Processed Result:", result);

  //     setTextResult(result.IsErroredOnProcessing ? "No Text Found" : result.ParsedResults[0].ParsedText);
  //     setShowMessage(true); // Show the message box

  //     // Hide the message box after 5 seconds
  //     setTimeout(() => {
  //       setShowMessage(false);
  //     }, 5000);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Something went wrong!");
  //   }
  // };


  const handleUpload = async (imageUrl) => {
    if (!imageUrl) return alert("No image found!");

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);

      const apiResponse = await fetch("/api/readTextAndReplace", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) throw new Error("API request failed");

      const result = await apiResponse.json();
      console.log("OCR Result:", result);
      setFullOCRResult(result.text.data)
      setTextResult(result.status === "error" ? "No Text Found" : result.text.data.map(item => item.text).join(" "));
      setShowMessage(true);

      setTimeout(() => setShowMessage(false), 5000);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  console.log(textResult)
  return (
    pages && <div className="flex flex-row justify-between items-center h-[87vh] bg-gray-900 text-white">
      {/* Sidebar */}
      <InfoSidebar chapterInfo={chapterInfo} extraInfo={extraInfo} isCollapsed={isCollapsed} mangaInfo={mangaInfo} setIsCollapsed={setIsCollapsed} />
      {/* Main Content */}
      <div
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)", // Purple scrollbar
        }}
        className="flex flex-col h-[91.2vh] flex-1 mt-3 overflow-y-scroll"
      >
        <div
          className={`flex flex-1 ${layout === "horizontal"
            ? "flex-row space-x-4 overflow-hidden justify-center"
            : "flex-col space-y-4 justify-center"
            } items-center mt-2 my-1`}
        >
          {panels === 2 && pages.slice(currentIndex, currentIndex + panels).length === 2 ? (
            <div className="relative max-w-full max-h-full gap-2 flex justify-center items-center">
              {/* Loading spinner for double page mode */}
              {(!imageCache.includes(pages[currentIndex]) || !imageCache.includes(pages[currentIndex + 1])) && (
                <div className="absolute w-full h-[80vh] flex justify-center items-center bg-black/20 rounded-lg shadow-lg">
                  <div className="flex justify-center items-center w-full h-screen">
                    <div className="text-center flex flex-col justify-center items-center">
                      <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 rounded-full mb-4" />
                      <span className="ml-2 text-indigo-400 font-medium">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
              {pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
                <Image
                  key={imageKey + index} // Unique key for each image
                  src={page}
                  alt={`Page ${currentIndex + index + 1}`}
                  height={1680}
                  width={1680}
                  className={`object-contain w-auto h-[75vh] rounded-lg shadow-xl transition-all ${(panels == 1 && (imageCache.includes(pages[currentIndex]))) || (panels == 2 && (imageCache.includes(pages[currentIndex]) && imageCache.includes(pages[currentIndex + 1]))) ? "block" : "hidden"}`}
                  priority={Boolean(index === 0)}
                  loading={index === 0 ? undefined : "lazy"}
                  onLoadingComplete={() => handleImageLoad(page)}
                  onError={handleImageError}
                  placeholder="blur"
                  blurDataURL="/placeholder.jpg"
                />
              ))}
            </div>
          ) : (
            pages && pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
              <div key={index} className="relative h-[75vh] flex justify-center items-center">
              <div className="relative w-[380px] h-[75vh]">
                <Image
                  key={imageKey}
                  src={page}
                  alt={`Page ${currentIndex + index + 1}`}
                  height={1680}
                  width={1680}
                  className={`object-contain w-full h-full rounded-lg shadow-xl transition-all ${
                    imageCache.includes(page) ? "block" : "hidden"
                  }`}
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  onLoadingComplete={() => handleImageLoad(page)}
                  onError={handleImageError}
                  placeholder="blur"
                  blurDataURL="/placeholder.jpg"
                />
                
                {/* Text Overlay Container - Positioned absolutely within the image container */}
                <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
                  {fullOCRResult &&
                    fullOCRResult.map((item, i) => {
                      const [[x1, y1], [x2], , [, y4]] = item.bbox;
            
                      // Define the original image dimensions
                      const originalImageWidth = 1680;
                      const originalImageHeight = 1680;
            
                      // Get actual rendered image dimensions
                      // We need to account for the object-contain scaling
                      const imageAspectRatio = originalImageWidth / originalImageHeight;
                      const containerAspectRatio = 380 / (window.innerHeight * 0.75);
                      
                      // Determine how the image is actually displayed (letterboxed or pillarboxed)
                      let renderedWidth, renderedHeight;
                      if (imageAspectRatio > containerAspectRatio) {
                        // Image is letterboxed (black bars on top and bottom)
                        renderedWidth = 380;
                        renderedHeight = 380 / imageAspectRatio;
                      } else {
                        // Image is pillarboxed (black bars on sides)
                        renderedHeight = window.innerHeight * 0.75;
                        renderedWidth = renderedHeight * imageAspectRatio;
                      }
                      
                      // Calculate the offset from the container edges
                      const offsetX = (380 - renderedWidth) / 2;
                      const offsetY = (810 - renderedHeight) / 15;
                      
                      // Calculate scaling factors for the actually rendered image
                      const scaleX = renderedWidth / originalImageWidth;
                      const scaleY = renderedHeight / originalImageHeight*1.4;
            
                      // Apply scaling to the coordinates and dimensions with offsets
                      const scaledX = (x1 * scaleX) + offsetX;
                      const scaledY = (y1 * scaleY) + offsetY - 70;
                      const scaledWidth = (x2 - x1) * scaleX;
                      const scaledHeight = (y4 - y1) * scaleY;
                      
                      // Ensure text doesn't go below a certain threshold to avoid the nav bar
                      const maxY = window.innerHeight * 0.75 - 50; // 50px buffer from bottom
                      const adjustedY = scaledY;
            
                      return (
                        <div
                          key={i}
                          className="absolute bg-white w-fit h-[10px]  text-black font-bold text-[10px] flex justify-center items-center overflow-hidden rounded-sm"
                          style={{
                            top: `${adjustedY}px`,
                            left: `${scaledX}px`,
                            // width: `${scaledWidth}px`,
                            // height: `${scaledHeight}px`,
                            // maxHeight: `${Math.min(scaledHeight, 30)}px`,
                            // maxWidth: `${Math.min(scaledWidth, 200)}px`,
                          }}
                        >
                          {item.text}
                        </div>
                      );
                    })}
                </div>
                
                {/* Loading spinner for single page mode */}
                {!imageCache.includes(page) && (
                  <div className="absolute inset-0 w-full h-full flex justify-center items-center bg-black/50 rounded-lg shadow-lg">
                    <div className="text-center flex flex-col justify-center items-center">
                      <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
                      <span className="ml-2 text-indigo-400 font-medium">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            
              {/* Translate button - positioned outside the image container */}
              <div className="absolute bottom-2 -right-96">
                <button
                  disabled={panels === 2}
                  onClick={() => handleUpload(page)}
                  className={`relative z-50 w-fit gap-4 text-sm cursor-pointer brightness-150 
                    shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center 
                    items-center p-5 rounded-xl overflow-hidden 
                    before:absolute before:inset-0 before:opacity-0 
                    before:transition-opacity before:duration-500 before:content-[''] 
                    group-hover:before:opacity-100`}
                  style={{
                    background: "linear-gradient(#3b235a, #24143f)",
                  }}
                >
                  Translate
                </button>
              </div>
            </div>
            ))
          )}
        </div>
        <BottomSettings currentIndex={currentIndex} layout={layout} pages={pages} panels={panels} setCurrentIndex={setCurrentIndex} setLayout={setLayout} setPanels={setPanels} />
      </div>

      {/* Floating Message Box */}
      {showMessage && (
        <div className="absolute z-50 text-wrap w-fit max-w-72 top-12 border-purple-500 border right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 ">
          <button
            className="absolute top-1 right-1 text-white bg-purple-600 hover:bg-gray-500 rounded-full p-1 px-2.5"
            onClick={() => setShowMessage(false)}
          >
            ✖
          </button>
          <p>{textResult || "No text Available"}</p>
        </div>
      )}

    </div>
  );
}
