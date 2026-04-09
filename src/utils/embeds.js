const { EmbedBuilder } = require('discord.js');

// ─── Color Palette (Solitude brand) ───
const COLORS = {
    primary: 0x5865F2,    // Discord blurple — main brand
    purple: 0x9B59B6,     // results
    gold: 0xF1C40F,       // tournaments
    green: 0x2ECC71,      // drops, success
    blue: 0x3498DB,       // strategies
    red: 0xE74C3C,        // high priority
    orange: 0xE67E22,     // medium priority
    lime: 0x27AE60,       // low priority
    cyan: 0x00D2D3,       // grind sessions
    pink: 0xE91E63,       // VOD reviews
    white: 0xECF0F1,      // news
    dark: 0x2C2F33,       // neutral/info
};

const PRIORITY_COLORS = { high: COLORS.red, medium: COLORS.orange, low: COLORS.lime };
const PRIORITY_EMOJI = { high: '🔴', medium: '🟡', low: '🟢' };

const STRATEGY_EMOJI = {
    rotation: '🔄', zone: '🎯', fight: '⚔️',
    position: '📍', endgame: '🏁', early_game: '🌅',
};

const FOCUS_EMOJI = {
    aim: '🎯', builds: '🏗️', edits: '✏️', rotations: '🔄',
    boxfights: '📦', scrims: '⚔️', vod_review: '🎬', general: '🎮',
};

// ─── Result Embed ───
function buildResultEmbed(data, t) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.purple)
        .setTitle(t('result.title'))
        .addFields(
            { name: t('result.tournament_label'), value: data.tournament || t('result.not_specified'), inline: false },
            { name: t('result.placement_label'), value: data.placement || '—', inline: true },
            { name: t('result.kills_label'), value: data.kills || '—', inline: true },
            { name: t('result.points_label'), value: data.points || '—', inline: true },
        )
        .setFooter({ text: `${data.username} • Solitude`, iconURL: data.avatarURL })
        .setTimestamp();

    if (data.comment) {
        embed.addFields({ name: t('result.comment_label'), value: data.comment, inline: false });
    }
    return embed;
}

// ─── Fix Embed ───
function buildFixEmbed(data, t) {
    const priorityColor = PRIORITY_COLORS[data.priority] || COLORS.orange;
    const priorityEmoji = PRIORITY_EMOJI[data.priority] || '🟡';

    const embed = new EmbedBuilder()
        .setColor(priorityColor)
        .setTitle(t('fix.title', { emoji: priorityEmoji }))
        .addFields({ name: t('fix.problem_label'), value: data.problem, inline: false })
        .setFooter({ text: `${data.username} • ID: ${data.fixId || '?'}`, iconURL: data.avatarURL })
        .setTimestamp();

    if (data.solution) {
        embed.addFields({ name: t('fix.solution_label'), value: data.solution, inline: false });
    }
    return embed;
}

// ─── Drop Embed ───
function buildDropEmbed(data, t) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.green)
        .setTitle(t('drop.title', { name: data.spotName }))
        .addFields({ name: t('drop.description_label'), value: data.description || t('result.not_specified'), inline: false })
        .setFooter({ text: data.username, iconURL: data.avatarURL })
        .setTimestamp();

    if (data.lootRoute) {
        embed.addFields({ name: t('drop.loot_route_label'), value: data.lootRoute, inline: false });
    }
    if (data.mapLink) {
        embed.addFields({ name: t('drop.map_label'), value: `[${t('drop.map_link_text')}](${data.mapLink})`, inline: false });
    }
    return embed;
}

// ─── Strategy Embed ───
function buildStrategyEmbed(data, t) {
    const typeEmoji = STRATEGY_EMOJI[data.type] || '📋';
    const typeLabel = t(`strategy.types.${data.type}`) || data.type;

    const embed = new EmbedBuilder()
        .setColor(COLORS.blue)
        .setTitle(t('strategy.title', { emoji: typeEmoji, title: data.title }))
        .setDescription(`**${t('strategy.type_label')}:** ${typeLabel}`)
        .addFields({ name: t('strategy.description_label'), value: data.description || t('result.not_specified'), inline: false })
        .setFooter({ text: data.username, iconURL: data.avatarURL })
        .setTimestamp();

    if (data.whenToUse) {
        embed.addFields({ name: t('strategy.when_label'), value: data.whenToUse, inline: false });
    }
    return embed;
}

// ─── Tournament Embed ───
function buildTournamentEmbed(data, t) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.gold)
        .setTitle(t('tournament.title', { name: data.tournamentName }))
        .addFields(
            { name: t('tournament.placement_label'), value: data.placement || '—', inline: true },
            { name: t('tournament.points_label'), value: data.points || '—', inline: true },
            { name: t('tournament.kills_label'), value: data.kills || '—', inline: true },
        )
        .setFooter({ text: `${data.username} • Solitude`, iconURL: data.avatarURL })
        .setTimestamp();

    if (data.bestGame) embed.addFields({ name: t('tournament.best_game_label'), value: data.bestGame, inline: false });
    if (data.teammates) embed.addFields({ name: t('tournament.teammates_label'), value: data.teammates, inline: true });
    if (data.issues) embed.addFields({ name: t('tournament.issues_label'), value: data.issues, inline: false });
    if (data.lessonsLearned) embed.addFields({ name: t('tournament.lessons_label'), value: data.lessonsLearned, inline: false });
    return embed;
}

// ─── Grind Session Embeds ───
function buildGrindStartEmbed(data, t) {
    const focusEmoji = FOCUS_EMOJI[data.focus] || '🎮';
    return new EmbedBuilder()
        .setColor(COLORS.cyan)
        .setTitle(t('grind.start_title'))
        .setDescription(`**${t('grind.goals_label')}:**\n${data.goals || t('grind.no_goals')}`)
        .addFields({ name: t('grind.focus_label'), value: `${focusEmoji} ${t(`grind.focus_types.${data.focus}`)}`, inline: true })
        .setFooter({ text: `${data.username} • ${t('grind.session_id', { id: data.sessionId })}`, iconURL: data.avatarURL })
        .setTimestamp();
}

function buildGrindEndEmbed(data, t) {
    return new EmbedBuilder()
        .setColor(COLORS.cyan)
        .setTitle(t('grind.end_title'))
        .addFields(
            { name: t('grind.duration_label'), value: data.duration || '—', inline: true },
            { name: t('grind.rating_label'), value: data.rating ? `${'⭐'.repeat(Math.min(data.rating, 5))} (${data.rating}/10)` : '—', inline: true },
            { name: t('grind.summary_label'), value: data.summary || t('result.not_specified'), inline: false },
        )
        .setFooter({ text: `${data.username} • ${t('grind.session_id', { id: data.sessionId })}`, iconURL: data.avatarURL })
        .setTimestamp();
}

// ─── VOD Review Embed ───
function buildVodEmbed(data, t) {
    return new EmbedBuilder()
        .setColor(COLORS.pink)
        .setTitle(t('vod.title'))
        .setDescription(`**${t('vod.link_label')}:** [${t('vod.link_text')}](${data.link})\n**${t('vod.timestamp_label')}:** \`${data.timestamp}\``)
        .addFields(
            { name: t('vod.mistake_label'), value: data.mistake, inline: false },
            { name: t('vod.fix_label'), value: data.fix, inline: false },
        )
        .setFooter({ text: `${data.username} • VOD Review`, iconURL: data.avatarURL })
        .setTimestamp();
}

// ─── Stats Embed ───
function buildStatsEmbed(data, t) {
    return new EmbedBuilder()
        .setColor(COLORS.primary)
        .setTitle(t('stats.title', { name: data.name }))
        .addFields(
            { name: t('stats.level'), value: String(data.level), inline: true },
            { name: t('stats.wins'), value: String(data.wins), inline: true },
            { name: t('stats.win_rate'), value: data.winRate, inline: true },
            { name: t('stats.kd'), value: String(data.kd), inline: true },
            { name: t('stats.kills'), value: String(data.kills), inline: true },
            { name: t('stats.playtime'), value: data.playTime, inline: true },
        )
        .setFooter({ text: `${data.username} • Solitude`, iconURL: data.avatarURL })
        .setTimestamp();
}

// ─── News Embed ───
function buildNewsEmbed(newsItem, t) {
    return new EmbedBuilder()
        .setColor(COLORS.white)
        .setTitle(`📰 ${newsItem.title}`)
        .setDescription(newsItem.body || '')
        .setImage(newsItem.image)
        .setFooter({ text: t('news.footer') })
        .setTimestamp();
}

// ─── Warmup Embed ───
function buildWarmupEmbed(drills, t) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.cyan)
        .setTitle(t('warmup.title'))
        .setDescription(t('warmup.description'))
        .setTimestamp();

    drills.forEach((drill, i) => {
        embed.addFields({ name: t('warmup.drill_label', { n: i + 1 }), value: drill, inline: false });
    });

    return embed;
}

// ─── Goal Embed ───
function buildGoalEmbed(data, t) {
    return new EmbedBuilder()
        .setColor(COLORS.primary)
        .setTitle(t('goal.title'))
        .addFields(
            { name: t('goal.target_label'), value: data.target, inline: false },
            { name: t('goal.category_label'), value: data.category, inline: true },
        )
        .setFooter({ text: `${data.username} • Solitude`, iconURL: data.avatarURL })
        .setTimestamp();
}

module.exports = {
    COLORS, PRIORITY_COLORS, PRIORITY_EMOJI, STRATEGY_EMOJI, FOCUS_EMOJI,
    buildResultEmbed, buildFixEmbed, buildDropEmbed, buildStrategyEmbed,
    buildTournamentEmbed, buildGrindStartEmbed, buildGrindEndEmbed,
    buildVodEmbed, buildStatsEmbed, buildNewsEmbed, buildWarmupEmbed,
    buildGoalEmbed,
};
