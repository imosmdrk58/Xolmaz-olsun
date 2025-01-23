import React, { useState, useEffect,useRef } from 'react';
import Image from 'next/image';
const SliderComponent = ({ processedRandomMangas }) => {
    console.log(processedRandomMangas)
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
        const items = document.querySelectorAll('.list .item');
        const dots = document.querySelectorAll('.indicators ul li');
        items.forEach((item, index) => {
            if (index === active) item.classList.add('active');
            else item.classList.remove('active');
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
        <div className="bg-gray-900 w-full overflow-hidden text-white font-sans">
            <section
                className="carousel h-[400px] relative flex justify-center items-center"
            >
                <div className="list relative h-full w-full  z-10 flex items-center">
                    {processedRandomMangas.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundImage: `url(${processedRandomMangas[active]?.coverImageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            className={`item rounded-xl overflow-hidden pl-12 absolute grid grid-cols-2 inset-0 transition-transform duration-700 ease-in-out ${active === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                                }`}
                        >
                            <div className="absolute w-full h-full backdrop-blur-lg bg-black bg-opacity-65"></div>
                            <div className="content relative z-20 flex flex-col justify-center gap-4 p-6 rounded-lg">
                                <h2 className="text-3xl font-semibold text-white leading-snug">{item.title}</h2>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {item.description.slice(0, 250)}
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                    {item.flatTags.slice(0, 4).map((tag, idx) => (
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
                                        href={`/read/${item.slug}`}
                                        className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium"
                                    >
                                        Read Now
                                    </a>
                                    <a
                                        href={`/${item.slug}`}
                                        className="px-5 py-2 bg-white hover:bg-gray-200 text-orange-500 rounded-md text-sm font-medium border border-orange-500"
                                    >
                                        View Info
                                    </a>
                                </div>
                            </div>
                            <div className="w-full h-full overflow-hidden flex justify-center items-center">
                                <Image
                                    className="rounded w-[390px] border-[20px] border-white h-[550px] transform rotate-[15deg] transition-transform"
                                    src={item.coverImageUrl}
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
                    className="absolute z-50 font-extrabold right-28 pb-2 bottom-2 h-12 w-12 flex justify-center items-center bg-white text-black text-3xl rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handlePrev}
                >
                    &#8249;
                </button>
                <button
                    className="absolute z-50 font-extrabold right-12 pb-2 bottom-2 h-12 w-12 flex justify-center items-center bg-white text-black text-3xl rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleNext}
                >
                    &#8250;
                </button>


                <div className="indicators absolute bottom-6 flex items-center justify-center w-full">
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
