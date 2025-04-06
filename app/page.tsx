/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import React from 'react';

// Define types for the components
interface Feature {
  title: string;
  description: string;
}

const ToonGodHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Custom debounce function with TypeScript typing
  function debounce<Func extends (...args: any[]) => any>(func: Func, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(this: any, ...args: Parameters<Func>) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Debounced scroll handler
  const handleScroll = useCallback(
    debounce(() => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition <= 500); // Invert logic for clarity
    }, 50), // 100ms debounce delay
    [] // No dependencies, as debounce handles the function recreation
  );

  // Set up scroll listener with cleanup
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const topSearches: string[] = [
    "Secret className", "Stepmother Friends", "Boarding Diary",
    "My Kingdom", "Touch to Unlock", "Queen Bee",
    "Springtime for Blossom", "Is there an Empty Room?",
    "My Stepmom", "My Aunt", "Childhood Friends",
    "Boss in School", "Fitness", "One's In-Laws Virgins"
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div 
      style={{
        lineHeight: "1.5",
        WebkitTextSizeAdjust: "100%",
        fontFamily: "system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        MozOsxFontSmoothing: "grayscale",
        touchAction: "manipulation",
        backgroundImage: "radial-gradient(#2d2d2d 2px, transparent 0), radial-gradient(#373636 2px, transparent 0)",
        backgroundPosition: "0 0, 25px 25px",
        backgroundSize: "50px 50px",
      }}
      className="bg-gray-900 text-gray-100 min-h-screen"
    >
      <div className={`w-full ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity flex justify-center items-center h-screen duration-300 bg-gradient-to-b from-purple-900/30 to-gray-900 pt-8 pb-12`}>
        <div className="container mx-auto px-4 py-6">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Link href="/home" className="inline-block">
              <Image
                src="/logo.svg" 
                width={260}
                height={260}
                alt="AI_Manga_Reader"
                className="h-40 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search manga..."
                className="w-full px-4 py-4 bg-gray-800 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-5"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                className="absolute right-2 top-2 brightness-200 bg-purple-600 hover:bg-purple-700 transition duration-200 rounded-lg px-4 py-2"
              >
                Search
              </button>
            </form>
          </div>

          {/* Top Searches */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center">
              <span className="text-gray-400 mr-2 mb-2">Top search:</span>
              {topSearches.map((term, index) => (
                <Link
                  key={index}
                  href={`/search?query=${encodeURIComponent(term)}`}
                  className="bg-gray-800 text-sm rounded-md px-3 py-2 m-1 hover:bg-opacity-45 hover:bg-purple-800 transition duration-200"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <Link
              href="/manga-list"
              style={{ background: "linear-gradient(#3b235a, #24143f)" }}
              className="relative brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 group"
            >
              <span
                style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out brightness-150 group-hover:h-full"
              ></span>
              <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                <svg className="w-5 h-5 font-extrabold text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                <svg className="w-5 h-5 font-extrabold text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Go To Homepage</span>
            </Link>
          </div>
        </div>
      </div>

      <LandingContent />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ToonGodHeader);

const LandingContent: React.FC = () => {
  const features: Feature[] = [
    { title: "Free of charge", description: "Access all content without spending a penny" },
    { title: "Safe to use", description: "Secure browsing with no risk to your device" },
    { title: "Various genres", description: "Find manga from every genre and category" },
    { title: "High-quality scans", description: "Crystal clear images for the best reading experience" },
    { title: "Anti-overload server", description: "Fast loading times even during peak hours" },
    { title: "Fast updates", description: "Get the latest chapters as soon as they're released" },
    { title: "Zero ads & pop-ups", description: "Enjoy an uninterrupted reading experience" },
    { title: "Global access", description: "Read from anywhere without restrictions" },
    { title: "User-friendly interface", description: "Easy navigation and intuitive design" },
    { title: "Social sharing", description: "Share your favorite manga with friends" },
    { title: "Cross-device sync", description: "Continue reading across all your devices" },
    { title: "Unlimited reading", description: "No caps or limits on how much you can read" }
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <main className="max-w-4xl mx-auto px-6 py-16 -mt-10">
        {/* Introduction */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-violet-400">Manga for Everyone</h2>
          <div className="text-lg space-y-4">
            <p>
              {`Searching for a place to read manga online without breaking the bank? Whether you're looking to save on subscription costs or need a safer alternative to your current reading site, AI Manga Reader is your solution.`}
            </p>
            <p>
              {`We believe manga should be accessible to all fans, regardless of budget. That's why we've created a platform that's completely free, safe, and easy to use.`}
            </p>
          </div>
        </div>

        {/* Reading Guide */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-violet-400">How To Read Manga</h2>
          <div className="space-y-4">
            <p>
              {`New to manga? Don't worry! All our titles are available in English for your convenience. `}
            </p>
            <p>
              Unlike traditional western comics, Japanese manga is read right-to-left. Start with the frame in the upper right corner and end at the bottom left. We preserve this authentic reading style to give you the true manga experience.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-violet-400">What Is AI Manga Reader?</h2>
          <p className="mb-6">
            {`We're an ad-free platform offering thousands of manga titles across all genres. Our database is constantly growing, and we provide premium features at no cost.`}
          </p>
          <h3 className="text-xl font-semibold mb-4 text-violet-400">Our Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition duration-300">
                <h4 className="font-medium text-violet-400 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-violet-400">Safe & Secure Reading</h2>
          <div className="space-y-4">
            <p>
              Unlike most free manga sites filled with intrusive ads and pop-ups, AI Manga Reader is completely ad-free. We prioritize your security and privacy.
            </p>
            <p>
              With no registration required, you can start reading immediately without sharing any personal information. Your data stays private, and your devices remain protected.
            </p>
            <p className="text-lg font-semibold text-violet-400 mt-6">
              The safest manga reading experience available online — period.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">About Us</h4>
              <p className="text-gray-300">
                AI Manga Reader is dedicated to bringing free, high-quality manga to readers around the world.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/manga-list" className="hover:text-violet-400 transition duration-200">Browse Manga</Link></li>
                <li><Link href="/completed" className="hover:text-violet-400 transition duration-200">Completed Series</Link></li>
                <li><Link href="/genres" className="hover:text-violet-400 transition duration-200">Genres</Link></li>
                <li><Link href="/latest" className="hover:text-violet-400 transition duration-200">Latest Updates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/terms" className="hover:text-violet-400 transition duration-200">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-violet-400 transition duration-200">Privacy Policy</Link></li>
                <li><Link href="/dmca" className="hover:text-violet-400 transition duration-200">DMCA</Link></li>
                <li><Link href="/contact" className="hover:text-violet-400 transition duration-200">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="text-center border-t border-gray-700 pt-6 text-gray-400 text-sm">
            <p className="mb-2">
              AI Manga Reader does not store any files on our server, we only link to media hosted on third-party services.
            </p>
            <p>© AI Manga Reader {new Date().getFullYear()} - All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};