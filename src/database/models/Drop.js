const mongoose = require('mongoose');

const dropSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    spotName: { type: String, required: true },
    description: { type: String, default: null },
    lootRoute: { type: String, default: null },
    mapLink: { type: String, default: null },
    tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Drop', dropSchema);
