const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity
const passport = require("passport")

const AuthController = require('../controllers/auth.controller.js');
const { validateLoginData,validateRegisterData } = require('../middleware/validator.middleware.js');
const { passportCall } = require('../middleware/passport.middleware.js');

const controller = new AuthController()

const router = Router()



router.post("/login",validateLoginData,passportCall('login'),controller.userLogin);

router.post("/register",validateRegisterData,passportCall('register'), controller.signUp);

router.post("/refresh",controller.updateToken)
router.get("/logout",controller.logout)
//se borran una vez que este el front
router.get("/login",controller.showLogin)
router.get("/register", controller.showRegister);



module.exports = router