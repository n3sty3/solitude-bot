const modalHandlers = require('../modals/handlers');
const Fix = require('../database/models/Fix');
const { t, getGuildLanguage, tSync } = require('../i18n');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // ─── Slash Commands ───
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`❌ Command error /${interaction.commandName}:`, error);
                const msg = await t(interaction.guildId, 'common.error');
                const reply = { content: msg, ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
            return;
        }

        // ─── Modal Submissions ───
        if (interaction.isModalSubmit()) {
            const handler = modalHandlers[interaction.customId];
            if (!handler) return;

            try {
                await handler.execute(interaction);
            } catch (error) {
                console.error(`❌ Modal error ${interaction.customId}:`, error);
                const msg = await t(interaction.guildId, 'common.modal_error');
                const reply = { content: msg, ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
            return;
        }

        // ─── Button Interactions ───
        if (interaction.isButton()) {
            if (interaction.customId.startsWith('fix_resolve_')) {
                const fixId = interaction.customId.replace('fix_resolve_', '');

                await Fix.findByIdAndUpdate(fixId, { status: 'resolved' });

                const lang = await getGuildLanguage(interaction.guildId);
                const { EmbedBuilder } = require('discord.js');
                const embed = interaction.message.embeds[0];
                const updatedEmbed = EmbedBuilder.from(embed)
                    .setColor(0x2ECC71)
                    .setTitle(tSync(lang, 'fix.resolved'));

                await interaction.update({ embeds: [updatedEmbed], components: [] });
            }
        }
    },
};
