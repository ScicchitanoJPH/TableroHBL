const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity


const controller = require('../controllers/auth.controller.js')

//const {showLogin,userLogin} = new AuthController()
const router = Router()

router.get("/",controller.showLogin)

router.post("/",controller.userLogin);




module.exports = router