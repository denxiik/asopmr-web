// Make h3 grid-items from SERVICE-BENEFITS SECTION have same height
function setEqualH3Height(itemsPerRow) {
    const gridContainer = document.querySelector('.grid-container');
    const gridItems = document.querySelectorAll('.grid-item');

    for (let i = 0; i < gridItems.length; i += itemsPerRow) {
        const rowItems = Array.from(gridItems).slice(i, i + itemsPerRow);
        let maxHeight = 0;
        const h3Elements = [];

        rowItems.forEach(item => {
            const h3 = item.querySelector('h3');
            if (h3) {
                h3Elements.push(h3);
                h3.style.height = 'auto';
                maxHeight = Math.max(maxHeight, h3.offsetHeight);
            }
        });

        h3Elements.forEach(h3 => {
            h3.style.height = `${maxHeight}px`;
        });
    }
}

// Handle case small screesn with two items per column
function handleResize() {
    const screenWidth = window.innerWidth;
    let itemsPerRow = 3;
    if (screenWidth < 576) {
        itemsPerRow = 2;
    }

    setEqualH3Height(itemsPerRow);
}

// PARK4DIS SECTION (park4dis-sample) circles
function drawCircleWithText(canvasId, text, fillColor) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10; // Adjust for padding

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor; // Use the passed fillColor
    ctx.fill();

    // Draw the text with line breaks and padding
    ctx.font = `1.5rem Borna`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';

    const lineHeight = 20;
    const paddingVertical = 10;
    const availableWidth = radius * 2 - 2 * paddingVertical;

    const manualLines = text.split('\n'); // Split by explicit newline characters
    let allLines = [];

    // Process each "manual" line for word wrapping
    for (let i = 0; i < manualLines.length; i++) {
        const currentManualLine = manualLines[i];
        const words = currentManualLine.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > availableWidth && n > 0) {
                allLines.push(line.trim()); // Add the wrapped line
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        allLines.push(line.trim()); // Add the last part of the line
    }

    // Calculate starting Y to center the block of text
    const totalTextHeight = allLines.length * lineHeight;
    let y = centerY - (totalTextHeight / 2) + lineHeight / 2; // Center vertically

    // Draw each line
    for (let i = 0; i < allLines.length; i++) {
        ctx.fillText(allLines[i], centerX, y);
        y += lineHeight;
    }
}

function resizeCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

