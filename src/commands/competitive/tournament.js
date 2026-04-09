const {
    SlashCommandBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder,
} = require('discord.js');
const { t } = require('../../i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tournament')
        .setDescription('🏆 Log a tournament result'),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const tr = async (key) => t(guildId, key);

        const modal = new ModalBuilder()
            .setCustomId('modal_tournament')
            .setTitle((await tr('tournament.modal_title')).slice(0, 45));

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('name')
                    .setLabel((await tr('tournament.field_name')).slice(0, 45))
                    .setPlaceholder('FNCS Week 1 / Cash Cup...')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('placement')
                    .setLabel((await tr('tournament.field_placement')).slice(0, 45))
                    .setPlaceholder('#42 / Top 100')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('points')
                    .setLabel((await tr('tournament.field_points')).slice(0, 45))
                    .setPlaceholder('128')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('best_game')
                    .setLabel((await tr('tournament.field_best_game')).slice(0, 45))
                    .setPlaceholder('Game 3: 1st place, 8 kills')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('issues')
                    .setLabel((await tr('tournament.field_issues')).slice(0, 45))
                    .setPlaceholder('Died to storm rotation game 5...')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)),
        );

        await interaction.showModal(modal);
    },
};
