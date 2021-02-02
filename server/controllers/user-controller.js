const Product = require("../models/product-model");
const User = require("../models/user-model");

exports.saveCart = async(req,res) => {
    const {cart, email} = req.body;
    try{
        const updatedProduct = await User.findOneAndUpdate({email}, {cart}, {new: true});
        res.status(200).json(updatedProduct);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.getCart = async(req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email}).exec();
        res.status(200).json(user);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.addAddress = async(req, res) => {
    const {address, email} = req.body;
    try{
        const user = await User.findOneAndUpdate({email}, {address}, {new: true});
        res.status(200).json(user);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}