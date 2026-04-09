const {
    SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder,
} = require('discord.js');
const { t } = require('../../i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fix')
        .setDescription('🔧 Log a recurring mistake to fix'),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const tr = async (key) => t(guildId, key);

        const modal = new ModalBuilder()
            .setCustomId('modal_fix')
            .setTitle((await tr('fix.modal_title')).slice(0, 45));

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('problem')
                    .setLabel((await tr('fix.field_problem')).slice(0, 45))
                    .setPlaceholder('We keep dying to late rotation...')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('solution')
                    .setLabel((await tr('fix.field_solution')).slice(0, 45))
                    .setPlaceholder('Start rotating earlier when zone pulls far...')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('priority')
                    .setLabel((await tr('fix.field_priority')).slice(0, 45))
                    .setPlaceholder('high / medium / low')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)),
        );

        await interaction.showModal(modal);
    },
};
