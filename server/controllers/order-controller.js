const User = require("../models/user-model");
const Order = require("../models/order-model");
const Product = require("../models/product-model");

exports.createOrder = async(req,res) => {
    const {email, userId, paymentIntent} = req.body;
    try{
        const userCart = await User.findOne({email}).exec();
        const newOrder = await new Order({products: userCart.cart, purchasedBy: userId, paymentIntent}).save();
        let bulkOption = userCart.cart.map((item) => {
            return {
              updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
              },
            };
        });
        
        let updated = await Product.bulkWrite(bulkOption, {});
        const userEmptyCart = await User.findOneAndUpdate({email}, {cart: []}, {new: true});
        res.status(200).json(newOrder);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}