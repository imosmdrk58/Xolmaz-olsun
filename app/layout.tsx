"use client";
/* eslint-disable @next/next/no-sync-scripts */
import './globals.css';
import TopNavbar from './Components/TopNavbar';
import TanstackProvider from '@/components/providers/TanstackProvider';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from "react";
import LoadingSpinner from './Components/LoadingSpinner';

// Dynamically import components
const Home = lazy(() => import("./page"));
const MangaChapters = lazy(() => import("./Core/MangaChapters"));
const MangaList = lazy(() => import("./Core/MangaList"));
const ReadChapter = lazy(() => import("./Core/ReadChapter"));
const NotFound = lazy(() => import("./Core/NotFound"));

// NavbarWrapper component to conditionally render the navbar
const NavbarWrapper = () => {
  const location = useLocation();
  // Don't show navbar on home page
  if (location.pathname === '/') {
    return null;
  }
  return <TopNavbar />;
};

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
        className="bg-[#070920]  text-white"
      >
        <TanstackProvider>
          <Suspense fallback={
            <LoadingSpinner text='Please Wait...'/>
          }>
            {isClient && ( // Only render Router on the client
              <Router>
                {/* NavbarWrapper will conditionally render the navbar */}
                <NavbarWrapper />
                <div className='mt-20'>
                <Routes>
                  <Route path="/" element={<div className='-mt-20'><Home /></div>} />
                  <Route path="/manga-list" element={<MangaList />} />
                  <Route path="/manga/:mangaId/chapters" element={<MangaChapters />} />
                  <Route path="/manga/:mangaId/chapter/:chapterId/read" element={<ReadChapter />} />
                  <Route path="*" element={<NotFound />} /> {/* Handle 404 */}
                </Routes>
                </div>
              </Router>
            )}
          </Suspense>
        </TanstackProvider>
      </body>
    </html>
  );
}