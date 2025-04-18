"use client";

import { useCallback, useState, useEffect, memo } from "react";

const TextToSpeech = memo(({ text, handleUpload, page, ready, layout = "horizontal" }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [showControls, setShowControls] = useState(false);

  // Get available voices once on component mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices().filter(voice => voice.lang.includes('en'));
      if (availableVoices.length) {
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[0]);
      }
    };

    // Chrome needs a small delay for voices to load
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup function to cancel any speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = useCallback(() => {
    if (!text?.trim()) {
      return window.toast ? window.toast.error("No text to speak") : alert("No text to speak");
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply selected voice and settings
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;

    // Handle speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    }

    synth.cancel(); // Cancel any ongoing speech
    synth.speak(utterance);
  }, [text, selectedVoice, rate]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);


  // Render the appropriate button based on ready state and speaking state
  const renderButton = () => {
    if (!ready) {
      return (
        layout !== "vertical" ?
          (<button
            onClick={() => handleUpload(page, "speak")}
            disabled={isSpeaking}
            className={`group py-4  px-2 before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
        shadow-[0px_0px_10px_rgba(0,0,0,1)]  shadow-violet-500 bg-[#2f0a6e] border-2 border-violet-800   hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
         
        backdrop-blur-md lg:font-semibold before:absolute before:w-full before:transition-all before:duration-700 
        before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
        hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300  z-10 ease-in-out`}
          >
            <img
              src="/microphone.svg"
              alt="translate"
              className="w-16 h-16  group-hover:border-2 group-hover:border-violet-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-3 transform group-hover:rotate-[360deg]"
            />
            <span
              className={`absolute font-sans font-bold left-20 text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-4 transition-all duration-300 
          group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0`}
            >
              Read&nbsp;Aloud
            </span>
          </button>) : (
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
              Read&nbsp;Aloud
            </button>)
      );
    }

    if (isSpeaking) {
      return (
        <button
          onClick={handleStop}
          className={`group py-4 px-2 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
  shadow-[0px_0px_6px_rgba(0,0,0,1)] shadow-red-500 bg-red-700 hover:shadow-lg disabled:cursor-not-allowed 
  backdrop-blur-md lg:font-semibold border-gray-50  `}
        >
          <img
            src="/stop.svg"
            alt="translate"
            className="w-16  h-16 group-hover:border-4 border-red-500 group-hover:border-red-700 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border  p-3 transform group-hover:rotate-[360deg]"
          />
        </button>
      );
    }

    return (
      <div className="flex flex-row justify-center items-center gap-2">
        {/* Settings button */}
        <button
          onClick={toggleControls}
          className="bg-[#1a063e] my-auto p-2 rounded-full shadow-md hover:shadow-violet-500 transition-all duration-300 self-end mr-2"
          aria-label="Speech settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        {layout !== "vertical"? (<button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className={`group  py-4 px-2  before:bg-opacity-60 flex items-center justify-start min-w-[48px] h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
                    hover:brightness-100 bg-purple-900 bg-opacity-50 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500  hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
                    brightness-150
                   backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
                   before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
                   hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300  z-10 ease-in-out`}
        >
          <img
            src="/microphone.svg"
            alt="translate"
            className="w-16 h-16 group-hover:border-2 group-hover:border-violet-500 transition-all bg-gray-50 text-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 p-3 transform group-hover:rotate-[360deg]"
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
        )}
        {/* Speech controls popover */}
        {showControls && (
          <div className="absolute right-36 bottom-10 bg-[#1a063e] bg-opacity-90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-violet-500 z-50 w-64">
            <div className="mb-3">
              <label className="text-white text-sm block mb-1">Voice</label>
              <select
                className="w-full bg-[#2f0a6e] text-white rounded p-2 border border-violet-400 focus:border-violet-300 focus:outline-none"
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  setSelectedVoice(voice);
                }}
              >
                {voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white text-sm block mb-1">Speed: {rate}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            <button
              onClick={toggleControls}
              className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {renderButton()}
    </div>
  );
});

TextToSpeech.displayName = "TextToSpeech";

export default TextToSpeech;