const mongoose = require('mongoose');

const vodReviewSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    link: { type: String, required: true },
    timestamp: { type: String, required: true },
    mistake: { type: String, required: true },
    fix: { type: String, required: true },
    severity: { type: Number, default: 3, min: 1, max: 5 },
    threadId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('VodReview', vodReviewSchema);
