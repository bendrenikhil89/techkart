const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const subCategorySchema = new mongoose.Schema({
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
    parent: {
        type: ObjectId,
        ref: "Category",
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('SubCategory', subCategorySchema);