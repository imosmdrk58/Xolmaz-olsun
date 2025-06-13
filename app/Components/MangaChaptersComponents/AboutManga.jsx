import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image"
import {
  Book,
  Play,
  Flag,
  Users,
  User,
  Clock,
  Eye,
  Star,
  BookmarkPlus,
  BookOpen,
  FlagTriangleRight,
  ShoppingCart,
  BookMarked,
  Library,
  Languages,
  List,
  UserPlus
} from 'lucide-react';

const MangaDetail = ({ manga, handleChapterClick, chapters }) => {

  const handleAddToLibrary = () => {
    alert('Added to library!');
  };

  const handleStartReading = () => {
    alert('Starting to read...');
  };


  return (
    <div className="min-h-full w-full">
      <div className="relative">
        <div
          className="absolute inset-x-0 top-0 h-[240px] sm:h-[350px] bg-cover"
          style={{ backgroundImage: `url('${manga.coverImageUrl}')` }}
        >
          <div className="absolute inset-0 h-[240px] sm:h-[350px] bg-black/40 backdrop-blur-sm z-10"></div>
        </div>
        <main className="relative px-10">
          <div className="relative z-10  p-8 pb-0">
            <div className="flex gap-8 mt-14">
              {/* Left Column - Manga Cover */}
              <div className="relative w-40 h-60 sm:w-48 sm:h-[295px] group select-none mx-auto sm:mx-0">
                <a href={manga.coverImageUrl} className="block relative w-full h-full">
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
                    <List className="text-white" size={20} />
                  </div>
                  <Image
                    className="w-full h-full rounded shadow-md transition-transform duration-200 group-hover:translate-y-0 object-cover"
                    src={manga.coverImageUrl}
                    alt="Cover image"
                    width={384}
                    height={295}
                    loading="lazy"
                  />
                </a>
              </div>

              {/* Right Column - Manga Details */}
              <div className="flex-1">
                <div className=' h-72 flex justify-between flex-col'>
                  <div className='flex flex-col'>
                    <h1 className="text-white text-7xl line-clamp-1 max-w-[80%] font-bold drop-shadow-lg">
                      {manga.title}
                    </h1>

                    <p className="text-white text-lg mb-6 line-clamp-1 max-w-[50%]">
                      {manga.altTitles.find(alt => alt.en)?.en || manga.altTitle}
                    </p>
                  </div>
                  <p className="text-white text-base mb-8">
                    {manga.authorName.map(author => author.attributes.name).join(', ')}
                  </p>
                </div>
                <div className="flex gap-4 mb-8">
                  <Button onClick={handleAddToLibrary} variant="primary" size="large">
                    Add To Library
                  </Button>
                  <Button
                    onClick={handleStartReading}
                    variant="secondary"
                    size="large"
                    Icon={BookOpen}
                  >
                    Start Reading
                  </Button>
                  <div className="flex items-center gap-6 ">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-orange-500" />
                      <span className="text-[#ff6740] text-base">{manga.rating.rating.bayesian.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <UserPlus className="w-4 h-4 mr-1 text-white" />
                      <span className="text-white text-base">{manga.rating.follows}</span>
                    </div>
                    <div className="flex items-center">
                      <Library className="w-4 h-4 mr-1 text-white" />
                      <span className="text-white text-base">{manga.rating.comments.repliesCount}</span>
                    </div>
                    <div className="flex items-center ml-2">
                      <Book className="w-4 h-4 mr-2 text-white" />
                      <span className="text-white text-xs font-bold uppercase">
                        Publication: {manga.year}, {manga.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Tag variant='primary'> {manga.contentRating}</Tag>
                  {manga.flatTags.map((tag, index) => (
                    <Tag key={index} variant={'secondary'}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 ">
              <p className="text-white text-base mb-4">
                {manga.altTitle}
              </p>
              <p className="text-white text-base leading-relaxed">
                {manga.description}
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MangaDetail;


const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  Icon = null,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';

  const variants = {
    primary: 'bg-[#ff6740] text-white hover:bg-[#e55a39] disabled:bg-gray-400',
    secondary: 'bg-[#4f4f4f] text-white hover:bg-[#666666] disabled:bg-gray-400',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400',
  };

  const sizes = {
    small: 'px-3 py-1 text-sm h-8',
    medium: 'px-4 py-2 text-base h-10',
    large: 'px-6 py-3 text-lg h-12',
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {Icon && <Icon alt="icon" className="w-6 h-6 mr-2" />}
      {children}
    </button>
  );
};


const Tag = ({
  children,
  variant = 'default',
  size = 'small',
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-bold uppercase rounded transition-colors duration-200';

  const variants = {
    primary: 'bg-[#ff6740] text-white',
    secondary: 'bg-[#2c2c2c] text-white',
    default: 'bg-[#2c2c2c] text-white',
  };

  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  };

  const tagClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`;

  return (
    <span
      onClick={onClick}
      className={tagClasses}
      {...props}
    >
      {children}
    </span>
  );
};
