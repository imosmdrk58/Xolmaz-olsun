import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
const SliderComponent = ({ processedRandomMangas }) => {
    const [active, setActive] = useState(0);
    const firstPosition = 0;
    const lastPosition = processedRandomMangas.length - 1;
    const interactionTimeoutRef = useRef(null); // Ref to track the timeout for resetting user interaction
    const autoPlayRef = useRef(null); // Ref to track the auto-play interval
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
        autoPlayRef.current = startAutoPlay(); // Start auto-play when the component mounts
        return () => {
            clearInterval(autoPlayRef.current); // Clean up on component unmount
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
        stopAutoPlay(); // Stop the auto-play on manual interaction
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current); // Clear any existing timeout
        }
        interactionTimeoutRef.current = setTimeout(restartAutoPlay, 5000); // Restart auto-play after 5 seconds
    };

    return (
        <div className="bg-gray-900 rounded-[50px] shadow-[0_0_15px_rgba(0,0,0,1)] shadow-slate-400 w-full overflow-hidden text-white font-sans">
            <section
                className="carousel h-[400px] relative flex justify-center items-center"
            >
                <div className="list relative  h-full w-full  z-10 flex items-center">
                    {processedRandomMangas.map((manga, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundImage: `url(${processedRandomMangas[active]?.coverImageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            className={`manga  overflow-hidden pl-12 absolute grid grid-cols-2 inset-0 transition-transform duration-700 ease-in-out ${active === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                                }`}
                        >
                            <div className="absolute w-full h-full backdrop-blur-lg bg-black bg-opacity-65"></div>
                            <div className="content relative z-20 flex flex-col justify-center gap-4 p-6 rounded-lg">
                                <h2 className="text-3xl font-semibold text-white leading-snug">{manga.title}</h2>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {manga.description.slice(0, 250)}
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                    {manga.flatTags.slice(0, 4).map((tag, idx) => (
                                        <li
                                            key={idx}
                                            className="border border-white bg-transparent text-white px-3 py-1 rounded text-xs font-medium"
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 flex gap-3">
                                    <a
                                        onClick={() => { handleMangaClicked(manga) }}
                                        className="px-5 cursor-pointer py-2 border-2 border-orange-500 bg-opacity-60 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium"
                                    >
                                        Read Now
                                    </a>
                                    <a
                                        onClick={() => { handleMangaClicked(manga) }}
                                        className="px-5 cursor-pointer py-2 bg-white  bg-opacity-80 hover:bg-gray-200 text-orange-600 rounded-md text-sm font-medium border border-orange-500"
                                    >
                                        View Info
                                    </a>
                                </div>
                            </div>
                            <div className="w-full h-full overflow-hidden flex justify-center items-center">
                                <Image
                                    className="rounded w-[390px] border-[20px] border-white h-[550px] transform rotate-[15deg] transition-transform"
                                    src={manga.coverImageUrl}
                                    alt="Cover image"
                                    width={500}
                                    height={288}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="absolute  border-4 border-double border-orange-500 z-50 font-extrabold right-28 pb-2 bottom-4 h-14 w-14 flex justify-center items-center bg-white text-black text-3xl rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-105 "
                    onClick={handlePrev}
                >
                    &#8249;
                </button>
                <button
                    className="absolute z-50 border-4 border-double border-orange-500 font-extrabold right-12 pb-2 bottom-4 h-14 w-14 flex justify-center items-center bg-white text-black text-3xl rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-105 "
                    onClick={handleNext}
                >
                    &#8250;
                </button>


                <div className="indicators z-30 absolute bottom-6 flex items-center justify-center w-full">
                    <ul className="flex gap-2">
                        {processedRandomMangas.map((_, index) => (
                            <li
                                key={index}
                                className={`w-3 h-3 rounded-full cursor-pointer ${active === index ? 'bg-orange-500' : 'bg-gray-500'
                                    }`}
                                onClick={() => handleDotClick(index)}
                            ></li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>


    );
};

export default SliderComponent;
