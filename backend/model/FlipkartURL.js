// model/FlipkartURL.js
const mongoose = require('mongoose');

const FlipkartURLSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true }, 
    data: [{
        title: { type: String, default: 'N/A' },
        price: { type: String, default: 'N/A' },
        rating: { type: String, default: 'N/A' },
        availability: { type: String, default: 'N/A' },
    }],
    createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model('FlipkartURL', FlipkartURLSchema);
