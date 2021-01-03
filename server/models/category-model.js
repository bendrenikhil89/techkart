const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Too short'],
        maxlength: [32, 'Too long'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    images: {
        type: Array,
    }
}, {timestamps: true});

module.exports = mongoose.model('Category', categorySchema);