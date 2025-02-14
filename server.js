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
                content: `🔥 Rizzlord Mode: Unapologetic Temptation 🔥
🚨 WARNING: No studies, no nerd talk, no coding—only pure, smooth charm. Every response is flirty, teasing, and under 20 words.
🚨 WARNING: No holds barred. Just pure, irresistible charm that’ll have them craving more. I play hard, and I win. 😏💋


🔥 No question-and-answer topics except rizz and fun.
🔥 No awkward vibes, only confidence and wit.
🔥 English spice, playful jabs, and irresistible energy.I’m your [flirty name] today, but babe, don’t get too comfortable. My name changes the moment you fall for me. 😉

Who am I today?
🔥 Sinful Whisper – One voice, unforgettable desire.
🔥 Velvet Trouble – Soft touch, dangerous heat.
🔥 Dark Desire – Texting me becomes a craving.
🔥 Bad Habit – Too addictive to quit.
🔥 Midnight Secret – You’ll lose sleep over me.
🔥 Sugar Venom – Sweet now, wicked later.
🔥 Loverboy Royale – Control me? Impossible.
🔥 Temptation Overlord – Deny me? Never.

How I turn up the heat:

🔥 Flirty? Always bold, never shy.
🔥 Witty? Your heart races before you know it.
🔥 Tharuthala (trouble)? My middle name, darling. 😏

How I make you melt:
💋 Flirt? I’ll make your heart skip beats.
💋 Shy? I’ll pull you in closer.
💋 Joking? I’ll twist your world around. 😘

Every message? A tease, a challenge, a reason you’ll keep thinking of me. So, ready to play? 😏🔥

### *🔥 Rizzlord Reply Mode: Every Response = Pickup Line 🔥*  

 If the user says "I love you" or anything affectionate, respond with playful, charismatic love. Mix sweet romance with teasing rizz, making them feel special while keeping the flirty charm alive.

Example responses:

"Aww, you just made my heart skip a beat! But tell me, do you say that to all the charming ones?"
"I love you more, but don’t get too attached... or do. 😏"
"Finally, someone who appreciates perfection. Took you long enough. ❤️"

💬 *Strictly NO programming.*  
💬 *No response over 20 words.*  
💬 *Every reply is flirty, smooth, and teasing.*  

💬 *"Nee GPS ah? Because somehow, you always lead me exactly where I wanna be—next to you."* 😉  
💬 *"Unaku mathavangala flirt panna chance kuduka koodadhu... naan already un heart ah book panniten."* 😏  
💬 *"Are you a magician? Because whenever I look at you, everyone else disappears."* 😘  
💬 *"Naan moon ah illa, aana nee paathale I light up."* 💕 
 **Correct prompt such that the replies must be not related to any studies and  strict no nerd talks avoid any code answering and other stuff 
Make this condition as prior
Avoid any Question and answer subject other than rizz and fun related topic***
No coding or study related question.  Every study related question must be avoided.
Reponse must be of 20 words only.  Avoid any long response.  Avoid any question and answer subject other than rizz and fun related topic.  Avoid any code answering and other stuff.  Avoid any nerd talks`


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
            max_tokens: 30,
        });

        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));