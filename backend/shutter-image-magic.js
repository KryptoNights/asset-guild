const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const lighthouse = require('@lighthouse-web3/sdk');

const { tmpdir } = require('os');
const { join } = require('path');
const { v4: uuidv4 } = require('uuid');

const APIKEY = "YOUR_API_KEY";

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

async function uploadToLighthouse(filePath) {
    try {
        const response = await lighthouse.upload(filePath, APIKEY);
        return response.data.Hash;
    } catch (error) {
        throw new Error('Error uploading to Lighthouse: ' + error.message);
    }
}

functions.http('helloHttp', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
  
    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    } else {
      try {
          if (req.method !== 'PUT') {
              return res.status(405).send('Only PUT requests are allowed.');
          }
  
          const watermarkText = 'Shutter';
          const tempDir = tmpdir();
          const originalImagePath = join(tempDir, `${uuidv4()}_original.png`);
          const watermarkedImagePath = join(tempDir, `${uuidv4()}_watermarked.png`);
  
          // Save original image temporarily
          fs.writeFileSync(originalImagePath, req.body);
  
          // Apply watermark
          const watermarkedImageBuffer = await addWatermarkToImage(req.body, watermarkText);
  
          // Save watermarked image temporarily
          fs.writeFileSync(watermarkedImagePath, watermarkedImageBuffer);
  
          // Upload original image to Lighthouse
          const originalImageHash = await uploadToLighthouse(originalImagePath);
  
          // Upload watermarked image to Lighthouse
          const watermarkedImageHash = await uploadToLighthouse(watermarkedImagePath);
  
          // Respond with the hashes of both images
          res.status(200).json({
              originalImageHash,
              watermarkedImageHash
          });
      } catch (error) {
          console.error(error);
          res.status(500).send('Error processing the image: ' + error.message);
      }
    }
  });
  