"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-[#0a1130] bg-opacity-60 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,1)] shadow-purple-500/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-1">

        {/* Logo - Left */}
        <Link href="/" className="flex items-center space-x-4 ">
          <div className="relative overflow-hidden rounded-full p-0.5 pr-0 pb-0">
            <Image
              src="/logo-2.png"
              alt="Logo"
              width={50}
              height={50}
              className="object-contain h-16 w-16 relative"
            />
            <div className="absolute inset-0 rounded-full shadow-inner shadow-purple-500/80"></div>
          </div>

          <span className="text-purple-300 tracking-wide text-2xl font-bold font-serif">Manga Reader</span>
        </Link>

        {/* Navigation Links - Center/Right */}
        <nav className="hidden md:flex space-x-6 text-white text-lg font-medium">
          <Link href="/browse" className="hover:text-yellow-400 transition">Browse</Link>
          <Link href="/latest" className="hover:text-yellow-400 transition">Latest</Link>
          <Link href="/popular" className="hover:text-yellow-400 transition">Popular</Link>
          <Link href="/genres" className="hover:text-yellow-400 transition">Genres</Link>
          <Link href="/search" className="hover:text-yellow-400 transition">Search</Link>
          <Link href="/favorites" className="hover:text-yellow-400 transition">Favorites</Link>
        </nav>

        {/* Mobile Menu Button - Right */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none hover:text-yellow-400 transition duration-300"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#0a1130] shadow-lg text-white p-4 space-y-3 text-center"
          >
            {["Browse", "Latest", "Popular", "Genres", "Search", "Favorites"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block py-2 text-lg hover:text-yellow-400 transition"
                onClick={toggleMobileMenu}
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopNavbar;
