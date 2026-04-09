const fs = require('fs');
const path = require('path');
const GuildSettings = require('../database/models/GuildSettings');

// ─── Load all locale files ───
const locales = {};
const localesDir = path.join(__dirname, 'locales');

for (const file of fs.readdirSync(localesDir).filter(f => f.endsWith('.json'))) {
    const lang = file.replace('.json', '');
    locales[lang] = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'));
}

console.log(`🌍 Loaded languages: ${Object.keys(locales).join(', ')}`);

// ─── Guild language cache (avoid DB reads on every message) ───
const langCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get the language for a guild.
 * @param {string} guildId
 * @returns {Promise<string>}
 */
async function getGuildLanguage(guildId) {
    if (!guildId) return 'en';

    const cached = langCache.get(guildId);
    if (cached && Date.now() - cached.time < CACHE_TTL) {
        return cached.lang;
    }

    try {
        const settings = await GuildSettings.findOne({ guildId }).lean();
        const lang = settings?.language || 'en';
        langCache.set(guildId, { lang, time: Date.now() });
        return lang;
    } catch {
        return 'en';
    }
}

/**
 * Translate a key for a guild.
 * Supports nested keys: t(guildId, 'result.title')
 * Supports variables: t(guildId, 'grind.duration', { time: '2h 30m' })
 *
 * @param {string} guildId
 * @param {string} key - Dot-notation key (e.g., 'result.title')
 * @param {object} vars - Replacement variables (e.g., { player: 'Nick' })
 * @returns {Promise<string>}
 */
async function t(guildId, key, vars = {}) {
    const lang = await getGuildLanguage(guildId);
    let value = getNestedValue(locales[lang], key);

    // Fallback to English if key not found
    if (value === undefined) {
        value = getNestedValue(locales['en'], key);
    }

    // If still not found, return the key itself
    if (value === undefined) return key;

    // Replace {variable} placeholders
    for (const [k, v] of Object.entries(vars)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }

    return value;
}

/**
 * Synchronous translate — use when you already know the language.
 */
function tSync(lang, key, vars = {}) {
    let value = getNestedValue(locales[lang], key);
    if (value === undefined) value = getNestedValue(locales['en'], key);
    if (value === undefined) return key;

    for (const [k, v] of Object.entries(vars)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return value;
}

/**
 * Clear cached language for a guild (call after /language command).
 */
function clearLangCache(guildId) {
    langCache.delete(guildId);
}

/**
 * Get all available languages.
 */
function getAvailableLanguages() {
    return Object.keys(locales);
}

// ─── Helper: resolve dot-notation keys ───
function getNestedValue(obj, key) {
    if (!obj) return undefined;
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

module.exports = { t, tSync, getGuildLanguage, clearLangCache, getAvailableLanguages };
