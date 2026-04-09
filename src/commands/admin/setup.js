const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../../database/models/GuildSettings');
const { t } = require('../../i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('⚙️ Configure Solitude for this server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('feature')
                .setDescription('Which feature channel to set')
                .setRequired(true)
                .addChoices(
                    { name: '🏆 Results', value: 'results' },
                    { name: '🔧 Fixes', value: 'fixes' },
                    { name: '📍 Drop Spots', value: 'drops' },
                    { name: '📋 Strategies', value: 'strategies' },
                    { name: '📰 News Feed', value: 'news' },
                    { name: '🏆 Tournaments', value: 'tournaments' },
                    { name: '🏋️ Training', value: 'training' },
                    { name: '🎬 VOD Reviews', value: 'vod' },
                ))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to use')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        const feature = interaction.options.getString('feature');
        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guildId;

        const update = { [`channels.${feature}`]: channel.id };

        await GuildSettings.findOneAndUpdate(
            { guildId },
            { $set: update, $setOnInsert: { guildId } },
            { upsert: true, new: true }
        );

        const tr = (key, vars) => t(guildId, key, vars);
        const msg = await tr('setup.channel_set', { feature, channel: `<#${channel.id}>` });
        await interaction.reply({ content: msg, ephemeral: true });
    },
};
