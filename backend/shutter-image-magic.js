// Helper function to add a watermark
async function addWatermarkToImage(imageBuffer, watermarkText) {
    try {
        const img = await loadImage(imageBuffer);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.font = '20px serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.textAlign = 'center';

        const textWidth = ctx.measureText(watermarkText).width;
        const diagonalGap = 50;
        const rotationAngle = -45 * Math.PI / 180;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotationAngle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        for (let y = -canvas.height; y < canvas.height * 2; y += diagonalGap) {
            const rowOffset = (y / diagonalGap) % 2 === 0 ? 0 : textWidth / 2;
            for (let x = -canvas.width; x < canvas.width * 2; x += textWidth + diagonalGap) {
                ctx.fillText(watermarkText, x + rowOffset, y);
            }
        }

        return canvas.toBuffer('image/png');
    } catch (error) {
        throw new Error('Error applying watermark: ' + error.message);
    }
}