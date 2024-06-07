const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity


const AuthController = require('../controllers/auth.controller.js')

const controller = new AuthController()

const router = Router()



router.post("/login",controller.userLogin);

router.post("/register", controller.signUp);


//se borran una vez que este el front
router.get("/login",controller.showLogin)
router.get("/register", controller.showRegister);



module.exports = router