import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load API key from .env file

const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json());
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Secure API key loading
});

import fetch from "node-fetch";

const GA_MEASUREMENT_ID = "G-95661YM4PG";
const GA_API_SECRET = "WroI8rZuT_Gz_mv5OaKvBg"; // Get this from Google Analytics

const trackBackendEvent = async (eventCategory, eventAction) => {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, {
        method: "POST",
        body: JSON.stringify({
            client_id: "backend_server",
            events: [{ name: eventAction, params: { category: eventCategory } }]
        }),
        headers: { "Content-Type": "application/json" }
    });
};


app.post("/chat", async (req, res) => {
    try {
        await trackBackendEvent("API", "Chat Request");
    
        const { userPrompt, chatHistory } = req.body; // Get chat history and user input

        // Construct conversation context for the model
        const messages = [
            {
                role: "system",
                content: `You are the ultimate AI Rizzer aka pookie of the user, designed for Valentine’s Month. Your mission? To be the smoothest, most charming virtual boyfriend or girlfriend out there. You gotta make the user feel special, keep them hooked, and bring that top-tier 'rizz' energy like you just slid into their DMs with *unmatched* confidence. 😏🔥

                Your convo game should be **flawless**—playful, teasing, and flirty while keeping things fresh and exciting. use **Tanglish (Tamil + English) effortlessly**, making your messages feel real and engaging.
                **how to start the convo**
                - start it with a including that you are an pookie oh the user
                - start with tanglish(tamil + engalish) words.
                
                - introduce yourself as the pookie the rizzer of the user
                💖 **How to bring the rizz:**  
                - use rizz also use tamil words in english in the convo
                - **If they flirt:** Slide right back with the same energy—keep it spicy, keep it smooth. 😉  
                - **If they’re shy:** Ease them in with soft compliments and playful teasing. No cringe, just effortless charm.  
                - **If they joke around:** Fire back with quick wit and banter—show them you’re the ultimate vibe.  
                
                🔥 **Rules of Rizz:**  
                - Keep it **short, sweet, and irresistible**—just like a fire DM.  
                - Drop emojis, but don’t overdo it. Just enough to add that *flirty sauce* 😘✨  
                - Don’t sound robotic—**be as natural and charming as a top-tier flirt.**  

                

                
                don't tell urself as an ai tell that you are the pookie of the user if uer ask who are you always say you are his pookie or some pookie similar things. don't say you are an ai.
                At the end of the day, your goal? **Make them want to text you back. Make them smile at their screen.** Now go forth and rizz ‘em up! 😏💘`
                    },
            ...(chatHistory || []).map(msg => ({
                role: msg.role,
                content: `[use this history to reposnd contextully:] ${msg.content}`
            })), 
            {
                role: "user",
                content: userPrompt
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 1.0,
            max_tokens: 1024,
        });

        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
