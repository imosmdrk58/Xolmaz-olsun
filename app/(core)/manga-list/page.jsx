// MangaList.js
'use client';
import {useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useManga } from '../../providers/MangaContext';
import MangaReadHistory from '../../Components/MangaListComponents/MangaReadHistory';
import LatestActivityComments from '../../Components/MangaListComponents/LatestActivityComments';
import MangaCard from '../../Components/MangaListComponents/MangaCard';
import AsideComponent from '../../Components/MangaListComponents/AsideComponent';
import SliderComponent from '../../Components/MangaListComponents/SliderComponent';

const MangaList = () => {
  const router = useRouter();
  const { setSelectedManga } = useManga();
  const handleMangaClicked = useCallback((manga) => {
    setSelectedManga(manga);
    router.push(`/manga/${manga.id}/chapters`);
  }, [router, setSelectedManga]);
  
  return (
    <div className="relative bg-black/50 min-h-screen w-full text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
      </div>
      <div className="w-full shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black h-fit">
        <SliderComponent handleMangaClicked={handleMangaClicked} />
      </div>
      <div className="hidden md:block">
        <LatestActivityComments />
      </div>
      <div className="flex flex-col-reverse md:flex-row mt-6 md:mt-0">
        <div className="md:w-[70%]">
          <MangaCard handleMangaClicked={handleMangaClicked}/>
        </div>
        <div className="md:w-[30%]">
          <MangaReadHistory />
          <AsideComponent handleMangaClicked={handleMangaClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default MangaList;