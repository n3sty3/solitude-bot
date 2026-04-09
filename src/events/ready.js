const { startNewsChecker } = require('../services/newsChecker');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        console.log(`✅ Solitude online: ${client.user.tag}`);
        console.log(`📡 Servers: ${client.guilds.cache.size}`);

        // Start multi-guild news checker
        startNewsChecker(client);
    },
};
