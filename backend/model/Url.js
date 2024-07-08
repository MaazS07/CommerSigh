const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    url: { type: String, required: true },  // Remove unique: true from here
    userId: { type: String, required: true },
    data: [{
        title: { type: String, default: 'N/A' },
        price: { type: String, default: 'N/A' },
        rating: { type: String, default: 'N/A' },
        availability: { type: String, default: 'N/A' },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

// This should be the only uniqueness constraint
UrlSchema.index({ url: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Url', UrlSchema);