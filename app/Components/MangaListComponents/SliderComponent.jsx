"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Flag from "react-world-flags";

const langToCountry = { ja: "JP", ms: "MY", ko: "KR", en: "US", zh: "CN" };

const SliderComponent = ({ processedRandomMangas, handleMangaClicked }) => {
    const [visibleMangas, setVisibleMangas] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const autoPlayRef = useRef(null);
    useEffect(() => {
        setVisibleMangas(processedRandomMangas.slice(0, 5));
        autoPlayRef.current = setInterval(handleNext, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [processedRandomMangas]);

    const handleNext = () => {
        setVisibleMangas((prev) => {
            const nextIndex = (processedRandomMangas.indexOf(prev[4]) + 1) % processedRandomMangas.length;
            return [...prev.slice(1), processedRandomMangas[nextIndex]];
        });
    };

    const handlePrev = () => {
        setVisibleMangas((prev) => {
            const prevIndex = (processedRandomMangas.indexOf(prev[0]) - 1 + processedRandomMangas.length) % processedRandomMangas.length;
            return [processedRandomMangas[prevIndex], ...prev.slice(0, 4)];
        });
    };

    return (
        <div className="w-full overflow-hidden text-white font-sans bg-black/20 pb-10 pt-7">
            <div className="mx-28 pb-7 text-2xl font-bold text-purple-200 tracking-wide uppercase ">
                <h1 className=" border-b-4 border-purple-900 w-fit pb-2">Randomized Recomendation</h1>
            </div>

            <section className="carousel flex justify-center w-full items-center relative gap-4">
                <span
                    onClick={() => handlePrev()}
                    className={`relative cursor-pointer brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-5 rounded-xl overflow-hidden
                                      before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                                    `}
                    style={{
                        background: "linear-gradient(#3b235a, #24143f)",
                    }}
                >
                    <Image className=" brightness-200" src="/previous.svg" alt="prev" width={20} height={20} />
                </span>
                <div className="list flex gap-2 items-center overflow-hidden">
                    {visibleMangas.map((manga, index) => (
                        <div key={index} className=" relative">
                            <div className=" absolute z-10 [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)] w-[250px] mt-[9px] antialiased bg-opacity-70  -ml-[3px] h-[355px] overflow-visible bg-purple-900 hover:scale-105 transition "></div>
                            <div
                                key={index}
                                className="relative my-4 z-20 [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)] w-[245px] h-[340px]  bg-gray-900 hover:scale-105 transition  border-purple-500 border-opacity-70"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Image className="w-full h-full object-cover" src={manga.coverImageUrl} alt={manga.title} width={220} height={340} loading="lazy" />
                                {/* Title Always Visible */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-950 via-purple-900 to-transparent p-4">
                                    <h1 className=" w-full flex-nowrap flex flex-row font-bold items-start justify-center text-xs tracking-[2px] text-white">
                                        <Flag code={langToCountry[manga.originalLanguage] || "UN"} className="w-6 shadow-lg shadow-black  mr-4" />
                                        {manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title}
                                    </h1>

                                </div>

                                {/* Description on Hover */}
                                {hoveredIndex === index && (
                                    <div onClick={() => { handleMangaClicked(manga) }} className="absolute cursor-pointer inset-0 flex flex-col justify-start p-4 bg-black bg-opacity-80 text-purple-300 transition-opacity duration-300">
                                        <p className="text-[12px] tracking-tight line-clamp-[15] ">{manga.description || "No description available."}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <span
                    onClick={() => handleNext()}
                    className={`relative cursor-pointer brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-5 rounded-xl overflow-hidden
                                      before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                                    `}
                    style={{
                        background: "linear-gradient(#3b235a, #24143f)",
                    }}
                >
                    <Image className=" brightness-200" src="/next.svg" alt="next" width={20} height={20} />
                </span>
            </section>
        </div>
    );
};

export default SliderComponent;
