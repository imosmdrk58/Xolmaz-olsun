import { useCallback, useState } from 'react';

const LayoutSelector = ({ layout, setLayout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
        setIsOpen(!isOpen);
    });

    const handleSelect = useCallback((value) => {
        setLayout(value);
        setIsOpen(false);
    });

    return (
        <div className="relative">
            <button
                type="button"
                onClick={toggleDropdown}
                className={`flex items-center transition-all justify-between gap-1 w-40 p-3 pr-1 text-gray-100 rounded-md bg-[#1a1a2e] shadow-md focus:outline-none  duration-200 
                    ${isOpen ? ' border-b-4 border-purple-600 bg-opacity-20' : ' hover:bg-[#25253a] shadow-[0px_0px_5px_rgba(0,0,0,0.2)] shadow-violet-500  bg-opacity-100'}`}
            >
                <span className="flex items-center gap-3">
                    <img src={layout === 'horizontal' ? "/horizontal.svg" : "/vertical.svg"} alt={layout} className="w-7 h-7 bg-purple-500 bg-opacity-30 p-1 rounded-lg " />
                    <span>{layout.charAt(0).toUpperCase() + layout.slice(1)}</span>
                </span>
                <svg className="w-4 h-4 ml-1 text-gray-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <ul className="absolute w-40 z-10 mb-1 max-h-56  overflow-auto rounded-md bg-[#1a1a2e] py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden bottom-full">
                    <li
                        className="relative cursor-pointer py-2 pr-9 pl-3 text-gray-100 select-none"
                        onClick={() => handleSelect('horizontal')}
                    >
                        <div className="flex items-center">
                            <img src="/horizontal.svg" alt="horizontal" className="w-6 h-6 mr-2" />
                            <span className="block truncate">Horizontal</span>
                        </div>
                    </li>
                    <li
                        className="relative cursor-pointer py-2 pr-9 pl-3 text-gray-100 select-none"
                        onClick={() => handleSelect('vertical')}
                    >
                        <div className="flex items-center">
                            <img src="/vertical.svg" alt="vertical" className="w-6 h-6 mr-2" />
                            <span className="block truncate">Vertical</span>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default LayoutSelector;
