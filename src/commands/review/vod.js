const {
    SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder,
} = require('discord.js');
const { t } = require('../../i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vod')
        .setDescription('🎬 Submit a VOD review'),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const tr = async (key) => t(guildId, key);

        const modal = new ModalBuilder()
            .setCustomId('modal_vod')
            .setTitle((await tr('vod.modal_title')).slice(0, 45));

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('link')
                    .setLabel((await tr('vod.field_link')).slice(0, 45))
                    .setPlaceholder('https://medal.tv/...')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('timestamp')
                    .setLabel((await tr('vod.field_timestamp')).slice(0, 45))
                    .setPlaceholder('14:32')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('mistake')
                    .setLabel((await tr('vod.field_mistake')).slice(0, 45))
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('fix')
                    .setLabel((await tr('vod.field_fix')).slice(0, 45))
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)),
        );

        await interaction.showModal(modal);
    },
};
