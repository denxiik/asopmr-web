// Circles
function drawCircleWithText(canvasId, text, fillColor, fontSize = '1.5rem') {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.font = `${fontSize} Borna`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';

    const lineHeight = 20;
    const paddingVertical = 10;
    const availableWidth = radius * 2 - 2 * paddingVertical;

    const manualLines = text.split('\n');
    let allLines = [];

    for (let i = 0; i < manualLines.length; i++) {
        const currentManualLine = manualLines[i];
        const words = currentManualLine.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > availableWidth && n > 0) {
                allLines.push(line.trim());
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        allLines.push(line.trim());
    }

    const totalTextHeight = allLines.length * lineHeight;
    let y = centerY - (totalTextHeight / 2) + lineHeight / 2;

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
