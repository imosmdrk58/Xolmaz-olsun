import React, { useState, useEffect, useCallback, useMemo } from "react";

const OCROverlay = ({ fullOCRResult, translatedTexts, loading, ready,layout="vertical" }) => {
  
  if (ready === false) return null;

  // Memoize getDisplayText function
  const getDisplayText = useCallback((originalText) => {
    if (loading && !translatedTexts[originalText]) {
      return "Translating...";
    }
    return translatedTexts[originalText] || originalText;
  }, [loading, translatedTexts]);

  // Memoize the rendered overlay content
  const overlayContent = useMemo(() => (
    fullOCRResult && fullOCRResult.map((item, i) => {
      // Extract bounding box coordinates
      const [[x1, y1], [x2], , [, y4]] = item.bbox;
      const originalImageWidth = 1680; // Static value
      const originalImageHeight = 1680; // Static value
      const containerWidth = 380; // Static value
      const containerHeight = 570; // Static value

      // Calculate scaling factors (memoized per item)
      const scaleX = containerWidth / originalImageWidth;
      const scaleY = containerHeight / originalImageHeight;

      // Calculate position and size (memoized per item)
      const scaledX = x1 * scaleX + 100;
      const scaledY = y1 * scaleY - Math.abs(1200 + (y4 > 1000 ? y4 : y4 / 10)) / 10 - 20;
      const textBlockWidth = (x2 - x1) * scaleX;
      const textBlockHeight = (y4 - y1) * scaleY;

      // Calculate font size (memoized per item)
      const minFontSize = 12;
      const fontSize = Math.max(minFontSize, textBlockHeight * 0.8);

      return (
        translatedTexts && (
          <div
            key={i}
            className="absolute bg-white text-black font-extrabold flex justify-center items-center overflow-hidden rounded-sm p-1 shadow-md"
            style={{
              left: `${scaledX}px`,
              top: `${scaledY + (i + 5) * i / 1.5 - (scaledY > 515 ? 60 : 0) + (layout=="vertical"?300:0)}px`,
              fontSize: `${fontSize}px`,
              lineHeight: `${textBlockHeight}px`,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            <div className="relative z-20">{getDisplayText(item.text)}</div>
          </div>
        )
      );
    })
  ), [fullOCRResult, translatedTexts, loading, getDisplayText]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {overlayContent}
    </div>
  );
};

export default OCROverlay;