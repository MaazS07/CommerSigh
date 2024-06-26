const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true }, // Unique URL constraint
    data: [{
        title: { type: String, default: 'N/A' },
        price: { type: String, default: 'N/A' },
        rating: { type: String, default: 'N/A' },
        availability: { type: String, default: 'N/A' },
       
        
    }],
    createdAt: { type: Date , default:new Date()}
});

module.exports = mongoose.model('Url', UrlSchema);
