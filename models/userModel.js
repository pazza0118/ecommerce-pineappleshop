const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid');
// const { timeStamp } = require('console')

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true,
            required: true,
            maxlength:32
        },
        email:{
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password:{
            type: String,
            required: true
        },
        about:{
            type: String,
            trim: true,
        },
        salt: String,
        role: {
            type: Number,
            default: 0  // 0 is user, 1 is admin
        },
        history: {
            type: Array,    // it seems type:Array and type:[Array] are the same thing
            default: []
        }
    }, {timestamps: true}
)

// METHODS
userSchema.methods = {
    authenticate: function(plainPassword){
        return this.encryptPassword(plainPassword) === this.hashed_password;
    },
    encryptPassword: function(password){
        if(!password) return "";
        try{
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex")
        }catch(err){
            return ""
        }
    }
}
// virtual field
userSchema.virtual('password')
    .set(function(password){        // sets user password, salt, and hashed_password
        // this._password = password,
        this.salt = uuidv1(),
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function(){                // you have access to the password
        return this._password
    })



module.exports = mongoose.model("User", userSchema)