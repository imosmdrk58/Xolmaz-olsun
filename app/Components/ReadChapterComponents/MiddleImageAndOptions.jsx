import React, { memo, useCallback, lazy, useState } from 'react'

import {
    Languages,
    ArrowRight,
    ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
const TextToSpeech = memo(lazy(() => import('./TextToSpeech')));
const OCROverlay = memo(lazy(() => import('./OCROverlay')));
const LoadingSpinner = memo(lazy(() => import('../LoadingSpinner')));
const Placeholder = memo(lazy(() => import('./Placeholder')));

function MiddleImageAndOptions({
    layout,
    isLoading,
    pages,
    quality,
    currentIndex,
    panels,
    chapterInfo,
    pageTranslations,
    setPageTranslations,
    pageTTS,
    setPageTTS,
    fullOCRResult,
    setFullOCRResult,
    isItTextToSpeech,
    setIsItTextToSpeech,
    finalResult,
    setShowMessage,
    allAtOnce,
    goToPrevChapter,
    hasPrevChapter,
    goToNextChapter,
    hasNextChapter,
    memoizedHandleTranslate
}) {
    if (!(chapterInfo && pages)) return null
    const [imageCache, setImageCache] = useState([]);
    const [imageKey, setImageKey] = useState(0);
    const [isLoadingOCR, setIsLoadingOCR] = useState(false);
    const [translatedTexts, setTranslatedTexts] = useState({});
    const [overlayLoading, setOverlayLoading] = useState(false);
    const handleImageLoad = useCallback((url) => {
        setImageCache((prevCache) => [...prevCache, url]);
    }, []);


    const handleImageError = useCallback(() => {
        setImageKey((prevKey) => prevKey + 1);
    }, []);
    const translateAll = useCallback(async (fullOCRResult) => {
        if (!fullOCRResult || fullOCRResult.length === 0) return;

        const needsTranslation = fullOCRResult.some(
            (item) => !translatedTexts[item.text] && item.text.trim() !== ""
        );

        if (!needsTranslation) return;

        setOverlayLoading(true);
        try {
            const newTranslations = { ...translatedTexts };
            const untranslatedItems = fullOCRResult.filter(
                (item) => !translatedTexts[item.text] && item.text.trim() !== ""
            );

            const batchSize = 5;
            for (let i = 0; i < untranslatedItems.length; i += batchSize) {
                const batch = untranslatedItems.slice(i, i + batchSize);
                const results = await Promise.all(
                    batch.map((item) => memoizedHandleTranslate(item.text))
                );
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
    }, [translatedTexts, memoizedHandleTranslate]);

    const handleUpload = useCallback(async (imageUrl, from) => {
        if (!imageUrl) return alert("No image found!");

        setIsLoadingOCR(true);
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
            const processedText = result.status === "error" ? "No Text Found" : result.text.data.map((item) => item.text).join(" ");

            if (from === "translate") {
                const translated = await memoizedHandleTranslate(processedText);
                const translatedocrResult = await translateAll(ocrResult);

                setPageTranslations((prev) => ({
                    ...prev,
                    [imageUrl]: {
                        ocrResult: ocrResult,
                        translatedocrResult: translatedocrResult,
                        textResult: translated,
                    },
                }));
                setIsItTextToSpeech(false);
            } else {
                setPageTTS((prev) => ({
                    ...prev,
                    [imageUrl]: {
                        ocrResult: ocrResult,
                        textResult: processedText,
                    },
                }));
                setFullOCRResult(ocrResult);
                setIsItTextToSpeech(true);
            }
            setShowMessage(true);
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        } finally {
            setIsLoadingOCR(false);
        }
    }, [memoizedHandleTranslate, translateAll]);


    return (
        <div>
            <div
                className={`flex flex-1 ${layout === "horizontal"
                    ? "flex-row space-x-4 overflow-hidden justify-center mt-7 items-start"
                    : "flex-col space-y-4 mt-7 justify-end items-center"
                    } my-1`}
            >
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    layout === "horizontal"
                        ? pages != undefined &&
                        (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)
                            .slice(Math.abs(currentIndex), Math.abs(currentIndex + panels))
                            .map((page, index) => (
                                <div key={index} className="tracking-wider relative h-[75vh] flex justify-center items-center">
                                    <div className={`relative  w-[380px] h-[75vh]`}>
                                        <Image
                                            key={imageKey}
                                            src={page}
                                            alt={`Page ${currentIndex + index + 1}`}
                                            height={1680}
                                            width={1680}
                                            className={`object-contain rounded-lg w-full h-full shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"
                                                }`}
                                            priority={index === 0}
                                            loading={index === 0 ? undefined : "eager"}
                                            onLoadingComplete={() => handleImageLoad(page)}
                                            onError={handleImageError}
                                            placeholder="blur"
                                            blurDataURL="/placeholder.jpg"
                                        />
                                        {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? (
                                            <OCROverlay
                                                loading={overlayLoading}
                                                handleTranslate={memoizedHandleTranslate} // Use memoized version
                                                translatedTexts={translatedTexts}
                                                fullOCRResult={fullOCRResult}
                                            />
                                        ) : (
                                            ""
                                        )}
                                        {!imageCache.includes(page) && <Placeholder />}
                                    </div>
                                    {panels != 2 && <div className="tracking-wider fixed flex flex-col justify-end items-end bottom-32 right-7">
                                        {!isLoadingOCR ? (
                                            <>
                                                {chapterInfo?.translatedLanguage?.trim() !== "en" && (
                                                    <button
                                                        disabled={panels === 2 || pageTranslations[page]}
                                                        onClick={() => handleUpload(page, "translate")}
                                                        className={`group py-4 ${panels === 2 || pageTranslations[page] ? "hidden" : ""
                                                            } px-2 mb-4 before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
                                  shadow-[0px_0px_10px_rgba(0,0,0,1)] shadow-yellow-500 bg-[#1a063e] bg-opacity-60  hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
                                  ${pageTranslations[page]
                                                                ? "shadow-[0px_0px_6px rgba(0,0,0,1)] shadow-yellow-500 bg-yellow-400 bg-opacity-60"
                                                                : "bg-[#1a063e]"
                                                            } 
                                  backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
                                  before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
                                  hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 ease-in-out`}
                                                    >
                                                        <Languages className="tracking-wider w-16 p-4 text-orange-400 h-16 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500 transition-all bg-gray-50 ease-in-out duration-300 rounded-full border border-gray-700  transform group-hover:rotate-[360deg]" />
                                                        <span
                                                            className={`absolute font-sans font-bold left-20 text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-4 transition-all duration-300 
                                      group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0 ${pageTranslations[page] ? "text-yellow-300" : ""
                                                                }`}
                                                        >
                                                            {pageTranslations[page] ? "Translated" : "Translate"}
                                                        </span>
                                                    </button>
                                                )}
                                                <TextToSpeech
                                                    page={page}
                                                    handleUpload={handleUpload}
                                                    ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])}
                                                    text={
                                                        ((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) &&
                                                        finalResult // Use memoized result
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <div className="tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                                                <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                    <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                        <div className="tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>}
                                </div>
                            ))
                        : (
                            <div className='w-full'>{pages &&
                                (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map(
                                    (page, index) => (
                                        <div
                                            key={index}
                                            className={`tracking-wider ${allAtOnce && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((p) => {
                                                if (!imageCache.includes(p)) return false
                                            }).includes(false) ? "hidden" : "block"} relative h-fit w-full flex justify-center items-center`}
                                        >
                                            <div className={`relative w-auto h-fit`}>
                                                <Image
                                                    key={imageKey}
                                                    src={page}
                                                    alt={`Page ${index + 1}`}
                                                    height={1680}
                                                    width={1680}
                                                    className={`object-contain rounded-lg w-full max-w-[1280px] h-auto shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"
                                                        }`}
                                                    priority={index === 0}
                                                    loading={index === 0 ? undefined : "eager"}
                                                    onLoadingComplete={() => handleImageLoad(page)}
                                                    onError={handleImageError}
                                                    placeholder="blur"
                                                    blurDataURL="/placeholder.jpg"
                                                />
                                                {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? (
                                                    <OCROverlay
                                                        loading={overlayLoading}
                                                        handleTranslate={memoizedHandleTranslate} // Use memoized version
                                                        ready={Boolean(pageTranslations[page]?.translatedocrResult)}
                                                        translatedTexts={pageTranslations[page]?.translatedocrResult}
                                                        fullOCRResult={pageTranslations[page]?.ocrResult}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                                {!imageCache.includes(page) && <Placeholder />}
                                            </div>
                                            <div className="tracking-wider absolute top-52 transform space-y-4 flex flex-col justify-start items-end bottom-28 right-3">
                                                {!isLoadingOCR ? (
                                                    <>
                                                        {chapterInfo?.translatedLanguage?.trim() !== "en" && (
                                                            <button
                                                                disabled={panels === 2 || pageTranslations[page]}
                                                                onClick={() => handleUpload(page, "translate")}
                                                                className={`font-sans ${panels === 2 || pageTranslations[page] ? "hidden" : ""
                                                                    } disabled:cursor-not-allowed mt-3 before:bg-opacity-60 min-w-[189px] transition-colors min-h-16 flex gap-4 justify-start items-center mx-auto shadow-xl text-lg text-white ${pageTranslations[page]
                                                                        ? "shadow-[0px_0px_6px_rgba(0,0,0,1)] shadow-yellow-500 bg-yellow-400 bg-opacity-60 "
                                                                        : "bg-[#1a063e]"
                                                                    } backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-3 py-2 ease-in-out overflow-hidden border-2 rounded-full group`}
                                                                type="submit"
                                                            >
                                                                <Languages className="tracking-wider w-12 h-12 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500 transition-all bg-gray-50 text-orange-400 ease-in-out duration-300 rounded-full border border-gray-700 p-3 transform group-hover:rotate-[360deg]" />
                                                                {pageTranslations[page] ? "Translated" : "Translate"}
                                                            </button>
                                                        )}
                                                        <TextToSpeech
                                                            page={page}
                                                            handleUpload={handleUpload}
                                                            ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])}
                                                            text={
                                                                ((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) &&
                                                                finalResult // Use memoized result
                                                            }
                                                            layout={layout}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                                                        <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                            <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                                <div className="tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                                <div className={`tracking-wider ${allAtOnce && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((p) => {
                                    if (!imageCache.includes(p)) return false
                                }).includes(false) ? "hidden" : "block"} px-[27%] mt-4 mb-20 h-20 grid grid-cols-2 gap-2`}>
                                    <button
                                        onClick={goToPrevChapter}
                                        disabled={!hasPrevChapter}
                                        className={`flex  gap-3 items-center justify-center py-2 rounded-lg ${hasPrevChapter
                                            ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40'
                                            : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'
                                            }`}
                                        aria-label="Previous chapter"
                                    >
                                        <ArrowLeft className="w-5 h-5 font-bold" />
                                        <span className=" ml-1 text-base font-bold">Previous</span>
                                    </button>
                                    <button
                                        onClick={goToNextChapter}
                                        disabled={!hasNextChapter}
                                        className={`flex items-center gap-3 justify-center py-2 rounded-lg ${hasNextChapter
                                            ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40'
                                            : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'
                                            }`}
                                        aria-label="Next chapter"
                                    >
                                        <span className=" mr-1 text-base font-bold">Next</span>
                                        <ArrowRight className="w-5 h-5 font-bold" />
                                    </button>
                                </div>
                    //for all at once loading while all the other pages are loading this is shown
                                {(allAtOnce && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((p) => {
                                    if (!imageCache.includes(p)) return false
                                }).includes(false)) && <div className=' absolute top-7 left-1/2'><Placeholder /></div>}
                            </div>
                        )
                )}
            </div>
        </div>
    )
}

export default MiddleImageAndOptions