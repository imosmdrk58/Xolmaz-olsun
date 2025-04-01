"use client";

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, memo } from 'react';
import InfoSidebar from "../Components/ReadChapterComponents/InfoSidebar";
import Image from 'next/image';
import BottomSettings from "../Components/ReadChapterComponents/BottomSettings";
import TextToSpeech from "../Components/ReadChapterComponents/TextToSpeech";
import OCROverlay from "../Components/ReadChapterComponents/OCROverlay";
import LoadingSpinner from "../Components/LoadingSpinner"; // New loading spinner component
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

  const handleTranslate = async (text, targetLang = "en") => {
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
  };

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

  useEffect(() => {
    if (pages && pages.length > 0) {
      const currentPage = pages[currentIndex];
      if (pageTranslations[currentPage]) {
        setFullOCRResult(pageTranslations[currentPage].ocrResult);
        setTextResult(pageTranslations[currentPage].textResult);
        setShowMessage(true);
      } else {
        setFullOCRResult("");
        setTextResult("");
        setShowMessage(false);
      }
    }
  }, [currentIndex, pages, pageTranslations]);

  const handleImageLoad = (url) => {
    setImageCache((prevCache) => [...prevCache, url]);
  };

  const handleImageError = () => {
    setImageKey((prevKey) => prevKey + 1);
  };

  const handleUpload = async (imageUrl, from) => {
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

      setPageTranslations(prev => ({
        ...prev,
        [imageUrl]: {
          ocrResult: ocrResult,
          textResult: processedText
        }
      }));

      setFullOCRResult(ocrResult);
      setTextResult(processedText);

      if (from === "translate") {
        handleTranslate(processedText).then((translated) => {
          setTranslatedText(translated);
          setIsItTextToSpeech(false);
        });
      } else {
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
  };

  return (
    pages ? (
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

                    {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? <MemoizedOCROverlay fullOCRResult={fullOCRResult} /> : ""}
                    {!imageCache.includes(page) && (
                      <Placeholder />
                    )}
                  </div>

                  <div className="fixed flex flex-col justify-end items-end bottom-28 right-3">
                    {!isLoadingOCR ? (<>
                      <MemoizedTextToSpeech page={page} handleUpload={handleUpload} text={isItTextToSpeech ? textResult : translatedText} />
                      {chapterInfo?.translatedLanguage?.trim() !== "en" && <button
                        disabled={panels === 2 || pageTranslations[page]}
                        onClick={() => handleUpload(page, "translate")}
                        className={`font-sans  disabled:cursor-not-allowed mt-3 before:bg-opacity-60 min-w-[182px] transition-colors flex gap-4 justify-start items-center mx-auto shadow-xl text-lg text-white ${pageTranslations[page] ? "shadow-[0px_0px_6px_rgba(0,0,0,1)] shadow-orange-500 bg-orange-400 bg-opacity-60 " : "bg-[#1a063e]"} backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border rounded-full group`}
                        type="submit"
                      >
                        <img
                          src="/translate.svg"
                          alt="translate"
                          className="w-12 h-12 group-hover:border-2 group-hover:border-orange-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transform group-hover:rotate-[360deg]"
                        />
                        {pageTranslations[page] ? "Translated" : "Translate"}
                      </button>}


                      {/* <button
                        disabled={panels === 2 || pageTranslations[page]}
                        onClick={() => handleUpload(page, "translate")}
                        className={`group py-4 px-2 before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-16 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-md 
        bg-[#1a063e] hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 
        ${pageTranslations[page] ? "shadow-[0px_0px_6px rgba(0,0,0,1)] shadow-orange-500 bg-orange-400 bg-opacity-60" : "bg-[#1a063e]"} 
        backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
        before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full  before:bg-[#FFFFFF] 
        hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 ease-in-out`}
                      >
                        <div className="flex items-center justify-center w-12 transition-all duration-300  group-hover:w-16 group-hover:pr-6">
                        <img 
                          src="/translate.svg"
                          alt="translate"
                          className="w-12 h-12 group-hover:border-2 group-hover:border-orange-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transform group-hover:rotate-[360deg]"
                        />
                        </div>
                        <span
                          className={`absolute font-sans font-bold left-20 text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-4 transition-all duration-300 
            group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0 ${pageTranslations[page] ? "text-orange-300" : ""}`}
                        >
                          {pageTranslations[page] ? "Translated" : "Translate"}
                        </span>
                      </button> */}


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
                  <div key={index} className="relative h-fit flex justify-center items-center">
                    <div className={`relative w-auto h-auto`}>
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

                      {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? <MemoizedOCROverlay fullOCRResult={fullOCRResult} /> : ""}
                      {!imageCache.includes(page) && (
                        <Placeholder />
                      )}
                    </div>
                    <div className="absolute flex flex-col justify-center items-center -right-96">
                      {!isLoadingOCR ? (<>
                        <MemoizedTextToSpeech page={page} handleUpload={handleUpload} text={isItTextToSpeech ? textResult : translatedText} />
                        {chapterInfo?.translatedLanguage?.trim() !== "en" && <button
                          disabled={panels === 2 || pageTranslations[page]}
                          onClick={() => handleUpload(page, "translate")}
                          className={`font-sans disabled:opacity-0 mt-3 before:bg-opacity-60 min-w-[182px] transition-colors flex gap-4 justify-start items-center mx-auto shadow-xl text-lg text-white ${pageTranslations[page] ? "bg-orange-400 bg-opacity-60 shadow-[0_0_5px_rgba(0,0,0,1)] shadow-orange-500" : "bg-[#070920]"} backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border-2 rounded-full group`}
                          type="submit"
                        >
                          <img
                            src="/translate.svg"
                            alt="translate"
                            className="w-12 h-12 group-hover:border-2 group-hover:border-orange-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transform group-hover:rotate-[360deg]"
                          />
                          {pageTranslations[page] ? "Translated" : "Translate"}
                        </button>}
                      </>) : (
                        <div className="h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                          <div className="flex justify-center items-center w-full h-fit">
                            <div className="text-center flex flex-col justify-center items-center">
                              <div className="spinner-border -mt-36 -ml-36 animate-spin h-8 w-8 border-t-4 border-indigo-500 rounded-full mb-4" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>

          <MemoizedBottomSettings
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
        </div>

        {showMessage && (
          <div className="absolute z-50 text-wrap w-fit max-w-72 top-12 border-purple-500 border right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300">
            <button
              className="absolute top-1 right-1 text-white bg-purple-600 hover:bg-gray-500 rounded-full p-1 px-2.5"
              onClick={() => setShowMessage(false)}
            >
              ✖
            </button>
            <p>{translatedText || "No text Available"}</p>
          </div>
        )}
      </div>
    ) : (
      <MemoizedLoadingSpinner text='Loading Chapter...' />
    )
  );
}
