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
    <header className="fixed px-20 top-0  w-full  z-[9999] bg-gradient-to-b from-purple-900/30 to-gray-950/60 bg-opacity-90 backdrop-blur-md flex items-center justify-between h-20">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center">
        <a href="/" className="flex items-center mr-6">
          <div className="hidden md:block">
            <Image className="rounded-full" src="/logo.svg" width={60} height={60} alt="logo" />
          </div>
          <div className="block md:hidden">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
        </a>

        {/* Navigation Links - Spotify style */}
        <div className="hidden md:flex space-x-7 text-gray-400">
          <a href="#" className="font-bold text-white hover:text-white">Home</a>
          <a href="#" className="font-medium hover:text-white">Search</a>
          <a href="#" className="font-medium hover:text-white">Library</a>
        </div>
      </div>

      {/* Middle - Search Bar */}
      <div className="hidden lg:block flex-grow max-w-2xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Image alt='search' width={300} height={300} src={"./search.svg"} className=' w-4 h-4 brightness-200 opacity-60' />
          </div>
          <input
            type="text"
            className="bg-gray-800 block w-full pl-10 pr-3 py-2 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search Manga"
          />
        </div>
      </div>

      {/* Right - Controls and Profile */}
      <div className="flex items-center space-x-5">
        <button className="hidden sm:block text-sm font-medium bg-black border border-gray-700 hover:border-white text-white py-3 px-5 rounded-full">
          Upgrade
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <button className="bg-purple-500 p-0.5 rounded-full flex items-center justify-center focus:outline-none">
            <span className="sr-only">User menu</span>
            <Image src="/user.png" width={40} height={40} alt="user" className="bg-white p-1 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
