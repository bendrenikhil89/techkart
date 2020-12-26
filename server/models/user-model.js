const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required:true,
        minlength: 8
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    role: {
        type: String,
        default: 'subscriber'
    },
    cart: {
        type: Array,
        default: []
    },
    address: String,
    // wishlist: [{type: ObjectId, ref: "Product"}],
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);