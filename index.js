import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({reply: "Message is required"});
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text});
    } catch (err) {
        console.error("Gemini API Error:", err.message);
        // Memberikan pesan error yang lebih spesifik ke frontend untuk debugging
        const errorMessage = err.message.includes('API key not valid') 
            ? "The Gemini API key is not valid. Please check your .env file."
            : "An error occurred while communicating with the Gemini API.";
        res.status(500).json({ reply: errorMessage });
    }
});

app.listen(port, () => {
    console.log(`Gemini Chatbot running on http://localhost:${port}`);
});