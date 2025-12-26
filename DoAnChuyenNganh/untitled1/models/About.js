const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    title: String,
    description: String,
    features: [
        {
            icon: String,
            title: String,
            description: String
        }
    ],
    mission: String,
    vision: String,
    image: String,
    status: { type: Boolean, default: true }
});

module.exports = mongoose.model('About', aboutSchema, 'about'); // ⚠️ ÉP COLLECTION
