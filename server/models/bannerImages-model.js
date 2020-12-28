const mongoose = require("mongoose");

const bannerImagesSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        unique: true,
        index: true
    }
}, {timestamps: true});

module.exports = mongoose.model('BannerImages', bannerImagesSchema);