//user schema mongodb
//define que es un usuario en la base de datos

import mongoose from "mongoose";
import validator from "validator";

function isEmail(value){
    return validator.isEmail(value)
}

const userSchema = new mongoose.Schema(
    {
        name : { type : String, required : true},
        email: { type: String, required : true, unique: true, validate: (value)=>{ return validator.isEmail(value)}},
        password: {type: String, required : true,},
        role : { type: String, enum: ['user','admin'],default: 'user'},
        createdAt : {type : Date, default : Date.now},
    }
);

const User = mongoose.model("User", userSchema);

export default User;