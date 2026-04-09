const { SlashCommandBuilder } = require('discord.js');
const { t, getGuildLanguage, tSync } = require('../../i18n');
const { buildStatsEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('📈 Look up Fortnite player stats')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('Epic Games username')
                .setRequired(true)),

    async execute(interaction) {
        const nickname = interaction.options.getString('player');
        const guildId = interaction.guildId;
        await interaction.deferReply();

        try {
            const response = await fetch(
                `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(nickname)}`,
                { headers: { 'Authorization': config.fortniteApiKey } }
            );

            const json = await response.json();

            if (json.status !== 200) {
                const msg = await t(guildId, 'stats.not_found', { name: nickname });
                return interaction.editReply(msg);
            }

            const stats = json.data.stats.all.overall;
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildStatsEmbed({
                name: json.data.account.name,
                level: json.data.battlePass?.level || '?',
                wins: stats.wins,
                winRate: (stats.winRate).toFixed(1) + '%',
                kd: (stats.kd).toFixed(2),
                kills: stats.kills,
                playTime: tr('stats.hours', { h: Math.floor(stats.minutesPlayed / 60) }),
                username: interaction.user.displayName || interaction.user.username,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const msg = await t(guildId, 'stats.api_error');
            await interaction.editReply(msg);
        }
    },
};
