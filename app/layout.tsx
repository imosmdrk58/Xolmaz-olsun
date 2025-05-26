'use client';

import { Suspense } from 'react';
import Script from 'next/script';
import TanstackProvider from '@/components/providers/TanstackProvider';
import LoadingSpinner from './Components/LoadingSpinner';
import TopNavBar from "./Components/TopNavbar";
import { MangaProvider } from '@/components/providers/MangaContext'; // Adjust the import path as needed
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <MangaProvider> {/* Add MangaProvider here */}
            <Suspense fallback={<LoadingSpinner text="Please Wait..." />}>
              <TopNavBar />
              <div className='md:mt-20'>{children}</div>
            </Suspense>
          </MangaProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}