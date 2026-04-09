const mongoose = require('mongoose');

const newsCacheSchema = new mongoose.Schema({
    newsId: { type: String, required: true, unique: true },
    title: { type: String },
    postedGuilds: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('NewsCache', newsCacheSchema);
