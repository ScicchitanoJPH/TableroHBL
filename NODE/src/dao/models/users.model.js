//user schema mongodb
//define que es un usuario en la base de datos

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { type } = require('os');
 


const userSchema = new mongoose.Schema(
    {
        name : { 
            type : String, 
            required : true,
            max: 30
        },
        email: { 
            type: String, 
            required : true, 
            unique: true,
            lowercase: true,
            trim: true, 
            },
        password: {
            type: String, 
            required : true,
            select:false
        },
        role : { 
            type: String, 
            enum: ['user','admin'],
            default: 'user'
        },
        createdAt : {
            type : Date, 
            default : Date.now
        },
        refreshTokens : [
            {
                token : String,
                createdAt : Date,
                expiry : Date
            }
        ]
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {UserModel}
