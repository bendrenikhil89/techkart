const User = require("../models/user-model");
const Product = require("../models/product-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async(req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email}).exec();
        const {cart} = user;
        const cartTotal = cart.reduce((total,curr) => total + (curr.count * curr.price), 0);
        const paymentIntent = await stripe.paymentIntents.create({
            amount:cartTotal * 100,
            currency:"inr"
        });
    
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}