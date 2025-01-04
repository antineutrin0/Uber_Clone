const express = require('express'); 
const router = express.Router();    
const {body}=require('express-validator');
const {registerUser,loginUser, getUserProfile, logoutUser} = require('../controllers/User.controller');
const {authUser} = require('../middlewares/auth.middleware');
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be atleast 3 characters long'),
    body('password').isLength({min:5}).withMessage('Password must be atleast 5 characters long'),
],
registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:5}).withMessage('Password must be atleast 5 characters long'),
],
loginUser
)
router.get('/profile',authUser,getUserProfile);

router.get('/logout',authUser,logoutUser);

module.exports = router;
