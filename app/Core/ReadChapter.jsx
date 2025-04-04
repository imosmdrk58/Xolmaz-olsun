"use client";

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import InfoSidebar from "../Components/ReadChapterComponents/InfoSidebar";
import Image from 'next/image';
import BottomSettings from "../Components/ReadChapterComponents/BottomSettings";
import TextToSpeech from "../Components/ReadChapterComponents/TextToSpeech";
import OCROverlay from "../Components/ReadChapterComponents/OCROverlay";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useLocation, useParams } from 'react-router-dom';
import Placeholder from "../Components/ReadChapterComponents/Placeholder";

// Memoized components
const MemoizedInfoSidebar = memo(InfoSidebar);
const MemoizedBottomSettings = memo(BottomSettings);
const MemoizedTextToSpeech = memo(TextToSpeech);
const MemoizedOCROverlay = memo(OCROverlay);
const MemoizedLoadingSpinner = memo(LoadingSpinner);

export default function ReadChapter() {
  const { mangaId, chapterId } = useParams();
  const location = useLocation();
  const [textResult, setTextResult] = useState("");
  const { chapterInfo, mangaInfo, artist_author_info } = location.state || {};
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [layout, setLayout] = useState('horizontal');
  const [panels, setPanels] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageCache, setImageCache] = useState([]);
  const [imageKey, setImageKey] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [fullOCRResult, setFullOCRResult] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [pageTranslations, setPageTranslations] = useState({});
  const [isLoadingOCR, setIsLoadingOCR] = useState(false); // Loading state for OCR
  const [isItTextToSpeech, setIsItTextToSpeech] = useState(false); // Loading state for OCR
  const [allAtOnce, setAllAtOnce] = useState(false); // Loading state for OCR
  const [pageTTS, setPageTTS] = useState({});
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [overlayLoading, setOverlayLoading] = useState(false);

  const handleTranslate = useCallback(async (text, targetLang = "en") => {
    if (!text || !text.trim()) return "";

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });

      const data = await res.json();
      return res.ok ? data.translatedText || text : text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }, []);

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

  // console.log(pageTranslations)
  // console.log(translatedText)
  // console.log(textResult);



  useEffect(() => {
    if (pages && pages.length > 0) {
      const currentPage = pages[currentIndex];
      if (pageTranslations[currentPage]) {
        setFullOCRResult(pageTranslations[currentPage].ocrResult);
        setTranslatedText(pageTranslations[currentPage].textResult);
        setTextResult(pageTranslations[currentPage].textResult);
        setShowMessage(true);
      } else if (!pageTranslations[currentPage] && pageTTS[currentPage]) {
        setFullOCRResult(pageTTS[currentPage].ocrResult);
        setTextResult(pageTTS[currentPage].textResult);
        setShowMessage(true);
      } else {
        setFullOCRResult("");
        setTextResult("");
        setShowMessage(false);
      }
    }
  }, [currentIndex, pages, pageTranslations, pageTTS]);

  const handleImageLoad = useCallback((url) => {
    setImageCache((prevCache) => [...prevCache, url]);
  }, []);

  const handleImageError = useCallback(() => {
    setImageKey((prevKey) => prevKey + 1);
  }, []);

  const translateAll = useCallback(async (fullOCRResult) => {
    if (!fullOCRResult || fullOCRResult.length === 0) return;

    // Skip if we already have translations for all items
    const needsTranslation = fullOCRResult.some(item =>
      !translatedTexts[item.text] && item.text.trim() !== ""
    );

    if (!needsTranslation) return;

    setOverlayLoading(true);
    try {
      // Create a map of original texts to their translated versions
      const newTranslations = { ...translatedTexts };
      const untranslatedItems = fullOCRResult.filter(
        item => !translatedTexts[item.text] && item.text.trim() !== ""
      );

      // Process in batches to avoid too many simultaneous API calls
      const batchSize = 5;
      for (let i = 0; i < untranslatedItems.length; i += batchSize) {
        const batch = untranslatedItems.slice(i, i + batchSize);

        // Process batch in parallel
        const results = await Promise.all(
          batch.map(item => handleTranslate(item.text))
        );

        // Store the results
        batch.forEach((item, index) => {
          newTranslations[item.text] = results[index];
        });
      }
      setTranslatedTexts(newTranslations);
      return newTranslations;
    } catch (error) {
      console.error("Error translating batch:", error);
    } finally {
      setOverlayLoading(false);
    }
  }, [translatedTexts, handleTranslate]);

  const handleUpload = useCallback(async (imageUrl, from) => {
    if (!imageUrl) return alert("No image found!");

    setIsLoadingOCR(true); // Set loading state
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

      const ocrResult = result.text.data;
      const processedText = result.status === "error" ? "No Text Found" : result.text.data.map(item => item.text).join(" ");

      if (from === "translate") {
        const translated = await handleTranslate(processedText); // Await the translation
        const translatedocrResult = await translateAll(ocrResult); // Await the result of translateAll

        setPageTranslations(prev => ({
          ...prev,
          [imageUrl]: {
            ocrResult: ocrResult,
            translatedocrResult: translatedocrResult, // Set the resolved value
            textResult: translated
          }
        }));
        setTranslatedText(translated);
        setIsItTextToSpeech(false);
      } else {
        setPageTTS(prev => ({
          ...prev,
          [imageUrl]: {
            ocrResult: ocrResult,
            textResult: processedText
          }
        }));
        setFullOCRResult(ocrResult);
        setTextResult(processedText);
        setIsItTextToSpeech(true);
        setTranslatedText(processedText);
      }
      setShowMessage(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setIsLoadingOCR(false); // Reset loading state
    }
  }, [handleTranslate, translateAll]);

  function sortAndJoinOCR(fullOCRResult) {
    if (!fullOCRResult || fullOCRResult.length === 0) return "";
  
    // Calculate center points for all text blocks
    const itemsWithCenters = fullOCRResult.map(item => {
        const getCenter = (bbox) => {
            const xCoords = bbox.map(point => point[0]).filter(x => typeof x === 'number'); // Ensure valid numbers
            const yCoords = bbox.map(point => point[1]).filter(y => typeof y === 'number');
            if (xCoords.length === 0 || yCoords.length === 0) return { x: 0, y: 0 };
            const centerX = xCoords.reduce((sum, x) => sum + x, 0) / xCoords.length;
            const centerY = yCoords.reduce((sum, y) => sum + y, 0) / yCoords.length;
            return { x: centerX, y: centerY };
        };
  
        return {
            text: item.text.trim(),
            center: getCenter(item.bbox),
            original: item // Keep original data
        };
    });
  
    // Find the starting point (strictly highest Y, ignoring X for initial selection)
    let start = itemsWithCenters.reduce((min, item) => 
        min.center.y < item.center.y ? min : item
    );
  
    // Initialize sorted and remaining items
    let sortedItems = [start];
    let remainingItems = itemsWithCenters.filter(item => item !== start);
  
    // Iteratively add the closest remaining item, with heavy Y-axis precedence
    const Y_WEIGHT = 5.0; // Significantly higher weight for Y to ensure top-to-bottom priority
    const X_WEIGHT = 1.0; // Lower weight for X
  
    while (remainingItems.length > 0) {
        const lastAdded = sortedItems[sortedItems.length - 1];
        let closestItem = null;
        let minDistance = Infinity;
  
        for (let item of remainingItems) {
            // Calculate weighted distance: heavily prioritize Y (vertical) over X
            const dx = (item.center.x - lastAdded.center.x) * X_WEIGHT;
            const dy = (item.center.y - lastAdded.center.y) * Y_WEIGHT; // Much higher Y weight
            const distance = Math.sqrt(dx * dx + dy * dy); // Weighted Euclidean distance
  
            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        }
  
        if (closestItem) {
            sortedItems.push(closestItem);
            remainingItems = remainingItems.filter(item => item !== closestItem);
        }
    }
  
    // Group into lines and ensure correct order within lines
    const Y_LINE_THRESHOLD = 25; // Tighter threshold for new lines
    const X_GAP_THRESHOLD = 15; // Tighter threshold for horizontal gaps
  
    let lines = [];
    let currentLine = [sortedItems[0]];
  
    for (let i = 1; i < sortedItems.length; i++) {
        const prev = sortedItems[i - 1];
        const curr = sortedItems[i];
  
        // Check if current item starts a new line (large Y gap or significant X shift)
        if (Math.abs(curr.center.y - prev.center.y) > Y_LINE_THRESHOLD ||
            Math.abs(curr.center.x - (prev.center.x + (prev.original.bbox[1][0] - prev.original.bbox[0][0]))) > X_GAP_THRESHOLD) {
            lines.push(currentLine);
            currentLine = [curr];
        } else {
            currentLine.push(curr);
        }
    }
    lines.push(currentLine); // Push the last line
    // const Y_SAME_THRESHOLD =2; // Define your threshold for Y similarity
const X_SAME_THRESHOLD = 4; // Define your threshold for X similarity


for (let j = 0; j < lines.length - 1; j++) {
    for (let j = 0; j < lines.length - 1; j++) {
        let current = lines[j][0]; // Get the first element of the current line
        let next = lines[j + 1][0]; // Get the first element of the next line

        // Check if X coordinates are the same (or very close)
        if (Math.abs(Math.ceil(current.center.x) - Math.ceil(next.center.x)) < X_SAME_THRESHOLD || Math.abs(Math.floor(current.center.x) - Math.floor(next.center.x)) < X_SAME_THRESHOLD) {
            // If X is the same, swap if next has smaller Y
            if (next.center.y < current.center.y) {
                // Swap elements
                [lines[j], lines[j + 1]] = [lines[j + 1], lines[j]];
            }
        }

      //   if (Math.abs(Math.ceil(current.center.y) - Math.ceil(next.center.y)) < Y_SAME_THRESHOLD || Math.abs(Math.floor(current.center.y) - Math.floor(next.center.y)) < Y_SAME_THRESHOLD) {
      //     // If X is the same, swap if next has smaller Y
      //     if (next.center.x < current.center.x) {
      //         // Swap elements
      //         [lines[j], lines[j + 1]] = [lines[j + 1], lines[j]];
      //     }
      // }

  
    }
  }

console.log("Final lines:", lines.map(line => line.map(item => `${item.text} (y=${item.center.y}, x=${item.center.x})`).join(", ")));
    // Join lines with newlines, and items within lines with spaces
    const processedText = lines.map(line => 
        line.map(item => item.text).join(" ")
    ).filter(line => line.trim().length > 0)
     .join(" ");
  
    return processedText;
  }
  

  return (
    pages && !isError ? (
      <div className="flex flex-row w-full justify-between items-start h-full -mt-5 bg-[#070920] backdrop-blur-md text-white">
        <MemoizedInfoSidebar
          chapterInfo={chapterInfo}
          extraInfo={artist_author_info}
          isCollapsed={isCollapsed}
          mangaInfo={mangaInfo}
          setIsCollapsed={setIsCollapsed}
        />
        <div
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
          }}
          className="flex flex-col h-[91.2vh] flex-1 w-full overflow-y-scroll"
        >
          <div
            className={`flex flex-1 ${layout === "horizontal"
              ? "flex-row space-x-4 overflow-hidden justify-center mt-7 items-start"
              : "flex-col space-y-4 mt-7 justify-end items-center"
              }  my-1`}
          >
            {isLoading ? (
              <MemoizedLoadingSpinner />
            ) : (
              layout === "horizontal" ? pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
                <div key={index} className="relative h-[75vh] flex justify-center items-center">
                  <div className={`relative w-[380px] h-[75vh]`}>
                    <Image
                      key={imageKey}
                      src={page}
                      alt={`Page ${currentIndex + index + 1}`}
                      height={1680}
                      width={1680}
                      className={`object-contain rounded-lg w-full h-full shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"}`}
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      onLoadingComplete={() => handleImageLoad(page)}
                      onError={handleImageError}
                      placeholder="blur"
                      blurDataURL="/placeholder.jpg"
                    />

                    {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? <MemoizedOCROverlay loading={overlayLoading} handleTranslate={handleTranslate} translatedTexts={translatedTexts} fullOCRResult={fullOCRResult} /> : ""}
                    {!imageCache.includes(page) && (
                      <Placeholder />
                    )}
                  </div>
                  <div className="fixed flex flex-col justify-end items-end bottom-32 right-7">
                    {!isLoadingOCR ? (<>
                      {chapterInfo?.translatedLanguage?.trim() !== "en" && <button
                        disabled={panels === 2 || pageTranslations[page]}
                        onClick={() => handleUpload(page, "translate")}
                        className={`group py-4 ${panels == 2 || pageTranslations[page] ? "hidden" : ""} px-2 mb-4 before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
                          shadow-[0px_0px_10px_rgba(0,0,0,1)] shadow-yellow-500 bg-[#1a063e] bg-opacity-60  hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
                          ${pageTranslations[page] ? "shadow-[0px_0px_6px rgba(0,0,0,1)] shadow-yellow-500 bg-yellow-400 bg-opacity-60" : "bg-[#1a063e]"} 
                          backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
                          before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
                          hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 ease-in-out`}
                      >
                        <img
                          src="/translate.svg"
                          alt="translate"
                          className="w-16 h-16 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transform group-hover:rotate-[360deg]"
                        />
                        <span
                          className={`absolute font-sans font-bold left-20 text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-4 transition-all duration-300 
                            group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0 ${pageTranslations[page] ? "text-yellow-300" : ""}`}
                        >
                          {pageTranslations[page] ? "Translated" : "Translate"}
                        </span>
                      </button>}
                      <MemoizedTextToSpeech page={page} handleUpload={handleUpload} ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])} text={((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) && sortAndJoinOCR(isItTextToSpeech ? fullOCRResult : fullOCRResult)} />
                    </>) : (
                      <div className="h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                        <div className="flex justify-center items-center w-full h-fit">
                          <div className="text-center flex flex-col justify-center items-center">
                            <div className="spinner-border -mt-36 -ml-36 w-12 h-12  rounded-full animate-spin
                    border-8 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )) :
                pages.map((page, index) => (
                  <div key={index} className="relative h-fit w-full flex justify-center items-center">
                    <div className={`relative w-auto h-fit`}>
                      <Image
                        key={imageKey}
                        src={page}
                        alt={`Page ${index + 1}`}
                        height={1680}
                        width={1680}
                        className={`object-contain rounded-lg w-full max-w-[1280px] h-auto shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"}`}
                        priority={index === 0}
                        loading={index === 0 ? undefined : "lazy"}
                        onLoadingComplete={() => handleImageLoad(page)}
                        onError={handleImageError}
                        placeholder="blur"
                        blurDataURL="/placeholder.jpg"
                      />
                      {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? <MemoizedOCROverlay loading={overlayLoading} handleTranslate={handleTranslate} ready={Boolean(pageTranslations[page]?.translatedocrResult)} translatedTexts={pageTranslations[page]?.translatedocrResult} fullOCRResult={pageTranslations[page]?.ocrResult} /> : ""}
                      {!imageCache.includes(page) && (
                        <Placeholder />
                      )}
                    </div>
                    <div className="absolute top-52 transform space-y-4  flex flex-col justify-start items-end bottom-28 right-3">
                      {!isLoadingOCR ? (
                        <>
                          {chapterInfo?.translatedLanguage?.trim() !== "en" && <button
                            disabled={panels === 2 || pageTranslations[page]}
                            onClick={() => handleUpload(page, "translate")}
                            className={`font-sans ${panels == 2 || pageTranslations[page] ? "hidden" : ""}  disabled:cursor-not-allowed mt-3 before:bg-opacity-60 min-w-[182px] transition-colors flex gap-4 justify-start items-center mx-auto shadow-xl text-lg text-white ${pageTranslations[page] ? "shadow-[0px_0px_6px_rgba(0,0,0,1)] shadow-yellow-500 bg-yellow-400 bg-opacity-60 " : "bg-[#1a063e]"} backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border-2 rounded-full group`}
                            type="submit"
                          >
                            <img
                              src="/translate.svg"
                              alt="translate"
                              className="w-12 h-12 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transform group-hover:rotate-[360deg]"
                            />
                            {pageTranslations[page] ? "Translated" : "Translate"}
                          </button>}
                          <MemoizedTextToSpeech page={page} handleUpload={handleUpload} ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])} text={((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) && sortAndJoinOCR(isItTextToSpeech ? fullOCRResult : fullOCRResult)} layout={layout}/>
                        </>
                      ) : (
                        <div className="h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                          <div className="flex justify-center items-center w-full h-fit">
                            <div className="text-center flex flex-col justify-center items-center">
                              <div className="spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
          <div><MemoizedBottomSettings
            allAtOnce={allAtOnce}
            setAllAtOnce={setAllAtOnce}
            currentIndex={currentIndex}
            layout={layout}
            pages={pages}
            panels={panels}
            setCurrentIndex={setCurrentIndex}
            setLayout={setLayout}
            setPanels={setPanels}
          />
            {layout == "vertical" && <button
              className="cursor-pointer fixed bottom-32 right-8 w-16 h-16 rounded-full border-4 border-violet-200 bg-black flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-24 group/button overflow-hidden active:scale-90"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <svg
                className="w-3 fill-white delay-50 duration-200 group-hover/button:-translate-y-12"
                viewBox="0 0 384 512"
              >
                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
              </svg>
              <span className="absolute text-white text-xs opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">Top</span>
            </button>}
          </div>
        </div>

        {showMessage && layout !== "vertical" && (
          <div className="absolute z-50 text-wrap w-fit max-w-72 top-12 border-purple-500 border right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300">
            <button
              className="absolute top-1 right-1 text-white bg-purple-600 hover:bg-gray-500 rounded-full p-1 px-2.5"
              onClick={() => setShowMessage(false)}
            >
              ✖
            </button>
            <p>{sortAndJoinOCR(isItTextToSpeech ? fullOCRResult : fullOCRResult || "No text Available")}</p>
          </div>
        )}
      </div>
    ) : (
      <MemoizedLoadingSpinner text='Loading Chapter...' />
    )
  );
}
