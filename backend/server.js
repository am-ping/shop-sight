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
                "role": "user",
                "content": [
                    { "type": "text", "text": "Describe this image in 10 words or less" },
                    { 
                        "type": "image_url", 
                        "image_url": { 
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});