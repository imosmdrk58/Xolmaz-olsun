"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

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
            <Search className=' w-4 h-4 brightness-200 opacity-60' />
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
