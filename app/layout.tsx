/* eslint-disable @next/next/no-sync-scripts */
import './globals.css'; 
import TopNavbar from './Components/TopNavbar'; 

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
      <body className="bg-gray-100 text-black">
        <TopNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
