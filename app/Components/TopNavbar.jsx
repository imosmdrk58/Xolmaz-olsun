"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky rounded-xl mt-6 justify-self-center  top-0 w-[95%] z-50 bg-gradient-to-b from-[#0a1130]/90 to-[#0d1845]/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,1)] shadow-purple-500/80 p-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
      <nav className="hidden md:flex space-x-6 text-white">
      <Link href="/browse" className="nav-link">Browse</Link>
          <Link href="/latest" className="nav-link">Latest</Link>
          <Link href="/popular" className="nav-link">Popular</Link>
          </nav>
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold font-serif text-white no-underline hover:text-purple-400 transition-colors duration-300">
            Manga Reader
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6 text-white">
         
          <Link href="/genres" className="nav-link">Genres</Link>
          <Link href="/search" className="nav-link">Search</Link>
          <Link href="/favorites" className="nav-link">Favorites</Link>
        </nav>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none hover:text-purple-400 transition-colors duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-[#0a1130]/95 to-[#0d1845]/95 backdrop-blur-md shadow-lg shadow-purple-500/20 text-white p-4`}>
        <Link href="/browse" className="mobile-nav-link" onClick={toggleMobileMenu}>Browse</Link>
        <Link href="/latest" className="mobile-nav-link" onClick={toggleMobileMenu}>Latest</Link>
        <Link href="/popular" className="mobile-nav-link" onClick={toggleMobileMenu}>Popular</Link>
        <Link href="/genres" className="mobile-nav-link" onClick={toggleMobileMenu}>Genres</Link>
        <Link href="/search" className="mobile-nav-link" onClick={toggleMobileMenu}>Search</Link>
        <Link href="/favorites" className="mobile-nav-link" onClick={toggleMobileMenu}>Favorites</Link>
      </div>
    </header>
  );
};

export default TopNavbar;