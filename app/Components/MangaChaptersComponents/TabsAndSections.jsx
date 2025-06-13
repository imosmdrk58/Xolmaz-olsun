import React, { useState, useRef, useEffect } from 'react'
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
import StableFlag from "../StableFlag";
import ChapterList from './ChapterList';
const MemoStableFlag = React.memo(StableFlag);
function TabsAndSections({ manga, chapters, handleChapterClick }) {
    const [sortOrder, setSortOrder] = useState('descending');

    const [activeTab, setActiveTab] = useState(0);

    const sortOptions = [
        { value: 'descending', label: 'Descending' },
        { value: 'ascending', label: 'Ascending' }
    ];

    const indexOptions = [
        { value: 'index', label: 'Index' },
        { value: 'chapter', label: 'Chapter' }
    ];

    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    // Calculate unique volumes from chapters
    const uniqueVolumes = [...new Set(chapters.map(ch => parseInt(ch.chapter.split('.')[0])))]
        .sort((a, b) => sortOrder === 'descending' ? b - a : a - b);


    const websiteNames = {
        al: "AniList",
        amz: "Amazon",
        bw: "BookWalker",
        ebj: "eBookJapan",
        mal: "MyAnimeList",
        mu: "MangaUpdates",
        ap: "Anime Planet",
        nu: "Novel Updates",
        kt: "MangaDex",
        raw: "Raw",
        cdj: "CDJapan",
        yen: "YEN Press",
    };

    const getFullLink = (key, link) =>
    ({
        mu: `https://www.mangaupdates.com/${link}`,
        mal: `https://myanimelist.net/manga/${link}`,
        bw: `https://bookwalker.jp/${link}`,
        ap: `https://www.anime-planet.com/${link}`,
        nu: `https://www.novelupdates.com/${link}`,
        kt: `https://mangadex.org/title/${manga.id}/${link}`,
        al: `https://anilist.co/manga/${link}`,
    }[key] || link);

    const tabs = [
        {
            label: `Chapters (${chapters.length})`,
            content: (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                            <Dropdown
                                options={sortOptions}
                                value={sortOrder}
                                onChange={(option) => setSortOrder(option.value)}
                                placeholder="Sort Order"
                            />
                            <Dropdown
                                options={indexOptions}
                                value="index"
                                onChange={() => { }}
                                placeholder="Index"
                            />
                        </div>
                    </div>

                    {uniqueVolumes.map(volume => {
                        const volumeChapters = chapters
                            .filter(ch => parseInt(ch.chapter.split('.')[0]) === volume)
                            .sort((a, b) => sortOrder === 'descending'
                                ? parseFloat(b.chapter) - parseFloat(a.chapter)
                                : parseFloat(a.chapter) - parseFloat(b.chapter));

                        return (
                            <div key={volume}>
                                <div className="flex justify-between items-center py-4">
                                    <h3 className="text-white text-lg">Volume {volume}</h3>
                                    <span className="text-white text-lg">
                                        Ch. {volumeChapters[volumeChapters.length - 1].chapter} - {volumeChapters[0].chapter}
                                    </span>
                                    <div className="flex items-center">
                                        <span className="text-white text-lg mr-1">{volumeChapters.length}</span>
                                        <Book className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {volumeChapters.map((chapter) => (
                                        <div
                                            key={chapter.id}
                                            className="bg-white/10 backdrop-blur-md rounded p-4 cursor-pointer"
                                            onClick={() => handleChapterClick(chapter.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <Flag className="w-5 h-5 mt-1 text-white" />
                                                    <div>
                                                        <h4 className="text-white font-bold text-sm mb-2">{chapter.title}</h4>
                                                        <div className="flex items-center space-x-4 text-sm">
                                                            <div className="flex items-center space-x-2">
                                                                <Users className="w-4 h-4 text-white" />
                                                                <span className="text-white">Unknown Translator</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <User className="w-4 h-4 text-white" />
                                                                <span className="text-[#2ecc71]">
                                                                    {manga.creatorName[0]?.attributes.username || 'Unknown'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Clock className="w-4 h-4 text-white" />
                                                                <span className="text-white">
                                                                    {new Date(chapter.publishAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="w-4 h-4 text-white" />
                                                        <span className="text-white text-sm">N/A</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-white" />
                                                        <span className="text-white text-xs">N/A</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
        },
        {
            label: `Comments (${manga.rating.comments.repliesCount})`,
            content: <div className="text-white">Comments section coming soon...</div>
        },
        {
            label: 'Art',
            content: <div className="text-white">Art gallery coming soon...</div>
        }
    ];

    const iconMap = {
        raw: <Book className="w-4 h-4 mr-2 text-white" />,
        bw: <BookOpen className="w-4 h-4 mr-2 text-white" />,
        amz: <ShoppingCart className="w-4 h-4 mr-2 text-white" />,
        ebj: <Book className="w-4 h-4 mr-2 text-white" />,
        cdj: <Library className="w-4 h-4 mr-2 text-white" />,
        mu: <BookMarked className="w-4 h-4 mr-2 text-white" />,
        ap: <Library className="w-4 h-4 mr-2 text-white" />,
        al: <Book className="w-4 h-4 mr-2 text-white" />,
        mal: <Library className="w-4 h-4 mr-2 text-white" />,
    };




    return (
        <div className='px-[70px] '>
            <div className="mb-8  w-fit">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabClick} />
            </div>
            <div className='flex  w-full flex-row gap-2'>
                <div className='w-4/12 flex flex-wrap gap-9  h-fit'>
                    <div className="flex flex-row gap-4 ">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2 min-w-1/3 w-full">Author</h3>
                            <div className=' bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-sm inline-flex items-center Capitalize rounded '>
                                {manga.authorName[0].attributes.name}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Artist</h3>
                            <div className=' bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-sm inline-flex items-center Capitalize rounded transition-colors duration-200'>
                                {manga.artistName[0].attributes.name}
                            </div>

                        </div>
                    </div>
                    <div className='h-fit'>
                        <h3 className="text-white font-bold text-lg mb-2">Genres</h3>
                        <div className=' flex gap-2'>
                            {manga.tags.find(group => group.group === 'genre')?.tags.map((genre, index) => (
                                <div key={index} className=' bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200'>
                                    {genre}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-fit">
                        <h3 className="text-white font-bold text-lg mb-2">Themes</h3>
                        <div className="flex flex-wrap gap-2">
                            {manga.tags.find(group => group.group === 'theme')?.tags.map((theme, index) => (
                                <div key={index} className=' bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200'>
                                    {theme}
                                </div>))}
                        </div>
                    </div>
                    <div className="h-fit">
                        <h3 className="text-white font-bold text-lg mb-2">Format</h3>
                        <div className="flex flex-wrap gap-2">
                            {manga.tags.find(group => group.group === 'format')?.tags.map((format, index) => (
                                <div key={index} className=' bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200'>
                                    {format}
                                </div>))}
                        </div>
                    </div>

                    <div className="">
                        <h3 className="text-white font-bold text-lg mb-2">Demographic</h3>
                        <div className=' bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200'>
                            {manga.MangaStoryType}
                        </div>
                    </div>

                    <div className="">
                        <h3 className="text-white font-bold text-lg mb-4">Read or Buy</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(manga.links).map(([key, link], index) => (
                                key !== 'kt' && (
                                    <a
                                        key={index}
                                        href={getFullLink(key, link)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 backdrop-blur-md rounded px-3 py-2 flex items-center"
                                    >
                                        {iconMap[key] || <Book className="w-4 h-4 mr-2 text-white" />}
                                        <span className="text-white text-xs">{websiteNames[key]}</span>
                                    </a>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="">
                        <h3 className="text-white font-bold text-lg mb-4">Track</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['mu', 'ap', 'al', 'mal'].map((key, index) => (
                                manga.links[key] && (
                                    <a
                                        key={index}
                                        href={getFullLink(key, manga.links[key])}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 backdrop-blur-md rounded px-3 py-2 flex items-center"
                                    >
                                        {iconMap[key] || <Book className="w-4 h-4 mr-2 text-white" />}
                                        <span className="text-white text-xs">{websiteNames[key]}</span>
                                    </a>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="">
                        <h3 className="text-white font-bold text-lg mb-4">Alternative Titles</h3>
                        <div className="space-y-2">
                            {manga.altTitles.map((title, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-800 transition-all duration-150"
                                >
                                    <MemoStableFlag
                                        code={Object.keys(title)[0] || "en"}
                                        className="w-6 sm:w-8 h-6 sm:h-8 rounded-md shadow-sm"
                                        alt="flag"
                                    />

                                    <span className="text-xs sm:text-sm line-clamp-1 font-medium text-gray-200">
                                        {Object.values(title)[0]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <ChapterList manga={manga} uniqueVolumes={uniqueVolumes} chapters={chapters} handleChapterClick={handleChapterClick} />

                {/* <div className="mt-4 w-9/12">
                    {tabs[activeTab] && tabs[activeTab].content}
                </div> */}
            </div>
        </div>
    )
}

export default TabsAndSections



const Dropdown = ({
    options = [],
    value,
    onChange,
    placeholder = 'Select option',
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        if (onChange) {
            onChange(option);
        }
        setIsOpen(false);
    };

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`bg-[#4f4f4f] text-white px-3 py-2 rounded text-sm font-small flex items-center justify-between w-full min-w-[100px] ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#666666] cursor-pointer'
                    }`}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <svg
                    className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#4f4f4f] border border-[#666666] rounded shadow-lg z-50">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className="w-full px-3 py-2 text-left text-white text-sm hover:bg-[#666666] first:rounded-t last:rounded-b"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};





const Tabs = ({ tabs, activeTab, onTabChange }) => {


    return (
        <div className="bg-white/10 backdrop-blur-md rounded">
            <div className="flex">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => onTabChange(index)}
                        className={`px-4 py-2 text-lg font-bold transition-colors duration-200 ${activeTab === index
                            ? 'bg-[#4f4f4f] text-white shadow-md rounded'
                            : 'text-[#808080] hover:text-white'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

        </div>
    );
};