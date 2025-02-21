"use client"
/* eslint-disable @next/next/no-sync-scripts */
import './globals.css';
import TopNavbar from './Components/TopNavbar';
import TanstackProvider from '@/components/providers/TanstackProvider';
import { BrowserRouter as Router,Routes, Route  } from 'react-router-dom';
import Home from "./page"
import MangaChapters from "./Core/MangaChapters"
import MangaList from "./Core/MangaList"
import ReadChapter from "./Core/ReadChapter"

export default function RootLayout() {
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
          <Router>
            <TopNavbar />
            <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/manga-list" element={<MangaList />} />
      <Route path="/manga/:mangaId/chapters" element={<MangaChapters />} />
      <Route path="/manga/:mangaId/chapter/:chapterId/read" element={<ReadChapter />} />
    </Routes>
          </Router>
        </TanstackProvider>
      </body>
    </html>
  );
}
