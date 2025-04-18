import React, { memo, useMemo } from 'react';
import { langFullNames } from '@/app/constants/Flags';
const DifferentMetaDataChapter = memo(({
  activeSection,
  setActiveSection,
  collapsedSections,
  toggleSection,
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

  // Memoized sections for rendering
  const sections = useMemo(() => [
    { id: 'info', icon: InfoIcon },
    { id: 'tags', icon: TagIcon },
    { id: 'links', icon: LinkIcon }
  ], [InfoIcon, TagIcon, LinkIcon]);

  return (
    <>
      <div className="flex border-b border-purple-700/20 mb-2">
        {sections.map(section => (
          <button
            key={section.id}
            className={`px-4 py-2 text-sm font-medium flex items-center ${activeSection === section.id ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400 hover:text-purple-200'}`}
            onClick={() => setActiveSection(section.id)}
            aria-label={`Show ${section.id} section`}
          >
            <section.icon />
            <span className="ml-2 capitalize">{section.id}</span>
          </button>
        ))}
      </div>

      <div
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
        className="flex-1 overflow-y-auto pr-2 space-y-4"
      >
        {activeSection === 'info' && (
          <>
            <div className="bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('description')}
              >
                <div className="flex items-center">
                  <DescriptionIcon />
                  <span className="ml-2">DESCRIPTION</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 ${collapsedSections.description ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.description && (
                <p className="text-sm text-gray-300 leading-relaxed">{mangaInfo.description}</p>
              )}
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('creators')}
              >
                <div className="flex items-center">
                  <CreatorsIcon />
                  <span className="ml-2">CREATORS</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 ${collapsedSections.creators ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.creators && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-400 w-16">Author:</span>
                    <span className="text-sm text-white">
                      {mangaInfo.authorName.map(author => author.attributes?.name).join(', ') || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-400 w-16">Artist:</span>
                    <span className="text-sm text-white">
                      {mangaInfo.artistName.map(artist => artist.attributes?.name).join(', ') || 'Unknown'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('publication')}
              >
                <div className="flex items-center">
                  <BookIcon />
                  <span className="ml-2">PUBLICATION</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 ${collapsedSections.publication ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.publication && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-400 w-16">Status:</span>
                    <span className={`text-sm px-2 py-0.5 rounded ${statusStyles[mangaInfo.status] || statusStyles.default}`}>
                      {mangaInfo.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-400 w-16">Released:</span>
                    <span className="text-sm text-white">{mangaInfo.year}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-400 w-16">Chapters:</span>
                    <span className="text-sm text-white">{allChapters.length}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
              <button
                className="w-full flex items-center justify-between text-xs text-purple-300 font-medium mb-2"
                onClick={() => toggleSection('languages')}
              >
                <div className="flex items-center">
                  <LanguageIcon />
                  <span className="ml-2">LANGUAGES</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 ${collapsedSections.languages ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.languages && (
                <div className="flex flex-wrap gap-2">
                  {mangaInfo.availableTranslatedLanguages?.map((lang, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-800/50 text-xs text-gray-300 rounded border border-purple-700/20">
                      {langFullNames[lang]}
                    </span>
                  )) || <span className="text-sm text-gray-400">No languages available</span>}
                </div>
              )}
            </div>
          </>
        )}
        {activeSection === 'tags' && (
          <div className="bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
            <div className="flex items-center text-xs text-purple-300 font-medium mb-3">
              <TagIcon />
              <span className="ml-2">CATEGORIES & TAGS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mangaInfo.flatTags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-purple-900/30 text-xs text-purple-300 rounded border border-purple-700/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'links' && (
          <div className="bg-gray-800/50 rounded-lg border border-purple-700/20 p-3">
            <div className="flex items-center text-xs text-purple-300 font-medium mb-3">
              <LinkIcon />
              <span className="ml-2">EXTERNAL LINKS</span>
            </div>
            <div className="space-y-2">
              {Object.entries(mangaInfo.links).map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-800/50 hover:bg-purple-900/30 transition-colors duration-300 border border-purple-700/20"
                >
                  <span className="text-sm text-gray-200">{key.toUpperCase()}</span>
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