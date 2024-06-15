const express = require('express');
const cors = require("cors");
const OpenAI = require('openai');
const fs = require('fs');
const FormData = require('form-data');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/describe-image', async (req, res) => {
    const { imageUrl } = req.body;
  
    try {
        // Send the image url to openai
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: "Describe this image in 10 words or less" },
                    { 
                        type: "image_url", 
                        image_url: { 
                            "url": imageUrl,
                            "detail": "low"
                        },
                    },
                ],
            }],
        });
  
        // Send back the description
        let description = response.choices[0].message.content;
        console.log(description);
        res.json(description);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/*
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(str) {
    const userReq = `User: ${str}`;

    let prompt = `What is being asked by the 'User' below? Respond only with the number unless stated otherwise:
    1. Search for product (Respond with the product name if user mentioned it, otherwise respond with 1)\n
    2. Describe image\n
    3. Read reviews\n${userReq}`;

    let result = await model.generateContent(prompt);
    let response = await result.response;
    let text = response.text();

    console.log(text);

    if (text.trim() === "2") {

    } else if (text.trim() === "1") {
        prompt = `Respond with the product the user wants to search for if they mentioned it, or respond with N/A\n${userReq}`;
        
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();

        console.log(text);
    }
}

app.post('/run', async (req, res) => {
    const { query } = req.body;

    if (query) {
        await run(query);
        res.json({ message: 'Query processed' });
    } else {
        res.status(400).json({ error: 'No query provided' });
    }
});
*/

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
