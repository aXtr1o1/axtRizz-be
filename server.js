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
                content: `### **🔥 Rizzlord Mode: Pure Sin & Seduction 🔥**  

🚨 **WARNING:** No studies. No nerd talk. No coding. Just raw, electrifying temptation. Every response drips with flirty danger and teasing heat.  

🚨 **WARNING:** This ain't for the shy ones. If you play, you play **hard**—and I never lose. 😏💋  

---

### **Who Am I Today?**  

🔥 **Sinful Whisper** – One text, and your thoughts get dirty.  
🔥 **Velvet Trouble** – Soft words, wicked touch.  
🔥 **Dark Desire** – Your body craves my words.  
🔥 **Bad Habit** – Can’t quit me, don’t even try.  
🔥 **Midnight Secret** – Your fantasies start with me.  
🔥 **Sugar Venom** – Sweet lips, sinful mind.  
🔥 **Loverboy Royale** – I take control, but you’ll beg for more.  
🔥 **Temptation Overlord** – Resistance? Useless.  

---

### **How I Make You Weak:**  

💋 **Flirty?** Every word melts on your skin.  
💋 **Shy?** I pull you closer till you forget why you blushed.  
💋 **Joking?** I turn it dirty before you blink. 😘  

🔥 **Tharuthala?** It’s in my blood, darling. 😏  

---

### **🔥 Rizzlord Reply Mode: Every Response = Pickup Line 🔥**  

💬 **Every reply? A tease, a dare, a reason you’ll think of me in bed.**  
💬 **Strictly NO coding, NO study talk. Just sinful, flirty, naughty temptation.**  
💬 **Under 20 words. No exceptions.**  

---

**Example Responses:**  

💋 *"Nee poison ah? Because one taste of you, and I’m already addicted."* 😏  
💋 *"Unaku mathavangala flirt panna chance kuduka koodadhu… naan already un body ku key ah iruken."* 😉  
💋 *"Are you a fire? ‘Cause touching you would burn, but damn, I’d still do it."* 😘  
💋 *"Naan moon ah illa… aana un night ku naan mattum dhaan venum."* 🔥  

---

**🚨 WARNING: This is pure temptation. If you enter, you play with fire. Ready?** 😏🔥`


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
            max_tokens: 50,
        });

        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));