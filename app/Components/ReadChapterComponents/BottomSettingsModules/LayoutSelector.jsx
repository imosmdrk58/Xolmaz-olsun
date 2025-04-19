import Image from 'next/image';
import React, { useCallback, useState, useEffect, useRef } from 'react';

const layoutSelector = ({ layout, setLayout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (value) => {
      setLayout(value);
      setIsOpen(false);
    },
    [setLayout]
  );

  // Close dropdown when clicking outside
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
        className={`flex items-center justify-between w-36 px-3 py-4 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 shadow-md focus:outline-none transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] ${isOpen
          ? 'shadow-[0_0_15px_rgba(139,92,246,0.6)] bg-opacity-90'
          : 'hover:bg-opacity-95'
          }`}
      >
        <span className="flex items-center gap-2.5">
          <Image
            height={300}
            width={300}
            src={layout === 'horizontal' ? '/horizontal.svg' : '/vertical.svg'}
            alt={layout}
            className="w-5 h-5 tracking-wide text-white flex justify-center items-center rounded-md bg-violet-500/20"
          />
          <span className="capitalize tracking-wider mb-0.5">{layout}</span>
        </span>
        <svg
          className={`w-3 h-3 text-violet-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
            }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="absolute z-20 w-36 mt-2 rounded-lg bg-gradient-to-b from-[#1a1a2e] to-[#141426] border border-violet-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden animate-slideDown bottom-full"
          role="listbox"
          tabIndex={-1}
        >
          <LayoutOption
            icon="/horizontal.svg"
            label="horizontal"
            value="horizontal"
            currentlayout={layout}
            onSelect={handleSelect}
          />
          <LayoutOption
            icon="/vertical.svg"
            label="vertical"
            value="vertical"
            currentlayout={layout}
            onSelect={handleSelect}
          />
        </ul>
      )}
    </div>
  );
};

const LayoutOption = ({ icon, label, value, currentlayout, onSelect }) => {
  const isSelected = currentlayout === value;

  return (
    <li
      className={`flex items-center px-3 py-2 text-xs text-gray-100 cursor-pointer transition-all duration-200 ${isSelected
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
        className="w-5 h-5 tracking-wide mr-2.5 text-white flex justify-center items-center rounded-md bg-violet-500/20"
      />
      <span className="flex-1 capitalize tracking-wider">{label}</span>
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

export default layoutSelector;
