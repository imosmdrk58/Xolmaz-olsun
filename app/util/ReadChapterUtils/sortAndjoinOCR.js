export default function sortAndJoinOCR(fullOCRResult) {
    if (!fullOCRResult || fullOCRResult.length === 0) return "";

    // Calculate center points for all text blocks
    const itemsWithCenters = fullOCRResult.map(item => {
      const getCenter = (bbox) => {
        const xCoords = bbox.map(point => point[0]).filter(x => typeof x === 'number'); // Ensure valid numbers
        const yCoords = bbox.map(point => point[1]).filter(y => typeof y === 'number');
        if (xCoords.length === 0 || yCoords.length === 0) return { x: 0, y: 0 };
        const centerX = xCoords.reduce((sum, x) => sum + x, 0) / xCoords.length;
        const centerY = yCoords.reduce((sum, y) => sum + y, 0) / yCoords.length;
        return { x: centerX, y: centerY };
      };

      return {
        text: item.text.trim(),
        center: getCenter(item.bbox),
        original: item // Keep original data
      };
    });

    // Find the starting point (strictly highest Y, ignoring X for initial selection)
    let start = itemsWithCenters.reduce((min, item) =>
      min.center.y < item.center.y ? min : item
    );

    // Initialize sorted and remaining items
    let sortedItems = [start];
    let remainingItems = itemsWithCenters.filter(item => item !== start);

    // Iteratively add the closest remaining item, with heavy Y-axis precedence
    const Y_WEIGHT = 5.0; // Significantly higher weight for Y to ensure top-to-bottom priority
    const X_WEIGHT = 1.0; // Lower weight for X

    while (remainingItems.length > 0) {
      const lastAdded = sortedItems[sortedItems.length - 1];
      let closestItem = null;
      let minDistance = Infinity;

      for (let item of remainingItems) {
        // Calculate weighted distance: heavily prioritize Y (vertical) over X
        const dx = (item.center.x - lastAdded.center.x) * X_WEIGHT;
        const dy = (item.center.y - lastAdded.center.y) * Y_WEIGHT; // Much higher Y weight
        const distance = Math.sqrt(dx * dx + dy * dy); // Weighted Euclidean distance

        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      }

      if (closestItem) {
        sortedItems.push(closestItem);
        remainingItems = remainingItems.filter(item => item !== closestItem);
      }
    }

    // Group into lines and ensure correct order within lines
    const Y_LINE_THRESHOLD = 25; // Tighter threshold for new lines
    const X_GAP_THRESHOLD = 15; // Tighter threshold for horizontal gaps

    let lines = [];
    let currentLine = [sortedItems[0]];

    for (let i = 1; i < sortedItems.length; i++) {
      const prev = sortedItems[i - 1];
      const curr = sortedItems[i];

      // Check if current item starts a new line (large Y gap or significant X shift)
      if (Math.abs(curr.center.y - prev.center.y) > Y_LINE_THRESHOLD ||
        Math.abs(curr.center.x - (prev.center.x + (prev.original.bbox[1][0] - prev.original.bbox[0][0]))) > X_GAP_THRESHOLD) {
        lines.push(currentLine);
        currentLine = [curr];
      } else {
        currentLine.push(curr);
      }
    }
    lines.push(currentLine); // Push the last line
    // const Y_SAME_THRESHOLD =2; // Define your threshold for Y similarity
    const X_SAME_THRESHOLD = 4; // Define your threshold for X similarity


    for (let j = 0; j < lines.length - 1; j++) {
      for (let j = 0; j < lines.length - 1; j++) {
        let current = lines[j][0]; // Get the first element of the current line
        let next = lines[j + 1][0]; // Get the first element of the next line

        // Check if X coordinates are the same (or very close)
        if (Math.abs(Math.ceil(current.center.x) - Math.ceil(next.center.x)) < X_SAME_THRESHOLD || Math.abs(Math.floor(current.center.x) - Math.floor(next.center.x)) < X_SAME_THRESHOLD) {
          // If X is the same, swap if next has smaller Y
          if (next.center.y < current.center.y) {
            // Swap elements
            [lines[j], lines[j + 1]] = [lines[j + 1], lines[j]];
          }
        }

        //   if (Math.abs(Math.ceil(current.center.y) - Math.ceil(next.center.y)) < Y_SAME_THRESHOLD || Math.abs(Math.floor(current.center.y) - Math.floor(next.center.y)) < Y_SAME_THRESHOLD) {
        //     // If X is the same, swap if next has smaller Y
        //     if (next.center.x < current.center.x) {
        //         // Swap elements
        //         [lines[j], lines[j + 1]] = [lines[j + 1], lines[j]];
        //     }
        // }


      }
    }

    console.log("Final lines:", lines.map(line => line.map(item => `${item.text} (y=${item.center.y}, x=${item.center.x})`).join(", ")));
    // Join lines with newlines, and items within lines with spaces
    const processedText = lines.map(line =>
      line.map(item => item.text).join(" ")
    ).filter(line => line.trim().length > 0)
      .join(" ");

    return processedText;
  }