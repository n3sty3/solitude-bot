const Result = require('../database/models/Result');
const Fix = require('../database/models/Fix');
const Drop = require('../database/models/Drop');
const Strategy = require('../database/models/Strategy');
const Tournament = require('../database/models/Tournament');
const GrindSession = require('../database/models/GrindSession');
const VodReview = require('../database/models/VodReview');
const GuildSettings = require('../database/models/GuildSettings');
const { t, getGuildLanguage, tSync } = require('../i18n');
const {
    buildResultEmbed, buildFixEmbed, buildDropEmbed, buildStrategyEmbed,
    buildTournamentEmbed, buildGrindStartEmbed, buildGrindEndEmbed, buildVodEmbed,
} = require('../utils/embeds');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// ─── Helper: get channel for a feature ───
async function getFeatureChannel(client, guildId, feature) {
    const settings = await GuildSettings.findOne({ guildId }).lean();
    const channelId = settings?.channels?.[feature];
    if (!channelId) return null;
    return client.channels.fetch(channelId).catch(() => null);
}

// ─── Helper: format duration ───
function formatDuration(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
}

module.exports = {
    // ─── Result Modal ───
    modal_result: {
        customId: 'modal_result',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const data = {
                guildId,
                userId: interaction.user.id,
                username: interaction.user.displayName || interaction.user.username,
                tournament: interaction.fields.getTextInputValue('tournament'),
                placement: interaction.fields.getTextInputValue('placement'),
                kills: interaction.fields.getTextInputValue('kills') || null,
                points: interaction.fields.getTextInputValue('points') || null,
                comment: interaction.fields.getTextInputValue('comment') || null,
            };

            await Result.create(data);
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildResultEmbed({
                ...data,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            // Post to results channel if configured
            const channel = await getFeatureChannel(interaction.client, guildId, 'results');
            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: tr('result.logged'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        },
    },

    // ─── Fix Modal ───
    modal_fix: {
        customId: 'modal_fix',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const priority = (interaction.fields.getTextInputValue('priority') || 'medium').toLowerCase().trim();
            const validPriority = ['high', 'medium', 'low'].includes(priority) ? priority : 'medium';

            const data = {
                guildId,
                userId: interaction.user.id,
                username: interaction.user.displayName || interaction.user.username,
                type: 'quick',
                problem: interaction.fields.getTextInputValue('problem'),
                solution: interaction.fields.getTextInputValue('solution') || null,
                priority: validPriority,
            };

            const doc = await Fix.create(data);
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildFixEmbed({
                ...data, fixId: doc._id.toString().slice(-6),
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`fix_resolve_${doc._id}`)
                    .setLabel(tr('fix.resolved'))
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅'));

            const channel = await getFeatureChannel(interaction.client, guildId, 'fixes');
            if (channel) {
                const msg = await channel.send({ embeds: [embed], components: [row] });
                doc.messageId = msg.id;
                doc.channelId = channel.id;
                await doc.save();
                await interaction.reply({ content: tr('fix.logged'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed], components: [row] });
            }
        },
    },

    // ─── Drop Modal ───
    modal_drop: {
        customId: 'modal_drop',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const data = {
                guildId,
                userId: interaction.user.id,
                username: interaction.user.displayName || interaction.user.username,
                spotName: interaction.fields.getTextInputValue('spot_name'),
                description: interaction.fields.getTextInputValue('description') || null,
                lootRoute: interaction.fields.getTextInputValue('loot_route') || null,
                mapLink: interaction.fields.getTextInputValue('map_link') || null,
            };

            await Drop.create(data);
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildDropEmbed({
                ...data,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            const channel = await getFeatureChannel(interaction.client, guildId, 'drops');
            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: tr('drop.logged'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        },
    },

    // ─── Strategy Modal ───
    modal_strategy: {
        customId: 'modal_strategy',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const typeRaw = interaction.fields.getTextInputValue('type').toLowerCase().trim();
            const validTypes = ['rotation', 'zone', 'fight', 'position', 'endgame', 'early_game'];
            const type = validTypes.includes(typeRaw) ? typeRaw : 'fight';

            const data = {
                guildId,
                userId: interaction.user.id,
                username: interaction.user.displayName || interaction.user.username,
                type,
                title: interaction.fields.getTextInputValue('title'),
                description: interaction.fields.getTextInputValue('description') || null,
                whenToUse: interaction.fields.getTextInputValue('when_to_use') || null,
            };

            await Strategy.create(data);
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildStrategyEmbed({
                ...data,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            const channel = await getFeatureChannel(interaction.client, guildId, 'strategies');
            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: tr('strategy.logged'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        },
    },

    // ─── Tournament Modal ───
    modal_tournament: {
        customId: 'modal_tournament',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const data = {
                guildId,
                userId: interaction.user.id,
                username: interaction.user.displayName || interaction.user.username,
                tournamentName: interaction.fields.getTextInputValue('name'),
                placement: interaction.fields.getTextInputValue('placement'),
                points: interaction.fields.getTextInputValue('points') || null,
                bestGame: interaction.fields.getTextInputValue('best_game') || null,
                issues: interaction.fields.getTextInputValue('issues') || null,
            };

            await Tournament.create(data);
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildTournamentEmbed({
                ...data,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            const channel = await getFeatureChannel(interaction.client, guildId, 'tournaments');
            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: tr('tournament.logged'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        },
    },

    // ─── Grind Start Modal ───
    modal_grind_start: {
        customId: 'modal_grind_start',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const focusRaw = (interaction.fields.getTextInputValue('focus') || 'general').toLowerCase().trim();
            const validFocus = ['aim', 'builds', 'edits', 'rotations', 'boxfights', 'scrims', 'vod_review', 'general'];
            const focus = validFocus.includes(focusRaw) ? focusRaw : 'general';

            const session = await GrindSession.create({
                guildId,
                userId: interaction.user.id,
                username: interaction.user.displayName || interaction.user.username,
                goals: interaction.fields.getTextInputValue('goals') || null,
                focus,
            });

            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildGrindStartEmbed({
                goals: session.goals,
                focus: session.focus,
                sessionId: session._id.toString().slice(-6),
                username: session.username,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            const channel = await getFeatureChannel(interaction.client, guildId, 'training');
            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: tr('grind.started'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        },
    },

    // ─── Grind End Modal ───
    modal_grind_end: {
        customId: 'modal_grind_end',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const session = await GrindSession.findOne({
                guildId, userId: interaction.user.id, active: true,
            });

            if (!session) {
                const msg = await t(guildId, 'grind.no_active');
                return interaction.reply({ content: msg, ephemeral: true });
            }

            session.active = false;
            session.endTime = new Date();
            session.summary = interaction.fields.getTextInputValue('summary') || null;
            const ratingStr = interaction.fields.getTextInputValue('rating');
            session.selfRating = ratingStr ? Math.min(10, Math.max(1, parseInt(ratingStr) || 5)) : null;
            await session.save();

            const durationMs = session.endTime.getTime() - session.startTime.getTime();
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildGrindEndEmbed({
                duration: formatDuration(durationMs),
                summary: session.summary,
                rating: session.selfRating,
                sessionId: session._id.toString().slice(-6),
                username: session.username,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            const channel = await getFeatureChannel(interaction.client, guildId, 'training');
            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: tr('grind.ended'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        },
    },

    // ─── VOD Modal ───
    modal_vod: {
        customId: 'modal_vod',
        async execute(interaction) {
            const guildId = interaction.guildId;
            const data = {
                guildId,
                userId: interaction.user.id,
                username: interaction.user.displayName || interaction.user.username,
                link: interaction.fields.getTextInputValue('link'),
                timestamp: interaction.fields.getTextInputValue('timestamp'),
                mistake: interaction.fields.getTextInputValue('mistake'),
                fix: interaction.fields.getTextInputValue('fix'),
            };

            await VodReview.create(data);
            const lang = await getGuildLanguage(guildId);
            const tr = (key, vars) => tSync(lang, key, vars);

            const embed = buildVodEmbed({
                ...data,
                avatarURL: interaction.user.displayAvatarURL({ size: 64 }),
            }, tr);

            const channel = await getFeatureChannel(interaction.client, guildId, 'vod');
            if (channel) {
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: tr('vod.logged'), ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        },
    },
};
