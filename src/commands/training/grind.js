const {
    SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder,
} = require('discord.js');
const GrindSession = require('../../database/models/GrindSession');
const { t } = require('../../i18n');
const { buildGrindStartEmbed, buildGrindEndEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grind')
        .setDescription('🏋️ Manage your training sessions')
        .addSubcommand(sub =>
            sub.setName('start').setDescription('Start a grind session'))
        .addSubcommand(sub =>
            sub.setName('end').setDescription('End your current grind session'))
        .addSubcommand(sub =>
            sub.setName('stats').setDescription('View your grind statistics')),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const guildId = interaction.guildId;
        const tr = async (key, vars) => t(guildId, key, vars);

        if (sub === 'start') {
            // Check for active session
            const active = await GrindSession.findOne({
                guildId, userId: interaction.user.id, active: true,
            });
            if (active) {
                return interaction.reply({ content: await tr('grind.already_active'), ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId('modal_grind_start')
                .setTitle((await tr('grind.modal_start_title')).slice(0, 45));

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('goals')
                        .setLabel((await tr('grind.field_goals')).slice(0, 45))
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('focus')
                        .setLabel((await tr('grind.field_focus')).slice(0, 45))
                        .setPlaceholder('aim / builds / edits / rotations / boxfights / scrims / general')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)),
            );

            await interaction.showModal(modal);
        }

        if (sub === 'end') {
            const active = await GrindSession.findOne({
                guildId, userId: interaction.user.id, active: true,
            });
            if (!active) {
                return interaction.reply({ content: await tr('grind.no_active'), ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId('modal_grind_end')
                .setTitle((await tr('grind.modal_end_title')).slice(0, 45));

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('summary')
                        .setLabel((await tr('grind.field_summary')).slice(0, 45))
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('rating')
                        .setLabel((await tr('grind.field_rating')).slice(0, 45))
                        .setPlaceholder('1-10')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)),
            );

            await interaction.showModal(modal);
        }

        if (sub === 'stats') {
            await interaction.deferReply({ ephemeral: true });

            const sessions = await GrindSession.find({
                guildId, userId: interaction.user.id, active: false,
            }).sort({ createdAt: -1 }).limit(30);

            if (!sessions.length) {
                return interaction.editReply({ content: await tr('common.no_data') });
            }

            let totalMs = 0;
            let count = sessions.length;
            for (const s of sessions) {
                if (s.endTime && s.startTime) {
                    totalMs += s.endTime.getTime() - s.startTime.getTime();
                }
            }

            const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(1);
            const avgMins = Math.round(totalMs / count / (1000 * 60));

            const { EmbedBuilder } = require('discord.js');
            const { COLORS } = require('../../utils/embeds');

            const embed = new EmbedBuilder()
                .setColor(COLORS.cyan)
                .setTitle('📊 Grind Stats')
                .addFields(
                    { name: '📅 Sessions (last 30)', value: String(count), inline: true },
                    { name: '⏱️ Total Time', value: `${totalHours}h`, inline: true },
                    { name: '📏 Avg Session', value: `${avgMins} min`, inline: true },
                )
                .setFooter({ text: `${interaction.user.displayName} • Solitude` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    },
};
