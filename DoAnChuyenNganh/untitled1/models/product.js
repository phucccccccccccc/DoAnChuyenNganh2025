const mongoose = require('mongoose');


const productSchema  = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: true
        },
        price: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('product', productSchema);
