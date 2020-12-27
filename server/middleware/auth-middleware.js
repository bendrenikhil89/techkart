const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

exports.authCheck = async(req,res,next) => {
    console.log(req.headers);
    console.log(req.body);
    const {authtoken} = req.headers;
    jwt.verify(authtoken, "techkart_crypto", (err,decoded) => {
        if(err) return res.status(500).json({msg: err.message});
        next();
    });
}

exports.adminCheck = async(req, res, next) => {
    const {email} = req.body;
    try{
        let user = await User.findOne({email}).exec();
        console.log(user);
        if(!user) return res.status(401).send({ msg:'The email address ' + email + ' is not associated with any account. please check and try again!'});
        if(user.role !== "admin" || !user.isVerified) return res.status(403).send({ msg:'User does not have admin privileges!'});
        next();
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}