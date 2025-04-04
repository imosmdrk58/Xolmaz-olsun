"use client";

import { useCallback, useState } from "react";

export default function TextToSpeech({ text, handleUpload, page, ready, layout = "horizontal" }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const handleSpeak = useCallback(() => {
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
    }, [text]);

    const handleStop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);
    return (
        <div className="flex items-center gap-2">
            {ready == false ? (
                layout !== "vertical"? (<button
                    onClick={() => handleUpload(page, "speak")}
                    disabled={isSpeaking}
                    className={`group py-4  px-2 before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
                  shadow-[0px_0px_10px_rgba(0,0,0,1)]  shadow-violet-500 bg-[#2f0a6e] border-2 border-violet-800 bg-opacity-60  hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
                   
                  backdrop-blur-md lg:font-semibold before:absolute before:w-full before:transition-all before:duration-700 
                  before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
                  hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300  z-10 ease-in-out`}
                >
                    <img
                        src="/microphone.svg"
                        alt="translate"
                        className="w-16 h-16 bg-opacity-70 group-hover:border-2 group-hover:border-violet-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-3 transform group-hover:rotate-[360deg]"
                    />
                    <span
                        className={`absolute font-sans font-bold left-20 text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-4 transition-all duration-300 
                    group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0`}
                    >
                        Read&nbsp;Aloud
                    </span>
                </button>
                ) : (
                    <button
                        onClick={() => handleUpload(page, "speak")}
                        disabled={isSpeaking}
                        className="font-sans before:bg-opacity-60  min-w-[182px] transition-colors flex gap-2 justify-start  items-center mx-auto shadow-xl text-lg text-white bg-[#1a063e] backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border-2 rounded-full group"
                        type="submit"
                    >
                        <img
                            src="/microphone.svg"
                            alt="microphone"
                            className="w-12 h-12 group-hover:border-2 group-hover:border-violet-500 bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transition-transform transform group-hover:rotate-[360deg]"
                        />
                        Read Aloud
                    </button>
                )
            ) : (
                <>
                    {!isSpeaking && (
                         layout !== "vertical"? (<button
                        onClick={handleSpeak}
                        disabled={isSpeaking}
                        className={`group  py-4 px-2  before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
                   hover:brightness-100 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500  hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
                   brightness-150
                  backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
                  before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
                  hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300  z-10 ease-in-out`}
                  style={{
                    background: "linear-gradient(#3b235a, #241432)",
                  }}
                    >
                        <img
                            src="/microphone.svg"
                            alt="translate"
                            className="w-16 bg-opacity-70 h-16 group-hover:border-2 group-hover:border-violet-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-3 transform group-hover:rotate-[360deg]"
                        />
                        <span
                            className={`absolute font-sans ml-3 font-bold left-20 text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-4 transition-all duration-300 
                    group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0`}
                        >
                            Speak
                        </span>
                    </button>
                         ):(
                            <button
                        onClick={handleSpeak}
                        disabled={isSpeaking}
                        className="font-sans before:bg-opacity-60  min-w-[182px] transition-colors flex gap-4 justify-start  items-center mx-auto text-lg text-white  bg-[#1a063e] shadow-[0px_0px_16px_rgba(0,0,0,1)] shadow-violet-500 bg-opacity-60 backdrop-blur-md lg:font-semibold isolation-auto border-violet-300 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-4 py-2 ease-in-out overflow-hidden border-2 rounded-full group"
                        type="submit"
                    >
                        <img
                            src="/microphone.svg"
                            alt="microphone"
                            className="w-12 h-12 bg-opacity-70 group-hover:border-2 group-hover:border-violet-300 bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-2 transition-transform transform group-hover:rotate-[360deg]"
                        />
                        Speak
                    </button>
                         )
                    )}
                    {isSpeaking && (
                        <button
                            onClick={handleStop}
                            className={`group py-4 px-2 before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
                      shadow-[0px_0px_6px_rgba(0,0,0,1)] shadow-red-500 bg-[#7e0606] bg-opacity-90  hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
                       
                      backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
                      before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
                      hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300  z-10 ease-in-out`}
                        >
                            <img
                                src="/stop.svg"
                                alt="translate"
                                className="w-16 bg-opacity-70 h-16 group-hover:border-2 group-hover:border-red-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-3 transform group-hover:rotate-[360deg]"
                            />
                            <span
                                className={`absolute font-sans ml-3 font-bold left-20 text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-4 transition-all duration-300 
                        group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0`}
                            >
                                Stop
                            </span>
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
