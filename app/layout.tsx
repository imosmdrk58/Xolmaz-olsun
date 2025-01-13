import './globals.css'; // Import your Tailwind CSS or other global styles
import TopNavbar from './Components/TopNavbar'; // Adjust the path based on your folder structure

export const metadata = {
  title: 'Manga Reader',
  description: 'Discover and read your favorite manga seamlessly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-black">
        <TopNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
