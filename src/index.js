const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { connectDatabase } = require('./database/mongoose');

// ─── Create client ───
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// ─── Load commands (recursive from subdirectories) ───
client.commands = new Collection();

function loadCommands(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            loadCommands(fullPath);
        } else if (entry.name.endsWith('.js')) {
            const command = require(fullPath);
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                console.log(`📦 Command loaded: /${command.data.name}`);
            }
        }
    }
}

loadCommands(path.join(__dirname, 'commands'));

// ─── Load events ───
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`⚡ Event loaded: ${event.name}`);
}

// ─── Startup ───
(async () => {
    if (!config.token) {
        console.error('❌ DISCORD_TOKEN not set in .env!');
        console.error('   Copy .env.example → .env and fill in values.');
        process.exit(1);
    }

    // Connect to MongoDB Atlas
    await connectDatabase();

    // Login to Discord
    await client.login(config.token);
})();
