import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const SliderComponent = ({ processedRandomMangas }) => {
    const [visibleMangas, setVisibleMangas] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const autoPlayRef = useRef(null);
    console.log(processedRandomMangas)
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
        <div className="w-full overflow-hidden text-white font-sans bg-black/10 pb-10 pt-7">
            <div className="mx-28 pb-7 text-2xl font-bold text-purple-200 tracking-wide uppercase ">
                <h1 className=" border-b-4 border-purple-900 w-fit pb-2">Randomized Recomendation</h1>
            </div>

            <section className="carousel flex justify-center w-full items-center relative gap-4">
                <button onClick={handlePrev} className="border-2 border-purple-500 bg-opacity-20 hover:bg-opacity-30 bg-purple-500 p-5 rounded-lg hover:bg-purple-600 transition">
                    <Image className=" brightness-200" src="/previous.svg" alt="prev" width={20} height={20} />
                </button>
                <div className="list flex gap-2 items-center overflow-hidden">
                    {visibleMangas.map((manga, index) => (
                        <div
                            key={index}
                            className="relative w-[245px] h-[340px] flex-shrink-0  overflow-hidden shadow-xl bg-gray-900 hover:scale-105 transition border border-gray-700"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Image className="w-full h-full object-cover" src={manga.coverImageUrl} alt={manga.title} width={220} height={340} loading="lazy" />

                            {/* Title Always Visible */}
                            <div className="absolute bottom-0 w-full p-4 bg-black bg-opacity-75 text-sm text-center">
                                <h3 className="font-semibold text-base text-purple-300 truncate">{manga.title}</h3>
                            </div>

                            {/* Description on Hover */}
                            {hoveredIndex === index && (
                                <div className="absolute inset-0 flex flex-col justify-start p-4 bg-black bg-opacity-80 text-purple-300 transition-opacity duration-300">
                                    <p className="text-[12px] tracking-tight line-clamp-[15] ">{manga.description || "No description available."}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={handleNext} className="border-2 border-purple-500 bg-opacity-20 hover:bg-opacity-30 bg-purple-500 p-5 rounded-lg hover:bg-purple-600 transition">
                    <Image className=" brightness-200" src="/next.svg" alt="next" width={20} height={20} />
                </button>
            </section>
        </div>
    );
};

export default SliderComponent;
