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
                    className="relative z-50 w-fit my-5 min-w-32 brightness-150 text-sm cursor-pointer  
                        shadow-[0_0_7px_rgba(0,0,0,1)] shadow-blue-500 flex justify-center 
                        items-center p-5 rounded-xl overflow-hidden group 
                        before:absolute before:inset-0 before:opacity-0 
                        before:transition-opacity before:duration-500 before:content-[''] 
                        hover:before:opacity-100"
                    style={{
                        background: "linear-gradient(#1e3a8a, #12264f)", 
                    }}
                >
                    Read Aloud
                </button>
            ) : (
                <>
                    <button
                        onClick={handleSpeak}
                        disabled={isSpeaking}
                        className="relative z-50 w-fit  my-5 min-w-32 text-sm brightness-150 cursor-pointer 
                        shadow-[0_0_7px_rgba(0,0,0,1)] shadow-blue-500 flex justify-center 
                        items-center p-5 rounded-xl overflow-hidden group 
                        before:absolute before:inset-0 before:opacity-0 
                        before:transition-opacity before:duration-500 before:content-[''] 
                        hover:before:opacity-100"
                        style={{
                            background: "linear-gradient(#1e3a8a, #12264f)", // Blue
                        }}
                    >
                        {isSpeaking ? "Speaking..." : "Start Reading"}
                    </button>

                    {isSpeaking && (
                        <button
                            onClick={handleStop}
                            className="relative z-50 w-fit my-5 min-w-32 text-sm cursor-pointer brightness-100 
                                shadow-[0_0_7px_rgba(0,0,0,1)] shadow-red-500 flex justify-center 
                                items-center p-5 rounded-xl overflow-hidden group 
                                before:absolute before:inset-0 before:opacity-0 
                                before:transition-opacity before:duration-500 before:content-[''] 
                                hover:before:opacity-100"
                            style={{
                                background: "linear-gradient(#dc2626, #991b1b)", // Red
                            }}
                        >
                            Stop
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
