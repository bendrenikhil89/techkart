const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 255,
        text: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    highlights: {
        type: String,
        required: true,
        time: true
    },
    specifications: {
        type: Array
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32,
    },
    category: {
        type: ObjectId,
        ref: "Category",
    },
    subcategories: [{
          type: ObjectId,
          ref: "SubCategory",
    }],
    quantity: Number,
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    shipping: {
        type: String,
        enum: ["Yes", "No"],
    },
    color: {
        type: String,
    },
    brand: {
        type: String,
    },
    // ratings: [{
    //     star: Number,
    //     postedBy: { type: ObjectId, ref: "User" },
    // }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);