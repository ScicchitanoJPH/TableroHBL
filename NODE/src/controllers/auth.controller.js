const User = require('../dao/models/users.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// Function definitions for userLogin, signUp, showLogin, and showRegister
// (Assuming your code defines these functions)
class AuthController{
    constructor(){
    }
    async userLogin(req,res){
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
                return res.redirect('/api/dashboard')
                
                
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
    showLogin(req,res){
        console.log(this)
        return res.render('login')
    }
    async signUp(req,res){
      const {name, email, password,role} = req.body;
      if (!name || !email || !password ){
          res.status(403)/*.send({ success : false, message : "All fields are required"})*/
          req.app.set('error',"All fields are required")
          return res.redirect('/api/login')
      }
  
  
      const existingUser = await User.findOne({email});
  
      if (existingUser){
          //console.log(existingUser)
          res.status(400)/*.json({error : 'Email already registered'})*/
          //req.flash('error', `Email already registered`)
          req.app.set('error', `Email already registered`)
          return res.redirect('/api/register')
      }
      console.log(this)
      let hashedPassword = await this.hashPassword(password);
      
      
      try {
          const newUser = new User({
              name,
              email,
              password:hashedPassword,
              role
            })    
          await newUser.save()
          res.status(200)/*.json({message: `user registered successfully`})*/
          //req.flash('success', `user registered successfully`)
          req.app.set('success',`user registered successfully`)
          return res.redirect('/api/login')
      } catch (error) {
          res.status(500)/*.json({"error" : error.message})*/
          //req.flash('error', `${error.message}`)
          req.app.set('error',`${error.message}`)
          return res.redirect('/api/login')
      }
    }
    async hashPassword(password){
        
        try {
            return await bcrypt.hash(password,10)
            
        } catch (error) {
            return res.status(500).json({
                success : false,
                message : `Hashing password error` + error.message
            })
        }
    }
    
    showRegister(req,res){
    
        return res.render('register')
    }
}
const controller = new AuthController()
// Export the functions as an object (common approach with require)
module.exports =   controller;
