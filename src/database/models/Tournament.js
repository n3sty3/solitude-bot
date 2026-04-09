const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    tournamentName: { type: String, required: true },
    placement: { type: String, default: null },
    points: { type: String, default: null },
    kills: { type: String, default: null },
    bestGame: { type: String, default: null },
    gamesPlayed: { type: String, default: null },
    teammates: { type: String, default: null },
    issues: { type: String, default: null },
    lessonsLearned: { type: String, default: null },
}, { timestamps: true });

tournamentSchema.index({ guildId: 1, userId: 1, createdAt: -1 });

module.exports = mongoose.model('Tournament', tournamentSchema);
