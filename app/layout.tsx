"use client";
import './globals.css';
import TopNavbar from './Components/TopNavbar';
import TanstackProvider from '@/components/providers/TanstackProvider';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import LoadingSpinner from './Components/LoadingSpinner';

// Dynamically import components
const Home = lazy(() => import("./page"));
const MangaChapters = lazy(() => import("./Core/MangaChapters"));
const MangaList = lazy(() => import("./Core/MangaList"));
const ReadChapter = lazy(() => import("./Core/ReadChapter"));
const NotFound = lazy(() => import("./Core/NotFound"));

// NavbarWrapper component to conditionally render the navbar
const NavbarWrapper: React.FC = () => {
  const location = useLocation();

  // Memoize the decision to render navbar
  const shouldRenderNavbar = useMemo(() => location.pathname !== '/', [location.pathname]);

  if (!shouldRenderNavbar) {
    return null;
  }

  return <TopNavbar />;
};

// Placeholder component for server-side rendering
const ClientOnlyRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen" />; // Placeholder to match server HTML
  }

  return <>{children}</>;
};

export default function RootLayout() {
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize the Router and Routes to prevent unnecessary re-renders
  const renderRouter = useMemo(() => {
    if (!isClient) {
      return <div className="min-h-screen" />; // Server-side placeholder
    }

    return (
      <ClientOnlyRouter>
        <Router>
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
      </ClientOnlyRouter>
    );
  }, [isClient]);

  return (
    <html lang="en">
      <head>
        {/* Use defer to ensure script loads after HTML but doesn't block parsing */}
      <script src="https://unpkg.com/react-scan/dist/auto.global.js" defer={true} />
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
        className="bg-[#070920] text-white"
      >
        <TanstackProvider>
          <Suspense fallback={<LoadingSpinner text='Please Wait...' />}>
            {renderRouter}
          </Suspense>
        </TanstackProvider>
      </body>
    </html>
  );
}