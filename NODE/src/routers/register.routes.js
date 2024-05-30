import { Router } from "express";
import User from "../dao/models/user.model.js";
import bcrypt from "bcrypt"



const router = Router()
router.post("/", signUp);
router.get("/", showRegister);

export async function signUp(req,res){
    const {name, email, password,role} = req.body;
    if (!name || !email || !password ){
        req.app.set('error',)
        return res.status(403).send({ success : false, message : "All fields are required"})
    }


    const existingUser = await User.findOne({email});

    if (existingUser){
        //console.log(existingUser)
        res.status(400)/*.json({error : 'Email already registered'})*/
        //req.flash('error', `Email already registered`)
        req.app.set('error', `Email already registered`)
        return res.redirect('/api/register')
    }
    
    let hashedPassword = await hashPassword(password);
    
    
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
 async function hashPassword(password){
    
    try {
        return await bcrypt.hash(password,10)
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : `Hashing password error` + error.message
        })
    }
}

export function showRegister(req,res){

    
    return res.render('register')
}



export default router