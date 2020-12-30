const slugify = require("slugify");
const Product = require("../models/product-model");

exports.createProduct = async(req,res) => {
    req.body.product.slug = slugify(req.body.product.title);
    try{
        let newProduct = await new Product(req.body.product).save();
        res.status(200).json(newProduct);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.updateProduct = async(req, res) => {
    const {title} =  req.body.product;
    const slug = req.params.slug;
    try{
        let updatedProduct = await Product.findOneAndUpdate({slug}, {...req.body.product, slug: slugify(title)}, {new: true});
        if(!updatedProduct) return res.status(404).json({msg: `${slug} does not exist!`});
        return res.status(200).json(updatedProduct);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.removeProduct = async(req, res) => {
    const slug = req.params.slug;
    try{
        let updatedProduct = await Product.findOneAndDelete({slug}).exec();
        if(!updatedProduct) return res.status(404).json({msg: `${slug} does not exist!`});
        return res.status(200).json({msg:`${slug} is deleted!`});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchProduct = async(req, res) => {
    const slug = req.params.slug;
    console.log(slug);
    try{
        let product = await Product.find({slug}).exec();
        if(!product) return res.status(404).json({msg: `${slug} does not exist!`});
        return res.status(200).json(product);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchAllProducts = async(req, res) => {
    try{
        let products = await Product.find({}).sort({createdAt: -1}).exec();
        return res.status(200).json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}