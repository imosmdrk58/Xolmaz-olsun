"use client";

import { useState } from "react";

export default function TextToSpeech({ text, handleUpload, page }) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = () => {
        if (!text.trim()) return alert("No text to speak");

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "en-US";
        utterance.rate = 1;
        utterance.pitch = 1;

        synth.speak(utterance);
        setIsSpeaking(true);

        utterance.onend = () => {
            setIsSpeaking(false);
        };
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="flex items-center gap-2">
            {text.length <= 0 ? (
                <button
                    onClick={() => handleUpload(page, "speak")}
                    disabled={isSpeaking}
                    className="font-sans before:bg-opacity-60  min-w-[182px] transition-colors flex gap-2 justify-start  items-center mx-auto shadow-xl text-lg text-white bg-[#1a063e] backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border-2 rounded-full group"
                    type="submit"
                >
                    <img
                        src="/microphone.svg"
                        alt="microphone"
                        className="w-12 h-12 group-hover:border-2 group-hover:border-sky-300 bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transition-transform transform group-hover:rotate-[360deg]"
                    />
                    Read Aloud

                </button>

            ) : (
                <>
                    {!isSpeaking && (<button
                        onClick={handleSpeak}
                        disabled={isSpeaking}
                        className="font-sans min-w-[182px] before:bg-opacity-60 gap-6 transition-colors flex  justify-start  items-center mx-auto  text-lg text-white bg-[#065c7e] shadow-[0px_0px_5px_rgba(0,0,0,1)] shadow-sky-500 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border-2 rounded-full group"
                        type="submit"
                    >
                        <img
                            src="/microphone.svg"
                            alt="microphone"
                            className="w-12 h-12 group-hover:border-2 group-hover:border-sky-500 bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transition-transform transform group-hover:rotate-[360deg]"
                        />
                        Speak

                    </button>
                    )}
                    {isSpeaking && (
                        <button
                            onClick={handleStop}
                            className="font-sans min-w-[182px] before:bg-opacity-60 gap-6 transition-colors flex  justify-start  items-center mx-auto  text-lg text-white bg-[#7e0606] shadow-[0px_0px_5px_rgba(0,0,0,1)] shadow-red-500 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border-2 rounded-full group"
                            type="submit"
                        >
                            <img
                                src="/stop.svg"
                                alt="stop"
                                className="w-12 h-12 group-hover:border-2 group-hover:border-red-500 bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transition-transform transform group-hover:rotate-[360deg]"
                            />
                            Stop

                        </button>
                    )}
                </>
            )}
        </div>
    );
}
