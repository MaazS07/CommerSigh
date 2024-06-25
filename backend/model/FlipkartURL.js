const mongoose = require('mongoose');

const FlipkartDataSchema = new mongoose.Schema({
    title: { type: String, default: 'N/A' },
    price: { type: String, default: 'N/A' },
    rating: { type: String, default: 'N/A' },
    availability: { type: String, default: 'N/A' },
}, { _id: false });

const FlipkartUrlSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    data: [FlipkartDataSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FlipkartUrl', FlipkartUrlSchema);
