const {
    SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder,
} = require('discord.js');
const { t } = require('../../i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('strategy')
        .setDescription('📋 Save a strategy for your team'),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const tr = async (key) => t(guildId, key);

        const modal = new ModalBuilder()
            .setCustomId('modal_strategy')
            .setTitle((await tr('strategy.modal_title')).slice(0, 45));

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('type')
                    .setLabel((await tr('strategy.field_type')).slice(0, 45))
                    .setPlaceholder('rotation / zone / fight / position / endgame / early_game')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('title')
                    .setLabel((await tr('strategy.field_title')).slice(0, 45))
                    .setPlaceholder('Late game surge play')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel((await tr('strategy.field_description')).slice(0, 45))
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('when_to_use')
                    .setLabel((await tr('strategy.field_when')).slice(0, 45))
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)),
        );

        await interaction.showModal(modal);
    },
};
