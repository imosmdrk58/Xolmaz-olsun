'use client';

import { Suspense, useEffect, useState } from 'react';
import Script from 'next/script';
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

  // Set isClient to true after mounting on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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
              {isClient && (window.location.pathname === '/' ? null : <TopNavBar />)}
              {isClient &&<div className="mt-20">{children}</div>}
            </Suspense>
          </MangaProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}