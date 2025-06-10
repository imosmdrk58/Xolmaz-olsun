'use client';

import React, { Suspense, useEffect, useState,memo } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation'; // Import usePathname
import TanstackProvider from '@/app/providers/TanstackProvider';
import LoadingSpinner from './Components/LoadingSpinner';
import TopNavBar from './Components/TopNavbar';
import { MangaProvider } from '@/app/providers/MangaContext';
import './globals.css';
import { ArrowUp, ChevronUp } from 'lucide-react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const pathname = usePathname(); // Get current pathname
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Update showNavbar based on the current pathname
  useEffect(() => {
    setIsClient(true);
    setShowNavbar(pathname !== '/'); // Show navbar for all routes except '/'
  }, [pathname]); // Re-run when pathname changes

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        style={{
          fontFamily: "'Poppins', sans-serif",
          lineHeight: '1.6',
          WebkitTextSizeAdjust: '100%',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
          MozOsxFontSmoothing: 'grayscale',
          touchAction: 'manipulation',
        }}
        className="bg-[#070920] text-white"
      >
        <TanstackProvider>
          <MangaProvider>
            <Suspense fallback={<LoadingSpinner text="Please Wait..." />}>
              {isClient && showNavbar && <TopNavBar />} {/* Simplified conditional rendering */}
              {isClient && (
                <div className="mt-20 text-white bg-black/50">
                  <div className="fixed inset-0 pointer-events-none -z-10">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
                  </div>
                  {children}
                  {/* Scroll to Top Button */}
                  {showScrollTop && (
                    <button
                      className="tracking-wider z-50 cursor-pointer fixed bottom-4 right-8 w-16 h-16 rounded-full border-4 border-violet-200 bg-black flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-24 group/button overflow-hidden active:scale-90"
                      onClick={scrollToTop}
                    >
                      <ArrowUp className="tracking-wider w-5 fill-white delay-50 duration-200 group-hover/button:-translate-y-12" />
                      <span className="tracking-wider absolute text-white text-xs opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                        Top
                      </span>
                    </button>

                  )}
                </div>
              )}
            </Suspense>
          </MangaProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}