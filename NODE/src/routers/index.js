const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity

const userRouter = require('./login.routes.js');
const registerRouter = require('./register.routes.js');

// Assuming auth.controller.js is in the same directory:
// const { userLogin, signUp, showLogin, showRegister } = require('../controllers/auth.controller.js');

const deviceRouter = require('./device.routes.js');
const eventsRouter = require('./event.routes.js');
const dashboardRouter = require('./dashboard.routes.js');

const router = Router();

router.use("/login",userRouter)

router.use("/register",registerRouter)

router.use("/devices",deviceRouter)

router.use("/events",eventsRouter)

router.use("/dashboard",dashboardRouter)

module.exports = router