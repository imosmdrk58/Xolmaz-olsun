"use client";

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import InfoSidebar from "../Components/ReadChapterComponents/InfoSidebar";
import Image from 'next/image';
import BottomSettings from "../Components/ReadChapterComponents/BottomSettings";
import TextToSpeech from "../Components/ReadChapterComponents/TextToSpeech";
import OCROverlay from "../Components/ReadChapterComponents/OCROverlay"
import LoadingSpinner from "../Components/LoadingSpinner"; // New loading spinner component
import { useLocation, useParams } from 'react-router-dom';
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
  const [imageKey, setImageKey] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [fullOCRResult, setFullOCRResult] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [pageTranslations, setPageTranslations] = useState({});
  const [isLoadingOCR, setIsLoadingOCR] = useState(false); // Loading state for OCR
  const [isItTextToSpeech, setIsItTextToSpeech] = useState(false); // Loading state for OCR

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

  // useEffect(()=>{
  //   if(isItTextToSpeech)
  //   pages.map((page)=>{
  //     handleUpload(page,"speak" )
  //   })
  // },[setIsItTextToSpeech,isItTextToSpeech])

  const handleUpload = async (imageUrl,from) => {
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
      
      if (from==="translate") {
        handleTranslate(processedText).then((translated) => {
          setTranslatedText(translated);
        });
      }
      else{
        setIsItTextToSpeech(true)
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
    pages && (
      <div className="flex flex-row justify-between items-center h-[87vh] bg-gray-900 text-white">
        <InfoSidebar chapterInfo={chapterInfo} extraInfo={extraInfo} isCollapsed={isCollapsed} mangaInfo={mangaInfo} setIsCollapsed={setIsCollapsed} />
        <div
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
          }}
          className="flex flex-col h-[91.2vh] flex-1 mt-3 overflow-y-scroll"
        >
          <div
            className={`flex flex-1 ${layout === "horizontal"
              ? "flex-row space-x-4 overflow-hidden justify-center"
              : "flex-col space-y-4 justify-center"
              } items-center mt-2 my-1`}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
                <div key={index} className="relative h-[75vh] flex justify-center items-center">
                  <div className={`relative w-[380px] h-[75vh]  ${layout === "horizontal" ? "" : "overflow-y-scroll"}`}>
                    <Image
                      key={imageKey}
                      src={page}
                      alt={`Page ${currentIndex + index + 1}`}
                      height={1680}
                      width={1680}
                      className={`object-contain  rounded-lg ${layout === "horizontal" ? "w-full h-full" : "w-full h-auto"} shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"}`}
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      onLoadingComplete={() => handleImageLoad(page)}
                      onError={handleImageError}
                      placeholder="blur"
                      blurDataURL="/placeholder.jpg"
                    />

                    {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim()!=="en"  ? <OCROverlay fullOCRResult={fullOCRResult} /> : ""}
                    {!imageCache.includes(page) && (
                      <LoadingSpinner />
                    )}
                  </div>

                  <div className="absolute bottom-2 -right-96">
                    {!isLoadingOCR ? (<>
                      <TextToSpeech  page={page} handleUpload={handleUpload} text={textResult} />
                      { chapterInfo?.translatedLanguage?.trim()!=="en" &&<button
                        disabled={panels === 2}
                        onClick={() => handleUpload(page,"translate")}
                        className={`relative z-50 w-fit min-w-32 gap-4 text-sm cursor-pointer brightness-150 
                                                shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center 
                                                items-center p-5 rounded-xl overflow-hidden 
                                                before:absolute before:inset-0 before:opacity-0 
                                                before:transition-opacity before:duration-500 before:content-[''] 
                                                group-hover:before:opacity-100  ${pageTranslations[page] ? 'bg-green-800' : 'bg-purple-800'}`}
                      >
                        {pageTranslations[page] ? "Translated" : "Translate"}
                      </button>}
                    </>) : (
                      <div className="h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                        <div className="flex justify-center items-center w-full h-fit">
                          <div className="text-center flex flex-col justify-center items-center">
                            <div className="spinner-border -mt-36 -ml-36  animate-spin h-8 w-8 border-t-4 border-indigo-500 rounded-full mb-4" />

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <BottomSettings currentIndex={currentIndex} layout={layout} pages={pages} panels={panels} setCurrentIndex={setCurrentIndex} setLayout={setLayout} setPanels={setPanels} />
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
    )
  );
}
