
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/user.repository.js');
const { UserDto } = require('../dto/userDto.js');



// Function definitions for userLogin, signUp, showLogin, and showRegister
// (Assuming your code defines these functions)
class AuthController{
    constructor(){
        this.service = new UserRepository(new UserDto())
    }
    userLogin= async(req,res) =>{
        const {email,password} = req.body;
        
        try{
            let user = await this.service.getUserBy({email: email})
            
            if (!user){
                return res.status(400).json({ status : 'error', msg: " Invalid email or password"})
                //req.app.set('error','Invalid email or password')
                
            }
            // Validate the password
            let payload = {
                email: user.email,
                id   : user._id,
                role : user.role,
            }
            
            if (await bcrypt.compare(password,user.password)) {
                let token = jwt.sign(payload,
                                    process.env.JWT_SECRET,
                                    {expiresIn : "7h"})
                user = user.toObject()
                user.token = token
                user.password =undefined
                user.email = undefined
                user.createdAt = undefined
                const options = {
                    expires : new Date( Date.now()+ 3*24*60*60*1000),
                    httpOnly: true
                }
                return res.cookie("token",token,options).status(200).json(
                    {status : 'success',
                    payload: {
                        id: user._id,
                        name: user.name,
                        role : user.role
                    }
                                                                    
                });
                //req.app.set('success','Login Success..')
                //req.flash('success', 'Login Success..');
                //return res.redirect('/api/boards')
            }
            else{
                //req.flash('error', 'Invalid email or password');
                //req.app.set('error','Invalid email or password')
                res.status(401).json({ status : 'error', msg: 'Invalid email or password' });
                
                //return res.redirect('/api/login')
                
            }
            
        }
        catch(error){
            console.error("Error loggin in:",error);
            return res.status(500).json({ status : 'error', msg:  'An error occurred while loggin in'});
        }
    }
    showLogin(req,res){
        console.log(this)
        return res.render('login')
    }
    signUp= async(req,res)=>{
      const {name, email, password,role} = req.body;
      if (!name || !email || !password ){
          return res.status(403).send({ success : 'error', message : "All fields are required"})
          req.app.set('error',"All fields are required")
          return res.redirect('/api/login')
      }
  
  
      const existingUser = await this.service.getUserBy({email});
  
      if (existingUser){
          //console.log(existingUser)
          return res.status(400).json({status : 'error', msg: 'Email already registered'})
          //req.flash('error', `Email already registered`)
          req.app.set('error', `Email already registered`)
          return res.redirect('/api/register')
      }
      
      let hashedPassword = await this.hashPassword(password);
      
      
      try {
          const newUser = await this.service.createUser({
              name,
              email,
              password:hashedPassword,
              role
            })    
          
          return res.status(200).json({status : 'success', msg: `user registered successfully`})
          //req.flash('success', `user registered successfully`)
          req.app.set('success',`user registered successfully`)
          return res.redirect('/api/login')
      } catch (error) {
            console.log(error)
            return res.status(500).json({status : 'error', msg: 'An error occurred at register'})
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

// Export the functions as an object (common approach with require)
module.exports =   AuthController;
