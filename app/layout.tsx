'use client';

import { Suspense, useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation'; // Import usePathname
import TanstackProvider from '@/app/providers/TanstackProvider';
import LoadingSpinner from './Components/LoadingSpinner';
import TopNavBar from './Components/TopNavbar';
import { MangaProvider } from '@/app/providers/MangaContext';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const pathname = usePathname(); // Get current pathname

  // Update showNavbar based on the current pathname
  useEffect(() => {
    setIsClient(true);
    setShowNavbar(pathname !== '/'); // Show navbar for all routes except '/'
  }, [pathname]); // Re-run when pathname changes

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
                </div>
              )}
            </Suspense>
          </MangaProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}