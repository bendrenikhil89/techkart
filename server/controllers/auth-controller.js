const nodemailer = require("nodemailer");

const sendgridTransport = require("nodemailer-sendgrid-transport");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user-model");
const Token = require("../models/token-model");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

exports.signUp = async(req, res) => {
    console.log(process.env.SENDGRID_API_KEY);
    const {name, email, password} = req.body;
    try{
        let newUser = await User.findOne({ email: req.body.email }).exec();
        if(newUser){
            return res.status(400).send({msg:'This email address is already associated with another account.'});
        }
        else{
            let hashPassword = Bcrypt.hashSync(password, 10);
            try{
                newUser = await new User({ name, email, password: hashPassword }).save();
                try{
                    var token = await new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') }).save();
                    transporter.sendMail({
                        to: newUser.email,
                        from : 'bendre.nikhil.89@gmail.com',
                        subject: 'TechKart - Account Verification Link',
                        html: 'Hello '+ newUser.name +',<br /><br />' + 'Please verify your account by clicking the link: \n' + req.headers.origin + '\/confirmation\/' + newUser.email + '\/' + token.token + '<br /><br />Thank You!\n'
                    }, err => {
                        if (err) res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                        return res.status(200).send('A verification email has been sent to ' + newUser.email + '. It will expire after a day.');
                    })
                }
                catch(err){
                    return res.status(500).json({msg: err.message});
                }
            }
            catch(err){
                return res.status(500).json({msg: err.message});
            }
        }
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

exports.login = async(req, res) => {
    const {email, password} = req.body;
    try{
        let user = await User.findOne({ email }).exec();
        if (!user){
            return res.status(401).send({ msg:'The email address ' + req.body.email + ' is not associated with any account. please check and try again!'});
        }
        else if(!Bcrypt.compareSync(password, user.password)){
            return res.status(401).send({msg:'Wrong Password!'});
        }
        else if (!user.isVerified){
            return res.status(401).send({msg:'Your Email has not been verified.'});
        }
        else{
            let token;
            token = jwt.sign({user: user._id, email: user.email}, process.env.SERVER_SECRET, {expiresIn: '1h'});
            return res.status(200).json({name: user.name, email: user.email, userId:user._id, token, role: user.role });
        }
    }
    catch(err){
        return res.status(500).json(err.message)
    }
}

exports.confirmEmail = async(req, res) => {
    let token;
    try{
        token = await Token.findOne({ token: req.params.token }).exec();
        if (!token){
            return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
        }
        else{
            try{
                let user = await User.findOne({ _id: token._userId, email: req.params.email }).exec();
                if (!user){
                    return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});
                } 
                else if (user.isVerified){
                    return res.status(200).send('User has been already verified. Please Login');
                }
                else{
                    user.isVerified = true;
                    try{
                        await user.save();
                        return res.status(200).send('Your account has been successfully verified');
                    }
                    catch(err){
                        return res.status(500).json(err.message)
                    }
                }
            }
            catch(err){
                return res.status(500).json(err.message)
            }
        }
    }
    catch(err){
        return res.status(500).json(err.message)
    }
}


exports.resendLink = async(req, res) => {
    const {email} = req.body;
    try{
        let user = await User.findOne({ email: req.body.email }).exec();
        if (!user){
            return res.status(400).send({msg:'We were unable to find a user with that email. Make sure your Email is correct!'});
        }
        else if (user.isVerified){
            return res.status(200).send('This account has been already verified. Please log in.');
        }
        else{
            try{
                let token = await new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') }).save();
                transporter.sendMail({
                    to: user.email,
                    from : 'bendre.nikhil.89@gmail.com',
                    subject: 'TechKart - Account Verification Link',
                    html: 'Hello '+ user.name +',<br /><br />' + 'Please verify your account by clicking the link: \n' + req.headers.origin + '\/confirmation\/' + user.email + '\/' + token.token + '<br /><br />Thank You!\n'
                }, err => {
                    if (err) res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                    return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                })
            }
            catch(err){
                return res.status(500).json({msg: err.message});
            }
        }
    }
    catch(err){
        return res.status(500).json(err.message)
    }
}

exports.validateToken = async(req,res) => {
    const {authtoken} = req.headers;
    jwt.verify(authtoken, process.env.SERVER_SECRET, (err,decoded) => {
    if(err) return res.status(500).json({msg: err.message});
        const {user, email, iat, exp} = decoded;
        return res.status(200).json({user, email, iat, exp});
    });
}