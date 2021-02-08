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

exports.fetchAllOrdersForUser = async(req,res) => {
  const {purchasedBy} = req.body;
  try{
    const orders = await Order.find({purchasedBy})
    .populate("purchasedBy")
    .sort([["createdAt", "desc"]])
    .exec();
    res.status(200).json(orders);
  }
  catch(err){
    return res.status(500).json({msg: err.message});
  }
}

exports.fetchAllOrders = async(req,res) => {
  try{
    const orders = await Order.find({})
    .populate("purchasedBy")
    .sort([["createdAt", "desc"]])
    .exec();
    res.status(200).json(orders);
  }
  catch(err){
    return res.status(500).json({msg: err.message});
  }
}

exports.updateOrder = async(req, res) => {
  const {orderID, orderStatus} = req.body;
  try{
    const updatedOrder = await Order.findOneAndUpdate({_id:orderID}, {orderStatus}, {new: true});
    res.status(200).json(updatedOrder);
  }
  catch(err){
    return res.status(500).json({msg: err.message});
  }
}