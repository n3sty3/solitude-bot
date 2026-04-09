const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    language: { type: String, default: 'en', enum: ['en', 'ru', 'es', 'fr', 'de', 'pt', 'tr', 'ar'] },
    channels: {
        results: { type: String, default: null },
        fixes: { type: String, default: null },
        drops: { type: String, default: null },
        strategies: { type: String, default: null },
        news: { type: String, default: null },
        tournaments: { type: String, default: null },
        training: { type: String, default: null },
        vod: { type: String, default: null },
    },
    features: {
        newsEnabled: { type: Boolean, default: true },
        mapAlertsEnabled: { type: Boolean, default: false },
        shopAlertsEnabled: { type: Boolean, default: false },
    },
    premiumTier: { type: String, default: 'free', enum: ['free', 'pro'] },
    setupComplete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
