const express = require('express');
const router = express.Router()

const {getUserById, readUserProfile, updateUserProfile} = require('../controllers/userController')
const {requireSignin, isAuth, isAdmin} = require('../controllers/authController')

router.param("userId", getUserById);    // will grab user data into req.profile for any route routed to "userId"
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req,res) => {
    console.log("about to send user:req.profile")
    res.json({user: req.profile})       // has access to user data in req.profile
})
router.get('/user/:userId', requireSignin, isAuth, readUserProfile)
router.put('/user/:userId', requireSignin, isAuth, updateUserProfile)

module.exports = router;