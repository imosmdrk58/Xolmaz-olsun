import React, { useState } from 'react';
import { langFullNames } from "../../../constants/Flags"
function FilterCustomDropDown({
  title,
  options = [],
  multiple = true,
  selectedValues = [],
  onSelectionChange,
  countLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // For checkbox selections
  const selectedCount = multiple ? selectedValues.length : (selectedValues ? 1 : 0);

  // Handle toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle reset
  // const handleReset = (e) => {
  //   e.stopPropagation();
  //   if (multiple) {
  //     onSelectionChange([]);
  //   } else {
  //     onSelectionChange("");
  //   }
  // };

  // Handle checkbox change
  const handleCheckboxChange = (value) => {
    onSelectionChange(selectedValues === value ? "" : value);
  };

  return (
    <div className="filter-group">
      <h3 className="font-medium text-purple-100 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
        {title}
      </h3>

      <div className="relative">
        <div
          className={`w-full p-3 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-lg text-purple-200 cursor-pointer transition-all duration-300 ${isOpen ? 'border-purple-600 shadow-lg shadow-purple-900/20' : ''}`}
          onClick={toggleDropdown}
        >
          <div className="flex items-center justify-between">

            <span className="text-sm line-clamp-1 ">{selectedCount == 0 ? countLabel : selectedValues.map((val, index) => <span key={index} className='mr-2 capitalize'>{countLabel == "Any Language" ? langFullNames[val] : val.charAt(0).toUpperCase() + val.slice(1)}</span>)}</span>
            <div className={`text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
            }}
            className="absolute z-10 w-full mt-2 bg-black/90 backdrop-blur-md border border-purple-800/50 rounded-lg overflow-hidden shadow-xl shadow-purple-900/30 transition-all duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-purple-800/30">
              <span className="text-sm text-purple-300">
                {`${selectedCount} Selected`}
              </span>

              {/* <button
                onClick={handleReset}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Reset
              </button> */}
            </div>

            {console.log(selectedValues)
            }
            <div className="max-h-48 overflow-y-auto custom-scrollbar p-2">
              {options.map((option) => (
                <label
                  key={option.label}
                  className="flex items-center gap-3 p-2 hover:bg-purple-900/20 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type={multiple ? "checkbox" : "radio"}
                    checked={multiple
                      ? selectedValues.includes(option.id)
                      : selectedValues === option.id
                    }
                    onChange={() => handleCheckboxChange(option.id)}
                    className="h-4 w-4 rounded-full appearance-none transition-colors
    checked:bg-purple-600  checked:border-purple-400
    bg-gray-600 border-purple-900/90 border-2
    focus:outline-none  "
                  />

                  <span className="text-sm font-medium text-purple-200">{option.label}</span>

                  {option.count !== undefined && (
                    <span className="text-xs text-purple-400 ml-auto">{option.count}</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterCustomDropDown;