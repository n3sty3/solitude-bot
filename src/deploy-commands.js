const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const commands = [];

// Recursively load commands from subdirectories
function loadCommands(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            loadCommands(fullPath);
        } else if (entry.name.endsWith('.js')) {
            const command = require(fullPath);
            if (command.data) {
                commands.push(command.data.toJSON());
            }
        }
    }
}

loadCommands(path.join(__dirname, 'commands'));

const rest = new REST().setToken(config.token);

(async () => {
    try {
        console.log(`🔄 Registering ${commands.length} global commands...`);

        // Global registration (works on all servers)
        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );

        console.log(`✅ Registered ${data.length} commands:`);
        data.forEach(cmd => console.log(`   /${cmd.name} — ${cmd.description}`));
    } catch (error) {
        console.error('❌ Command registration error:', error);
    }
})();
