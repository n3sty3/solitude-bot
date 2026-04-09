const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../../database/models/GuildSettings');
const { t, clearLangCache, getAvailableLanguages } = require('../../i18n');

const LANG_NAMES = {
    en: '🇬🇧 English',
    ru: '🇷🇺 Русский',
    es: '🇪🇸 Español',
    fr: '🇫🇷 Français',
    de: '🇩🇪 Deutsch',
    pt: '🇧🇷 Português',
    tr: '🇹🇷 Türkçe',
    ar: '🇸🇦 العربية',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('🌍 Set the bot language for this server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => {
            const opt = option
                .setName('lang')
                .setDescription('Language to set')
                .setRequired(true);

            for (const lang of getAvailableLanguages()) {
                opt.addChoices({ name: LANG_NAMES[lang] || lang, value: lang });
            }
            return opt;
        }),

    async execute(interaction) {
        const lang = interaction.options.getString('lang');
        const guildId = interaction.guildId;

        await GuildSettings.findOneAndUpdate(
            { guildId },
            { $set: { language: lang }, $setOnInsert: { guildId } },
            { upsert: true }
        );

        clearLangCache(guildId);

        const msg = await t(guildId, 'language.changed', { lang: LANG_NAMES[lang] || lang });
        await interaction.reply({ content: msg, ephemeral: true });
    },
};
