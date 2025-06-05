// MangaList.js
'use client';
import React, { useCallback } from 'react';
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
    <div className="relative min-h-screen w-full  overflow-hidden">

      <div className="w-full shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black h-fit">
        <SliderComponent handleMangaClicked={handleMangaClicked} />
      </div>
      <div className="hidden md:block">
        <LatestActivityComments />
      </div>
      <div className="flex flex-col-reverse md:flex-row mt-6 md:mt-0">
        <div className="md:w-[70%]">
          <MangaCard handleMangaClicked={handleMangaClicked} />
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

export default React.memo(MangaList);