const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity

const userRouter = require('./login.routes.js');
const registerRouter = require('./register.routes.js');

// Assuming auth.controller.js is in the same directory:
// const { userLogin, signUp, showLogin, showRegister } = require('../controllers/auth.controller.js');

const deviceRouter = require('./device.router.js');
const eventsRouter = require('./event.router.js');

const router = Router();

router.use("/login",userRouter)

router.use("/register",registerRouter)

router.use("/devices",deviceRouter)

router.use("/events",eventsRouter)


module.exports = router