import React, { Suspense } from 'react';
import Script from 'next/script';
import TanstackProvider from '@/app/providers/TanstackProvider';
import { MangaProvider } from '@/app/providers/MangaContext';
import LoadingSpinner from './Components/LoadingSpinner';
import './globals.css';
import TopNavbar from './Components/TopNavbar';
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            <TopNavbar />
             <div className='mt-20'>{children}</div> 
            </Suspense>
          </MangaProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}