const Product = require("../models/product-model");
const User = require("../models/user-model");
const Bcrypt = require("bcryptjs");

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

exports.updatePassword = async(req, res) => {
    const {email, password, newPassword} = req.body;
    let hashPassword = Bcrypt.hashSync(newPassword, 10);
    try{
        const user = await User.findOne({email}).exec();
        if(!Bcrypt.compareSync(password, user.password)){
            return res.status(401).send({msg:'Wrong Password!'});
        }
        else{
            const user = await User.findOneAndUpdate({email}, {password: hashPassword}, {new: true});
            res.status(200).json(user);
        }
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.addToWishlist = async(req, res) => {
    const {email, productID} = req.body;
    try{
        const user = await User.findOneAndUpdate({email}, {$addToSet : {wishlist: productID}}).exec();
        return res.status(200).json({user});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.updateUserProfile = async(req, res) => {
    const {email, userProfile} = req.body;
    try{
        const user = await User.findOneAndUpdate({email}, userProfile).exec();
        return res.status(200).json({user});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.getUserWishlist = async(req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email})
            .select("wishlist")
            .populate("wishlist")
            .exec();
        return res.status(200).json({user});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.removeFromWishlist = async(req, res) => {
    const {email, productID} = req.body;
    try{
        const user = await User.findOneAndUpdate({email}, {$pull : {wishlist: productID}}).exec();
        return res.status(200).json({user});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}