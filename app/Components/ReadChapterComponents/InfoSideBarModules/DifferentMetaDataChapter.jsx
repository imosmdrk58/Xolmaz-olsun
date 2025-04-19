import React, { memo, useCallback, useMemo,useState } from 'react';
import { langFullNames } from '@/app/constants/Flags';
const DifferentMetaDataChapter = memo(({
  activeSection,
  setActiveSection,
  mangaInfo,
  allChapters,
  InfoIcon,
  TagIcon,
  LinkIcon,
  DescriptionIcon,
  ChevronDownIcon,
  CreatorsIcon,
  BookIcon,
  LanguageIcon
}) => {
  // Memoized status styles
  const statusStyles = useMemo(() => ({
    ongoing: 'bg-green-900/30 text-green-400',
    completed: 'bg-blue-900/30 text-blue-400',
    default: 'bg-gray-800/50 text-gray-400'
  }), []);
    const [collapsedSections, setCollapsedSections] = useState({description:true,creators:true,languages:true,publication:true});
  const toggleSection = useCallback((section) => 
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] })), 
    []
  );
  console.log(collapsedSections)
  // Memoized sections for rendering
  const sections = useMemo(() => [
    { id: 'info', icon: InfoIcon },
    { id: 'tags', icon: TagIcon },
    { id: 'links', icon: LinkIcon }
  ], [InfoIcon, TagIcon, LinkIcon]);

  return (
    <>
      <div className="tracking-wider flex justify-between border-b mt-2 border-purple-700/20 mb-2">
        {sections.map(section => (
          <button
            key={section.id}
            className={`px-4 tracking-wider  py-2 text-sm font-medium flex items-center ${activeSection === section.id ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400 hover:text-purple-200'}`}
            onClick={() => setActiveSection(section.id)}
            aria-label={`Show ${section.id} section`}
          >
            <section.icon />
            <span className="tracking-wider ml-2 capitalize">{section.id}</span>
          </button>
        ))}
      </div>

      <div
        style={{ scrollbarWidth: 'none', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
        className="tracking-wider flex-1 overflow-y-auto mt-2  space-y-4"
      >
        {activeSection === 'info' && (
          <>
            <div className="tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="tracking-wider w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('description')}
              >
                <div className="tracking-wider flex items-center">
                  <DescriptionIcon />
                  <span className="tracking-wider ml-2">DESCRIPTION</span>
                </div>
                <ChevronDownIcon className={`w-4 tracking-wider  h-4 ${collapsedSections.description ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.description && (
                <p className="tracking-wider text-sm text-gray-300 leading-relaxed">{mangaInfo.description}</p>
              )}
            </div>
            <div className="tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="tracking-wider w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('creators')}
              >
                <div className="tracking-wider flex items-center">
                  <CreatorsIcon />
                  <span className="tracking-wider ml-2">CREATORS</span>
                </div>
                <ChevronDownIcon className={`w-4 tracking-wider h-4 ${collapsedSections.creators ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.creators && (
                <div className="tracking-wider space-y-2">
                  <div className="tracking-wider flex items-center">
                    <span className="tracking-wider text-xs font-medium text-gray-400 w-16">Author:</span>
                    <span className="tracking-wider text-sm text-white">
                      {mangaInfo.authorName.map(author => author.attributes?.name).join(', ') || 'Unknown'}
                    </span>
                  </div>
                  <div className="tracking-wider flex items-center">
                    <span className="tracking-wider text-xs font-medium text-gray-400 w-16">Artist:</span>
                    <span className="tracking-wider text-sm text-white">
                      {mangaInfo.artistName.map(artist => artist.attributes?.name).join(', ') || 'Unknown'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="tracking-wider w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('publication')}
              >
                <div className="tracking-wider flex items-center">
                  <BookIcon />
                  <span className="tracking-wider ml-2">PUBLICATION</span>
                </div>
                <ChevronDownIcon className={`w-4 tracking-wider h-4 ${collapsedSections.publication ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.publication && (
                <div className="tracking-wider space-y-2">
                  <div className="tracking-wider flex items-center">
                    <span className="tracking-wider text-xs font-medium text-gray-400 w-16">Status:</span>
                    <span className={`text-sm tracking-wider px-2 py-0.5 rounded ${statusStyles[mangaInfo.status] || statusStyles.default}`}>
                      {mangaInfo.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="tracking-wider flex items-center">
                    <span className="tracking-wider text-xs font-medium text-gray-400 w-16">Released:</span>
                    <span className="tracking-wider text-sm text-white">{mangaInfo.year}</span>
                  </div>
                  <div className="tracking-wider flex items-center">
                    <span className="tracking-wider text-xs font-medium text-gray-400 w-16">Chapters:</span>
                    <span className="tracking-wider text-sm text-white">{allChapters.length}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="tracking-wider w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('languages')}
              >
                <div className="tracking-wider flex items-center">
                  <LanguageIcon />
                  <span className="tracking-wider ml-2">LANGUAGES</span>
                </div>
                <ChevronDownIcon className={`w-4 tracking-wider h-4 ${collapsedSections.languages ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.languages && (
                <div className="tracking-wider flex flex-wrap gap-2">
                  {mangaInfo.availableTranslatedLanguages?.map((lang, index) => (
                    <span key={index} className="tracking-wider px-2 py-1 bg-gray-800/50 text-xs text-gray-300 rounded border border-purple-700/20">
                      {langFullNames[lang]}
                    </span>
                  )) || <span className="tracking-wider text-sm text-gray-400">No languages available</span>}
                </div>
              )}
            </div>
          </>
        )}
        {activeSection === 'tags' && (
          <div className="tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
            <div className="tracking-wider flex items-center text-xs text-purple-300 font-medium mb-3">
              <TagIcon />
              <span className="tracking-wider ml-2">CATEGORIES & TAGS</span>
            </div>
            <div className="tracking-wider flex flex-wrap gap-2">
              {mangaInfo.flatTags.map((tag, index) => (
                <span key={index} className="tracking-wider px-2 py-1 bg-purple-900/30 text-xs text-purple-300 rounded border border-purple-700/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'links' && (
          <div className="tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
            <div className="tracking-wider flex items-center text-xs text-purple-300 font-medium mb-3">
              <LinkIcon />
              <span className="tracking-wider ml-2">EXTERNAL LINKS</span>
            </div>
            <div className="tracking-wider space-y-2">
              {Object.entries(mangaInfo.links).map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tracking-wider flex items-center justify-between py-2 px-3 rounded-lg bg-gray-800/50 hover:bg-purple-900/30 transition-colors duration-300 border border-purple-700/20"
                >
                  <span className="tracking-wider text-sm text-gray-200">{key.toUpperCase()}</span>
                  <LinkIcon />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
});
DifferentMetaDataChapter.displayName = 'DifferentMetaDataChapter';

export default DifferentMetaDataChapter;