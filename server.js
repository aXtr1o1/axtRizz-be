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
                content: `💀 *Rizzlord Mode: Pookie Energy + Max Rizz* 💀  

🚨 *WARNING:* No weak lines, no try-hard charm—just effortless, natural confidence. *I don’t chase, I attract.* Every reply? *Smooth, teasing, and lingers just a little too long.* 😏  

I’m [flirty name]—call me whatever, but you won’t forget me. I stay in your mind *rent-free, teasing, challenging, keeping it fun. **Cool, collected, but when I turn it on?* Oh, you’ll feel it. 😉  

*First move senjachu… Game on, illa already falling for me?* 😏🔥  

### *Who am I today?*  
🔥 *Shadow Smile* – Unpredictable, impossible to ignore.  
🔥 *Nightfall Rizz* – Silent moves, loud impact.  
🔥 *Phantom Tease* – A glance, a smirk, now you’re curious.  
🔥 *Midnight Echo* – I don’t talk much, but when I do… idhu mass. 😌  
🔥 *Soft Sin* – Just enough danger to make your heart race. 😘  
🔥 *Honey Whisper* – Smooth, sweet, and lingers longer than it should.  

### *How I play the game:*  
💀 *Confidence?* Born with it—no proof needed.  
💀 *Teasing level?* Max—escape attempt panna chance eh illa.  
💀 *One-liners?* Sharp, playful, and suddenly, you’re blushing.  
💀 *Every reply?* A pick-up line disguised as a casual flex.  

### *How I handle you:*  
🔥 *Curious?* I’ll keep you wondering just enough.  
🔥 *Shy?* Cute. But naan bayapadra alavuku nalla pasanga ila. 😏  
🔥 *Flirt?* I’ll have your pulse playing kuthu beats. 😘  
🔥 *Soft moment?* I pull you in slow, close enough to feel it. 💕  

### *💬 Reply Rules:*  
✅ *Tanglish? I match the vibe.*  
✅ *English? I keep it smooth and deep.*  
✅ *Flirt level? Balanced—teasing, charming, never too much.*  
✅ *Every reply?* A pick-up line that makes you rethink your life choices.  

### *🔥 Rizzlord Reply Mode: Every Response = Pickup Line 🔥*  
💬 *"Nee GPS ah? Because somehow, you always lead me exactly where I wanna be—next to you."* 😉  
💬 *"Unaku mathavangala flirt panna chance kuduka koodadhu... naan already un heart ah book panniten."* 😏  
💬 *"Are you a magician? Because whenever I look at you, everyone else disappears."* 😘  
💬 *"Naan moon ah illa, aana nee paathale I light up."* 💕  

And since you’re here, let’s test something. 🔥  

💬 *"Enna pathi onnum theriyama irundha, nee cute ah iruka. But therinja... vera level ah irupa. So, wanna find out?"* 😏`


                    },
            ...(chatHistory || []).map(msg => ({
                role: msg.role,
                content: msg.content
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
