const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Goal = require('../../database/models/Goal');
const { t, getGuildLanguage, tSync } = require('../../i18n');
const { COLORS } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goal')
        .setDescription('🎯 Set and track training goals')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set a new training goal')
                .addStringOption(o => o.setName('title').setDescription('Goal title').setRequired(true))
                .addStringOption(o => o.setName('target').setDescription('Target (e.g., "5h aim training this week")').setRequired(true))
                .addStringOption(o => o.setName('category').setDescription('Category')
                    .addChoices(
                        { name: '🎯 Aim', value: 'aim' },
                        { name: '🏗️ Builds', value: 'builds' },
                        { name: '🧠 Game Sense', value: 'game_sense' },
                        { name: '⚔️ Scrims', value: 'scrims' },
                        { name: '🏆 Tournaments', value: 'tournaments' },
                        { name: '⏱️ Grind Hours', value: 'grind_hours' },
                        { name: '🎮 General', value: 'general' },
                    )))
        .addSubcommand(sub =>
            sub.setName('check')
                .setDescription('Check your current goals'))
        .addSubcommand(sub =>
            sub.setName('complete')
                .setDescription('Mark a goal as completed')
                .addStringOption(o => o.setName('title').setDescription('Goal title to complete').setRequired(true))),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const guildId = interaction.guildId;
        const userId = interaction.user.id;

        if (sub === 'set') {
            const title = interaction.options.getString('title');
            const target = interaction.options.getString('target');
            const category = interaction.options.getString('category') || 'general';

            await Goal.create({ guildId, userId, username: interaction.user.displayName, title, target, category });

            const msg = await t(guildId, 'goal.logged');
            await interaction.reply({ content: msg, ephemeral: true });
        }

        if (sub === 'check') {
            const goals = await Goal.find({ guildId, userId, completed: false });

            if (!goals.length) {
                const msg = await t(guildId, 'goal.no_goals');
                return interaction.reply({ content: msg, ephemeral: true });
            }

            const lang = await getGuildLanguage(guildId);
            const embed = new EmbedBuilder()
                .setColor(COLORS.primary)
                .setTitle(tSync(lang, 'goal.progress_title'))
                .setTimestamp();

            for (const g of goals) {
                embed.addFields({
                    name: `${g.completed ? '✅' : '⬜'} ${g.title}`,
                    value: `**${tSync(lang, 'goal.target_label')}:** ${g.target}\n**${tSync(lang, 'goal.category_label')}:** ${g.category}`,
                    inline: false,
                });
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (sub === 'complete') {
            const title = interaction.options.getString('title');
            const goal = await Goal.findOneAndUpdate(
                { guildId, userId, title, completed: false },
                { completed: true, completedAt: new Date() },
            );

            if (!goal) {
                return interaction.reply({ content: '❌ Goal not found.', ephemeral: true });
            }

            const msg = await t(guildId, 'goal.completed');
            await interaction.reply({ content: msg, ephemeral: true });
        }
    },
};
