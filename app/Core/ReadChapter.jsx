"use client";

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, memo, useCallback, lazy, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import sortAndJoinOCR from '../util/ReadChapterUtils/sortAndjoinOCR';
import handleTranslate from '../util/ReadChapterUtils/handleTranslate';
import { ArrowUp } from 'lucide-react';

const InfoSidebar = memo(lazy(() => import('../Components/ReadChapterComponents/InfoSideBarModules/InfoSidebar')));
const BottomSettings = memo(lazy(() => import('../Components/ReadChapterComponents/BottomSettingsModules/BottomSettings')));
const LoadingSpinner = memo(lazy(() => import('../Components/LoadingSpinner')));

import _MiddleImageAndOptions from "../Components/ReadChapterComponents/MiddleImageAndOptions";
const MiddleImageAndOptions = memo(_MiddleImageAndOptions);
export default function ReadChapter() {
  const { mangaId, chapterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { chapterInfo, mangaInfo, chapters } = location.state || {};
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [layout, setLayout] = useState('horizontal');
  const [panels, setPanels] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [fullOCRResult, setFullOCRResult] = useState("");
  const [pageTranslations, setPageTranslations] = useState({});

  const [isItTextToSpeech, setIsItTextToSpeech] = useState(false);
  const [allAtOnce, setAllAtOnce] = useState(false);
  const [pageTTS, setPageTTS] = useState({});

  const [quality, setQuality] = useState("low");
  const [finalResult, setFinalResult] = useState();
  const scrollContainerRef = useRef(null);
  // Memoize handleTranslate to ensure stable reference for props and callbacks

  const momoizedSortAndJoinOCR = useCallback((fullOCRResult) => sortAndJoinOCR(fullOCRResult))

  const { data: pages, isLoading, isError } = useQuery({
    queryKey: ['chapterPages', chapterId],
    queryFn: async () => {
      const cachedPages = localStorage.getItem(`chapter_${chapterId}`);
      if (cachedPages) return JSON.parse(cachedPages);

      const response = await fetch(`/api/manga/chapter/${chapterId}/pages`);
      if (!response.ok) throw new Error('Failed to fetch chapter pages.');
      const data = await response.json();
      if (data.result == "ok") {
        localStorage.setItem(`chapter_${chapterId}`, JSON.stringify(data));
        return data;
      }
      throw new Error('No pages found.');
    },
    retry: 2,
  });

  const memoizedHandleTranslate = useCallback(
    (text) => handleTranslate(text),
    []
  );
  const handleChapterClick = useCallback(
    (id) => {
      navigate(`/manga/${mangaId}/chapter/${id.id}/read`, {
        state: { chapterInfo: id, mangaInfo: mangaInfo, chapters },
      });
    },
    [navigate, mangaId, mangaInfo, pages]
  );
  useEffect(() => {
    async function doFullTextOCR() {
      setFinalResult(isItTextToSpeech ? momoizedSortAndJoinOCR(fullOCRResult) : await memoizedHandleTranslate(momoizedSortAndJoinOCR(fullOCRResult)));
    }
    doFullTextOCR()
  }, [momoizedSortAndJoinOCR, isItTextToSpeech, memoizedHandleTranslate, fullOCRResult])

  console.log(finalResult)
  useEffect(() => {
    if (pages && pages?.chapter?.dataSaver?.length > 0 && pages?.chapter?.data?.length > 0) {
      const currentPage = quality === "low" ? pages?.chapter?.dataSaver[currentIndex] : pages?.chapter?.data[currentIndex];
      if (pageTranslations[currentPage]) {
        setFullOCRResult(pageTranslations[currentPage].ocrResult);
        setShowMessage(true);
      } else if (!pageTranslations[currentPage] && pageTTS[currentPage]) {
        setFullOCRResult(pageTTS[currentPage].ocrResult);
        setShowMessage(true);
      } else {
        setFullOCRResult("");
        setShowMessage(false);
      }
    }
  }, [currentIndex, pages, pageTranslations, pageTTS]);


  useEffect(() => {
    if (mangaInfo.originalLanguage == "ko" || mangaInfo.originalLanguage == "zh" || mangaInfo.originalLanguage == "zh-hk" || mangaInfo.flatTags.includes("Long Strip") || mangaInfo.flatTags.includes("Web Comic")) {
      setLayout("vertical")
    }
  }, [mangaId, chapters, mangaInfo, pages, chapterId])

  console.log(mangaInfo);



  const currentChapterIndex = useMemo(() =>
    chapters.findIndex(ch => ch.id === chapterInfo.id),
    [chapters, chapterInfo.id]
  );
  const hasPrevChapter = useMemo(() => currentChapterIndex > 0);
  const hasNextChapter = useMemo(() => currentChapterIndex < chapters.length - 1);
  const goToChapter = useCallback((chapter) => {
    if (chapter) {
      handleChapterClick(chapter);
    }
  }, [handleChapterClick]);

  const goToPrevChapter = useCallback(() =>
    hasPrevChapter && goToChapter(chapters[currentChapterIndex - 1]),
    [hasPrevChapter, currentChapterIndex, chapters, goToChapter]
  );
  const goToNextChapter = useCallback(() =>
    hasNextChapter && goToChapter(chapters[currentChapterIndex + 1]),
    [hasNextChapter, currentChapterIndex, chapters, goToChapter]
  );
  return (
    pages && !isError ? (
      <div
        className="tracking-wider flex flex-row w-full h-[90vh] md:h-[91.3vh] justify-between items-start -mt-5 bg-[#070920] backdrop-blur-md text-white overflow-hidden"
      >
        <InfoSidebar
          panels={panels}
          pages={pages && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
          allChapters={chapters}
          currentChapterIndex={currentChapterIndex}
          goToNextChapter={goToNextChapter}
          goToPrevChapter={goToPrevChapter}
          onChapterChange={handleChapterClick}
          hasNextChapter={hasNextChapter}
          hasPrevChapter={hasPrevChapter}
          goToChapter={goToChapter}
          chapterInfo={chapterInfo}
          isCollapsed={isCollapsed}
          mangaInfo={mangaInfo}
          setIsCollapsed={setIsCollapsed}
          className="min-w-[200px] max-w-[300px] sm:max-w-[350px] flex-shrink-0"
        />

        <div
          ref={scrollContainerRef}
          className="tracking-wider flex flex-col flex-grow min-w-0 h-full w-full max-w-full  scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900"
        >
          {/* MiddleImageAndOptions scrollable area */}
          <div 
            style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
          }}
          className="flex-grow overflow-y-auto min-w-0 max-w-full scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900">
            <MiddleImageAndOptions
              layout={layout}
              isLoading={isLoading}
              pages={pages}
              quality={quality}
              currentIndex={currentIndex}
              panels={panels}
              chapterInfo={chapterInfo}
              pageTranslations={pageTranslations}
              setPageTranslations={setPageTranslations}
              pageTTS={pageTTS}
              setPageTTS={setPageTTS}
              fullOCRResult={fullOCRResult}
              setFullOCRResult={setFullOCRResult}
              isItTextToSpeech={isItTextToSpeech}
              setIsItTextToSpeech={setIsItTextToSpeech}
              finalResult={finalResult}
              showMessage={showMessage}
              setShowMessage={setShowMessage}
              allAtOnce={allAtOnce}
              goToPrevChapter={goToPrevChapter}
              hasPrevChapter={hasPrevChapter}
              goToNextChapter={goToNextChapter}
              hasNextChapter={hasNextChapter}
              memoizedHandleTranslate={memoizedHandleTranslate}
              className="min-w-0 max-w-full"
            />
          </div>

          {/* BottomSettings fixed height, no overflow */}
          <div className="flex-shrink-0 w-full max-w-full">
            <BottomSettings
              allAtOnce={allAtOnce}
              quality={quality}
              isCollapsed={isCollapsed}
              setQuality={setQuality}
              setAllAtOnce={setAllAtOnce}
              currentIndex={currentIndex}
              layout={layout}
              pages={pages && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)}
              panels={panels}
              setCurrentIndex={setCurrentIndex}
              setLayout={setLayout}
              setPanels={setPanels}
            />
            {layout === "vertical" && (
              <button
                className="tracking-wider cursor-pointer fixed bottom-32 right-8 w-16 h-16 rounded-full border-4 border-violet-200 bg-black flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-24 group/button overflow-hidden active:scale-90"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <ArrowUp className="tracking-wider w-3 fill-white delay-50 duration-200 group-hover/button:-translate-y-12" />
                <span className="tracking-wider absolute text-white text-xs opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                  Top
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

    ) : (
      <LoadingSpinner text="Loading Chapter..." />
    )
  );
}