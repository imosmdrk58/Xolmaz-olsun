"use client";
/* eslint-disable @next/next/no-sync-scripts */
import './globals.css';
import TopNavbar from './Components/TopNavbar';
import TanstackProvider from '@/components/providers/TanstackProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from "react";

// Dynamically import components
const Home = lazy(() => import("./page"));
const MangaChapters = lazy(() => import("./Core/MangaChapters"));
const MangaList = lazy(() => import("./Core/MangaList"));
const ReadChapter = lazy(() => import("./Core/ReadChapter"));
const NotFound = lazy(() => import("./Core/NotFound"));
export default function RootLayout() {
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head>
      <body
        style={{
          fontFamily: "'Poppins', sans-serif",
          lineHeight: "1.6",
          WebkitTextSizeAdjust: "100%",
          WebkitFontSmoothing: "antialiased",
          textRendering: "optimizeLegibility",
          MozOsxFontSmoothing: "grayscale",
          touchAction: "manipulation",
        }}
        className="bg-gray-900 text-white"
        >

        <TanstackProvider>
          <Suspense fallback={<div className="flex justify-center items-center w-full h-screen">
            <div className="text-center">
              <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
              <p className="text-lg font-semibold">Loading Mangas...</p>
            </div>
          </div>}>
            {isClient && ( // Only render Router on the client
              <Router>
                <TopNavbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/manga-list" element={<MangaList />} />
                  <Route path="/manga/:mangaId/chapters" element={<MangaChapters />} />
                  <Route path="/manga/:mangaId/chapter/:chapterId/read" element={<ReadChapter />} />
                  <Route path="*" element={<NotFound />} /> {/* Handle 404 */}
                </Routes>
              </Router>
            )}
          </Suspense>
        </TanstackProvider>
      </body>
    </html>
  );
}
