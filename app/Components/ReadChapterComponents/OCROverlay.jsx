import React, { useState, useEffect } from "react";

const OCROverlay = ({ fullOCRResult }) => {
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [loading, setLoading] = useState(false);

  // Effect to translate all OCR results when they change
  useEffect(() => {
    const translateAll = async () => {
      if (!fullOCRResult || fullOCRResult.length === 0) return;
      
      // Skip if we already have translations for all items
      const needsTranslation = fullOCRResult.some(item => 
        !translatedTexts[item.text] && item.text.trim() !== ""
      );
      
      if (!needsTranslation) return;
      
      setLoading(true);
      
      try {
        // Create a map of original texts to their translated versions
        const newTranslations = { ...translatedTexts };
        const untranslatedItems = fullOCRResult.filter(
          item => !translatedTexts[item.text] && item.text.trim() !== ""
        );
        
        // Process in batches to avoid too many simultaneous API calls
        const batchSize = 5;
        for (let i = 0; i < untranslatedItems.length; i += batchSize) {
          const batch = untranslatedItems.slice(i, i + batchSize);
          
          // Process batch in parallel
          const results = await Promise.all(
            batch.map(item => handleTranslate(item.text))
          );
          
          // Store the results
          batch.forEach((item, index) => {
            newTranslations[item.text] = results[index];
          });
        }
        
        setTranslatedTexts(newTranslations);
      } catch (error) {
        console.error("Error translating batch:", error);
      } finally {
        setLoading(false);
      }
    };
    
    translateAll();
  }, [fullOCRResult]);

  const handleTranslate = async (text, targetLang = "en") => {
    if (!text || !text.trim()) return "";

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });

      const data = await res.json();
      return res.ok ? data.translatedText || text : text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  // Function to get the displayed text for an item
  const getDisplayText = (originalText) => {
    if (loading && !translatedTexts[originalText]) {
      return "Translating...";
    }
    return translatedTexts[originalText] || originalText;
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {fullOCRResult &&
        fullOCRResult.map((item, i) => {
          const [[x1, y1], [x2], , [, y4]] = item.bbox;
          const originalImageWidth = 1680;
          const originalImageHeight = 1680;

          const imageAspectRatio = originalImageWidth / originalImageHeight;
          const containerAspectRatio =
            380 / (window.innerHeight * item.confidence);

          let renderedWidth, renderedHeight;
          if (imageAspectRatio > containerAspectRatio) {
            renderedWidth = 380;
            renderedHeight = 380 / imageAspectRatio;
          } else {
            renderedHeight = window.innerHeight * item.confidence;
            renderedWidth = renderedHeight * imageAspectRatio;
          }

          const offsetX = (380 - renderedWidth) / 2;
          const offsetY = (810 - renderedHeight) / 15;
          const scaleX = renderedWidth / originalImageWidth;
          const scaleY = (renderedHeight / originalImageHeight) * 1.4;

          const scaledX = x1 * scaleX + offsetX;
          const scaledY = y1 * scaleY + offsetY - 60;
          
          return (
            <div
              key={i}
              className="absolute bg-white w-fit h-[10px] text-black font-bold text-[10px] flex justify-center items-center overflow-hidden rounded-sm p-0.5"
              style={{
                top: `${scaledY}px`,
                left: `${scaledX}px`,
              }}
            >
              {getDisplayText(item.text)}
            </div>
          );
        })}
    </div>
  );
};

export default OCROverlay;