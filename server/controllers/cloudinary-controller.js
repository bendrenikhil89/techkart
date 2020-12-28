const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
    try{
        let result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
        });
        res.json({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

exports.removeImage = async(req, res) => {
  let image_id = req.body.public_id;
  try{
    let deletedImage = await cloudinary.uploader.destroy(image_id);
    res.json({msg: "Image deleted successfully!"});
  }
  catch(err){
    return res.status(500).json(err.message);
  }
};