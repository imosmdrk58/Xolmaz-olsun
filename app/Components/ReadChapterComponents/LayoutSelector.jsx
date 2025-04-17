import React, { useCallback, useState, useEffect, useRef } from 'react';

const LayoutSelector = ({ layout, setLayout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelect = useCallback((value) => {
    setLayout(value);
    setIsOpen(false);
  }, [setLayout]);

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
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center transition-all justify-between gap-1 w-40 p-3 pr-1 text-gray-100 rounded-md bg-[#1a1a2e] shadow-md focus:outline-none duration-200 
          ${isOpen 
            ? 'border-b-4 border-purple-600 bg-opacity-20' 
            : 'hover:bg-[#25253a] shadow-[0_0_8px_rgba(0,0,0,0.2)] shadow-violet-500 bg-opacity-100'}`}
      >
        <span className="flex items-center gap-3">
          <img 
            src={layout === 'horizontal' ? "/horizontal.svg" : "/vertical.svg"} 
            alt={layout} 
            className="w-7 h-7 bg-purple-500 bg-opacity-30 p-1 rounded-lg"
          />
          <span className="font-medium">{layout.charAt(0).toUpperCase() + layout.slice(1)}</span>
        </span>
        <svg 
          className={`w-4 h-4 ml-1 text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
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
          className="absolute w-40 z-10 mb-2 max-h-56 overflow-auto rounded-md bg-[#1a1a2e] py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none bottom-full animate-fadeIn"
          role="listbox"
          tabIndex={-1}
        >
          <LayoutOption 
            icon="/horizontal.svg" 
            label="Horizontal" 
            value="horizontal"
            currentLayout={layout}
            onSelect={handleSelect}
          />
          <LayoutOption 
            icon="/vertical.svg" 
            label="Vertical" 
            value="vertical"
            currentLayout={layout}
            onSelect={handleSelect}
          />
        </ul>
      )}
    </div>
  );
};

const LayoutOption = ({ icon, label, value, currentLayout, onSelect }) => {
  const isSelected = currentLayout === value;
  
  return (
    <li
      className={`relative cursor-pointer py-2 px-3 text-gray-100 select-none transition-colors duration-150 ${
        isSelected ? 'bg-purple-900/30 text-white' : 'hover:bg-gray-800/50'
      }`}
      onClick={() => onSelect(value)}
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex items-center">
        <img src={icon} alt={label.toLowerCase()} className="w-6 h-6 mr-2" />
        <span className="block truncate">{label}</span>
        
        {isSelected && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-400">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    </li>
  );
};

export default LayoutSelector;