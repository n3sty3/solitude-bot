const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    type: { type: String, required: true, enum: ['rotation', 'zone', 'fight', 'position', 'endgame', 'early_game'] },
    title: { type: String, required: true },
    description: { type: String, default: null },
    whenToUse: { type: String, default: null },
    tags: [{ type: String }],
    upvotes: { type: Number, default: 0 },
}, { timestamps: true });

strategySchema.index({ guildId: 1, type: 1 });
strategySchema.index({ guildId: 1, tags: 1 });

module.exports = mongoose.model('Strategy', strategySchema);
