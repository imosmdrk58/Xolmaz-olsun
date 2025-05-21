import React, { useCallback, useState, useEffect, useRef } from 'react';
import { LayoutPanelTop, LayoutPanelLeft, Check, ChevronDown } from 'lucide-react';

const LayoutSelector = ({ layout, setLayout }) => {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const LayoutIcon = layout === 'horizontal' ? LayoutPanelTop : LayoutPanelLeft;

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center justify-between w-32 sm:w-36 px-2 sm:px-3 py-3 sm:py-4 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 shadow-md focus:outline-none transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] ${isOpen
            ? 'shadow-[0_0_15px_rgba(139,92,246,0.6)] bg-opacity-90'
            : 'hover:bg-opacity-95'
          }`}
      >
        <span className="flex items-center gap-2 sm:gap-2.5">
          <LayoutIcon
            className="w-4 sm:w-5 h-4 sm:h-5 font-extrabold border border-white text-white rounded-md bg-violet-500/20 p-0.5"
            aria-hidden="true"
          />
          <span className="capitalize tracking-wider mb-0.5">{layout}</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-violet-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          className="absolute z-20 w-32 sm:w-36 mt-1 sm:mt-2 rounded-lg bg-gradient-to-b from-[#1a1a2e] to-[#141426] border border-violet-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden animate-slideDown bottom-full left-0"
          role="listbox"
          tabIndex={-1}
        >
          <LayoutOption
            Icon={LayoutPanelTop}
            label="horizontal"
            value="horizontal"
            currentLayout={layout}
            onSelect={handleSelect}
          />
          <LayoutOption
            Icon={LayoutPanelLeft}
            label="vertical"
            value="vertical"
            currentLayout={layout}
            onSelect={handleSelect}
          />
        </ul>
      )}
    </div>
  );
};

const LayoutOption = ({ Icon, label, value, currentLayout, onSelect }) => {
  const isSelected = currentLayout === value;

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
      <Icon
        className="w-4 sm:w-5 h-4 sm:h-5 font-extrabold mr-2 sm:mr-2.5 border border-white text-white rounded-md bg-violet-500/20 p-0.5 sm:p-1"
        aria-hidden="true"
      />
      <span className="flex-1 capitalize tracking-wider">{label}</span>
      {isSelected && <Check className="w-3 h-3 text-violet-400" aria-hidden="true" />}
    </li>
  );
};

export default LayoutSelector;