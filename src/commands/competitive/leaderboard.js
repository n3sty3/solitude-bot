const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Result = require('../../database/models/Result');
const GrindSession = require('../../database/models/GrindSession');
const { t, getGuildLanguage, tSync } = require('../../i18n');
const { COLORS } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('🏅 View server leaderboard')
        .addStringOption(o =>
            o.setName('type')
                .setDescription('Leaderboard type')
                .addChoices(
                    { name: '💀 Top Kills', value: 'kills' },
                    { name: '🏆 Most Results', value: 'results' },
                    { name: '⏱️ Most Grind Hours', value: 'grind' },
                )),

    async execute(interaction) {
        const type = interaction.options.getString('type') || 'kills';
        const guildId = interaction.guildId;
        await interaction.deferReply();

        const lang = await getGuildLanguage(guildId);
        const tr = (key, vars) => tSync(lang, key, vars);

        let lines = [];

        if (type === 'kills') {
            const results = await Result.aggregate([
                { $match: { guildId } },
                { $group: { _id: '$username', totalKills: { $sum: { $toInt: { $ifNull: ['$kills', '0'] } } } } },
                { $sort: { totalKills: -1 } },
                { $limit: 10 },
            ]);
            lines = results.map((r, i) => `**${i + 1}.** ${r._id} — **${r.totalKills}** kills`);
        }

        if (type === 'results') {
            const results = await Result.aggregate([
                { $match: { guildId } },
                { $group: { _id: '$username', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]);
            lines = results.map((r, i) => `**${i + 1}.** ${r._id} — **${r.count}** results logged`);
        }

        if (type === 'grind') {
            const sessions = await GrindSession.aggregate([
                { $match: { guildId, active: false, endTime: { $ne: null } } },
                {
                    $group: {
                        _id: '$username',
                        totalMs: { $sum: { $subtract: ['$endTime', '$startTime'] } },
                    }
                },
                { $sort: { totalMs: -1 } },
                { $limit: 10 },
            ]);
            lines = sessions.map((s, i) => {
                const hours = (s.totalMs / (1000 * 60 * 60)).toFixed(1);
                return `**${i + 1}.** ${s._id} — **${hours}h** grind time`;
            });
        }

        const embed = new EmbedBuilder()
            .setColor(COLORS.gold)
            .setTitle(tr('leaderboard.title', { type: tr(`leaderboard.${type}`) }))
            .setDescription(lines.length ? lines.join('\n') : tr('leaderboard.empty'))
            .setFooter({ text: 'Solitude' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
