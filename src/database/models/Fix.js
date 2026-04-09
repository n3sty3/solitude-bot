const mongoose = require('mongoose');

const fixSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    type: { type: String, required: true, enum: ['quick', 'long', 'tournament'] },
    problem: { type: String, required: true },
    solution: { type: String, default: null },
    priority: { type: String, default: 'medium', enum: ['high', 'medium', 'low'] },
    status: { type: String, default: 'open', enum: ['open', 'in_progress', 'resolved'] },
    assignee: { type: String, default: null },
    messageId: { type: String, default: null },
    channelId: { type: String, default: null },
}, { timestamps: true });

fixSchema.index({ guildId: 1, status: 1 });

module.exports = mongoose.model('Fix', fixSchema);
