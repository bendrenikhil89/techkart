const slugify = require("slugify");
const Product = require("../models/product-model");
const User = require("../models/user-model");

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
        let product = await Product.findOne({slug}).exec();
        if(!product) return res.status(404).json({msg: `${slug} does not exist!`});
        return res.status(200).json(product);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchAllProducts = async(req, res) => {
    try{
        let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate("category")
        .populate("subcategories")
        .sort([["createdAt", "desc"]])
        .exec();
        return res.status(200).json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchProductsByPageSize = async (req, res) => {
    try {
      const { sort, order, page, pageSize } = req.body;
      const currentPage = page || 1;
      const perPage = pageSize || 4;
  
      const products = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .populate("category")
        .populate("subcategories")
        .sort([[sort, order]])
        .limit(perPage)
        .exec();
  
      res.json(products);
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
  };

exports.productsCount = async (req, res) => {
    try{
        let total = await Product.find({}).estimatedDocumentCount().exec();
        res.json(total);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
};

exports.postRating = async(req, res) => {
    const {rating, email} = req.body;
    try{
        const product = await Product.findById(req.params.productId).exec();
        const user = await User.findOne({ email }).exec();

        const existingRatingObject = product.ratings.find(
            (ele) => ele.postedBy.toString() === user._id.toString()
        );
        
        if (existingRatingObject === undefined) {
            let ratingAdded = await Product.findByIdAndUpdate(
              product._id,
              {
                $push: { ratings: { star:rating, postedBy: user._id } },
              },
              { new: true }
            ).exec();
            res.status(200).json(ratingAdded);
        }
        else {
            const ratingUpdated = await Product.updateOne(
              {
                ratings: { $elemMatch: existingRatingObject },
              },
              { $set: { "ratings.$.star": rating } },
              { new: true }
            ).exec();
            res.status(200).json(ratingUpdated);
        }
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const handleQuery = async(req,res,query) => {
    try{
        const products = await Product.find({$text: { $search: query} })
        .populate("category")
        .populate("subcategories")
        .populate("postedBy")
        .exec();
        res.json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const handlePrice = async(req, res, price) => {
    try{
        const products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1]
            }
        }).populate("category")
        .populate("subcategories")
        .populate("postedBy")
        .exec();
        res.json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const handleBrand = async(req, res, brand) => {
    try{
        const products = await Product.find({brand})
        .populate("category")
        .populate("subcategories")
        .populate("postedBy")
        .exec();
        res.json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const handleSubCategories = async(req, res, subcategories) => {
    try{
        const products = await Product.find({subcategories})
        .populate("category")
        .populate("subcategories")
        .populate("postedBy")
        .exec();
        res.json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const handleRating = async(req, res, rating) => {
    try{
        let productsStar = await Product.aggregate([
            {
                $project: {
                    document: "$$ROOT",
                    floorAverage: {
                        $floor: { $avg: "$ratings.star"}
                    }
                }
            },
            { $match: {floorAverage: rating}}
        ]).limit(12);
        let products = await Product.find({_id: productsStar})
        .populate("category")
        .populate("subcategories")
        .populate("postedBy")
        .exec();

        res.json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.searchFilters = async(req,res) => {
    const {query, price, rating, brand, subcategories} = req.body;
    try{
        if(query !== undefined){
            await handleQuery(req,res,query);
        }
        if(price !== undefined){
            await handlePrice(req, res, price);
        }
        if(rating !== undefined){
            await handleRating(req, res, rating);
        }
        if(brand !== undefined){
            await handleBrand(req, res, brand);
        }
        if(subcategories !== undefined){
            await handleSubCategories(req, res, subcategories);
        }
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchProductsByCategory = async(req, res) => {
    const {category} = req.body;
    try{
        const products = await Product.find({category})
        .populate("category")
        .populate("subcategories")
        .populate("postedBy")
        .exec();
        res.json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}