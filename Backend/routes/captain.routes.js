const express = require('express');
const router = express.Router();
const {body}=require('express-validator');
const { registerCaptain, getCaptainProfile, logoutCaptain, loginCaptain } = require('../controllers/captain.controller');
const { authCaptain } = require('../middlewares/auth.middleware');

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be atleast 3 characters long'),
    body('password').isLength({min:5}).withMessage('Password must be atleast 5 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('Color must be atleast 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate must be atleast 3 characters long'),
    body('vehicle.capacity').isNumeric().withMessage('Capacity must be a number'),
    body('vehicle.type').isIn(['car','motorcycle','auto']).withMessage('Invalid vehicle type')
],
registerCaptain
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:5}).withMessage('Password must be atleast 5 characters long'),
],
loginCaptain
)

router.get('/profile',authCaptain,getCaptainProfile);
router.get('/logout',authCaptain,logoutCaptain);

module.exports = router;    
