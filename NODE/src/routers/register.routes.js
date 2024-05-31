const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity
const authController = require('../controllers/auth.controller')

//const controller = new authController()

const router = Router()
router.post("/", authController.signUp.bind(authController));
router.get("/", authController.showRegister);





module.exports = router