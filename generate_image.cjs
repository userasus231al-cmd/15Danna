const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: 'A beautiful pink fairytale castle at night, highly detailed, photorealistic, cinematic lighting, 4k resolution. Vertical framing.',
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '3:4' }
    });
    fs.writeFileSync('src/assets/images/pink_castle_generated.jpg', Buffer.from(response.generatedImages[0].image.imageBytes, 'base64'));
    console.log('Saved to pink_castle_generated.jpg');
  } catch (e) {
    console.error(e.message);
  }
}
run();
