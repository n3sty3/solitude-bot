const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../../i18n');
const { buildWarmupEmbed } = require('../../utils/embeds');

const WARMUP_DRILLS = {
    aim: [
        '🎯 Skaavok Aim Trainer — 10 min tracking + flicks',
        '🎯 Piece Control Kill Race — 5 min',
        '🎯 Aim Duel 1v1 — 3 rounds',
        '🎯 Headshot-only Zone Wars — 5 min',
        '🎯 Tile Frenzy (Medium) — 5 min',
    ],
    builds: [
        '🏗️ Raider\'s 1v1 Build Fight — 5 min free build',
        '🏗️ Triple Edit Race — 3 runs',
        '🏗️ Retake practice (tunneling + high ground) — 10 min',
        '🏗️ Protected side jumps — 5 min drill',
        '🏗️ Ramp rush + 90s + cone jumps — 5 min',
    ],
    edits: [
        '✏️ Edit Course (Candook\'s) — 3 runs, beat your time',
        '✏️ Mongraal Classic — 5 min',
        '✏️ Edit on release practice — 10 min',
        '✏️ Double edit maps — 3 runs',
        '✏️ Window + door combo edits — 5 min',
    ],
    boxfights: [
        '📦 Box Fight 1v1 — Best of 10',
        '📦 Piece control drills — 5 min',
        '📦 Right-hand peek practice — 5 min',
        '📦 Box PvP (hold box + take box) — 10 min',
        '📦 Realistic fight scenarios — 5 min',
    ],
    general: [
        '🎮 Free build warm up — 5 min',
        '🎮 Edit course — 3 runs',
        '🎮 Aim trainer — 5 min',
        '🎮 Zone Wars — 3 games',
        '🎮 Box fight 1v1 — Best of 5',
    ],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warmup')
        .setDescription('🏋️ Get a randomized warmup routine')
        .addStringOption(option =>
            option.setName('focus')
                .setDescription('What to focus on')
                .addChoices(
                    { name: '🎯 Aim', value: 'aim' },
                    { name: '🏗️ Builds', value: 'builds' },
                    { name: '✏️ Edits', value: 'edits' },
                    { name: '📦 Box Fights', value: 'boxfights' },
                    { name: '🎮 General', value: 'general' },
                )),

    async execute(interaction) {
        const focus = interaction.options.getString('focus') || 'general';
        const guildId = interaction.guildId;
        const tr = (key, vars) => t(guildId, key, vars);

        // Pick 3-4 random drills
        const pool = WARMUP_DRILLS[focus] || WARMUP_DRILLS.general;
        const shuffled = pool.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(4, pool.length));

        const tSync = require('../../i18n').tSync;
        const { getGuildLanguage } = require('../../i18n');
        const lang = await getGuildLanguage(guildId);

        const embed = buildWarmupEmbed(selected, (key, vars) => tSync(lang, key, vars));
        await interaction.reply({ embeds: [embed] });
    },
};
