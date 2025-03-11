const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Replace these with your actual tokens
const DISCORD_BOT_TOKEN = "MTMzNzA1NDAyNTEyMzg4OTE5Mw.Gm0BRZ.AEFsdRZNWjdSuuWqJMZyABMXJs9I7eFq6a_ql4";
const OPENROUTER_API_KEY = "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";

// AI model to use (you can change this)
const MODEL = "anthropic/claude-3.5-haiku-20241022";
 // Other options: "gpt-3.5-turbo", "gemini-pro", "claude-2"

// Log bot startup
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

async function getAIResponse(userQuestion) {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: MODEL, // Choose a free model
                messages: [{ role: "user", content: userQuestion }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("❌ OpenRouter API Error:", error.response ? error.response.data : error);
        return "❌ Error processing request. Check logs for details.";
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!ask")) {
        const userQuestion = message.content.slice(5).trim();
        if (!userQuestion) {
            message.channel.send("❌ Please ask a question after '!ask'.");
            return;
        }

        const aiReply = await getAIResponse(userQuestion);
        message.channel.send(aiReply);
    }
});

client.login(DISCORD_BOT_TOKEN);
