const userModel=require('../models/User.model');
 const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const blacklistTokenModel=require('../models/blacklistToken.model');
 const registerUser = async (req, res,next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });

}
const {fullname,email,password} = req.body;

const isUserExist = await userModel.findOne({email});
if(isUserExist){
    return res.status(400).json({message:"User already exists"});
}

const hashedPassword = await userModel.hashPassword(password);
const user = await userService.createUser({
    firstname:fullname.firstname,
    lastname:fullname.lastname,
    email,
    password:hashedPassword
});
const token = await user.generateAuthToken();

res.status(201).json({user,token});

}

const loginUser = async (req, res,next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
const {email,password} = req.body;
const user=await userModel.findOne({email}).select('+password');
if(!user){
    return res.status(404).json({message:"Invalid credentials"});
}

const isMatch = await user.comparePassword(password);
if(!isMatch){
    return res.status(404).json({message:"Invalid credentials"});
}
const token = await user.generateAuthToken();
res.cookie('token',token);
res.status(200).json({user,token});

}

const getUserProfile = async (req, res,next) => {  
res.status(200).json(req.user);

} 
const logoutUser = async (req, res,next) => {
    res.clearCookie('token');
    const token=req.headers.authorization?.split(' ')[1] || req.cookies.token;
    await blacklistTokenModel.create({token});
    res.status(200).json({message:"Logged out successfully"});
    }





module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
}