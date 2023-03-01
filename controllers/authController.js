// PACKAGES
const User = require("../models/userModel")
const jwt = require('jsonwebtoken');        // to generate signed token
const { expressjwt } = require("express-jwt");
// HELPER FUNCTION
const {errorHandler} = require('../helpers/dbErrorHandler')

// authenticates user is the correct user
exports.isAuth = (req, res, next) => {
    console.log("isAuth")
    if(!(req.profile._id.toString() === req.auth._id)) {
        return res.status(403).json({error: "User Access denied"})
    }
    next();
}
exports.isAdmin = (req,res,next)=>{
    console.log("isAdmin")
    if(req.profile.role === 0){
        return res.status(403).json({error: "Admin only, access denied"})
    }
    next();
}

// requires user to sign in before accessing
exports.requireSignin = expressjwt({        // only checks whether user is signed in, doesn't actually check which user is signed in
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"    // the payload of expressjwt({...}) is available on request object (req.auth)
})


// authenticates and signs in user
exports.signIn = (req,res) => {
    const {email, password} = req.body
    //find user based on email
    User.findOne({email}, (err,user) => {
        if(err || !user){
            return res.status(400).json({err: 
                'User with that email does not exist. Please Register'
            })
        }
        
        // authenticate password
        if(!user.authenticate(password)){
            return res.status(401).json({
                err: 'password does not match'
            })
        }
        // generate signed token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        
        // sets cookie name to a value & expiration data, this doe not send the cookie
        res.cookie('token', token, {expire: new Date() + 99})        // remember that the 1st arg will determine the name of the cookie e.g."token3"
        
        // return token (cookie, technically not rn, but it will be stored under cookie) and user
        const {_id, email, name, role} = user
        return res.json({token, user: {_id, email, name, role}})
    })
}

exports.signUp = (req,res) => {
    console.log("signUp starting")
    // console.log("req",req);
    const user = new User(req.body);
    user.save((error,user) => {
        if(error){
            console.log('error message is triggered', error)
            return res.status(400).json({err:errorHandler(error)});     // Remember that when this is eventually caught in some promise's .then, the response will be of the format response.error instead of response.err
        }
        // console.log("res",res);
        res.json({user});
    });
    console.log("signUp ending")
};


exports.signOut = (req,res) => {
    res.clearCookie("token");
    res.json({message: "Sign out success"})
}