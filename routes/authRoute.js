const express = require('express');
const router = express.Router()

const {signUp, signIn, signOut, requireSignin} = require('../controllers/authController')
const {userSignupValidator} = require('../validator/userSignUpValidator')

router.post('/signup', userSignupValidator, signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.get('/hello', requireSignin, (req,res)=>{
    res.send("hello")
})
module.exports = router;