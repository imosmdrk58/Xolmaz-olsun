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
      // Extract bounding box coordinates
      const [[x1, y1], [x2], , [, y4]] = item.bbox;
      const originalImageWidth = 1680; // Original width of the image
      const originalImageHeight = 1680; // Original height of the image

      // Get the rendered image container dimensions (assuming 380px width for vertical layout)
      const containerWidth = 380; // Fixed width from your layout
      const containerHeight = 570; // Estimated height for vertical layout (adjust based on actual height)

      // Calculate scaling factors
      const scaleX = containerWidth / originalImageWidth; // Scale factor for width
      const scaleY = containerHeight / originalImageHeight; // Scale factor for height

      // Calculate the position of the text block
      const scaledX = x1 * scaleX + 100; // X position scaled to container
      const scaledY = y1 * scaleY - Math.abs(1200 + y4>1000?y4:y4/10)/10 -20

      // Calculate the width and height of the text block
      const textBlockWidth = (x2 - x1) * scaleX; // Width based on bbox difference
      const textBlockHeight = (y4 - y1) * scaleY; // Height based on bbox difference

      // Ensure the text block is visible and readable
      const minFontSize = 12; // Minimum font size in pixels
      const fontSize = Math.max(minFontSize, textBlockHeight * 0.8); // Scale font size with height

      return (
        <div
          key={i}
          className="absolute bg-white text-black font-extrabold flex justify-center items-center overflow-hidden rounded-sm p-1 shadow-md"
          style={{
            left: `${scaledX}px`,
            top: `${scaledY + (i +5)*i/1.5 - (scaledY>515?60:0)}px`,
            // height: `${textBlockHeight}px`,
            fontSize: `${fontSize}px`, // Dynamic font size
            lineHeight: `${textBlockHeight}px`, // Ensure text fits vertically
            whiteSpace: 'nowrap', // Prevent text wrapping
            textOverflow: 'ellipsis', // Handle overflow
          }}
        >
          <div className=" relative z-20">{getDisplayText(item.text)}</div>
        </div>
      );
    })}
</div>
  );
};

export default OCROverlay;