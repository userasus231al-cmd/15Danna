const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'imagen-3.0-generate-002',
      contents: 'A majestic fairytale castle at night, glowing with warm golden and deep pink magical lights, starry night sky, fantasy architecture. Same art style and colors as the reference. No people, no characters, no princess, empty scenery, highly detailed, photorealistic. aspect ratio 3:4',
    });
    console.log(response);
  } catch (e) {
    console.error(e.message);
  }
}
run();
