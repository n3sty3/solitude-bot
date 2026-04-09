const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { t } = require('../../i18n');
const { COLORS } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📖 View all Solitude commands'),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const tr = async (key, vars) => t(guildId, key, vars);

        const embed = new EmbedBuilder()
            .setColor(COLORS.primary)
            .setTitle(await tr('help.title'))
            .setDescription(await tr('help.description'))
            .addFields(
                {
                    name: await tr('help.training_title'),
                    value: [
                        '`/grind start` — Start a training session',
                        '`/grind end` — End your session',
                        '`/grind stats` — View grind statistics',
                        '`/warmup` — Get a warmup routine',
                        '`/goal set` — Set a training goal',
                        '`/goal check` — Check goal progress',
                    ].join('\n'),
                    inline: false,
                },
                {
                    name: await tr('help.competitive_title'),
                    value: [
                        '`/result` — Log a match result',
                        '`/tournament` — Log a tournament',
                        '`/stats` — Fortnite player stats',
                        '`/leaderboard` — Server leaderboard',
                    ].join('\n'),
                    inline: false,
                },
                {
                    name: await tr('help.review_title'),
                    value: [
                        '`/vod` — Submit a VOD review',
                        '`/fix` — Log a recurring mistake',
                        '`/strategy` — Save a strategy',
                        '`/drop` — Save a drop spot',
                    ].join('\n'),
                    inline: false,
                },
                {
                    name: await tr('help.admin_title'),
                    value: [
                        '`/setup` — Configure channels',
                        '`/language` — Set bot language',
                    ].join('\n'),
                    inline: false,
                },
            )
            .setFooter({ text: await tr('help.footer') })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
