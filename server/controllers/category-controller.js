const slugify = require("slugify");
const Category = require("../models/category-model");

exports.create = async(req,res) => {
    const {name} = req.body;
    try{
        let category = await Category.findOne({ name }).exec();
        if(category) return res.status(405).json({msg: `${name} already exists!`});
        try{
            let newCategory = await new Category({name, slug: slugify(name)}).save();
            return res.status(200).json({category: newCategory.name, slug: newCategory.slug});
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchAll = async(req,res) => {
    try{
        let categories = await Category.find({}).sort({createdAt : -1}).exec();
        return res.status(200).json(categories);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchOne = async(req,res) => {
    const slug = req.params.slug;
    try{
        let category = await Category.findOne({slug}).exec();
        if(!category) return res.status(404).json({msg: `${slug} does not exist!`})
        return res.status(200).json(category);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.remove = async(req,res) => {
    const slug = req.params.slug;
    try{
        let category = await Category.findOneAndDelete({slug}).exec();
        if(!category) return res.status(404).json({msg: `${slug} does not exist!`})
        return res.status(200).json({msg:`${slug} is deleted!`});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.update = async(req,res) => {
    const slug = req.params.slug;
    const {name} = req.body;
    try{
        let category = await Category.findOneAndUpdate({slug}, {name, slug: slugify(name)}, {new: true});
        if(!category) return res.status(404).json({msg: `${slug} does not exist!`})
        return res.status(200).json({msg:`${category.name} is updated!`});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}