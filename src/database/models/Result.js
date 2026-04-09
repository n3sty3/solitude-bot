const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    mode: { type: String, default: 'arena', enum: ['arena', 'cash_cup', 'fncs', 'ranked', 'creative', 'other'] },
    tournament: { type: String, default: null },
    placement: { type: String, default: null },
    kills: { type: String, default: null },
    points: { type: String, default: null },
    comment: { type: String, default: null },
}, { timestamps: true });

resultSchema.index({ guildId: 1, userId: 1, createdAt: -1 });

module.exports = mongoose.model('Result', resultSchema);
