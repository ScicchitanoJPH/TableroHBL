const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../dao/models/users.model.js');



const router = Router()

router.get("/",showLogin)

router.post("/",userLogin);


async function userLogin(req,res){
    const {email,password} = req.body;
    console.log(email,password)
    try{
        let user = await User.findOne({email})
        if (!user){
            res.status(400)/*.json({ error :" Invalid email or password"})*/
            req.app.set('error','Invalid email or password')
            return res.redirect('/api/login')
        }
        // Validate the password
        let payload = {
            email: User.email,
            id   : User._id,
            role : User.role,
        }
        if (await bcrypt.compare(password,user.password)) {
            let token = jwt.sign(payload,
                                 process.env.JWT_SECRET,
                                 {expiresIn : "7h"})
            user = user.toObject()
            user.token = token
            user.password =undefined
            user.email = undefined
            const options = {
                expires : new Date( Date.now()+ 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token",token,options).status(200)/*.json(
                {success : true,
                 token,
                 user,
                 message : "Logged in successfully✅"                                               
            });*/
            req.app.set('success','Login Success..')
            //req.flash('success', 'Login Success..');
            return res.redirect('/api/tableros')
            
            
        }
        else{
            //req.flash('error', 'Invalid email or password');
            req.app.set('error','Invalid email or password')
            res.status(401)/*.json({ error: 'Invalid email or password' });*/
            
            return res.redirect('/api/login')
            
        }
        
    }
    catch(error){
        console.error("Error loggin in:",error);
        return res.status(500).json({ error : 'An error occurred while loggin in'});
    }
}

function showLogin(req,res){

    
    return res.render('login')
}

module.exports = router