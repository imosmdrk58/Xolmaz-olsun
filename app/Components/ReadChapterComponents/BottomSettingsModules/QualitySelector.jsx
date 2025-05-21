import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useState, useEffect, useRef } from 'react';

const QualitySelector = ({ quality, setQuality }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (value) => {
      setQuality(value);
      setIsOpen(false);
    },
    [setQuality]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center justify-between w-32 sm:w-36 px-2 sm:px-3 py-3 sm:py-4 text-[10px] sm:text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 shadow-md focus:outline-none transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] ${isOpen
          ? 'shadow-[0_0_15px_rgba(139,92,246,0.6)] bg-opacity-90'
          : 'hover:bg-opacity-95'
          }`}
      >
        <span className="flex items-center gap-2 sm:gap-2.5">
          <Image
            height={300}
            width={300}
            src={quality === 'high' ? '/HQ.svg' : '/LQ.svg'}
            alt={quality}
            className="w-4 sm:w-5 h-4 sm:h-5 tracking-wide text-white flex justify-center items-center rounded-md bg-violet-500/20"
          />
          <span className="capitalize tracking-wider mb-0.5">{quality} Quality</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-violet-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          className="absolute z-20 w-32 sm:w-36 mt-1 sm:mt-2 rounded-lg bg-gradient-to-b from-[#1a1a2e] to-[#141426] border border-violet-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden animate-slideDown bottom-full left-0"
          role="listbox"
          tabIndex={-1}
        >
          <QualityOption
            icon="/HQ.svg"
            label="High"
            value="high"
            currentQuality={quality}
            onSelect={handleSelect}
          />
          <QualityOption
            icon="/LQ.svg"
            label="Low"
            value="low"
            currentQuality={quality}
            onSelect={handleSelect}
          />
        </ul>
      )}
    </div>
  );
};

const QualityOption = ({ icon, label, value, currentQuality, onSelect }) => {
  const isSelected = currentQuality === value;

  return (
    <li
      className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs text-gray-100 cursor-pointer transition-all duration-200 ${isSelected
        ? 'bg-violet-700/30 text-violet-300'
        : 'hover:bg-violet-800/20 hover:text-violet-200'
        }`}
      onClick={() => onSelect(value)}
      role="option"
      aria-selected={isSelected}
    >
      <Image
        height={300}
        width={300}
        src={icon}
        alt={label.toLowerCase()}
        className="w-4 sm:w-5 h-4 sm:h-5 tracking-wide mr-2 sm:mr-2.5 text-white flex justify-center items-center rounded-md bg-violet-500/20"
      />
      <span className="flex-1 capitalize tracking-wider">{label} Quality</span>
      {isSelected && (
        <svg
          className="w-3 h-3 text-violet-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </li>
  );
};

export default QualitySelector;