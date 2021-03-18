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
    const filter = {...req.body};
    let filterQuery = {};
    try{
        if(filter && filter.categoryID !== undefined && filter.categoryID.length > 0){
            filterQuery = {...filterQuery, category: filter.categoryID};
        }
        if(filter && filter.subcategoryID){
            filterQuery = {...filterQuery, subcategories: filter.subcategoryID};
        }
        if(filter && filter.brand){
            filterQuery = {...filterQuery, brand: filter.brand};
        }
        if(filter && filter.price){
            filterQuery = {...filterQuery, price: { $gte: filter.price[0], $lte: filter.price[1]} };
        }
        if(filter && filter.query){
            filterQuery = {$text: { $search: filter.query}};
        }
        if(filter && filter.rating){
            filterQuery = {...filterQuery, avgRating: { $eq: filter.rating} };
        }
        let total = await Product.find(filterQuery).exec();
        res.json(total.length);
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
        const updatedProduct = await Product.findById(req.params.productId).exec();
        const productAvgRating = updatedProduct.ratings.reduce((sum, p) =>  {
            return sum + parseFloat(p.star);
        }, 0) / updatedProduct.ratings.length;
        await Product.findByIdAndUpdate(product._id, {avgRating: Math.floor(productAvgRating)}, { new: true }).exec();
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const handleQuery = async(req,res,query, page, pageSize) => {
    try{
        const currentPage = page || 1;
        const perPage = pageSize || 4;
        const products = await Product.find({$text: { $search: query} })
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subcategories")
            .populate("postedBy")
            .sort([["createdAt", "desc"]])
            .limit(perPage)
            .exec();
        res.json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const handleFilter = async(req,res,filter, page, pageSize) => {
    let filterQuery={};
    try{
        if(filter.categoryID.length > 0){
            filterQuery = {...filterQuery, category: filter.categoryID};
        }
        if(filter.subcategoryID){
            filterQuery = {...filterQuery, subcategories: filter.subcategoryID};
        }
        if(filter.brand){
            filterQuery = {...filterQuery, brand: filter.brand};
        }
        if(filter.price){
            filterQuery = {...filterQuery, price: { $gte: filter.price[0], $lte: filter.price[1]} };
        }
        if(filter.rating){
            filterQuery = {...filterQuery, avgRating: { $eq: filter.rating} };
        }
        const currentPage = page || 1;
        const perPage = pageSize || 4;
        const products = await Product.find(filterQuery)
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subcategories")
            .sort([["createdAt", "desc"]])
            .limit(perPage)
            .exec();
        res.status(200).json(products);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.searchFilters = async(req,res) => {
    const {query, filter, page, pageSizeCount} = req.body;
    try{
        if(query !== ""){
            await handleQuery(req,res,query, page, pageSizeCount);
        }
        else {
            await handleFilter(req, res, filter, page, pageSizeCount);
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

exports.fetchBrands = async(req,res) => {
    let brands = [];
    try{
        const products = await Product.find({}).exec();
        brands = [...new Set(products.map(item => item.brand))].sort();
        res.status(200).json(brands);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchSimilarProducts = async(req,res) => {
    const {_id, category, perPage} = req.body;
    console.log(category);
    try{
        const similarProducts = await Product.find({
            _id : {$ne : _id},
            category
        })
            .populate("category")
            .populate("subcategories")
            .sort([["sold", "desc"]])
            .limit(perPage)
            .exec();
        return res.status(200).json(similarProducts);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}