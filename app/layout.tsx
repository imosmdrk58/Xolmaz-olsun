/* eslint-disable @next/next/no-sync-scripts */
import './globals.css';
import TopNavbar from './Components/TopNavbar';
import TanstackProvider from '@/components/providers/TanstackProvider';

export const metadata = {
  title: 'Manga Reader',
  description: 'Discover and read your favorite manga seamlessly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <TopNavbar />
          <main>{children}</main>
        </TanstackProvider>
      </body>
    </html>
  );
}
