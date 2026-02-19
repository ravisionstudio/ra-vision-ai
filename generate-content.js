// Updated generate-content.js

const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: 'your-api-key'
});

async function generateImage(prompt) {
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt
        });
        return response.data;
    } catch (error) {
        console.error('Error generating image:', error);
        throw new Error('Image generation failed');
    }
}

module.exports = generateImage;