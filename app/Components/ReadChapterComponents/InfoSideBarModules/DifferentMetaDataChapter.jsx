import React, { memo, useCallback, useMemo, useState } from 'react';
import { langFullNames } from '@/app/constants/Flags';
import {
  Info,
  Tag,
  Link,
  FileText,
  ChevronDown,
  User,
  BookOpen,
  Globe
} from 'lucide-react';

const DifferentMetaDataChapter = memo(({
  mangaInfo,
  allChapters
}) => {
  const [activeSection, setActiveSection] = useState('info');
  const statusStyles = useMemo(() => ({
    ongoing: 'bg-green-900/30 text-green-400',
    completed: 'bg-blue-900/30 text-blue-400',
    default: 'bg-gray-800/50 text-gray-400'
  }), []);

  const [collapsedSections, setCollapsedSections] = useState({ description: true, creators: true, languages: true, publication: true });

  const toggleSection = useCallback((section) =>
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] })),
    []
  );

  const sections = useMemo(() => [
    { id: 'info', icon: Info },
    { id: 'tags', icon: Tag },
    { id: 'links', icon: Link }
  ], []);

  return (
    <>
      <div className="md:tracking-wider flex justify-between border-b mt-1 md:mt-2 border-purple-700/20 mb-1 md:mb-2">
        {sections.map(section => (
          <button
            key={section.id}
            className={`px-2 md:px-4 md:tracking-wider py-1 md:py-2 text-[10px] md:text-sm font-medium flex items-center ${activeSection === section.id ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400 hover:text-purple-200'}`}
            onClick={() => setActiveSection(section.id)}
            aria-label={`Show ${section.id} section`}
          >
            <section.icon className="h-4 md:h-5 w-4 md:w-5" />
            <span className="md:tracking-wider ml-1 md:ml-2 capitalize">{section.id}</span>
          </button>
        ))}
      </div>

      <div
        style={{ scrollbarWidth: 'none', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
        className="md:tracking-wider flex-1 overflow-y-auto mt-1 md:mt-2 space-y-2 md:space-y-4"
      >
        {activeSection === 'info' && (
          <>
            <div className="md:tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-2 md:p-3">
              <button
                className="md:tracking-wider w-full flex items-center justify-between text-[10px] md:text-xs text-purple-300 font-medium mb-1 md:mb-2"
                onClick={() => toggleSection('description')}
              >
                <div className="md:tracking-wider flex items-center">
                  <FileText className="h-4 md:h-5 w-4 md:w-5" />
                  <span className="md:tracking-wider ml-1 md:ml-2">DESCRIPTION</span>
                </div>
                <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 ${collapsedSections.description ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.description && (
                <p className="md:tracking-wider text-[10px] md:text-sm text-gray-300 leading-relaxed">{mangaInfo.description}</p>
              )}
            </div>
            <div className="md:tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-2 md:p-3">
              <button
                className="md:tracking-wider w-full flex items-center justify-between text-[10px] md:text-xs text-purple-300 font-medium mb-1 md:mb-2"
                onClick={() => toggleSection('creators')}
              >
                <div className="md:tracking-wider flex items-center">
                  <User className="h-4 md:h-5 w-4 md:w-5" />
                  <span className="md:tracking-wider ml-1 md:ml-2">CREATORS</span>
                </div>
                <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 ${collapsedSections.creators ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.creators && (
                <div className="md:tracking-wider space-y-1 md:space-y-2">
                  <div className="md:tracking-wider flex items-center">
                    <span className="md:tracking-wider text-[10px] md:text-xs font-medium text-gray-400 w-12 md:w-16">Author:</span>
                    <span className="md:tracking-wider text-[10px] md:text-sm text-white">
                      {(typeof mangaInfo.authorName === "string") ? mangaInfo.authorName : mangaInfo.authorName?.map(author => author.attributes?.name).join(', ') || 'Unknown'}
                    </span>
                  </div>
                  <div className="md:tracking-wider flex items-center">
                    <span className="md:tracking-wider text-[10px] md:text-xs font-medium text-gray-400 w-12 md:w-16">Artist:</span>
                    <span className="md:tracking-wider text-[10px] md:text-sm text-white">
                      {(typeof mangaInfo.artistName === "string") ? mangaInfo.artistName : mangaInfo.artistName?.map(author => author.attributes?.name).join(', ') || 'Unknown'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="md:tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-2 md:p-3">
              <button
                className="md:tracking-wider w-full flex items-center justify-between text-[10px] md:text-xs text-purple-300 font-medium mb-1 md:mb-2"
                onClick={() => toggleSection('publication')}
              >
                <div className="md:tracking-wider flex items-center">
                  <BookOpen className="h-4 md:h-5 w-4 md:w-5" />
                  <span className="md:tracking-wider ml-1 md:ml-2">PUBLICATION</span>
                </div>
                <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 ${collapsedSections.publication ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.publication && (
                <div className="md:tracking-wider space-y-1 md:space-y-2">
                  <div className="md:tracking-wider flex items-center">
                    <span className="md:tracking-wider text-[10px] md:text-xs font-medium text-gray-400 w-12 md:w-16">Status:</span>
                    <span className={`text-[10px] md:text-sm md:tracking-wider px-1.5 md:px-2 py-0.5 rounded ${statusStyles[mangaInfo.status] || statusStyles.default}`}>
                      {mangaInfo.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="md:tracking-wider flex gap-1 items-center">
                    <span className="md:tracking-wider text-[10px] md:text-xs font-medium text-gray-400 w-12 md:w-16">Released:</span>
                    <span className="md:tracking-wider text-[10px] md:text-sm text-white">{mangaInfo.year}</span>
                  </div>
                  <div className="md:tracking-wider flex gap-1 items-center">
                    <span className="md:tracking-wider text-[10px] md:text-xs font-medium text-gray-400 w-12 md:w-16">Chapters:</span>
                    <span className="md:tracking-wider text-[10px] md:text-sm text-white">{allChapters.length}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="md:tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-2 md:p-3">
              <button
                className="md:tracking-wider w-full flex items-center justify-between text-[10px] md:text-xs text-purple-300 font-medium mb-1 md:mb-2"
                onClick={() => toggleSection('languages')}
              >
                <div className="md:tracking-wider flex items-center">
                  <Globe className="h-4 md:h-5 w-4 md:w-5" />
                  <span className="md:tracking-wider ml-1 md:ml-2">LANGUAGES</span>
                </div>
                <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 ${collapsedSections.languages ? 'rotate-180' : ''}`} />
              </button>
              {!collapsedSections.languages && (
                <div className="md:tracking-wider flex flex-wrap gap-1.5 md:gap-2">
                  {mangaInfo.availableTranslatedLanguages?.map((lang, index) => (
                    <span key={index} className="md:tracking-wider px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-800/50 text-[10px] md:text-xs text-gray-300 rounded border border-purple-700/20">
                      {langFullNames[lang]}
                    </span>
                  )) || <span className="md:tracking-wider text-[10px] md:text-sm text-gray-400">No languages available</span>}
                </div>
              )}
            </div>
          </>
        )}
        {activeSection === 'tags' && (
          <div className="md:tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-2 md:p-3">
            <div className="md:tracking-wider flex items-center text-[10px] md:text-xs text-purple-300 font-medium mb-2 md:mb-3">
              <Tag className="h-4 md:h-5 w-4 md:w-5" />
              <span className="md:tracking-wider ml-1 md:ml-2">CATEGORIES & TAGS</span>
            </div>
            <div className="md:tracking-wider flex flex-wrap gap-1.5 md:gap-2">
              {mangaInfo.flatTags.map((tag, index) => (
                <span key={index} className="md:tracking-wider px-1.5 md:px-2 py-0.5 md:py-1 bg-purple-900/30 text-[10px] md:text-xs text-purple-300 rounded border border-purple-700/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'links' && (
          <div className="md:tracking-wider bg-gray-800/50 rounded-lg border border-purple-700/20 p-2 md:p-3">
            <div className="md:tracking-wider flex items-center text-[10px] md:text-xs text-purple-300 font-medium mb-2 md:mb-3">
              <Link className="h-4 md:h-5 w-4 md:w-5" />
              <span className="md:tracking-wider ml-1 md:ml-2">EXTERNAL LINKS</span>
            </div>
            <div className="md:tracking-wider space-y-1.5 md:space-y-2">
              {Object.entries(mangaInfo.links).map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:tracking-wider flex items-center justify-between py-1.5 md:py-2 px-2 md:px-3 rounded-lg bg-gray-800/50 hover:bg-purple-900/30 transition-colors duration-300 border border-purple-700/20"
                >
                  <span className="md:tracking-wider text-[10px] md:text-sm text-gray-200">{key.toUpperCase()}</span>
                  <Link className="h-4 md:h-5 w-4 md:w-5" />
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