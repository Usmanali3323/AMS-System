const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    gender: {
        type: String,
        enum: ['male','female','other'], // Use 'Other' instead of 'other' for consistency
    },
    reg_date: {
        type: Date,
        default: Date.now, // Set default registration date to now
    },
    imageUrl: {
      type:  String,
      required:true
    },
    refreshToken:{
        type:String
    },
    admin:{
        type:Boolean,
        default:false
    }
});

userSchema.methods.generateAccessToken = function(ACCESS_TOKEN_EXPIRY){
    return JWT.sign(
    {
    _id: this._id,
    username: this.username,
    email: this.email,
    fullName: this.fullName
    },
    process.env.ACCESS_TOKEN,
    {expiresIn:ACCESS_TOKEN_EXPIRY}
    );
}

userSchema.methods.generateRefreshToken = function(REFRESH_TOKEN_EXPIRY){
    return JWT.sign(
    {
    _id: this._id,
    },
    process.env.REFRESH_TOKEN,
    {expiresIn:REFRESH_TOKEN_EXPIRY}
    );
}

// Create the user model
const User = mongoose.model("user", userSchema);

module.exports = User;

