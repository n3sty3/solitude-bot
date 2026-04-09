const mongoose = require('mongoose');

const grindSessionSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    goals: { type: String, default: null },
    focus: { type: String, default: 'general', enum: ['aim', 'builds', 'edits', 'rotations', 'boxfights', 'scrims', 'vod_review', 'general'] },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: null },
    summary: { type: String, default: null },
    selfRating: { type: Number, default: null, min: 1, max: 10 },
    active: { type: Boolean, default: true },
}, { timestamps: true });

grindSessionSchema.index({ guildId: 1, userId: 1, active: 1 });

module.exports = mongoose.model('GrindSession', grindSessionSchema);
