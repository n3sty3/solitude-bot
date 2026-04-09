const {
    SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder,
} = require('discord.js');
const { t } = require('../../i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drop')
        .setDescription('📍 Save a drop spot'),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const tr = async (key) => t(guildId, key);

        const modal = new ModalBuilder()
            .setCustomId('modal_drop')
            .setTitle((await tr('drop.modal_title')).slice(0, 45));

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('spot_name')
                    .setLabel((await tr('drop.field_name')).slice(0, 45))
                    .setPlaceholder('Pleasant Park / Retail Row...')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel((await tr('drop.field_description')).slice(0, 45))
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('loot_route')
                    .setLabel((await tr('drop.field_loot_route')).slice(0, 45))
                    .setPlaceholder('Land on blue house → chest → ammo box...')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('map_link')
                    .setLabel((await tr('drop.field_map_link')).slice(0, 45))
                    .setPlaceholder('https://fortnite.gg/...')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)),
        );

        await interaction.showModal(modal);
    },
};
