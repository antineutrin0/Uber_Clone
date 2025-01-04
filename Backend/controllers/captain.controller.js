const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

const registerCaptain = async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {fullname,email,password,vehicle} = req.body;
    const isCaptainExist = await captainModel.findOne({email});
    if(isCaptainExist){
        return res.status(400).json({message:"Captain already exists"});
    }

    const hashedPassword = await captainModel.hashPassword(password);
    const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        type:vehicle.type
    });
    const token = await captain.generateAuthToken();
    res.status(201).json({captain,token});

}

const loginCaptain = async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} = req.body;
    const captain=await captainModel.findOne({email}).select('+password');
    if(!captain){
        return res.status(404).json({message:"Invalid credentials"});
    }
    const isMatch = await captain.comparePassword(password);
    if(!isMatch){
        return res.status(404).json({message:"Invalid credentials"});
    }
    const token = await captain.generateAuthToken();
    res.cookie('token',token);
    res.status(200).json({captain,token});

}

const getCaptainProfile = async (req, res,next) => {  
    res.status(200).json(req.captain);

}
const logoutCaptain = async (req, res,next) => {
    res.clearCookie('token');
    const token=req.headers.authorization?.split(' ')[1] || req.cookies.token;
    await blacklistTokenModel.create({token});
    res.status(200).json({message:"Logged out successfully"});
}
module.exports = { 
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
}