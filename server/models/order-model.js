const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const ordersSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    },
    purchasedBy: {
        type: ObjectId,
        ref: "User",
    },
    paymentIntent: {},
    orderStatus: {
        type:String,
        default: "Not Processed",
    }
}, {timestamps: true});

module.exports = mongoose.model('Order', ordersSchema);