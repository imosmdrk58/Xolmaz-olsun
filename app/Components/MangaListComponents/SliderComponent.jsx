import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const SliderComponent = ({ processedRandomMangas }) => {
    const [active, setActive] = useState(0);
    const firstPosition = 0;
    const lastPosition = processedRandomMangas.length - 1;
    const interactionTimeoutRef = useRef(null);
    const autoPlayRef = useRef(null);

    const startAutoPlay = () => {
        return setInterval(() => {
            setActive((prevActive) => (prevActive + 1 > lastPosition ? 0 : prevActive + 1));
        }, 15000);
    };

    const stopAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
    };

    const restartAutoPlay = () => {
        stopAutoPlay();
        autoPlayRef.current = startAutoPlay();
    };

    useEffect(() => {
        autoPlayRef.current = startAutoPlay();
        return () => {
            clearInterval(autoPlayRef.current);
        };
    }, []);

    const setSlider = () => {
        const items = document.querySelectorAll('.list .manga');
        const dots = document.querySelectorAll('.indicators ul li');
        items.forEach((manga, index) => {
            if (index === active) manga.classList.add('active');
            else manga.classList.remove('active');
        });
        dots.forEach((dot, index) => {
            if (index === active) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    };

    const handleNext = () => {
        setActive((prevActive) => (prevActive + 1 > lastPosition ? 0 : prevActive + 1));
        setSlider();
        handleManualScroll();
    };

    const handlePrev = () => {
        setActive((prevActive) => (prevActive - 1 < firstPosition ? lastPosition : prevActive - 1));
        setSlider();
        handleManualScroll();
    };

    const handleDotClick = (index) => {
        setActive(index);
        setSlider();
        handleManualScroll();
    };

    const handleManualScroll = () => {
        stopAutoPlay();
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
        interactionTimeoutRef.current = setTimeout(restartAutoPlay, 5000);
    };

    return (
        <div className=" w-full overflow-x-hidden text-white font-sans">
            <section className="carousel h-[550px] relative flex justify-center items-center">
                <button
                    className="h-[70px] -mr-6 z-50 border-4 border-double border-orange-500 font-extrabold pb-2 w-[70px] flex justify-center items-center bg-white bg-opacity-55 text-black text-3xl rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-105"
                    onClick={handlePrev}
                >
                    &#8249;
                </button>
                <div className="list relative h-full w-full z-10 flex items-center">

                    {processedRandomMangas.map((manga, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundImage: `url(${processedRandomMangas[active]?.coverImageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            className={`manga my-10  shadow-[0_0_40px_rgba(0,0,0,1)] shadow-purple-500/40  rounded-lg overflow-hidden pl-16 absolute grid grid-cols-2 inset-0 transition-transform duration-700 ease-in-out ${active === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50 pointer-events-none"></div>
                            <div className="absolute w-full h-full backdrop-blur-lg bg-black bg-opacity-65"></div>
                            <div className="content relative z-20 flex flex-col justify-center gap-6 p-8">
                                <h2 className="text-4xl font-semibold text-white leading-snug">{manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title}</h2>
                                <p className="text-base text-gray-300 leading-relaxed">
                                    {manga.description.slice(0, 250)}
                                </p>
                                <ul className="flex flex-wrap gap-3">
                                    {manga.flatTags.slice(0, 4).map((tag, idx) => (
                                        <li
                                            key={idx}
                                            className="border border-white bg-transparent text-white px-4 py-2 text-sm font-medium"
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 flex gap-4">
                                    <a
                                        onClick={() => { handleMangaClicked(manga) }}
                                        className="px-6 cursor-pointer py-3 border-2 border-orange-500 bg-opacity-60 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-base font-medium"
                                    >
                                        Read Now
                                    </a>
                                    <a
                                        onClick={() => { handleMangaClicked(manga) }}
                                        className="px-6 cursor-pointer py-3 bg-white bg-opacity-80 hover:bg-gray-200 text-orange-600 rounded-md text-base font-medium border border-orange-500"
                                    >
                                        View Info
                                    </a>
                                </div>
                            </div>
                            <div className="w-full h-full overflow-hidden flex justify-center items-center">
                                <Image
                                    className="rounded w-[468px] border-[24px] border-white h-[660px] transform rotate-[15deg] transition-transform"
                                    src={manga.coverImageUrl}
                                    alt="Cover image"
                                    width={600}
                                    height={346}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="indicators z-30 absolute bottom-14 flex items-center justify-center w-full">
                    <ul className="flex gap-3">
                        {processedRandomMangas.map((_, index) => (
                            <li
                                key={index}
                                className={`w-4 h-4 rounded-full cursor-pointer ${active === index ? 'bg-orange-500' : 'bg-gray-500'}`}
                                onClick={() => handleDotClick(index)}
                            ></li>
                        ))}
                    </ul>
                </div>

                <button
                    className="h-[70px] -ml-6 z-50 border-4 border-double border-orange-500 font-extrabold pb-2 w-[70px] flex justify-center items-center bg-opacity-55 bg-white text-black text-3xl rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-105"
                    onClick={handleNext}
                >
                    &#8250;
                </button>
            </section>
        </div>
    );
};

export default SliderComponent;