import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path:`${__dirname}/.env`});

function authenticateUser (req,res,next) {
    try {
        console.log(__dirname)
        console.log("cookies",req.cookies)
        const token = req.cookies.token;
        console.log(token)
        const decodedToken = jwt.verify(token,'secretkey');

        req.userId = decodedToken.userId; 

        next()
    } catch (error){
        console.error('Error authenticating user:', error);
        res.status(401).json({error : 'Unauthorized'})
    }
} 

export default authenticateUser;