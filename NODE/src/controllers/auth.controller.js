const {request, response} = require("express")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/user.repository.js');
const { UserDto } = require('../dto/userDto.js');
const { logger } = require("../utils/logger.js");




// Function definitions for userLogin, signUp, showLogin, and showRegister
// (Assuming your code defines these functions)
class AuthController{
    constructor(){
        this.service = new UserRepository(new UserDto())
        this.log = logger('auth.log')
    }
    userLogin= async(req = request ,res = response) =>{
        try{
            const user = req.user
            const token = req.cookies.jwt
            
            if (token) {
                
                const userFound = await this.service.getUserBy({'refreshTokens.token' : token})
                if (userFound) 
                    return res.status(400).json({status : 'error', msg: 'User already logged in'})
            }

            const {accessToken,refreshToken,refreshExpireAt} = this.service.generateJWT(user)
            
            
            const userJwt = this.service.addJwt(user, refreshToken, refreshExpireAt)
            
            const userCleaned = this.service.deleteExpiredTokens(userJwt)
            const userUpdated = await this.service.updateUser(userCleaned._id,userCleaned)
            

            res.cookie("_auth", accessToken, { httpOnly: true,expiresIn: 24* 60 * 60 * 1000, secure : true });
            res.cookie("jwt", refreshToken, { httpOnly: true,expiresIn: 24* 60 * 60 * 1000 , secure : true});
            this.log.info(`login User ${user.name} id:${user._id} `)
            return res.status(200).json({ status: "success", payload: user, accessToken,refreshToken });

            //return res.status(200).json({status : 'success', payload: req.user })
        }
        catch(error){
            this.log.error("Error loggin in:",error);
            return res.status(500).json({ status : 'error', msg:  'An error occurred while loggin in'});
        }
    }
    
    signUp= async(req,res)=>{
        try {
            const user = req.user
            this.log.info(`Register succesfully User ${user.name} id:${user._id} `)
            return res.status(200).json({status : 'success', msg: `user registered successfully`})
          
        } catch (error) {
            this.log.error("Error signing up in:",error)
            return res.status(500).json({status : 'error', msg: 'An error occurred at register'})
            
        }
    }
    
    
    updateToken = async ( req,res)=>{
        
        try {
            let oldToken = req.cookies.jwt
            
            
            const decodedToken = jwt.verify(oldToken,process.env.REFRESH_TOKEN_KEY)

            const userId = decodedToken.id
            
            let user = await this.service.getUserBy({_id: userId},false)
            
            const userHasJwt = user.refreshTokens.find((e) => e.token == oldToken)
            console.log('tokens' ,userHasJwt,!userHasJwt) 
            if (!userHasJwt){
                res.clearCookie('_auth')
                res.clearCookie('jwt')
                return res.status(403).json({ status: 'error', msg: "Please log in again"})
            }

            if (!user){
                res.clearCookie('_auth')
                res.clearCookie('jwt')
                return res.status(204).json({ 
                    status : 'error', 
                    msg: " User not found " 
                })
            }
            user = this.service.deleteJwt(user, oldToken)
            
            const {accessToken, refreshToken ,refreshExpireAt} = this.service.generateJWT(user)
            
            
            user = this.service.addJwt(user, refreshToken,refreshExpireAt)
            
            
            await this.service.updateUser(user._id, user)

            //console.log(await this.service.getUserBy({_id: user._id}))
            
            const options = {
                expiresIn : 24*60*60*1000,//
                httpOnly: true,
                secure : true
            }
            this.log.info(`refreshed token User ${user.name} id:${user._id} `)
            res.cookie('_auth',accessToken,options)
            res.cookie('jwt',refreshToken,options)
            return res.status(200).json({
                status : 'success',
                payload:{
                    accessToken,
                    refreshToken
                }
            })
        } catch (error) {
            this.log.error('Error updating token:', error.message);
            res.status(401).json({error : 'Unauthorized'})
        }
    }

    logout = async (req,res) =>{
        try {
            const refreshtoken = req.cookies.jwt
            let user = await this.service.getUserBy({'refreshTokens.token' : refreshtoken})
            
            //res.clearCookie('_auth')
            //res.clearCookie('jwt')

            if (!refreshtoken || !user) return res.status(400).json({status: "error", msg : "no hay usuario logeado"})
            
            
            
            const userFound = this.service.deleteJwt(user, refreshtoken)
            //userFound.refreshTokens = userFound.refreshTokens.filter( (e)=> e.token != token )
            
            await this.service.updateUser(userFound._id,userFound)
            
            //console.log(await this.service.getUserBy({_id: userFound._id}))
            
 
            
            this.log.info(`logout User ${user.name} id:${user._id} `)
            req.logout(function(err) {
                if (err) { 
                    console.log(err)
                    return next(err); 
                }
                
                return res.status(200).json({status : "success", msg: "logout exitoso"})
            });
            
            
            
        } catch (error) {
            this.log.error("Error loggin out in:",error);
            return res.status(500).json({ status : 'error', msg:  'An error occurred while loggin in'});
        }
    }
    showRegister(req,res){
    
        return res.render('register')
    }
    showLogin(req,res){
        console.log(this)
        return res.render('login')
    }

}

// Export the functions as an object (common approach with require)
module.exports =   AuthController;
