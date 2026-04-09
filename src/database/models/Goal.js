const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    target: { type: String, required: true },
    category: { type: String, default: 'general', enum: ['aim', 'builds', 'game_sense', 'scrims', 'tournaments', 'grind_hours', 'general'] },
    deadline: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
}, { timestamps: true });

goalSchema.index({ guildId: 1, userId: 1, completed: 1 });

module.exports = mongoose.model('Goal', goalSchema);
