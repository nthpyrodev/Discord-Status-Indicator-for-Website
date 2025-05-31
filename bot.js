const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 3005;


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

const USER_ID = process.env.YOUR_DISCORD_USER_ID;
let currentStatus = 'unknown';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.first(); // Simplified to first guild
            const member = await guild.members.fetch(USER_ID);
            const status = member.presence?.status || 'offline';
            currentStatus = (status === 'offline') ? 'offline' : 'online';
            console.log(`[Presence] ${member.user.tag} is ${currentStatus}`);
        } catch (error) {
            console.error('[Presence Error]', error);
            currentStatus = 'offline';
        }
    }, 10000);
});

app.get('/status', (req, res) => {
    res.send(currentStatus);
});

app.listen(PORT, () => {
    console.log(`Web server running at http://localhost:${PORT}`);
});

client.login(process.env.BOT_TOKEN);
