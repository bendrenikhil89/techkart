const slugify = require("slugify");
const SubCategory = require("../models/subcategory-model");

exports.fetchAllSubCategories = async(req,res) => {
    try{
        let subCategories = await SubCategory.find({}).sort({createdAt : -1}).exec();
        return res.status(200).json(subCategories);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.fetchOneSubCategory = async(req,res) => {
    const slug = req.params.slug;
    try{
        let subCategory = await SubCategory.findOne({slug}).exec();
        if(!subCategory) return res.status(404).json({msg: `${slug} does not exist!`})
        return res.status(200).json(subCategory);
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.createSubCategory = async(req,res) => {
    const {name, parent} = req.body.sub;
    try{
        let subCategory = await SubCategory.findOne({ name }).exec();
        if(subCategory) return res.status(405).json({msg: `${name} already exists!`});
        try{
            let newSubCategory = await new SubCategory({name, parent, slug: slugify(name)}).save();
            return res.status(200).json({subCategory: newSubCategory.name, parent: newSubCategory.parent, slug: newSubCategory.slug});
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.removeSubCategory = async(req,res) => {
    const slug = req.params.slug;
    try{
        let subCategory = await SubCategory.findOneAndDelete({slug}).exec();
        if(!subCategory) return res.status(404).json({msg: `${slug} does not exist!`})
        return res.status(200).json({msg:`${slug} is deleted!`});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.updateSubCategory = async(req,res) => {
    const slug = req.params.slug;
    const {name, parent} = req.body.sub;
    try{
        let subCategory = await SubCategory.findOneAndUpdate({slug}, {name, parent, slug: slugify(name)}, {new: true});
        if(!subCategory) return res.status(404).json({msg: `${slug} does not exist!`})
        return res.status(200).json({subCategory:`${subCategory.name}`});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}