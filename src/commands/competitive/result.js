const {
    SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder,
} = require('discord.js');
const { t } = require('../../i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('result')
        .setDescription('🏆 Log a match result'),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const tr = async (key) => t(guildId, key);

        const modal = new ModalBuilder()
            .setCustomId('modal_result')
            .setTitle((await tr('result.modal_title')).slice(0, 45));

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('tournament')
                    .setLabel((await tr('result.field_tournament')).slice(0, 45))
                    .setPlaceholder('Arena / Cash Cup / FNCS...')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('placement')
                    .setLabel((await tr('result.field_placement')).slice(0, 45))
                    .setPlaceholder('1st, top 5, #12...')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('kills')
                    .setLabel((await tr('result.field_kills')).slice(0, 45))
                    .setPlaceholder('7')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('points')
                    .setLabel((await tr('result.field_points')).slice(0, 45))
                    .setPlaceholder('48')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('comment')
                    .setLabel((await tr('result.field_comment')).slice(0, 45))
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)),
        );

        await interaction.showModal(modal);
    },
};
