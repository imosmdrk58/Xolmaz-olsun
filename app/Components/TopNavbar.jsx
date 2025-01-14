import React from 'react';

const TopNavbar = () => {
  return (
    <>
      <header className='w-full h-fit bg-gradient-to-b from-[#0a1130] to-[#0d1845] flex flex-row justify-around items-center bg-opacity-95  shadow-md shadow-purple-200/50 relative z-10'>
        <nav className="bg-transparent text-white p-4 w-full flex justify-center items-center">
          <h1 className="text-2xl font-bold text-white">Manga Reader</h1>
        </nav>
      </header>
    </>
  );
};

export default TopNavbar;
