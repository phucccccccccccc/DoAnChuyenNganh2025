const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    name: String,
    image: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: String,
    status: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
