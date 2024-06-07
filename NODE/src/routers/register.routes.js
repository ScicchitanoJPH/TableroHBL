const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity
const AuthController = require('../controllers/auth.controller')

const controller = new AuthController()

const router = Router()
router.post("/", controller.signUp);
router.get("/", controller.showRegister);





module.exports = router