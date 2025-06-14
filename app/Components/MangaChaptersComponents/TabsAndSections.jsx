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
import CommentsOnManga from './CommentsOnManga';
const MemoStableFlag = React.memo(StableFlag);
function TabsAndSections({ manga, chapters, handleChapterClick }) {
    const [sortOrder, setSortOrder] = useState('descending');

    const [activeTab, setActiveTab] = useState(0);

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
            content: <ChapterList manga={manga} uniqueVolumes={uniqueVolumes} chapters={chapters} handleChapterClick={handleChapterClick} />

        },
        {
            label: `Comments (${manga.rating.comments.repliesCount})`,
            content: <CommentsOnManga manga={manga} />
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
                <div className='w-5/12 flex flex-wrap gap-9  h-fit'>
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
                        {manga.tags.find(group => group.group === 'format')?.tags.length > 0 && <h3 className="text-white font-bold text-lg mb-2">Format</h3>}
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
                <div className='w-full -mt-6 ml-5'>
                    {tabs[activeTab] && tabs[activeTab].content}
                </div>
            </div>
        </div>
    )
}

export default TabsAndSections




const Tabs = ({ tabs, activeTab, onTabChange }) => {


    return (
        <div className="bg-white/10 backdrop-blur-md rounded">
            <div className="flex">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => onTabChange(index)}
                        className={`px-4 py-2 text-base font-bold transition-colors duration-200 ${activeTab === index
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