const GuildSettings = require('../database/models/GuildSettings');
const NewsCache = require('../database/models/NewsCache');
const { buildNewsEmbed } = require('../utils/embeds');
const { tSync } = require('../i18n');

const NEWS_API_URL = 'https://fortnite-api.com/v2/news/br';
const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

let newsInterval = null;

async function checkForNews(client) {
    try {
        const response = await fetch(NEWS_API_URL);
        const json = await response.json();

        if (json.status !== 200 || !json.data?.motds) return;

        // Get all guilds with news channel configured
        const guilds = await GuildSettings.find({
            'channels.news': { $ne: null },
            'features.newsEnabled': true,
        }).lean();

        if (!guilds.length) return;

        for (const newsItem of json.data.motds) {
            // Check if already cached
            let cache = await NewsCache.findOne({ newsId: newsItem.id });

            for (const guild of guilds) {
                // Skip if already posted to this guild
                if (cache?.postedGuilds?.includes(guild.guildId)) continue;

                const channel = await client.channels.fetch(guild.channels.news).catch(() => null);
                if (!channel) continue;

                const lang = guild.language || 'en';
                const tr = (key, vars) => tSync(lang, key, vars);
                const embed = buildNewsEmbed(newsItem, tr);

                await channel.send({ embeds: [embed] });

                // Update cache
                if (!cache) {
                    cache = await NewsCache.create({
                        newsId: newsItem.id,
                        title: newsItem.title,
                        postedGuilds: [guild.guildId],
                    });
                } else {
                    cache.postedGuilds.push(guild.guildId);
                    await NewsCache.updateOne(
                        { newsId: newsItem.id },
                        { $addToSet: { postedGuilds: guild.guildId } }
                    );
                }

                console.log(`📰 News posted to guild ${guild.guildId}: ${newsItem.title}`);
            }
        }
    } catch (error) {
        console.error('❌ News checker error:', error.message);
    }
}

function startNewsChecker(client) {
    // Initial check after 10s to let everything initialize
    setTimeout(() => checkForNews(client), 10_000);
    newsInterval = setInterval(() => checkForNews(client), CHECK_INTERVAL);
    console.log('📰 News checker started (every 30 min, multi-guild)');
}

function stopNewsChecker() {
    if (newsInterval) {
        clearInterval(newsInterval);
        newsInterval = null;
    }
}

module.exports = { startNewsChecker, stopNewsChecker };
