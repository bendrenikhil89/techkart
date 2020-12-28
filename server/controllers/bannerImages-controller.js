const BannerImages = require("../models/bannerImages-model");

exports.uploadBannerImages = async(req, res) => {
    const {public_id, url} = req.body.image;
    try{
        let uploadImage =  await new BannerImages({public_id, url}).save();
        res.json({uploadImage, msg: "Banner image uploaded successfully!"});
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

exports.removeBannerImage = async(req, res) => {
    const {public_id} = req.body;
    try{
        let deletedImage = await BannerImages.findOneAndDelete({ public_id }).exec();
        if(!deletedImage) return res.status(404).json({msg: `Image does not exist!`})
        return res.status(200).json({msg:`Image is deleted!`});
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

exports.fetchBannerImages = async(req,res) => {
    try{
        let bannerImages = await BannerImages.find({}).sort({createAt: -1}).exec();
        return res.json(bannerImages);
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}