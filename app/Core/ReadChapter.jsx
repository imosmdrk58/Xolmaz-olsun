'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useParams, useLocation } from 'react-router-dom';
import InfoSidebar from '../Components/ReadChapterComponents/InfoSidebar';
import BottomSettings from '../Components/ReadChapterComponents/BottomSettings';
import TextToSpeech from '../Components/ReadChapterComponents/TextToSpeech';
import OCROverlay from '../Components/ReadChapterComponents/OCROverlay';
import LoadingSpinner from '../Components/LoadingSpinner';
import Placeholder from '../Components/ReadChapterComponents/Placeholder';

const MemoizedInfoSidebar = memo(InfoSidebar);
const MemoizedBottomSettings = memo(BottomSettings);
const MemoizedTextToSpeech = memo(TextToSpeech);
const MemoizedOCROverlay = memo(OCROverlay);
const MemoizedLoadingSpinner = memo(LoadingSpinner);

export default function ReadChapter() {
  const { mangaId, chapterId } = useParams();
  const { chapterInfo, mangaInfo } = useLocation().state || {};
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [layout, setLayout] = useState('horizontal');
  const [panels, setPanels] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageCache, setImageCache] = useState([]);
  const [imageKey, setImageKey] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [fullOCRResult, setFullOCRResult] = useState('');
  const [pageTranslations, setPageTranslations] = useState({});
  const [isLoadingOCR, setIsLoadingOCR] = useState(false);
  const [isItTextToSpeech, setIsItTextToSpeech] = useState(false);
  const [allAtOnce, setAllAtOnce] = useState(false);
  const [pageTTS, setPageTTS] = useState({});
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [overlayLoading, setOverlayLoading] = useState(false);

  const handleTranslate = useCallback(
    async (text, targetLang = 'en') => {
      if (!text?.trim()) return '';
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang }),
        });
        const data = await res.json();
        return res.ok ? data.translatedText || text : text;
      } catch (error) {
        console.error('Translation error:', error);
        return text;
      }
    },
    []
  );

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
        setShowMessage(true);
      } else if (pageTTS[currentPage]) {
        setFullOCRResult(pageTTS[currentPage].ocrResult);
        setShowMessage(true);
      } else {
        setFullOCRResult('');
        setShowMessage(false);
      }
    }
  }, [currentIndex, pages, pageTranslations, pageTTS]);

  const handleImageLoad = useCallback(url => {
    setImageCache(prev => [...prev, url]);
  }, []);

  const handleImageError = useCallback(() => {
    setImageKey(prev => prev + 1);
  }, []);

  const translateAll = useCallback(
    async fullOCRResult => {
      if (!fullOCRResult || fullOCRResult.length === 0) return;
      const needsTranslation = fullOCRResult.some(
        item => !translatedTexts[item.text] && item.text.trim() !== ''
      );
      if (!needsTranslation) return;
      setOverlayLoading(true);
      try {
        const newTranslations = { ...translatedTexts };
        const untranslatedItems = fullOCRResult.filter(
          item => !translatedTexts[item.text] && item.text.trim() !== ''
        );
        const batchSize = 5;
        for (let i = 0; i < untranslatedItems.length; i += batchSize) {
          const batch = untranslatedItems.slice(i, i + batchSize);
          const results = await Promise.all(batch.map(item => handleTranslate(item.text)));
          batch.forEach((item, index) => {
            newTranslations[item.text] = results[index];
          });
        }
        setTranslatedTexts(newTranslations);
        return newTranslations;
      } catch (error) {
        console.error('Error translating batch:', error);
      } finally {
        setOverlayLoading(false);
      }
    },
    [translatedTexts, handleTranslate]
  );

  const handleUpload = useCallback(
    async (imageUrl, from) => {
      if (!imageUrl) return alert('No image found!');
      setIsLoadingOCR(true);
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: blob.type });
        const formData = new FormData();
        formData.append('file', file);
        const apiResponse = await fetch('/api/readTextAndReplace', {
          method: 'POST',
          body: formData,
        });
        if (!apiResponse.ok) throw new Error('API request failed');
        const result = await apiResponse.json();
        const ocrResult = result.text.data;
        const processedText = result.status === 'error' ? 'No Text Found' : result.text.data.map(item => item.text).join(' ');
        if (from === 'translate') {
          const translated = await handleTranslate(processedText);
          const translatedocrResult = await translateAll(ocrResult);
          setPageTranslations(prev => ({
            ...prev,
            [imageUrl]: {
              ocrResult,
              translatedocrResult,
              textResult: translated,
            },
          }));
          setIsItTextToSpeech(false);
        } else {
          setPageTTS(prev => ({
            ...prev,
            [imageUrl]: { ocrResult, textResult: processedText },
          }));
          setFullOCRResult(ocrResult);
          setIsItTextToSpeech(true);
        }
        setShowMessage(true);
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
      } finally {
        setIsLoadingOCR(false);
      }
    },
    [handleTranslate, translateAll]
  );

  const sortAndJoinOCR = useCallback(fullOCRResult => {
    if (!fullOCRResult || fullOCRResult.length === 0) return '';
    const itemsWithCenters = fullOCRResult.map(item => {
      const getCenter = bbox => {
        const xCoords = bbox.map(point => point[0]).filter(x => typeof x === 'number');
        const yCoords = bbox.map(point => point[1]).filter(y => typeof y === 'number');
        if (xCoords.length === 0 || yCoords.length === 0) return { x: 0, y: 0 };
        const centerX = xCoords.reduce((sum, x) => sum + x, 0) / xCoords.length;
        const centerY = yCoords.reduce((sum, y) => sum + y, 0) / yCoords.length;
        return { x: centerX, y: centerY };
      };
      return {
        text: item.text.trim(),
        center: getCenter(item.bbox),
        original: item,
      };
    });

    let start = itemsWithCenters.reduce((min, item) => (min.center.y < item.center.y ? min : item));
    let sortedItems = [start];
    let remainingItems = itemsWithCenters.filter(item => item !== start);

    const Y_WEIGHT = 5.0;
    const X_WEIGHT = 1.0;

    while (remainingItems.length > 0) {
      const lastAdded = sortedItems[sortedItems.length - 1];
      let closestItem = null;
      let minDistance = Infinity;
      for (let item of remainingItems) {
        const dx = (item.center.x - lastAdded.center.x) * X_WEIGHT;
        const dy = (item.center.y - lastAdded.center.y) * Y_WEIGHT;
        const distance = Math.sqrt(dx * dx + dy * dy);
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

    const Y_LINE_THRESHOLD = 25;
    const X_GAP_THRESHOLD = 15;
    let lines = [];
    let currentLine = [sortedItems[0]];
    for (let i = 1; i < sortedItems.length; i++) {
      const prev = sortedItems[i - 1];
      const curr = sortedItems[i];
      if (
        Math.abs(curr.center.y - prev.center.y) > Y_LINE_THRESHOLD ||
        Math.abs(curr.center.x - (prev.center.x + (prev.original.bbox[1][0] - prev.original.bbox[0][0]))) > X_GAP_THRESHOLD
      ) {
        lines.push(currentLine);
        currentLine = [curr];
      } else {
        currentLine.push(curr);
      }
    }
    lines.push(currentLine);

    const X_SAME_THRESHOLD = 4;
    for (let j = 0; j < lines.length - 1; j++) {
      let current = lines[j][0];
      let next = lines[j + 1][0];
      if (
        Math.abs(Math.ceil(current.center.x) - Math.ceil(next.center.x)) < X_SAME_THRESHOLD ||
        Math.abs(Math.floor(current.center.x) - Math.floor(next.center.x)) < X_SAME_THRESHOLD
      ) {
        if (next.center.y < current.center.y) {
          [lines[j], lines[j + 1]] = [lines[j + 1], lines[j]];
        }
      }
    }

    return lines
      .map(line => line.map(item => item.text).join(' '))
      .filter(line => line.trim().length > 0)
      .join(' ');
  }, []);

  return pages && !isError ? (
    <div className="flex flex-row w-full justify-between items-start h-full -mt-5 bg-[#070920] backdrop-blur-md text-white">
      <MemoizedInfoSidebar
        chapterInfo={chapterInfo}
        isCollapsed={isCollapsed}
        mangaInfo={mangaInfo}
        setIsCollapsed={setIsCollapsed}
      />
      <div
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
        className="flex flex-col overflow-hidden h-[91.9vh] flex-1 w-full overflow-y-scroll"
      >
        <div
          className={`flex flex-1 ${layout === 'horizontal' ? 'flex-row space-x-4 justify-center mt-7' : 'flex-col space-y-4 mt-7 items-center'}`}
        >
          {isLoading ? (
            <MemoizedLoadingSpinner />
          ) : layout === 'horizontal' ? (
            pages.slice(currentIndex, currentIndex + panels).map((page, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative h-[75vh] flex justify-center items-center"
              >
                <div className="relative w-[380px] h-[75vh]">
                  <Image
                    key={imageKey}
                    src={page}
                    alt={`Page ${currentIndex + index + 1}`}
                    height={1680}
                    width={1680}
                    className={`object-contain rounded-lg w-full h-full shadow-xl transition-all ${imageCache.includes(page) ? 'block' : 'hidden'}`}
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'lazy'}
                    onLoadingComplete={() => handleImageLoad(page)}
                    onError={handleImageError}
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                  />
                  {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== 'en' && (
                    <MemoizedOCROverlay
                      loading={overlayLoading}
                      handleTranslate={handleTranslate}
                      translatedTexts={translatedTexts}
                      fullOCRResult={fullOCRResult}
                    />
                  )}
                  {!imageCache.includes(page) && <Placeholder />}
                </div>
                <div className="fixed flex flex-col justify-end items-end bottom-32 right-7 space-y-4">
                  {!isLoadingOCR ? (
                    <>
                      {chapterInfo?.translatedLanguage?.trim() !== 'en' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={panels === 2 || pageTranslations[page]}
                          onClick={() => handleUpload(page, 'translate')}
                          className={`group flex items-center justify-start min-w-[48px] h-16 p-3 rounded-full bg-gradient-to-br from-purple-800 to-purple-900 text-white shadow-lg hover:min-w-[182px] hover:shadow-yellow-500/40 transition-all duration-300 ${pageTranslations[page] ? 'bg-yellow-400/60' : ''}`}
                        >
                          <motion.img
                            src="/translate.svg"
                            alt="translate"
                            className="w-12 h-12 bg-gray-50 rounded-full border border-gray-700 p-2 group-hover:border-yellow-500 transition-all duration-300"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="absolute font-sans font-bold left-16 text-lg text-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transform translate-x-4 transition-all duration-300">
                            {pageTranslations[page] ? 'Translated' : 'Translate'}
                          </span>
                        </motion.button>
                      )}
                      <MemoizedTextToSpeech
                        page={page}
                        handleUpload={handleUpload}
                        ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])}
                        text={((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) && sortAndJoinOCR(fullOCRResult)}
                      />
                    </>
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 rounded-full border-8 border-purple-500 border-t-transparent shadow-md"
                    />
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            pages.map((page, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-fit w-full flex justify-center items-center"
              >
                <div className="relative w-auto h-fit">
                  <Image
                    key={imageKey}
                    src={page}
                    alt={`Page ${index + 1}`}
                    height={1680}
                    width={1680}
                    className={`object-contain rounded-lg w-full max-w-[1280px] h-auto shadow-xl transition-all ${imageCache.includes(page) ? 'block' : 'hidden'}`}
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'lazy'}
                    onLoadingComplete={() => handleImageLoad(page)}
                    onError={handleImageError}
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                  />
                  {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== 'en' && (
                    <MemoizedOCROverlay
                      loading={overlayLoading}
                      handleTranslate={handleTranslate}
                      ready={Boolean(pageTranslations[page]?.translatedocrResult)}
                      translatedTexts={pageTranslations[page]?.translatedocrResult}
                      fullOCRResult={pageTranslations[page]?.ocrResult}
                    />
                  )}
                  {!imageCache.includes(page) && <Placeholder />}
                </div>
                <div className="absolute top-52 right-3 space-y-4 flex flex-col items-end">
                  {!isLoadingOCR ? (
                    <>
                      {chapterInfo?.translatedLanguage?.trim() !== 'en' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={panels === 2 || pageTranslations[page]}
                          onClick={() => handleUpload(page, 'translate')}
                          className={`flex gap-3 justify-start items-center w-48 p-3 rounded-full bg-gradient-to-br from-purple-800 to-purple-900 text-white shadow-xl hover:shadow-yellow-500/40 transition-all duration-300 ${pageTranslations[page] ? 'bg-yellow-400/60' : ''}`}
                        >
                          <motion.img
                            src="/translate.svg"
                            alt="translate"
                            className="w-10 h-10 bg-gray-50 rounded-full border border-gray-700 p-2 group-hover:border-yellow-500 transition-all duration-300"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          />
                          {pageTranslations[page] ? 'Translated' : 'Translate'}
                        </motion.button>
                      )}
                      <MemoizedTextToSpeech
                        page={page}
                        handleUpload={handleUpload}
                        ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])}
                        text={((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) && sortAndJoinOCR(fullOCRResult)}
                        layout={layout}
                      />
                    </>
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 rounded-full border-8 border-purple-500 border-t-transparent shadow-md"
                    />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div>
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
          {layout === 'vertical' && (
            <motion.button
              whileHover={{ scale: 1.05, width: 96 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-32 right-8 w-16 h-16 rounded-full border-4 border-purple-200 bg-black flex items-center justify-center text-white transition-all duration-300 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <motion.svg
                className="w-4 h-4 fill-white group-hover:-translate-y-12 transition-transform duration-200"
                viewBox="0 0 384 512"
              >
                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
              </motion.svg>
              <span className="absolute text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Top
              </span>
            </motion.button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showMessage && layout !== 'vertical' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute z-50 w-80 top-12 right-4 bg-gray-800/95 backdrop-blur-md text-white p-4 rounded-lg shadow-xl border border-purple-500"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowMessage(false)}
              className="absolute top-2 right-2 text-white bg-purple-600 hover:bg-purple-700 rounded-full p-1 px-2"
            >
              ✕
            </motion.button>
            <p className="text-sm">{sortAndJoinOCR(fullOCRResult) || 'No text available'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <MemoizedLoadingSpinner text="Loading Chapter..." />
  );
}